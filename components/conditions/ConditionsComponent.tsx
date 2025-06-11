'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { cgu } from '@/lib/conditions/cgu';
import { cgv } from '@/lib/conditions/cgv';
import { politique } from '@/lib/conditions/politique';

export default function ConditionsComponent() {
  return (
    <div className="w-full h-full min-h-screen flex justify-center">
      <div className="max-w-7xl w-full py-8 flex flex-col gap-4">
        <Link
          href="/"
          className="flex pb-4 border-b border-[var(--text-primary-color)]/10"
        >
          <Image
            src="/logo.png"
            alt="Profil First CV Logo"
            height={40}
            width={300}
          />
        </Link>

        <div className="flex justify-center items-center">
          <div className="max-w-7xl flex flex-col gap-20 py-12">
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-2">
                <h1 className="text-5xl font-bold text-[var(--text-primary-color)]">
                  {cgu.title}
                </h1>
                <p className="text-xl text-gray-400">{cgu.date}</p>
              </div>

              <div className="list-decimal list-inside flex flex-col gap-6">
                {cgu.content.map((item) => (
                  <div key={`cgu-${item.id}`} className="flex flex-col gap-2">
                    <p className="text-2xl font-semibold text-[var(--text-primary-color)]">
                      {item.id}. {item.name}
                    </p>
                    <div className="text-[var(--text-secondary-gray)] leading-5">
                      {Array.isArray(item.value) ? (
                        item.value.map((val, index) =>
                          val.type === 'string' ? (
                            <p key={`cgu-item-${index}`}>{val.desc}</p>
                          ) : val.type === 'mail' ? (
                            <a
                              href={`mailto:${val.desc}`}
                              key={`cgu-item-${index}`}
                            >
                              {val.desc}
                            </a>
                          ) : (
                            <a
                              key={`cgu-item-${index}`}
                              href={val.desc}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {val.desc}
                            </a>
                          ),
                        )
                      ) : (
                        <p>{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-2">
                <h1 className="text-5xl font-bold text-[var(--text-primary-color)]">
                  {cgv.title}
                </h1>
                <p className="text-xl text-gray-400">{cgv.date}</p>
              </div>

              <div className="list-decimal list-inside flex flex-col gap-6">
                {cgv.content.map((item) => (
                  <div key={`cgv-${item.id}`} className="flex flex-col gap-2">
                    <p className="text-2xl font-semibold text-[var(--text-primary-color)]">
                      {item.id}. {item.name}
                    </p>
                    <div className="text-[var(--text-secondary-gray)] leading-5">
                      {Array.isArray(item.value) ? (
                        item.value.map((val, index) =>
                          val.type === 'string' ? (
                            <p key={`cgu-item-${index}`}>{val.desc}</p>
                          ) : val.type === 'mail' ? (
                            <a
                              href={`mailto:${val.desc}`}
                              key={`cgu-item-${index}`}
                            >
                              {val.desc}
                            </a>
                          ) : (
                            <a
                              key={`cgu-item-${index}`}
                              href={val.desc}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {val.desc}
                            </a>
                          ),
                        )
                      ) : (
                        <p>{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-2">
                <h1 className="text-5xl font-bold text-[var(--text-primary-color)]">
                  {politique.title}
                </h1>
                <p className="text-xl text-gray-400">{politique.date}</p>
              </div>

              <div className="list-decimal list-inside flex flex-col gap-6">
                {politique.content.map((item) => (
                  <div key={`cgv-${item.id}`} className="flex flex-col gap-2">
                    <p className="text-2xl font-semibold text-[var(--text-primary-color)]">
                      {item.id}. {item.name}
                    </p>
                    <div className="text-[var(--text-secondary-gray)] leading-5">
                      {Array.isArray(item.value) ? (
                        item.value.map((val, index) =>
                          val.type === 'string' ? (
                            <p key={`cgu-item-${index}`}>{val.desc}</p>
                          ) : val.type === 'mail' ? (
                            <a
                              href={`mailto:${val.desc}`}
                              key={`cgu-item-${index}`}
                            >
                              {val.desc}
                            </a>
                          ) : (
                            <a
                              key={`cgu-item-${index}`}
                              href={val.desc}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {val.desc}
                            </a>
                          ),
                        )
                      ) : (
                        <p>{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
