import { Module } from '@nestjs/common'
import { CommunitiesController, MyCommunitiesController } from './communities.controller'
import { MembershipController } from './membership/membership.controller'
import { CommunityInvitesController, InviteRedeemController } from './invites/invites.controller'
import { CommunitiesService } from './communities.service'
import { MembershipService } from './membership/membership.service'
import { InvitesService } from './invites/invites.service'
import { CommunityRoleGuard } from './membership/community-role.guard'
import { AuthModule } from '../auth/auth.module'

@Module({
  imports: [AuthModule],
  controllers: [
    CommunitiesController,
    MyCommunitiesController,
    MembershipController,
    CommunityInvitesController,
    InviteRedeemController,
  ],
  providers: [CommunitiesService, MembershipService, InvitesService, CommunityRoleGuard],
  exports: [CommunitiesService, MembershipService],
})
export class CommunitiesModule {}
