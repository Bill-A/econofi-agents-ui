import { SignJWT } from 'jose';

const secret = new TextEncoder().encode(
  process.env.DEMO_JWT_SECRET ?? 'fallback-secret-not-for-production',
);

export async function getDemoToken(): Promise<string> {
  return new SignJWT({
    sub: 'user-demo-001',
    bank_id: '00000000-0000-0000-0000-000000000001',
    role: 'compliance_officer',
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secret);
}
