import React from 'react';
import iconsRaw from 'lucide-static/icon-nodes.json';

import { IconInterface } from '@/interfaces/icon.interface';

type IconNode =
  | ['path', { d: string }]
  | ['line', { x1: string; y1: string; x2: string; y2: string }]
  | ['circle', { cx: string; cy: string; r: string; fill?: string }]
  | [
      'rect',
      {
        width: string;
        height: string;
        x: string;
        y: string;
        rx: string;
        ry: string;
      },
    ]
  | [
      'ellipse',
      {
        cx: string;
        cy: string;
        rx: string;
        ry: string;
      },
    ]
  | ['polygon', { points: string }]
  | ['polyline', { points: string }];

export default function LucideIcon({
  name,
  size = 16,
  strokeWidth = 2,
  fill = 'none',
}: {
  name: IconInterface;
  size?: number;
  color?: string;
  strokeWidth?: number;
  fill?: 'none' | 'currentColor';
}) {
  const iconNodes = iconsRaw[name] as IconNode[];
  if (!iconNodes) return null;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill}
      strokeWidth={strokeWidth}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {iconNodes.map(([tag, attrs], i) => {
        return React.createElement(tag, { key: i, ...attrs });
      })}
    </svg>
  );
}
