'use client';

import { useEffect, useState } from 'react';
import { StreamCall, StreamTheme, useStreamVideoClient } from '@stream-io/video-react-sdk';
import { useParams } from 'next/navigation';

import MeetingSetup from '@/components/MeetingSetup';
import MeetingRoom from '@/components/MeetingRoom';

import type { Call } from '@stream-io/video-react-sdk';

const MeetingPage = () => {
  const { id } = useParams();
  const client = useStreamVideoClient();

  // Ensure id is a string
  const meetingId = Array.isArray(id) ? id[0] : id as string;

  const [call, setCall] = useState<Call | null>(null);
  const [isSetupComplete, setIsSetupComplete] = useState(false);

  useEffect(() => {
    if (!client || !meetingId) return;

    const callInstance = client.call('default', meetingId);
    setCall(callInstance);
  }, [client, meetingId]);

  if (!call) return <div className="text-white text-center mt-10">Loading...</div>;

  return (
    <StreamCall call={call}>
      <StreamTheme>
        {isSetupComplete ? (
          <MeetingRoom />
        ) : (
          <MeetingSetup setIsSetupComplete={setIsSetupComplete} />
        )}
      </StreamTheme>
    </StreamCall>
  );
};

export default MeetingPage;
