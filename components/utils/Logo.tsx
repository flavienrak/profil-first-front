'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Logo({
  href,
  showText = true,
}: {
  href: string;
  showText?: boolean;
}) {
  return (
    <Link href={href}>
      <div className="flex items-center gap-3 select-none">
        {showText ? (
          <Image src={'/logo.png'} alt="" width={200} height={25} />
        ) : (
          <Image src={'/short-logo.png'} alt="" width={40} height={40} />
        )}
      </div>
    </Link>
  );
}
