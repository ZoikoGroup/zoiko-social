import { NestFactory } from '@nestjs/core'
import { AppModule } from './src/app.module'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import * as request from 'supertest'
import { PrismaClient } from '@prisma/client'
import { sign } from 'jsonwebtoken'
import { randomUUID } from 'crypto'

async function bootstrap() {
  const prisma = new PrismaClient()
  await prisma.$connect()

  // Setup test user
  const user = await prisma.user.create({
    data: {
      email: `${randomUUID()}@example.com`,
      passwordHash: 'dummy',
    }
  })
  
  const profile = await prisma.profile.create({
    data: {
      id: user.id,
      username: `testuser_${randomUUID().split('-')[0]}`,
      displayName: 'Test User',
      identityStatus: null, // NOT verified
    }
  })

  // Create JWT for the user
  const token = sign({ sub: user.id, username: profile.username, role: 'user' }, process.env.JWT_SECRET || 'fallback-secret-for-testing-only-do-not-use', { expiresIn: '1h' })

  // Initialize app
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    { logger: false }
  )
  await app.init()
  await app.getHttpAdapter().getInstance().ready()

  const server = app.getHttpServer()
  
  console.log('--- TEST 1: Unverified User (Should fail with VERIFICATION_SCOPE_REQUIRED) ---')
  const res1 = await request(server)
    .post('/shop')
    .set('Authorization', `Bearer ${token}`)
    .send({
      name: 'Test Product',
      category: 'accessories',
      price: 100,
      condition: 'new',
      description: 'Test description',
      currency: 'USD',
      quantity: 1,
    })

  console.log(`Status: ${res1.status}`)
  console.log(`Body: ${JSON.stringify(res1.body, null, 2)}`)

  console.log('\n--- TEST 2: Verified User without Subscription (Should fail with SUBSCRIPTION_REQUIRED) ---')
  
  // Make user verified
  await prisma.profile.update({
    where: { id: user.id },
    data: { identityStatus: 'approved' } // One of the required scopes is 'identity'
  })

  const res2 = await request(server)
    .post('/shop')
    .set('Authorization', `Bearer ${token}`)
    .send({
      name: 'Test Product',
      category: 'accessories',
      price: 100,
      condition: 'new',
      description: 'Test description',
      currency: 'USD',
      quantity: 1,
    })

  console.log(`Status: ${res2.status}`)
  console.log(`Body: ${JSON.stringify(res2.body, null, 2)}`)

  console.log('\n--- TEST 3: Verified User WITH Subscription (Should pass/fail for other reasons like bad input) ---')
  
  // Give user subscription
  await prisma.subscription.create({
    data: {
      userId: user.id,
      entitlement: 'seller_professional',
      status: 'active',
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 days
    }
  })

  const res3 = await request(server)
    .post('/shop')
    .set('Authorization', `Bearer ${token}`)
    .send({
      name: 'Test Product',
      category: 'accessories',
      price: 100,
      condition: 'new',
      description: 'Test description',
      currency: 'USD',
      quantity: 1,
    })

  console.log(`Status: ${res3.status}`)
  console.log(`Body: ${JSON.stringify(res3.body, null, 2)}`)

  // Cleanup
  await prisma.subscription.deleteMany({ where: { userId: user.id } })
  await prisma.profile.delete({ where: { id: user.id } })
  await prisma.user.delete({ where: { id: user.id } })

  await app.close()
  await prisma.$disconnect()
}

bootstrap().catch(err => {
  console.error(err)
  process.exit(1)
})
