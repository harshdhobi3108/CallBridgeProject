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
  const [recordings, setRecordings] = useState<CallRecording[]>([]);

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
        callRecordings?.map((meeting) => meeting.queryRecordings()) ?? []
      );

      const recordings = callData
        .filter((call) => call.recordings.length > 0)
        .flatMap((call) => call.recordings);

      setRecordings(recordings);
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
    const confirmed = confirm('Are you sure you want to delete this recording?');
    if (!confirmed || !callCid || !sessionId) return;

    const callId = callCid.split(':')[1]; // extract 'callId' from 'default:callId'

    try {
      await fetch(`/api/delete-recording`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ callId, sessionId }),
      });

      setRecordings((prev) => prev.filter((r) => r.id !== recordingId));
    } catch (error) {
      console.error('Delete failed', error);
      alert('Failed to delete recording.');
    }
  };

  if (isLoading) return <Loader />;

  const calls = getCalls();
  const noCallsMessage = getNoCallsMessage();

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
      {calls && calls.length > 0 ? (
        calls.map((meeting: Call | CallRecording) => {
          const isRecording = type === 'recordings';
          const meetingId = (meeting as Call).id || (meeting as CallRecording).id;
          const recording = meeting as CallRecording;

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
                  (meeting as Call).state?.custom?.description ||
                  recording.filename?.substring(0, 20) ||
                  'No Description'
                }
                date={
                  (meeting as Call).state?.startsAt?.toLocaleString() ||
                  recording.start_time?.toLocaleString()
                }
                isPreviousMeeting={type === 'ended'}
                link={
                  isRecording
                    ? recording.url
                    : `${baseUrl}/meeting/${(meeting as Call).id}`
                }
                buttonIcon1={isRecording ? '/icons/play.svg' : undefined}
                buttonText={isRecording ? 'Play' : 'Start'}
                handleClick={
                  isRecording
                    ? () => router.push(recording.url)
                    : () => router.push(`/meeting/${(meeting as Call).id}`)
                }
              />

              {isRecording && (
                <button
                  onClick={() =>
                    handleDelete(recording.id, recording.call_cid, recording.session_id)
                  }
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
