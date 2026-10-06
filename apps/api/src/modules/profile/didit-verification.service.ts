import {
  Injectable,
  Logger,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '../config/config.service';

interface DiditDecision {
  session_id: string;
  status: string;
  vendor_data?: string;
  id_verifications?: Array<{
    status: string;
    first_name?: string;
    last_name?: string;
    full_name?: string;
    document_number?: string;
    document_type?: string;
    issuing_country?: string;
    date_of_birth?: string;
    warnings?: string[];
  }>;
}

@Injectable()
export class DiditVerificationService {
  private readonly logger = new Logger(DiditVerificationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  /**
   * Generates a deterministic, one-way SHA-256 hash of a government identity document.
   * Prevents storing raw national IDs in plain text while enabling exact collision detection.
   */
  hashIdentityDocument(docType: string, docNumber: string, country: string): string {
    const normalized = `${docType.toLowerCase().trim()}:${docNumber.replace(/\s+/g, '').toUpperCase().trim()}:${country.toUpperCase().trim()}`;
    return crypto.createHash('sha256').update(normalized).digest('hex');
  }

  /**
   * Compares the legal name provided by the user with the name extracted from their national ID.
   * Tolerates case differences, middle names, and name ordering (Given Surname vs Surname Given).
   */
  isNameMatching(userLegalName: string, docFirstName?: string, docLastName?: string, docFullName?: string): boolean {
    const cleanUser = userLegalName
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .trim();

    const userTokens = cleanUser.split(/\s+/).filter(Boolean);
    if (userTokens.length === 0) return false;

    // Build candidate strings from Didit
    const docNameCombos: string[] = [];
    if (docFullName) docNameCombos.push(docFullName);
    if (docFirstName && docLastName) {
      docNameCombos.push(`${docFirstName} ${docLastName}`);
      docNameCombos.push(`${docLastName} ${docFirstName}`);
    } else if (docFirstName) {
      docNameCombos.push(docFirstName);
    } else if (docLastName) {
      docNameCombos.push(docLastName);
    }

    for (const combo of docNameCombos) {
      const cleanDoc = combo
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .trim();
      const docTokens = cleanDoc.split(/\s+/).filter(Boolean);

      // Check token overlap
      const matches = userTokens.filter((token) => docTokens.includes(token));
      // If at least 70% of tokens match or both first & last match
      if (matches.length >= Math.min(userTokens.length, docTokens.length)) {
        return true;
      }
      if (matches.length >= 2) {
        return true;
      }
    }

    return false;
  }

  /**
   * Creates a secure Didit verification session.
   */
  async createSession(userId: string, returnUrl?: string) {
    if (!this.config.diditEnabled) {
      throw new BadRequestException('Didit identity verification is not configured on this environment.');
    }

    const callbackUrl =
      returnUrl || `${this.config.appBaseUrl || 'http://localhost:3000'}/verify?session_complete=true`;

    const res = await fetch('https://verification.didit.me/v3/session/', {
      method: 'POST',
      headers: {
        'x-api-key': this.config.diditApiKey!,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        workflow_id: this.config.diditWorkflowId!,
        vendor_data: userId,
        callback: callbackUrl,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      this.logger.error(`Failed to create Didit session: ${errText}`);
      throw new BadRequestException('Failed to initiate identity verification session with provider.');
    }

    const data = await res.json();
    return {
      sessionId: data.session_id,
      sessionUrl: data.url,
      sessionToken: data.session_token,
      status: data.status,
    };
  }

  /**
   * Fetches decision directly from Didit API.
   */
  async getSessionDecision(sessionId: string): Promise<DiditDecision> {
    const res = await fetch(`https://verification.didit.me/v3/session/${sessionId}/decision/`, {
      method: 'GET',
      headers: {
        'x-api-key': this.config.diditApiKey!,
        accept: 'application/json',
      },
    });

    if (!res.ok) {
      const errText = await res.text();
      this.logger.error(`Failed to fetch Didit decision for session ${sessionId}: ${errText}`);
      throw new BadRequestException('Failed to retrieve verification decision.');
    }

    return (await res.json()) as DiditDecision;
  }

  /**
   * Processes the verified identity result, validates name-matching,
   * and registers identity permanently in PermanentIdentityRegistry to close
   * the deleted account loophole.
   */
  async processVerificationDecision(sessionId: string, currentUserId: string, submittedLegalName?: string) {
    const decision = await this.getSessionDecision(sessionId);
    const userId = decision.vendor_data || currentUserId;

    if (decision.status !== 'Approved' && decision.status !== 'APPROVED') {
      this.logger.warn(`Didit verification not approved for user ${userId}. Status: ${decision.status}`);
      return {
        success: false,
        status: decision.status,
        message: 'Identity verification was not approved by provider.',
      };
    }

    const idCheck = decision.id_verifications?.[0];
    if (!idCheck || !idCheck.document_number) {
      throw new BadRequestException('No valid identity document extracted by verification provider.');
    }

    const docType = idCheck.document_type || 'national_id';
    const docNumber = idCheck.document_number;
    const country = idCheck.issuing_country || 'UNKNOWN';
    const verifiedFullName =
      idCheck.full_name ||
      `${idCheck.first_name || ''} ${idCheck.last_name || ''}`.trim() ||
      'VERIFIED INDIVIDUAL';
    const birthDate = idCheck.date_of_birth || null;

    // 1. Name Match Validation
    if (submittedLegalName) {
      const isMatch = this.isNameMatching(
        submittedLegalName,
        idCheck.first_name,
        idCheck.last_name,
        idCheck.full_name,
      );
      if (!isMatch) {
        this.logger.warn(
          `Name mismatch for user ${userId}: submitted "${submittedLegalName}", doc extracted "${verifiedFullName}"`,
        );
        throw new ForbiddenException({
          code: 'NAME_MISMATCH',
          message:
            'The name on your government document does not match the legal name entered on your account.',
        });
      }
    }

    // 2. Hash identity document
    const idHash = this.hashIdentityDocument(docType, docNumber, country);

    // 3. Permanent Identity Registry Check (Scenario 1 Mitigation)
    const existingIdentity = await this.prisma.permanentIdentityRegistry.findUnique({
      where: { idDocumentHash: idHash },
    });

    if (existingIdentity) {
      // Check if this permanent identity was banned previously
      if (existingIdentity.isBanned) {
        this.logger.error(`BANNED identity re-registration attempted by user ${userId}. Document hash: ${idHash}`);
        // Flag and ban the new account immediately
        await this.prisma.profile.update({
          where: { id: userId },
          data: { identityStatus: 'rejected' },
        });
        throw new ForbiddenException({
          code: 'IDENTITY_BANNED',
          message: 'This identity has been permanently barred from ZoikoSocial due to previous policy violations.',
        });
      }

      // Check if this identity is currently active on another different account
      if (existingIdentity.currentUserId && existingIdentity.currentUserId !== userId) {
        const otherUser = await this.prisma.profile.findUnique({
          where: { id: existingIdentity.currentUserId },
          select: { id: true, identityStatus: true },
        });

        if (otherUser && otherUser.identityStatus === 'approved') {
          throw new ForbiddenException({
            code: 'IDENTITY_ALREADY_LINKED',
            message: 'This national identity is already actively verified on another ZoikoSocial account.',
          });
        }
      }

      // Re-link to new account (user deleted old account and legitimately recreated)
      await this.prisma.permanentIdentityRegistry.update({
        where: { id: existingIdentity.id },
        data: {
          currentUserId: userId,
          associatedUserIds: {
            push: userId,
          },
          diditSessionId: sessionId,
          lastVerifiedAt: new Date(),
        },
      });
      this.logger.log(`Existing permanent identity transferred to user ${userId} (re-created account detected)`);
    } else {
      // First time this national document is registered in ZoikoSocial
      await this.prisma.permanentIdentityRegistry.create({
        data: {
          idDocumentHash: idHash,
          verifiedFullName,
          birthDate,
          issuingCountry: country,
          docType,
          currentUserId: userId,
          associatedUserIds: [userId],
          diditSessionId: sessionId,
          isBanned: false,
        },
      });
      this.logger.log(`New permanent identity registered for user ${userId}`);
    }

    // 4. Mark user Profile as Identity Verified
    await this.prisma.profile.update({
      where: { id: userId },
      data: {
        identityStatus: 'approved',
      },
    });

    return {
      success: true,
      status: 'Approved',
      verifiedFullName,
      country,
      docType,
    };
  }
}
