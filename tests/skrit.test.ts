import { encodeText, detectMode, detectLeetBase, _deleetTextBasic } from '../src/skrit';
import { Satrovacki } from '../src/satrovacki';
import { Utrovacki } from '../src/utrovacki';

describe('Skrit Router', () => {
  describe('detectMode', () => {
    test('plain text detected as satro', () => {
      expect(detectMode('bazen voda')).toBe('satro');
    });

    test('utro encoded text detected as utro', () => {
      // Encode some utro words first
      const u = new Utrovacki();
      const encoded = u.encode('bazen zemlja kafa');
      expect(detectMode(encoded)).toBe('utro');
    });
  });

  describe('encodeText', () => {
    test('satro mode', () => {
      const result = encodeText('bazen', { mode: 'satro' });
      expect(result).toBe('zenba');
    });

    test('utro mode', () => {
      const result = encodeText('bazen', { mode: 'utro' });
      expect(result).toBe('uzenzabanje');
    });

    test('auto mode on plain text encodes as satro', () => {
      const result = encodeText('bazen', { mode: 'auto' });
      // On plain text that isn't encoded, should encode to satro
      expect(result).toBe('zenba');
    });

    test('auto mode decodes utro', () => {
      const u = new Utrovacki();
      const encoded = u.encodeWord('bazen');
      const result = encodeText(encoded, { mode: 'auto' });
      expect(result).toBe('bazen');
    });

    test('auto mode decodes satro', () => {
      const s = new Satrovacki();
      const encoded = s.encodeWord('bazen');
      const result = encodeText(encoded, { mode: 'auto', detectFrom: 'satro' });
      expect(result).toBe('bazen');
    });

    test('leet mode', () => {
      const result = encodeText('bazen', { mode: 'leet', leetDensity: 1.0 });
      expect(result).not.toBe('bazen');
    });
  });

  describe('_deleetTextBasic', () => {
    test('reverses basic leet', () => {
      expect(_deleetTextBasic('h3ll0')).toBe('hello');
    });

    test('4 -> a', () => {
      expect(_deleetTextBasic('4')).toBe('a');
    });

    test('00 -> u', () => {
      expect(_deleetTextBasic('00')).toBe('u');
    });

    test('non-leet chars unchanged', () => {
      expect(_deleetTextBasic('xyz')).toBe('xyz');
    });
  });

  describe('detectLeetBase', () => {
    test('returns satro or utro', () => {
      const base = detectLeetBase('zenba');
      expect(['satro', 'utro']).toContain(base);
    });
  });
});
