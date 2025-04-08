import { JsonObject, JsonValue } from '@/interfaces/data.interface';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isSameData(a: JsonValue, b: JsonValue): boolean {
  if (typeof a === 'string' && typeof b === 'string') {
    return a.trim() === b.trim();
  }

  if (a === b) return true;

  if (
    typeof a !== 'object' ||
    typeof b !== 'object' ||
    a === null ||
    b === null
  ) {
    return false;
  }

  // Array case
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!isSameData(a[i], b[i])) return false;
    }
    return true;
  }

  // Object case
  const keysA = Object.keys(a as JsonObject);
  const keysB = Object.keys(b as JsonObject);
  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (!keysB.includes(key)) return false;
    if (!isSameData((a as JsonObject)[key], (b as JsonObject)[key]))
      return false;
  }

  return true;
}
