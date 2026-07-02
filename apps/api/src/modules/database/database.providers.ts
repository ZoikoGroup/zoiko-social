import { type Provider, Logger } from '@nestjs/common'
import { createClient } from '@supabase/supabase-js'
import { ConfigService } from '../config/config.service'
import type { Database } from '../../types/database'

export const SUPABASE_ADMIN_CLIENT = 'SUPABASE_ADMIN_CLIENT'
export const SUPABASE_ANON_CLIENT = 'SUPABASE_ANON_CLIENT'

export type SupabaseAdminClient = ReturnType<typeof createClient<Database>>
export type SupabaseAnonClient = ReturnType<typeof createClient<Database>>

export const SupabaseAdminClientProvider: Provider = {
  provide: SUPABASE_ADMIN_CLIENT,
  inject: [ConfigService],
  useFactory: (config: ConfigService) => {
    const logger = new Logger('SupabaseAdminClient')
    const client = createClient<Database>(
      config.supabaseUrl,
      config.supabaseServiceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      },
    )
    logger.log('Supabase admin client initialized')
    return client
  },
}

export const SupabaseAnonClientProvider: Provider = {
  provide: SUPABASE_ANON_CLIENT,
  inject: [ConfigService],
  useFactory: (config: ConfigService) => {
    const logger = new Logger('SupabaseAnonClient')
    const client = createClient<Database>(
      config.supabaseUrl,
      config.supabaseAnonKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      },
    )
    logger.log('Supabase anon client initialized')
    return client
  },
}
