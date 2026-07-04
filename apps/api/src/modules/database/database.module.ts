import { Global, Module } from '@nestjs/common'
import { SupabaseAdminClientProvider, SupabaseAnonClientProvider } from './database.providers'

@Global()
@Module({
  providers: [SupabaseAdminClientProvider, SupabaseAnonClientProvider],
  exports: [SupabaseAdminClientProvider, SupabaseAnonClientProvider],
})
export class DatabaseModule {}
