import { Module } from '@nestjs/common'
import { ProfileController } from './profile.controller'
import { ProfileService } from './profile.service'
import { DiditVerificationService } from './didit-verification.service'
import { AuthModule } from '../auth/auth.module'
import { SupabaseStorageModule } from '../storage/supabase-storage.module'

@Module({
  imports: [AuthModule, SupabaseStorageModule],
  controllers: [ProfileController],
  providers: [ProfileService, DiditVerificationService],
  exports: [ProfileService, DiditVerificationService],
})
export class ProfileModule {}
