'use client';

import { useGetCalls } from '@/hooks/useGetCalls';
import MeetingTypeList from '@/components/MeetingTypeList';
import { useEffect, useState } from 'react';

const Home = () => {
  const now = new Date();
  const [nextMeetingTime, setNextMeetingTime] = useState<string | null>(null);
  const { upcomingCalls, isLoading } = useGetCalls();

  const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const date = new Intl.DateTimeFormat('en-US', { dateStyle: 'full' }).format(now);

  useEffect(() => {
    if (upcomingCalls && upcomingCalls.length > 0) {
      const sortedCalls = [...upcomingCalls].sort(
        (a, b) => new Date(a.state.startsAt!).getTime() - new Date(b.state.startsAt!).getTime()
      );

      const next = sortedCalls.find((call) => new Date(call.state.startsAt!) > now);

      if (next) {
        const nextTime = new Date(next.state.startsAt!).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        });
        setNextMeetingTime(nextTime);
      }
    }
  }, [upcomingCalls]);

  return (
    <section className="flex size-full flex-col gap-5 text-white">
      <div className="h-[303px] w-full rounded-[20px] bg-hero bg-cover">
        <div className="flex h-full flex-col justify-between max-md:px-5 max-md:py-8 lg:p-11">
          <h2 className="glassmorphism max-w-[273px] rounded py-2 text-center text-base font-normal">
            {isLoading
              ? 'Loading...'
              : nextMeetingTime
              ? `Upcoming Meeting at: ${nextMeetingTime}`
              : 'No Upcoming Meetings'}
          </h2>
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-extrabold lg:text-7xl">{time}</h1>
            <p className="text-lg font-medium text-sky-1 lg:text-2xl">{date}</p>
          </div>
        </div>
      </div>

      <MeetingTypeList />
    </section>
  );
};

export default Home;
