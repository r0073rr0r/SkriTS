import { Satrovacki } from '../src/satrovacki';

describe('Satrovacki', () => {
  const s = new Satrovacki();

  describe('encode', () => {
    test('basic latin word', () => {
      expect(s.encodeWord('bazen')).toBe('zenba');
    });

    test('Beograd title case', () => {
      expect(s.encodeWord('Beograd')).toBe('Gradbeo');
    });

    test('riba', () => {
      expect(s.encodeWord('riba')).toBe('bari');
    });

    test('uppercase', () => {
      expect(s.encodeWord('BAZEN')).toBe('ZENBA');
    });

    test('word shorter than minWordLength unchanged', () => {
      expect(s.encodeWord('na')).toBe('na');
    });

    test('word exactly at minWordLength encoded', () => {
      expect(s.encodeWord('pas')).not.toBe('pas');
    });

    test('sentence with punctuation', () => {
      const result = s.encode('Zdravo, svete!');
      expect(result).toContain(',');
      expect(result).toContain('!');
    });

    test('numbers unchanged', () => {
      expect(s.encode('test 123')).toContain('123');
    });

    test('cyrillic word', () => {
      // Земун -> Мунзе
      expect(s.encodeWord('Земун')).toBe('Мунзе');
    });

    test('cyrillic sentence', () => {
      const result = s.encode('Земун закон матори');
      expect(result).toMatch(/^[А-ЯЁа-яёЂЃЄЅІЇЈЉЊЋЌЍЎЏ\s]+$/u);
    });

    test('exception brate -> tebra', () => {
      const exc = new Satrovacki({ exceptions: { brate: 'tebra' } });
      expect(exc.encodeWord('brate')).toBe('tebra');
    });

    test('exception case-insensitive key', () => {
      const exc = new Satrovacki({ exceptions: { brate: 'tebra' } });
      expect(exc.encodeWord('BRATE')).toBe('TEBRA');
    });

    test('matori unchanged (exception)', () => {
      const exc = new Satrovacki({ exceptions: { matori: 'matori' } });
      expect(exc.encodeWord('matori')).toBe('matori');
    });

    test('syllabic r - no vowels fallback', () => {
      // "brk" - all consonants except r which is syllabic
      const result = s.encodeWord('brk');
      expect(typeof result).toBe('string');
      expect(result.length).toBe(3);
    });
  });

  describe('decode', () => {
    test('decode zenba -> bazen', () => {
      expect(s.decodeWord('zenba')).toBe('bazen');
    });

    test('decode Gradbeo -> Beograd', () => {
      expect(s.decodeWord('Gradbeo')).toBe('Beograd');
    });

    test('roundtrip', () => {
      const words = ['bazen', 'zemlja', 'srbija', 'kafa', 'beograd'];
      for (const w of words) {
        expect(s.decodeWord(s.encodeWord(w))).toBe(w);
      }
    });

    test('cyrillic roundtrip', () => {
      const encoded = s.encodeWord('Земун');
      expect(s.decodeWord(encoded)).toBe('Земун');
    });
  });

  describe('canDecodeWord', () => {
    test('encoded word can be decoded', () => {
      expect(s.canDecodeWord('zenba')).toBe(true);
    });

    test('short word cannot be decoded', () => {
      expect(s.canDecodeWord('na')).toBe(false);
    });
  });

  describe('options', () => {
    test('custom minWordLength', () => {
      const s4 = new Satrovacki({ minWordLength: 4 });
      expect(s4.encodeWord('pas')).toBe('pas'); // 3 < 4
    });
  });
});
