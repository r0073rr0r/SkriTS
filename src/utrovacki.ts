// D:\Projects\SkriTS\src\utrovacki.ts

import { cyrillicToLatin, latinToCyrillic, containsCyrillic } from './core/transliteration';
import { applyCase } from './core/caseHelper';
import { tokenize, isAlpha } from './core/tokenizer';
import { splitChars, strLen } from './core/stringUtils';
import { Satrovacki, SatrovackiOptions } from './satrovacki';

export interface UtrovackiOptions extends SatrovackiOptions {
  prefix?: string;
  infix?: string;
  suffix?: string;
}

export class Utrovacki extends Satrovacki {
  readonly prefix: string;
  readonly infix: string;
  readonly suffix: string;

  constructor(options: UtrovackiOptions = {}) {
    super(options);
    this.prefix = options.prefix ?? 'u';
    this.infix = options.infix ?? 'za';
    this.suffix = options.suffix ?? 'nje';
  }

  override encode(text: string): string {
    return tokenize(text).map(token => {
      if (isAlpha(token)) return this.encodeWord(token);
      return token;
    }).join('');
  }

  override decode(text: string): string {
    return tokenize(text).map(token => {
      if (isAlpha(token)) return this.decodeWord(token);
      return token;
    }).join('');
  }

  override encodeWord(word: string): string {
    const lower = word.toLowerCase();
    for (const [exc, rep] of Object.entries(this.exceptions)) {
      if (exc.toLowerCase() === lower) return applyCase(word, rep);
    }
    if (strLen(word) < this.minWordLength) return word;

    const isCyr = containsCyrillic(word);
    const latin = isCyr ? cyrillicToLatin(word) : word;
    const latinLower = latin.toLowerCase();

    const splitIdx = this._findSplitIndex(latinLower);
    const n = strLen(latinLower);
    const chars = splitChars(latinLower);

    // Degenerate split: whole word becomes the second segment (B), A stays empty
    const part1 = (splitIdx <= 0 || splitIdx >= n) ? '' : chars.slice(0, splitIdx).join('');
    const part2 = (splitIdx <= 0 || splitIdx >= n) ? latinLower : chars.slice(splitIdx).join('');

    const encoded = this.prefix + part2 + this.infix + part1 + this.suffix;
    let result = applyCase(latin, encoded);
    if (isCyr) {
      result = latinToCyrillic(result, this.softTjToCyrillic, this.plainCTarget);
    }
    return result;
  }

  override decodeWord(word: string): string {
    const lower = word.toLowerCase();
    for (const [exc, rep] of Object.entries(this.exceptions)) {
      if (rep.toLowerCase() === lower) return applyCase(word, exc);
    }
    if (!this.canDecodeWord(word)) return word;

    const isCyr = containsCyrillic(word);
    const latin = isCyr ? cyrillicToLatin(word) : word;
    const latinLower = latin.toLowerCase();

    const parts = this._splitEncodedParts(latinLower);
    /* istanbul ignore next */
    if (!parts) return word;

    const [part1, part2] = parts;
    const decoded = part1 + part2;
    let result = applyCase(latin, decoded);
    if (isCyr) {
      result = latinToCyrillic(result, this.softTjToCyrillic, this.plainCTarget);
    }
    return result;
  }

  override canDecodeWord(word: string): boolean {
    if (strLen(word) < this.minWordLength) return false;
    const isCyr = containsCyrillic(word);
    const latin = isCyr ? cyrillicToLatin(word) : word;
    return this._splitEncodedParts(latin.toLowerCase()) !== null;
  }

  _splitEncodedParts(word: string): [string, string] | null {
    const pre = this.prefix.toLowerCase();
    const inf = this.infix.toLowerCase();
    const suf = this.suffix.toLowerCase();

    if (!word.startsWith(pre)) return null;
    if (!word.endsWith(suf)) return null;

    const inner = word.slice(pre.length, word.length - suf.length);

    // Try all occurrences of the infix; validate each by re-running _findSplitIndex
    let searchStart = 0;
    while (searchStart <= inner.length - inf.length) {
      const infIdx = inner.indexOf(inf, searchStart);
      if (infIdx === -1) break;

      const part2 = inner.slice(0, infIdx);
      const part1 = inner.slice(infIdx + inf.length);
      const candidate = part1 + part2;

      const candidateSplit = this._findSplitIndex(candidate);
      const normalCase = part1.length > 0
        && candidateSplit === part1.length
        && part1.length < candidate.length;
      // Degenerate case: part1='' means the whole word ended up as B
      // (split at 0 — not produced by current algo, but guarded here for safety)
      const degenerateCase = part1.length === 0 && candidateSplit >= candidate.length;

      if (normalCase || degenerateCase) return [part1, part2];

      searchStart = infIdx + 1;
    }

    return null;
  }
}
