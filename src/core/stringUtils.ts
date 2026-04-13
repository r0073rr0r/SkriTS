// D:\Projects\SkriTS\src\core\stringUtils.ts

/** Unicode-safe string length */
export function strLen(s: string): number {
  return [...s].length;
}

/** Unicode-safe substring */
export function strSubstr(s: string, start: number, length?: number): string {
  const chars = [...s];
  return chars.slice(start, length !== undefined ? start + length : undefined).join('');
}

/** Unicode-safe split into array of characters */
export function splitChars(s: string): string[] {
  return [...s];
}

export function startsWith(s: string, prefix: string): boolean {
  return s.startsWith(prefix);
}

export function endsWith(s: string, suffix: string): boolean {
  return s.endsWith(suffix);
}
