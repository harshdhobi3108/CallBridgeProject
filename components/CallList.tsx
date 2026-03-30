'use client';

import { Call, CallRecording } from '@stream-io/video-react-sdk';
import Loader from './Loader';
import { useGetCalls } from '@/hooks/useGetCalls';
import MeetingCard from './MeetingCard';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';

const CallList = ({ type }: { type: 'ended' | 'upcoming' | 'recordings' }) => {
  const router = useRouter();
  const { endedCalls, upcomingCalls, callRecordings, isLoading } = useGetCalls();
  const [recordings, setRecordings] = useState<any[]>([]);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  const getCalls = () => {
    switch (type) {
      case 'ended':
        return endedCalls;
      case 'recordings':
        return recordings;
      case 'upcoming':
        return upcomingCalls;
      default:
        return [];
    }
  };

  const getNoCallsMessage = () => {
    switch (type) {
      case 'ended':
        return 'No Previous Calls';
      case 'upcoming':
        return 'No Upcoming Calls';
      case 'recordings':
        return 'No Recordings';
      default:
        return '';
    }
  };

  useEffect(() => {
    const fetchRecordings = async () => {
      const callData = await Promise.all(
        callRecordings?.map(async (call) => {
          const result = await call.queryRecordings();
          return result.recordings.map((r) => ({
            ...r,
            call_cid: call.cid, // ✅ attach call_cid manually
          }));
        }) ?? []
      );

      const allRecordings = callData.flat();
      setRecordings(allRecordings);
    };

    if (type === 'recordings') {
      fetchRecordings();
    }
  }, [type, callRecordings]);

  const handleDelete = async (
    recordingId: string,
    callCid: string | undefined,
    sessionId: string | undefined
  ) => {
    console.log('🔥 DELETE CLICKED:', { recordingId, callCid, sessionId });

    const confirmed = confirm('Are you sure you want to delete this recording?');
    if (!confirmed || !callCid || !sessionId) return;

    const callId = callCid.split(':')[1];

    try {
      const res = await fetch(`/api/delete-recording`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ callId, sessionId }),
      });

      const data = await res.json();
      console.log('✅ Delete response:', data);

      if (!res.ok) {
        alert('Failed to delete recording: ' + data.error);
        return;
      }

      setRecordings((prev) => prev.filter((r) => r.id !== recordingId));
    } catch (error) {
      console.error('❌ Delete failed', error);
      alert('Failed to delete recording.');
    }
  };

  if (isLoading) return <Loader />;

  const calls = getCalls();
  const noCallsMessage = getNoCallsMessage();

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
      {calls && calls.length > 0 ? (
        calls.map((meeting: Call | any, index: number) => {
          const isRecording = type === 'recordings';
          const call = meeting as Call;
          const recording = meeting;

          const recordingId = recording?.id ?? `rec-${index}`;
          const callCid = recording?.call_cid;
          const sessionId = recording?.session_id;

          const meetingId =
            call?.id ||
            recording?.id ||
            `${sessionId}-${Math.random().toString(36).substring(2, 6)}`;

          return (
            <div key={meetingId} className="relative">
              <MeetingCard
                icon={
                  type === 'ended'
                    ? '/icons/previous.svg'
                    : type === 'upcoming'
                    ? '/icons/upcoming.svg'
                    : '/icons/recordings.svg'
                }
                title={
                  call?.state?.custom?.description ||
                  recording?.filename?.substring(0, 20) ||
                  'No Description'
                }
                date={
                  call?.state?.startsAt?.toLocaleString() ||
                  recording?.start_time?.toLocaleString() ||
                  ''
                }
                isPreviousMeeting={type === 'ended'}
                link={
                  isRecording
                    ? recording?.url ?? '#'
                    : `${baseUrl}/meeting/${call?.id}`
                }
                buttonIcon1={isRecording ? '/icons/play.svg' : undefined}
                buttonText={isRecording ? 'Play' : 'Start'}
                handleClick={
                  isRecording
                    ? () => router.push(recording?.url ?? '#')
                    : () => router.push(`/meeting/${call?.id}`)
                }
              />

              {/* ✅ Show delete icon if valid recording */}
              {isRecording && callCid && sessionId && (
                <button
                  onClick={() => handleDelete(recordingId, callCid, sessionId)}
                  className="absolute top-2 right-4 text-blue-500 hover:text-blue-700"
                  title="Delete Recording"
                >
                  <Trash2 size={24} />
                </button>
              )}
            </div>
          );
        })
      ) : (
        <h1 className="text-2xl font-bold text-white">{noCallsMessage}</h1>
      )}
    </div>
  );
};

export default CallList;
