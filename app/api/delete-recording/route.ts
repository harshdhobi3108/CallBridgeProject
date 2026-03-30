import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const STREAM_API_KEY = process.env.STREAM_API_KEY!;
const STREAM_SECRET = process.env.STREAM_SECRET!;
const STREAM_API_URL = 'https://video.stream-io-api.com/video/v1';

function generateJWT() {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600,
    user_id: 'server', // Make sure this user is registered in Stream if needed
  })).toString('base64url');

  const signature = crypto
    .createHmac('sha256', STREAM_SECRET)
    .update(`${header}.${payload}`)
    .digest('base64url');

  return `${header}.${payload}.${signature}`;
}

export async function DELETE(req: NextRequest) {
  try {
    const { callId, sessionId } = await req.json();

    if (!callId || !sessionId) {
      return NextResponse.json({ error: 'Missing callId or sessionId' }, { status: 400 });
    }

    const jwt = generateJWT();
    const url = `${STREAM_API_URL}/call/default/${callId}/recordings/${sessionId}`;

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: jwt,
        'Content-Type': 'application/json',
        'X-Stream-Client': 'callbridge-server',
      },
    });

    if (!response.ok) {
      const errorDetails = await response.json();
      console.error('❌ Stream API DELETE error:', errorDetails);
      return NextResponse.json({ error: errorDetails.message || 'Unknown error' }, { status: response.status });
    }

    return NextResponse.json({ message: 'Recording deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('[DELETE_RECORDING_ERROR]', error);
    return NextResponse.json({ error: 'Failed to delete recording' }, { status: 500 });
  }
}
