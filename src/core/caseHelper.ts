// D:\Projects\SkriTS\src\core\caseHelper.ts

export function isUpperCase(s: string): boolean {
  return s === s.toUpperCase() && s !== s.toLowerCase();
}

export function isLowerCase(s: string): boolean {
  return s === s.toLowerCase() && s !== s.toUpperCase();
}

export function isTitleCase(s: string): boolean {
  if (s.length === 0) return false;
  const chars = [...s];
  return chars[0] === chars[0].toUpperCase() &&
    chars.slice(1).join('') === chars.slice(1).join('').toLowerCase() &&
    chars[0] !== chars[0].toLowerCase();
}

export function applyCase(original: string, transformed: string): string {
  if (original.length === 0) return transformed;
  if (isUpperCase(original)) {
    return transformed.toUpperCase();
  }
  if (isTitleCase(original)) {
    const chars = [...transformed];
    if (chars.length === 0) return transformed;
    return chars[0].toUpperCase() + chars.slice(1).join('').toLowerCase();
  }
  // default: lowercase
  return transformed.toLowerCase();
}
