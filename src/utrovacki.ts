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
    const chars = splitChars(latinLower);
    const part1 = chars.slice(0, splitIdx).join('');
    const part2 = chars.slice(splitIdx).join('');

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
    const infIdx = inner.indexOf(inf);
    if (infIdx === -1) return null;

    const part2 = inner.slice(0, infIdx);
    const part1 = inner.slice(infIdx + inf.length);
    return [part1, part2];
  }
}
