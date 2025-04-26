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
          <div className="max-w-4/5 bg-[var(--primary-color)] p-2 rounded-l-md rounded-br-md shadow-sm">
            <p className="text-white text-xs whitespace-pre-line">{message}</p>
          </div>
        </div>
      ) : (
        <div className="flex gap-2 max-w-4/5">
          <div className="w-8 min-w-8 h-8 min-h-8 bg-purple-100 p-1.5 rounded-full">
            <Image
              src={'/coach.png'}
              width={24}
              height={24}
              alt="Profiler Coach AI"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex-1 bg-white p-2 rounded-md rounded-tl-none shadow-sm">
            <p className="text-gray-700 text-xs whitespace-pre-line">
              {message}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
