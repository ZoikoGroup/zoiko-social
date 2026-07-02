import { Module } from '@nestjs/common'
import { SupabaseAdminClientProvider, SupabaseAnonClientProvider } from './database.providers'

@Module({
  providers: [SupabaseAdminClientProvider, SupabaseAnonClientProvider],
  exports: [SupabaseAdminClientProvider, SupabaseAnonClientProvider],
})
export class DatabaseModule {}
