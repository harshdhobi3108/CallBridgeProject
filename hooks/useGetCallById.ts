// hooks/useGetCallById.ts
import { useEffect, useState } from 'react';
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk';

export const useGetCallById = (id: string | string[] | undefined) => {
  const client = useStreamVideoClient();
  const [call, setCall] = useState<Call | null>(null);
  const [isCallLoading, setIsCallLoading] = useState(true);

  useEffect(() => {
    if (!client || !id) return;

    const getCall = async () => {
      try {
        const callInstance = client.call('default', id as string);
        await callInstance.join(); // 🔥 required to activate media + state
        setCall(callInstance);
      } catch (err) {
        console.error('Error joining call:', err);
      } finally {
        setIsCallLoading(false);
      }
    };

    getCall();
  }, [client, id]);

  return { call, isCallLoading };
};
