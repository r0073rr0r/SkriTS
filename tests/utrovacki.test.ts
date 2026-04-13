import { Utrovacki } from '../src/utrovacki';

describe('Utrovacki', () => {
  const u = new Utrovacki();

  describe('encode', () => {
    test('bazen -> uzenzabanje', () => {
      expect(u.encodeWord('bazen')).toBe('uzenzabanje');
    });

    test('title case', () => {
      // Zemun: z=consonant, e=vowel at idx1, splitIdx=2 (after 'ze'), part2='mun'
      // encoded = u + mun + za + ze + nje = 'umunzazenje' -> title -> 'Umunzazenje'
      expect(u.encodeWord('Zemun')).toBe('Umunzazenje');
    });

    test('short word unchanged', () => {
      expect(u.encodeWord('na')).toBe('na');
    });

    test('cyrillic', () => {
      const result = u.encodeWord('Земун');
      expect(result).toMatch(/^[\u0400-\u04FF]+$/u);
    });

    test('custom affixes', () => {
      const custom = new Utrovacki({ prefix: 'ku', infix: 'ma', suffix: 'la' });
      const result = custom.encodeWord('bazen');
      expect(result).toContain('ku');
      expect(result).toContain('ma');
      expect(result).toContain('la');
    });

    test('sentence', () => {
      const result = u.encode('bazen voda');
      expect(result).toContain('nje');
    });
  });

  describe('decode', () => {
    test('decode uzenzabanje -> bazen', () => {
      expect(u.decodeWord('uzenzabanje')).toBe('bazen');
    });

    test('roundtrip', () => {
      const words = ['bazen', 'zemlja', 'kafa'];
      for (const w of words) {
        const encoded = u.encodeWord(w);
        expect(u.decodeWord(encoded)).toBe(w);
      }
    });

    test('cyrillic roundtrip', () => {
      const encoded = u.encodeWord('земун');
      expect(u.decodeWord(encoded)).toBe('земун');
    });
  });

  describe('canDecodeWord', () => {
    test('utro word detectable', () => {
      expect(u.canDecodeWord('uzenzabanje')).toBe(true);
    });

    test('plain word not utro', () => {
      expect(u.canDecodeWord('bazen')).toBe(false);
    });

    test('short word false', () => {
      expect(u.canDecodeWord('uz')).toBe(false);
    });
  });

  describe('_splitEncodedParts', () => {
    test('splits correctly', () => {
      const parts = u._splitEncodedParts('uzenzabanje');
      expect(parts).toEqual(['ba', 'zen']);
    });

    test('invalid returns null', () => {
      expect(u._splitEncodedParts('bazen')).toBeNull();
    });
  });
});
