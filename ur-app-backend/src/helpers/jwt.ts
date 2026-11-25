import * as jose from 'jose';

// We'll need env passed; simpler: use a function that accepts secret
export const signToken = async (userId: string, email: string, role: string, secret: string): Promise<string> => {
  const jwtSecret = new TextEncoder().encode(secret);
  return await new jose.SignJWT({ userId, email, role })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(jwtSecret);
};

export const verifyToken = async (token: string, secret: string): Promise<{ userId: string; email: string; role: string }> => {
  const jwtSecret = new TextEncoder().encode(secret);
  const { payload } = await jose.jwtVerify(token, jwtSecret);
  return payload as unknown as { userId: string; email: string; role: string };
};