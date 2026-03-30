'use client';

import { ReactNode, useEffect, useState } from 'react';
import { StreamVideoClient, StreamVideo } from '@stream-io/video-react-sdk';
import { useUser } from '@clerk/nextjs';

const API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY;

const StreamClientProvider = ({ children }: { children: ReactNode }) => {
  const [videoClient, setVideoClient] = useState<StreamVideoClient | null>(null);
  const { user, isLoaded } = useUser();

  useEffect(() => {
    const initializeClient = async () => {
      if (!API_KEY) {
        console.error('❌ STREAM API KEY MISSING');
        return;
      }

      if (!isLoaded || !user) return;

      try {
        const res = await fetch('/api/token', {
          method: 'POST',
        });

        if (!res.ok) {
          throw new Error('❌ Token API failed');
        }

        const data = await res.json();

        if (!data?.token) {
          throw new Error('❌ No token received');
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
      } catch (error) {
        console.error('[Stream Init Error]', error);
      }
    };

    initializeClient();
  }, [user, isLoaded]);

  // ✅ Wait for Clerk to load
  if (!isLoaded) {
    return <div>Loading user...</div>;
  }

  // 🚨 CRITICAL FIX → allow auth pages to render
  if (!user) {
    return <>{children}</>;
  }

  // ✅ Initialize Stream after login
  if (!videoClient) {
    return <div>Initializing video client...</div>;
  }

  return <StreamVideo client={videoClient}>{children}</StreamVideo>;
};

export default StreamClientProvider;
