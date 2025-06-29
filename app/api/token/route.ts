import { StreamClient } from '@stream-io/node-sdk';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const STREAM_API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const STREAM_API_SECRET = process.env.STREAM_API_SECRET;

if (!STREAM_API_KEY || !STREAM_API_SECRET) {
  throw new Error('Missing Stream API key/secret in environment');
}

const serverClient = new StreamClient(STREAM_API_KEY, STREAM_API_SECRET);

export async function POST() {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const now = Math.floor(Date.now() / 1000);
    const iat = now - 60; // Issued 60 seconds ago
    const exp = now + 3600; // Expires in 1 hour

    const token = serverClient.createToken(userId, exp, iat);

    return NextResponse.json({ token });
  } catch (err: any) {
    console.error('[STREAM_TOKEN_ERROR]', err.message || err);
    return NextResponse.json({ error: 'Token generation failed' }, { status: 500 });
  }
}
