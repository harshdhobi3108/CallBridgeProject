'use client';

import { ReactNode, useEffect, useState } from 'react';
import { StreamVideoClient, StreamVideo } from '@stream-io/video-react-sdk';
import { useUser } from '@clerk/nextjs';

import Loader from '@/components/Loader';

const API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY;

const StreamVideoProvider = ({ children }: { children: ReactNode }) => {
  const [videoClient, setVideoClient] = useState<StreamVideoClient>();
  const { user, isLoaded } = useUser();

  useEffect(() => {
    const initializeClient = async () => {
      if (!isLoaded || !user || !API_KEY) return;

      try {
        const res = await fetch('/api/token', {
          method: 'POST',
        });

        const data = await res.json();

        if (!data.token) {
          throw new Error('Failed to fetch Stream token');
        }

        const client = new StreamVideoClient({
          apiKey: API_KEY,
          user: {
            id: user.id,
            name: user.username || user.id,
            image: user.imageUrl,
          },
          token: data.token,
        });

        setVideoClient(client);
      } catch (err) {
        console.error('[StreamVideoClient Init Error]', err);
      }
    };

    initializeClient();
  }, [user, isLoaded]);

  if (!videoClient) return <Loader />;

  return <StreamVideo client={videoClient}>{children}</StreamVideo>;
};

export default StreamVideoProvider;
