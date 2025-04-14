'use client';

import React from 'react';
import { IconInterface } from '@/interfaces/icon.interface';
import {
  Svg,
  Path,
  Line,
  Rect,
  Circle,
  Ellipse,
  Polygon,
} from '@react-pdf/renderer';
import iconsRaw from 'lucide-static/icon-nodes.json';

interface IconPDFProps {
  name: IconInterface;
  size?: number;
  color?: string;
}

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

export const LucidePDFIcon = ({
  name,
  size = 16,
  color = 'white',
}: IconPDFProps) => {
  const iconNodes = iconsRaw[name] as IconNode[];
  if (!iconNodes) return null;

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {iconNodes.map(([tag, attrs], i) => {
        switch (tag) {
          case 'path':
            return <Path key={i} {...attrs} stroke={color} />;
          case 'line':
            return <Line key={i} {...attrs} stroke={color} />;
          case 'rect':
            return <Rect key={i} {...attrs} stroke={color} />;
          case 'circle':
            return <Circle key={i} {...attrs} stroke={color} />;
          case 'ellipse':
            return <Ellipse key={i} {...attrs} stroke={color} />;
          case 'polygon':
            return <Polygon key={i} {...attrs} stroke={color} />;
          default:
            return null;
        }
      })}
    </Svg>
  );
};
