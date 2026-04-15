// src/leetrovacki.ts

import { Satrovacki, SatrovackiOptions } from './satrovacki';
import { Utrovacki, UtrovackiOptions } from './utrovacki';
import { getLeetProfile, applyLeet, DEFAULT_LEET_DENSITY, LeetProfile } from './leet';
import { tokenize, isAlpha } from './core/tokenizer';
import { strLen } from './core/stringUtils';
import { applyCase } from './core/caseHelper';

export type LeetBase = 'auto' | 'satro' | 'utro';
export type ZaStyle = '24' | 'z4';
export type NjeStyle = 'n73' | 'nj3' | 'њ';

export interface LeetrovackiOptions extends SatrovackiOptions {
  base?: LeetBase;
  leetProfile?: LeetProfile | string;
  leetComplexity?: number;
  leetDensity?: number;
  zaStyle?: ZaStyle;
  njeStyle?: NjeStyle;
  // utro options for when base=utro
  prefix?: string;
  infix?: string;
  suffix?: string;
}

export class Leetrovacki {
  readonly base: LeetBase;
  readonly leetProfile: LeetProfile | string;
  readonly leetComplexity: number;
  readonly leetDensity: number;
  readonly zaStyle: ZaStyle;
  readonly njeStyle: NjeStyle;
  private readonly satroCoder: Satrovacki;
  private readonly utroCoder: Utrovacki;
  private readonly leetMapping: Record<string, string>;

  constructor(options: LeetrovackiOptions = {}) {
    this.base = options.base ?? 'auto';
    this.leetProfile = options.leetProfile ?? 'basic';
    this.leetComplexity = options.leetComplexity ?? 0;
    this.leetDensity = options.leetDensity ?? DEFAULT_LEET_DENSITY;
    this.zaStyle = options.zaStyle ?? '24';
    this.njeStyle = options.njeStyle ?? 'n73';

    if (this.leetDensity < 0 || this.leetDensity > 1) {
      throw new Error('leet_density must be between 0.0 and 1.0');
    }

    const sharedOpts: SatrovackiOptions = {
      minWordLength: options.minWordLength,
      plainCTarget: options.plainCTarget,
      softTjToCyrillic: options.softTjToCyrillic,
      exceptions: options.exceptions,
    };

    this.satroCoder = new Satrovacki(sharedOpts);
    this.utroCoder = new Utrovacki({
      ...sharedOpts,
      prefix: options.prefix,
      infix: options.infix,
      suffix: options.suffix,
    });
    this.leetMapping = getLeetProfile(this.leetProfile, undefined, this.leetComplexity);
  }

  encode(text: string): string {
    return tokenize(text).map(token => {
      if (isAlpha(token)) return this.encodeWord(token);
      return token;
    }).join('');
  }

  encodeWord(word: string): string {
    if (strLen(word) < (this.satroCoder.minWordLength)) return word;

    const resolvedBase = this._resolveBase(word);
    if (resolvedBase === 'utro') {
      const utroEncoded = this.utroCoder.encodeWord(word);
      return this._leetifyUtro(utroEncoded);
    } else {
      const satroEncoded = this.satroCoder.encodeWord(word);
      return this._leetifySatro(satroEncoded);
    }
  }

  private _resolveBase(word: string): 'satro' | 'utro' {
    if (this.base === 'utro') return 'utro';
    if (this.base === 'satro') return 'satro';
    // auto: check if word looks like utro encoded
    if (this._looksLikeUtro(word)) return 'utro';
    return 'satro';
  }

  private _looksLikeUtro(word: string): boolean {
    return this.utroCoder.canDecodeWord(word);
  }

  private _leetifyUtro(encoded: string): string {
    // In utro mode: apply leet but handle 'za' and 'nje' styling
    const lower = encoded.toLowerCase();
    const pre = this.utroCoder.prefix.toLowerCase();
    const inf = this.utroCoder.infix.toLowerCase();
    const suf = this.utroCoder.suffix.toLowerCase();

    // Find the structural parts
    if (lower.startsWith(pre) && lower.endsWith(suf)) {
      const inner = lower.slice(pre.length, lower.length - suf.length);
      const infIdx = inner.indexOf(inf);
      if (infIdx !== -1) {
        const part2 = inner.slice(0, infIdx);
        const part1 = inner.slice(infIdx + inf.length);

        const leetPart2 = applyLeet(part2, this.leetMapping, this.leetDensity);
        const leetPart1 = applyLeet(part1, this.leetMapping, this.leetDensity);
        const zaStr = this._zaReplacement();
        const njeStr = this._njeReplacement();

        const leetPre = applyLeet(pre, this.leetMapping, this.leetDensity);
        return leetPre + leetPart2 + zaStr + leetPart1 + njeStr;
      }
    }

    /* istanbul ignore next */
    return applyLeet(encoded, this.leetMapping, this.leetDensity);
  }

  private _leetifySatro(encoded: string): string {
    return applyLeet(encoded, this.leetMapping, this.leetDensity);
  }

  private _zaReplacement(): string {
    if (this.zaStyle === 'z4') return 'z4';
    return '24'; // default '24'
  }

  private _njeReplacement(): string {
    if (this.njeStyle === 'nj3') return 'nj3';
    if (this.njeStyle === 'њ') return 'њ';
    return 'n73'; // default
  }
}
