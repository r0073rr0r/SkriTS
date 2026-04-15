// D:\Projects\SkriTS\src\satrovacki.ts

import { cyrillicToLatin, latinToCyrillic, containsCyrillic } from './core/transliteration';
import { applyCase } from './core/caseHelper';
import { tokenize, isAlpha } from './core/tokenizer';
import { splitChars, strLen } from './core/stringUtils';

export interface SatrovackiOptions {
  minWordLength?: number;
  plainCTarget?: string;
  softTjToCyrillic?: boolean;
  exceptions?: Record<string, string>;
}

const VOWELS = new Set(['a', 'e', 'i', 'o', 'u', 'а', 'е', 'и', 'о', 'у']);

export class Satrovacki {
  readonly minWordLength: number;
  readonly plainCTarget: string;
  readonly softTjToCyrillic: boolean;
  readonly exceptions: Record<string, string>;

  constructor(options: SatrovackiOptions = {}) {
    this.minWordLength = options.minWordLength ?? 3;
    this.plainCTarget = options.plainCTarget ?? 'ц';
    this.softTjToCyrillic = options.softTjToCyrillic ?? false;
    this.exceptions = options.exceptions ?? {};
  }

  encode(text: string): string {
    return tokenize(text).map(token => {
      if (isAlpha(token)) return this.encodeWord(token);
      return token;
    }).join('');
  }

  decode(text: string): string {
    return tokenize(text).map(token => {
      if (isAlpha(token)) return this.decodeWord(token);
      return token;
    }).join('');
  }

  encodeWord(word: string): string {
    if (strLen(word) < this.minWordLength) return word;

    const isCyr = containsCyrillic(word);
    const latin = isCyr ? cyrillicToLatin(word) : word;
    const latinLower = latin.toLowerCase();

    const replaced = this._encodeLatinWord(latinLower);
    let result = applyCase(latin, replaced);
    if (isCyr) {
      result = latinToCyrillic(result, this.softTjToCyrillic, this.plainCTarget);
    }
    return result;
  }

  decodeWord(word: string): string {
    if (strLen(word) < this.minWordLength) return word;

    const isCyr = containsCyrillic(word);
    const latin = isCyr ? cyrillicToLatin(word) : word;
    const latinLower = latin.toLowerCase();

    const reverseExceptions: Record<string, string> = {};
    for (const [k, v] of Object.entries(this.exceptions)) {
      reverseExceptions[v] = k;
    }
    let replaced = reverseExceptions[latinLower] ?? null;

    if (replaced === null) {
      const candidates = this._decodeCandidates(latinLower);
      replaced = candidates.length > 0 ? this._pickBestDecodeCandidate(candidates) : latinLower;
    }

    let result = applyCase(latin, replaced);
    if (isCyr) {
      result = latinToCyrillic(result, this.softTjToCyrillic, this.plainCTarget);
    }
    return result;
  }

  canDecodeWord(word: string): boolean {
    if (strLen(word) < this.minWordLength) return false;
    const isCyr = containsCyrillic(word);
    const latin = isCyr ? cyrillicToLatin(word) : word;
    const lower = latin.toLowerCase();

    const reverseExceptions: Record<string, string> = {};
    for (const [k, v] of Object.entries(this.exceptions)) {
      reverseExceptions[v] = k;
    }
    if (reverseExceptions[lower] !== undefined) return true;
    return this._decodeCandidates(lower).length > 0;
  }

  _encodeLatinWord(lowerWord: string): string {
    const exc = this.exceptions[lowerWord];
    if (exc !== undefined) return exc;
    return this._encodeLatinWordPlain(lowerWord);
  }

  _encodeLatinWordPlain(lowerWord: string): string {
    const splitIdx = this._findSplitIndex(lowerWord);
    const n = strLen(lowerWord);
    if (splitIdx <= 0 || splitIdx >= n) return lowerWord;
    const chars = splitChars(lowerWord);
    return chars.slice(splitIdx).join('') + chars.slice(0, splitIdx).join('');
  }

  _decodeCandidates(lowerWord: string): Array<[number, string]> {
    const candidates: Array<[number, string]> = [];
    const n = strLen(lowerWord);
    const chars = splitChars(lowerWord);

    for (let splitIndex = 1; splitIndex < n; splitIndex++) {
      // Right-rotate by splitIndex: take last splitIndex chars + rest
      const candidate = chars.slice(n - splitIndex).join('') + chars.slice(0, n - splitIndex).join('');
      const encodedWithExc = this._encodeLatinWord(candidate);
      const encodedPlain = this._encodeLatinWordPlain(candidate);
      if (encodedWithExc === lowerWord || encodedPlain === lowerWord) {
        candidates.push([splitIndex, candidate]);
      }
    }
    return candidates;
  }

  _pickBestDecodeCandidate(candidates: Array<[number, string]>): string {
    const half = strLen(candidates[0][1]) / 2.0;

    const score = ([splitIndex, candidate]: [number, string]): [number, number, number, number] => {
      const secondIsVowel = (strLen(candidate) > 1 && this._isVowelAt(candidate, 1)) ? 1 : 0;
      const startsWithConsonant = (candidate.length > 0 && !this._isVowelAt(candidate, 0)) ? 1 : 0;
      return [-startsWithConsonant, Math.abs(splitIndex - half), -secondIsVowel, splitIndex];
    };

    return candidates.reduce((best, cur) => {
      const bs = score(best);
      const cs = score(cur);
      for (let i = 0; i < 4; i++) {
        if (cs[i] < bs[i]) return cur;
        if (cs[i] > bs[i]) return best;
      }
      /* istanbul ignore next */
      return best;
    })[1];
  }

  protected _findSplitIndex(word: string): number {
    // Single-pass scan: seek the first interior vowel (i.e. a vowel that follows
    // at least one consonant). For vowel-initial words, the leading vowel block is
    // skipped first so that the split falls after the *next* vowel group.
    // If the interior split would be degenerate (B would be empty), fall back to
    // floor(n/2). If no interior vowel exists, return the end of the leading
    // vowel block (or floor(n/2) for all-consonant words).
    const n = strLen(word);
    let seenConsonant = false;
    let initialVowelEnd = 0;

    for (let i = 0; i < n; i++) {
      if (!this._isVowelAt(word, i)) {
        seenConsonant = true;
      } else if (seenConsonant) {
        // Interior vowel: extend through vowel run
        let splitIdx = i + 1;
        while (splitIdx < n && this._isVowelAt(word, splitIdx)) splitIdx++;
        // Degenerate (B would be empty) — fall back to midpoint
        if (splitIdx >= n) return Math.floor(n / 2);
        return splitIdx;
      } else {
        // Still in leading vowel block
        initialVowelEnd = i + 1;
      }
    }

    // No interior vowel found
    if (initialVowelEnd > 0) return initialVowelEnd; // end of leading vowel block
    return Math.floor(n / 2);                         // all-consonant fallback
  }

  protected _isVowelAt(word: string, i: number): boolean {
    const chars = splitChars(word);
    if (i < 0 || i >= chars.length) return false;
    const ch = chars[i].toLowerCase();
    if (VOWELS.has(ch)) return true;
    // Syllabic r: 'r' between consonants, not at word edges
    if (ch === 'r' && i > 0 && i < chars.length - 1) {
      const prev = chars[i - 1].toLowerCase();
      const next = chars[i + 1].toLowerCase();
      return !VOWELS.has(prev) && !VOWELS.has(next);
    }
    return false;
  }
}
