import { cyrillicToLatin, latinToCyrillic, containsCyrillic } from '../src/core/transliteration';

describe('Transliteration', () => {
  describe('cyrillicToLatin', () => {
    test('basic cyrillic to latin', () => {
      expect(cyrillicToLatin('земун')).toBe('zemun');
    });

    test('uppercase cyrillic', () => {
      expect(cyrillicToLatin('ЗЕМУН')).toBe('ZEMUN');
    });

    test('digraphs', () => {
      expect(cyrillicToLatin('љ')).toBe('lj');
      expect(cyrillicToLatin('њ')).toBe('nj');
      expect(cyrillicToLatin('џ')).toBe('dž');
    });

    test('mixed text passes through non-cyrillic', () => {
      expect(cyrillicToLatin('abc')).toBe('abc');
    });
  });

  describe('latinToCyrillic', () => {
    test('basic latin to cyrillic', () => {
      expect(latinToCyrillic('zemun')).toBe('земун');
    });

    test('digraphs', () => {
      expect(latinToCyrillic('lj')).toBe('љ');
      expect(latinToCyrillic('nj')).toBe('њ');
    });

    test('plain c -> ц by default', () => {
      expect(latinToCyrillic('c')).toBe('ц');
    });

    test('plain c -> ч with plainCTarget=ч', () => {
      expect(latinToCyrillic('c', false, 'ч')).toBe('ч');
    });

    test('soft tj -> ć when enabled', () => {
      expect(latinToCyrillic('tj', true)).toBe('ћ');
    });

    test('tj stays as t+j when disabled', () => {
      expect(latinToCyrillic('tj', false)).toBe('тј');
    });
  });

  describe('containsCyrillic', () => {
    test('cyrillic text detected', () => {
      expect(containsCyrillic('земун')).toBe(true);
    });

    test('latin text not detected', () => {
      expect(containsCyrillic('zemun')).toBe(false);
    });

    test('mixed text detected', () => {
      expect(containsCyrillic('zemун')).toBe(true);
    });
  });
});
