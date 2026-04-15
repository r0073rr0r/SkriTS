// src/skrit.ts

import { Satrovacki, SatrovackiOptions } from './satrovacki';
import { Utrovacki, UtrovackiOptions } from './utrovacki';
import { Leetrovacki, LeetrovackiOptions, LeetBase } from './leetrovacki';
import { applyLeet, getLeetProfile, DEFAULT_LEET_DENSITY, BASIC_LEET_PROFILE, LeetProfile } from './leet';
import { tokenize, isAlpha } from './core/tokenizer';

export type Mode = 'auto' | 'satro' | 'utro' | 'leet';
export type DetectFrom = 'satro' | 'utro' | 'leet' | null;

export interface SkritOptions {
  mode?: Mode;
  detectFrom?: DetectFrom;
  minWordLength?: number;
  plainCTarget?: string;
  softTjToCyrillic?: boolean;
  exceptions?: Record<string, string>;
  leetBase?: LeetBase;
  leetProfile?: LeetProfile | string;
  leetComplexity?: number;
  leetDensity?: number;
  zaStyle?: '24' | 'z4';
  njeStyle?: 'n73' | 'nj3' | 'њ';
  utroPrefix?: string;
  utroInfix?: string;
  utroSuffix?: string;
}

export function detectMode(text: string, options: SkritOptions = {}): 'satro' | 'utro' | 'leet' {
  const tokens = tokenize(text).filter(t => isAlpha(t));
  if (tokens.length === 0) return 'satro';

  const utro = new Utrovacki({
    prefix: options.utroPrefix,
    infix: options.utroInfix,
    suffix: options.utroSuffix,
  });

  let utroCount = 0;
  let leetCount = 0;

  for (const token of tokens) {
    if (utro.canDecodeWord(token)) utroCount++;
    if (_looksLikeLeetrovacki(token) || _looksLikeUtroLeet(token, utro)) leetCount++;
  }

  const total = tokens.length;
  if (utroCount > total * 0.5) return 'utro';
  if (leetCount > total * 0.3) return 'leet';
  return 'satro';
}

export function detectLeetBase(text: string, options: SkritOptions = {}): 'satro' | 'utro' {
  const utro = new Utrovacki({
    prefix: options.utroPrefix,
    infix: options.utroInfix,
    suffix: options.utroSuffix,
  });
  const tokens = tokenize(text).filter(t => isAlpha(t));
  for (const token of tokens) {
    if (_looksLikeUtroLeet(token, utro)) return 'utro';
  }
  return 'satro';
}

export function encodeText(text: string, options: SkritOptions = {}): string {
  const mode = options.mode ?? 'auto';
  const sharedOpts: SatrovackiOptions = {
    minWordLength: options.minWordLength,
    plainCTarget: options.plainCTarget,
    softTjToCyrillic: options.softTjToCyrillic,
    exceptions: options.exceptions,
  };

  let effectiveMode: 'satro' | 'utro' | 'leet';

  if (mode === 'auto') {
    // Check if input is already encoded, if so decode it
    if (options.detectFrom) {
      return _autoDecodeText(text, options);
    }
    // Detect from input
    const detected = detectMode(text, options);
    if (detected !== 'satro') {
      return _autoDecodeText(text, { ...options, detectFrom: detected });
    }
    effectiveMode = 'satro';
  } else {
    effectiveMode = mode;
  }

  const utroOpts: UtrovackiOptions = {
    ...sharedOpts,
    prefix: options.utroPrefix,
    infix: options.utroInfix,
    suffix: options.utroSuffix,
  };

  const leetOpts: LeetrovackiOptions = {
    ...sharedOpts,
    base: options.leetBase,
    leetProfile: options.leetProfile,
    leetComplexity: options.leetComplexity,
    leetDensity: options.leetDensity,
    zaStyle: options.zaStyle,
    njeStyle: options.njeStyle,
    prefix: options.utroPrefix,
    infix: options.utroInfix,
    suffix: options.utroSuffix,
  };

  if (effectiveMode === 'satro') return new Satrovacki(sharedOpts).encode(text);
  if (effectiveMode === 'utro') return new Utrovacki(utroOpts).encode(text);
  if (effectiveMode === 'leet') return new Leetrovacki(leetOpts).encode(text);
  /* istanbul ignore next */
  return text;
}

function _autoDecodeText(text: string, options: SkritOptions): string {
  /* istanbul ignore next */
  const detectFrom = options.detectFrom ?? detectMode(text, options);
  const sharedOpts: SatrovackiOptions = {
    minWordLength: options.minWordLength,
    plainCTarget: options.plainCTarget,
    softTjToCyrillic: options.softTjToCyrillic,
    exceptions: options.exceptions,
  };

  if (detectFrom === 'utro') {
    const utro = new Utrovacki({
      ...sharedOpts,
      prefix: options.utroPrefix,
      infix: options.utroInfix,
      suffix: options.utroSuffix,
    });
    return utro.decode(text);
  }
  if (detectFrom === 'leet') {
    // Deleet first, then decode base
    const deleeted = _deleetTextBasic(text);
    const base = detectLeetBase(deleeted, options);
    if (base === 'utro') {
      return new Utrovacki({
        ...sharedOpts,
        prefix: options.utroPrefix,
        infix: options.utroInfix,
        suffix: options.utroSuffix,
      }).decode(deleeted);
    }
    return new Satrovacki(sharedOpts).decode(deleeted);
  }
  // satro
  return new Satrovacki(sharedOpts).decode(text);
}

export function _deleetTextBasic(text: string): string {
  // Reverse basic leet table
  const reverse: Record<string, string> = {};
  for (const [letter, replacement] of Object.entries(BASIC_LEET_PROFILE)) {
    reverse[replacement] = letter;
  }
  // Also handle '00' -> 'u'
  // Apply replacements (simple character-level)
  let result = text;
  // Multi-char first (00 -> u)
  result = result.replace(/00/g, 'u');
  // Single char replacements
  const mapped: Record<string, string> = { '4': 'a', '3': 'e', '1': 'i', '0': 'o', '5': 's', '7': 't', '2': 'z' };
  return result.split('').map(ch => mapped[ch] ?? ch).join('');
}

function _looksLikeLeetrovacki(word: string): boolean {
  let signalCount = 0;
  const signals = new Set(['4', '3', '1', '0', '5', '7', '2', '@', '$', '!']);
  for (const ch of word) {
    /* istanbul ignore next */
    if (signals.has(ch)) signalCount++;
  }
  return signalCount >= 2;
}

function _looksLikeUtroLeet(word: string, utro: Utrovacki): boolean {
  // Deleet and check if result looks like utro
  const deleeted = _deleetTextBasic(word);
  return utro.canDecodeWord(deleeted);
}

export function _looksLikeSatroEncoded(word: string, options: SatrovackiOptions = {}): boolean {
  return new Satrovacki(options).canDecodeWord(word);
}
