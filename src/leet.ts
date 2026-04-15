// src/leet.ts

export const LEET_TABLE: Record<string, string[]> = {
  a: ['4', '@', '/\\', 'а'],
  b: ['8', '|3', '13'],
  c: ['(', '<', '{', '['],
  d: ['|)', 'cl', '[)'],
  e: ['3', '€', '[-'],
  f: ['|=', 'ph', '|#'],
  g: ['6', '9', '(_+'],
  h: ['#', '|-|', '}{', ')-('],
  i: ['1', '!', '|', ']['],
  j: ['_|', ']', '_)'],
  k: ['|<', '|{', 'ik'],
  l: ['1', '|_', '|'],
  m: ['|\\/|', '|v|', '/\\/\\', '|\\/|'],
  n: ['|\\|', '/\\/', '|\\/|', '|\\\\|'],
  o: ['0', '()', '[]', '<>'],
  p: ['|*', '|o', '|>', '|"'],
  q: ['(,)', '0_', 'kw'],
  r: ['|2', '|?', '/2', 'I2'],
  s: ['5', '$', 'z'],
  t: ['7', '+', '†'],
  u: ['00', '|_|', '\\_/'],
  v: ['\\/', '\\/'],
  w: ['\\/\\/', 'vv', '\\|/', '\\^/'],
  x: ['><', '%', '}{'],
  y: ['`/', '¥', '\\|/'],
  z: ['2', '7_', '>_'],
};

export const BASIC_LEET_PROFILE: Record<string, string> = {
  a: '4', b: '8', e: '3', g: '6', i: '1', o: '0', s: '5', t: '7', u: '00', z: '2',
};

export const READABLE_FULL_PROFILE: Record<string, string> = {
  a: '4', b: '8', e: '3', g: '6', i: '1', o: '0', s: '5', t: '7', z: '2',
};

export type LeetProfile = 'basic' | 'readable' | 'full';

export function availableProfiles(): LeetProfile[] {
  return ['basic', 'readable', 'full'];
}

export function getLeetProfile(
  name: LeetProfile | string,
  customMap?: Record<string, string>,
  complexity = 0,
): Record<string, string> {
  if (customMap) return customMap;
  if (name === 'basic') return { ...BASIC_LEET_PROFILE };
  if (name === 'readable') return { ...READABLE_FULL_PROFILE };
  if (name === 'full') return buildFullLeetProfile(complexity);
  throw new Error(`Unknown leet profile: ${name}. Available: basic, readable, full`);
}

export function buildFullLeetProfile(complexity = 0): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [letter, variants] of Object.entries(LEET_TABLE)) {
    const idx = Math.min(complexity, variants.length - 1);
    result[letter] = variants[idx];
  }
  return result;
}

export const DEFAULT_LEET_DENSITY = 0.86;
export const LEET_SIGNAL_CHARS = new Set(['4', '3', '1', '0', '5', '7', '2', '@', '$', '!']);

export function applyLeet(text: string, mapping: Record<string, string>, density = DEFAULT_LEET_DENSITY): string {
  if (density < 0 || density > 1) throw new Error('Leet density must be between 0.0 and 1.0');
  const chars = [...text];
  return chars.map((ch, pos) => {
    const lower = ch.toLowerCase();
    const replacement = mapping[lower];
    if (!replacement) return ch;
    // Density check: deterministic pseudo-random based on char value and position
    /* istanbul ignore next */
    const charOrd = ch.codePointAt(0) ?? 0;
    const score = (pos * 131 + charOrd * 17) % 100;
    if (score >= density * 100) return ch;
    // Preserve case if possible
    if (ch === ch.toUpperCase() && ch !== ch.toLowerCase()) {
      return replacement.toUpperCase();
    }
    return replacement;
  }).join('');
}

export function looksLikeLeet(text: string): boolean {
  let signalCount = 0;
  for (const ch of text) {
    if (LEET_SIGNAL_CHARS.has(ch)) signalCount++;
  }
  return signalCount >= 2;
}

export interface LeetEncoderOptions {
  profile?: LeetProfile | string;
  customMap?: Record<string, string>;
  complexity?: number;
  density?: number;
}

export class LeetEncoder {
  readonly profile: LeetProfile | string;
  readonly mapping: Record<string, string>;
  readonly density: number;

  constructor(options: LeetEncoderOptions = {}) {
    this.profile = options.profile ?? 'basic';
    this.density = options.density ?? DEFAULT_LEET_DENSITY;
    this.mapping = getLeetProfile(this.profile, options.customMap, options.complexity ?? 0);
  }

  encode(text: string): string {
    return applyLeet(text, this.mapping, this.density);
  }
}
