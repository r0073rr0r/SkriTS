/**
 * Targeted tests for full coverage of all src/ modules.
 * Covers branches and functions not exercised by the module-specific tests.
 */

// ── Barrel imports ────────────────────────────────────────────────────────────
// Import from barrel to cover src/index.ts and src/core/index.ts
import {
  Satrovacki,
  Utrovacki,
  Leetrovacki,
  BASIC_LEET_PROFILE,
  READABLE_FULL_PROFILE,
  LEET_TABLE,
  LEET_SIGNAL_CHARS,
  DEFAULT_LEET_DENSITY,
  LeetEncoder,
  applyLeet,
  availableProfiles,
  getLeetProfile,
  buildFullLeetProfile,
  looksLikeLeet,
  encodeText,
  detectMode,
  detectLeetBase,
  _deleetTextBasic,
  _looksLikeSatroEncoded,
  isUpperCase,
  isLowerCase,
  isTitleCase,
  applyCase,
  strLen,
  strSubstr,
  splitChars,
  startsWith,
  endsWith,
  tokenize,
  isAlpha,
  latinToCyrillic,
  cyrillicToLatin,
  CYR_TO_LAT,
  LAT_TO_CYR_DIGRAPHS,
  LAT_TO_CYR_SINGLE,
  OPTIONAL_TJ_TO_CYR,
} from '../src/index';

// core barrel
import * as CoreBarrel from '../src/core/index';

// ── src/index.ts barrel ───────────────────────────────────────────────────────
describe('src/index barrel', () => {
  test('exports Satrovacki and encodes correctly', () => {
    expect(new Satrovacki().encodeWord('bazen')).toBe('zenba');
  });

  test('exports BASIC_LEET_PROFILE with b and g', () => {
    expect(BASIC_LEET_PROFILE['b']).toBe('8');
    expect(BASIC_LEET_PROFILE['g']).toBe('6');
  });

  test('exports encodeText', () => {
    expect(encodeText('bazen', { mode: 'satro' })).toBe('zenba');
  });

  test('encodeText with no options uses auto mode (lines 67-68 default params)', () => {
    // Triggers options={} default and mode=undefined??'auto' branch
    expect(encodeText('bazen')).toBe('zenba');
  });

  test('exports constants and collections', () => {
    expect(typeof LEET_TABLE).toBe('object');
    expect(typeof READABLE_FULL_PROFILE).toBe('object');
    expect(LEET_SIGNAL_CHARS instanceof Set).toBe(true);
    expect(typeof DEFAULT_LEET_DENSITY).toBe('number');
    expect(typeof CYR_TO_LAT).toBe('object');
    expect(typeof LAT_TO_CYR_DIGRAPHS).toBe('object');
    expect(typeof LAT_TO_CYR_SINGLE).toBe('object');
    expect(typeof OPTIONAL_TJ_TO_CYR).toBe('object');
  });

  test('exports utility functions', () => {
    expect(cyrillicToLatin('баzen')).toContain('a');
    expect(availableProfiles()).toContain('basic');
    expect(looksLikeLeet('h3ll0')).toBe(true);
    expect(looksLikeLeet('hello')).toBe(false);
    expect(_deleetTextBasic('h3ll0')).toBe('hello');
  });

  test('exports detectMode and detectLeetBase', () => {
    expect(detectMode('bazen')).toBe('satro');
    expect(detectLeetBase('bazen')).toBe('satro');
    // utro return path
    expect(detectLeetBase('uzenzabanje')).toBe('utro');
  });

  test('LeetEncoder encodes text', () => {
    expect(new LeetEncoder().encode('bazen')).toContain('4');
  });

  test('Leetrovacki encodes text', () => {
    expect(typeof new Leetrovacki().encode('bazen')).toBe('string');
  });
});

// ── src/core/index.ts barrel ──────────────────────────────────────────────────
describe('src/core/index barrel', () => {
  test('re-exports core utilities', () => {
    expect(typeof CoreBarrel.strLen).toBe('function');
    expect(typeof CoreBarrel.tokenize).toBe('function');
    expect(typeof CoreBarrel.applyCase).toBe('function');
  });
});

// ── src/core/caseHelper.ts ────────────────────────────────────────────────────
describe('caseHelper — isLowerCase and edge cases', () => {
  test('lowercase string returns true', () => {
    expect(isLowerCase('abc')).toBe(true);
  });

  test('uppercase string returns false', () => {
    expect(isLowerCase('ABC')).toBe(false);
  });

  test('mixed case returns false', () => {
    expect(isLowerCase('Abc')).toBe(false);
  });

  test('digits return false (neither upper nor lower)', () => {
    expect(isLowerCase('123')).toBe(false);
  });

  test('isUpperCase, isTitleCase, applyCase exported from barrel', () => {
    expect(isUpperCase('ABC')).toBe(true);
    expect(isTitleCase('Abc')).toBe(true);
    expect(applyCase('ABC', 'hello')).toBe('HELLO');
  });

  test('isTitleCase empty string returns false (line 12)', () => {
    expect(isTitleCase('')).toBe(false);
  });

  test('applyCase with empty original returns transformed (line 20)', () => {
    expect(applyCase('', 'hello')).toBe('hello');
  });

  test('applyCase title-case with empty transformed returns empty (line 26)', () => {
    // 'Hello' is title-case; empty transformed → chars.length===0 → return ''
    expect(applyCase('Hello', '')).toBe('');
  });
});

// ── src/core/stringUtils.ts ───────────────────────────────────────────────────
describe('stringUtils — uncovered exports', () => {
  test('strLen from barrel', () => {
    expect(strLen('hello')).toBe(5);
  });

  test('strSubstr with length', () => {
    expect(strSubstr('hello', 1, 3)).toBe('ell');
  });

  test('strSubstr without length (to end)', () => {
    expect(strSubstr('hello', 2)).toBe('llo');
  });

  test('splitChars', () => {
    expect(splitChars('abc')).toEqual(['a', 'b', 'c']);
  });

  test('startsWith true', () => {
    expect(startsWith('hello', 'hel')).toBe(true);
  });

  test('startsWith false', () => {
    expect(startsWith('hello', 'xyz')).toBe(false);
  });

  test('endsWith true', () => {
    expect(endsWith('hello', 'llo')).toBe(true);
  });

  test('endsWith false', () => {
    expect(endsWith('hello', 'xyz')).toBe(false);
  });
});

// ── src/core/tokenizer.ts ─────────────────────────────────────────────────────
describe('tokenizer — empty string branch', () => {
  test('tokenize empty string returns []', () => {
    expect(tokenize('')).toEqual([]);
  });

  test('isAlpha false for digit token', () => {
    expect(isAlpha('123')).toBe(false);
  });

  test('isAlpha true for word', () => {
    expect(isAlpha('hello')).toBe(true);
  });
});

// ── src/core/transliteration.ts — plainCTarget branches ──────────────────────
describe('transliteration — plainCTarget branches (lines 70-75)', () => {
  test('c → ч when plainCTarget is ч (lowercase c)', () => {
    expect(latinToCyrillic('cat', false, 'ч')).toContain('ч');
  });

  test('C → Ч when plainCTarget is ч (uppercase C)', () => {
    expect(latinToCyrillic('Cat', false, 'ч')).toContain('Ч');
  });

  test('c → ћ when plainCTarget is ћ (lowercase c)', () => {
    expect(latinToCyrillic('cat', false, 'ћ')).toContain('ћ');
  });

  test('C → Ћ when plainCTarget is ћ (uppercase C)', () => {
    expect(latinToCyrillic('Cat', false, 'ћ')).toContain('Ћ');
  });

  test('C → Ц in default mode covers uppercase branch at line 73', () => {
    // Default plainCTarget='ц': ch==='C' → 'Ц' (otherwise 'ц')
    expect(latinToCyrillic('Cat')).toContain('Ц');
  });

  test('unknown char falls back to itself via ?? ch branch', () => {
    // '1' is not in LAT_TO_CYR_SINGLE → falls back to '1'
    expect(latinToCyrillic('a1')).toBe('а1');
  });
});

// ── src/leet.ts — readable/full profiles + uppercase preservation ─────────────
describe('leet.ts — uncovered branches', () => {
  test('getLeetProfile readable (line 53)', () => {
    const profile = getLeetProfile('readable');
    expect(profile['a']).toBe('4');
    expect(profile['u']).toBeUndefined(); // readable has no u→00
  });

  test('getLeetProfile full / buildFullLeetProfile (lines 58-65)', () => {
    const profile = getLeetProfile('full');
    expect(typeof profile['a']).toBe('string');
    // Call with no args to cover default parameter branch
    const profile2 = buildFullLeetProfile();
    expect(typeof profile2['a']).toBe('string');
    const profile3 = buildFullLeetProfile(2);
    expect(typeof profile3['b']).toBe('string');
  });

  test('uppercase letter gets uppercased replacement (line 83)', () => {
    const result = applyLeet('T', { t: 'x' }, 1.0);
    expect(result).toBe('X');
  });

  test('lowercase letter gets lowercase replacement', () => {
    const result = applyLeet('t', { t: 'x' }, 1.0);
    expect(result).toBe('x');
  });

  test('applyLeet without density uses default (line 70 default param branch)', () => {
    // Call without third arg to cover the density=DEFAULT_LEET_DENSITY default branch
    const result = applyLeet('aaa', BASIC_LEET_PROFILE);
    expect(typeof result).toBe('string');
  });
});

// ── src/satrovacki.ts — decode + encode edge cases ───────────────────────────
describe('Satrovacki — decode and encode edge cases', () => {
  const s = new Satrovacki();

  test('decodeWord short word returns unchanged (line 60)', () => {
    expect(s.decodeWord('ab')).toBe('ab');
  });

  test('decodeWord with no valid candidates returns word unchanged (line 74 else)', () => {
    // 'abc': no rotation of it re-encodes back to 'abc', so candidates=[]
    expect(s.decodeWord('abc')).toBe('abc');
  });

  test('canDecodeWord short word returns false (line 87)', () => {
    expect(s.canDecodeWord('ab')).toBe(false);
  });

  test('encodeWord all-vowel word hits degenerate split (line 107)', () => {
    // 'aei': all vowels, findSplitIndex returns n=3 (≥n) → returns word unchanged
    expect(s.encodeWord('aei')).toBe('aei');
  });

  test('_isVowelAt out-of-bounds returns false (line 184)', () => {
    expect((s as any)._isVowelAt('hello', -1)).toBe(false);
    expect((s as any)._isVowelAt('hello', 10)).toBe(false);
  });

  test('canDecodeWord with Cyrillic word covers isCyr branch (line 87)', () => {
    // 'зенба' is Cyrillic encoding of 'zenba' (satrovacki of 'bazen')
    expect(s.canDecodeWord('зенба')).toBe(true);
  });

  test('decode sentence preserves punctuation (line 40: return token)', () => {
    const result = s.decode('zenba, voda!');
    expect(result).toContain(',');
    expect(result).toContain('!');
    expect(result).toContain('bazen');
  });

  test('decodeWord uses reverse exception (lines 67-70)', () => {
    const exc = new Satrovacki({ exceptions: { brate: 'tebra' } });
    expect(exc.decodeWord('tebra')).toBe('brate');
  });

  test('canDecodeWord uses reverse exception (lines 90-94)', () => {
    const exc = new Satrovacki({ exceptions: { brate: 'tebra' } });
    expect(exc.canDecodeWord('tebra')).toBe(true);
  });

  test('_findSplitIndex all-consonant fallback (line 178: floor(n/2))', () => {
    expect(s.encodeWord('bcd')).toBe('cdb');
  });
});

// ── src/utrovacki.ts — exception paths + degenerate encoding ──────────────────
describe('Utrovacki — exception paths and degenerate encoding', () => {
  test('encodeWord with exception (line 44)', () => {
    const u = new Utrovacki({ exceptions: { bazen: 'encoded_override' } });
    expect(u.encodeWord('bazen')).toBe('encoded_override');
  });

  test('decodeWord with exception (line 71)', () => {
    const u = new Utrovacki({ exceptions: { bazen: 'encoded_override' } });
    expect(u.decodeWord('encoded_override')).toBe('bazen');
  });

  test('decode sentence preserves non-alpha tokens (line 37: return token)', () => {
    const u = new Utrovacki();
    const result = u.decode('uzenzabanje, test!');
    expect(result).toContain(',');
    expect(result).toContain('!');
  });

  test('encodeWord all-vowel word triggers degenerate split (lines 57-58)', () => {
    const u = new Utrovacki();
    // 'aei' → findSplitIndex returns 3 >= n=3 → part1='', part2='aei'
    // encoded = 'u' + 'aei' + 'za' + '' + 'nje' = 'uaeizanje'
    expect(u.encodeWord('aei')).toBe('uaeizanje');
  });

  test('_splitEncodedParts word not ending with suffix returns null (line 104)', () => {
    const u = new Utrovacki();
    // starts with 'u' but doesn't end with 'nje'
    expect(u._splitEncodedParts('ubazen')).toBeNull();
  });

  test('_splitEncodedParts degenerate case: part1="" and split>=len (line 124)', () => {
    const u = new Utrovacki();
    // 'uaeizanje': inner='aeiza', infIdx=3, part2='aei', part1=''
    // candidate='aei', findSplit('aei')=3>=3 → degenerateCase=true
    expect(u._splitEncodedParts('uaeizanje')).toEqual(['', 'aei']);
  });

  test('_splitEncodedParts returns null when all infix occurrences invalid (line 131)', () => {
    const u = new Utrovacki();
    expect(u._splitEncodedParts('uzaanje')).toBeNull();
  });
});

// ── src/leetrovacki.ts — auto detects utro + njeStyle variants ────────────────
describe('Leetrovacki — auto utro detection and njeStyle', () => {
  test('auto mode detects utro-encoded word and uses _leetifyUtro (line 91)', () => {
    // 'uzenzabanje' is utro-encoded 'bazen'; Leetrovacki(auto) should detect it
    const result = new Leetrovacki().encodeWord('uzenzabanje');
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  test('njeStyle nj3 returns nj3 (line 138)', () => {
    const enc = new Leetrovacki({ base: 'utro', njeStyle: 'nj3', leetDensity: 0 });
    const result = enc.encodeWord('bazen');
    expect(result).toContain('nj3');
  });

  test('njeStyle њ returns њ (line 139)', () => {
    const enc = new Leetrovacki({ base: 'utro', njeStyle: 'њ', leetDensity: 0 });
    const result = enc.encodeWord('bazen');
    expect(result).toContain('њ');
  });
});

// ── src/skrit.ts — detectMode edge cases ─────────────────────────────────────
describe('Skrit — detectMode edge cases', () => {
  test('detectMode with no alpha tokens returns satro (line 32)', () => {
    expect(detectMode('123 !!!')).toBe('satro');
  });

  test('detectMode returns leet when >30% tokens are utro-like (line 50)', () => {
    // 2/4 tokens are utro-encoded = 50%, utroCount=2 not > 4*0.5=2 → leet
    // usozamenje = utro('meso'), uzenzabanje = utro('bazen')
    expect(detectMode('uzenzabanje usozamenje bazen meso')).toBe('leet');
  });
});

// ── src/skrit.ts — _looksLikeSatroEncoded + leet→utro + leet→satro ────────────
describe('Skrit — auto decode paths', () => {
  test('_looksLikeSatroEncoded returns true for encoded word', () => {
    expect(_looksLikeSatroEncoded('zenba')).toBe(true);
  });

  test('_looksLikeSatroEncoded returns false for plain word', () => {
    expect(_looksLikeSatroEncoded('bazen')).toBe(false);
  });

  test('auto mode with detectFrom=leet decodes utro-based text (lines 139-148)', () => {
    // 'uzenzabanje' is utro-encoded 'bazen'; no leet chars → base=utro → decode
    const result = encodeText('uzenzabanje', { mode: 'auto', detectFrom: 'leet' });
    expect(result).toBe('bazen');
  });

  test('auto mode with detectFrom=leet decodes satro-based leet text (line 150)', () => {
    // 'z3nb4' → deleet → 'zenba' → detectLeetBase → 'satro' → Satrovacki.decode → 'bazen'
    const result = encodeText('z3nb4', { mode: 'auto', detectFrom: 'leet' });
    expect(result).toBe('bazen');
  });
});
