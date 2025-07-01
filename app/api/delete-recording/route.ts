import { NextRequest, NextResponse } from 'next/server';
import { StreamVideoServerClient } from '@stream-io/video-node-sdk';

const apiKey = process.env.STREAM_API_KEY!;
const secret = process.env.STREAM_SECRET!;

const serverClient = new StreamVideoServerClient(apiKey, secret);

export async function DELETE(req: NextRequest) {
  try {
    const { callId, sessionId } = await req.json();

    if (!callId || !sessionId) {
      return NextResponse.json({ error: 'Missing callId or sessionId' }, { status: 400 });
    }

    await serverClient.deleteRecording(callId, sessionId);

    return NextResponse.json({ message: 'Recording deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('[DELETE_RECORDING_ERROR]', error);
    return NextResponse.json({ error: 'Failed to delete recording' }, { status: 500 });
  }
}
