const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.$executeRawUnsafe(`insert into storage.buckets (id, name, public) values ('verification-documents', 'verification-documents', false) on conflict do nothing;`);
  
  // Also create RLS policy to allow users to upload their own documents
  await prisma.$executeRawUnsafe(`
    create policy "Users can upload their own verification docs"
    on storage.objects for insert
    with check (
      bucket_id = 'verification-documents' and
      auth.uid() = (regexp_match(name, '^([^/]+)/'))[1]::uuid
    );
  `).catch(e => console.log('Policy insert error (might exist):', e.message));

  console.log('Bucket and policy created');
}

main().finally(() => prisma.$disconnect());
