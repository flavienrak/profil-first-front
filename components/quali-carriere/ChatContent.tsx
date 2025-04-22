import React from 'react';
import Image from 'next/image';

export default function ChatContent({
  message,
  mine,
}: {
  message: string;
  mine?: boolean;
}) {
  return (
    <>
      {mine ? (
        <div className="flex justify-end">
          <div className="flex-1 max-w-[calc(100%-3rem)] bg-[var(--primary-color)] p-4 rounded-l-xl rounded-br-2xl shadow-sm">
            <p className="text-white whitespace-pre-line">{message}</p>
          </div>
        </div>
      ) : (
        <div className="flex gap-4">
          <div className="w-8 min-w-8 h-8 min-h-8 bg-purple-100 p-1.5 rounded-full">
            <Image
              src={'/coach.png'}
              width={24}
              height={24}
              alt="Profiler Coach AI"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex-1 bg-white p-4 rounded-2xl rounded-tl-none shadow-sm">
            <p className="text-gray-700 whitespace-pre-line">{message}</p>
          </div>
        </div>
      )}
    </>
  );
}
