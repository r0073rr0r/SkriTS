import { Leetrovacki } from '../src/leetrovacki';

describe('Leetrovacki', () => {
  describe('basic encoding', () => {
    test('encodes word with leet applied', () => {
      const l = new Leetrovacki({ base: 'satro', leetDensity: 1.0 });
      const result = l.encodeWord('bazen');
      // zenba with leet at 100% density: z->2, e->3, n unchanged, b unchanged, a->4
      expect(result).not.toBe('bazen');
      expect(typeof result).toBe('string');
    });

    test('short words unchanged', () => {
      const l = new Leetrovacki();
      expect(l.encodeWord('na')).toBe('na');
    });

    test('utro base uses utro format', () => {
      const l = new Leetrovacki({ base: 'utro', leetDensity: 0.0 });
      const result = l.encodeWord('bazen');
      // zaStyle='24' replaces 'za', njeStyle='n73' replaces 'nje' - these always apply in utro mode
      expect(result).toContain('24');
      expect(result).toContain('n73');
    });

    test('sentence encode', () => {
      const l = new Leetrovacki({ base: 'satro' });
      const result = l.encode('bazen voda');
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('validation', () => {
    test('invalid density throws', () => {
      expect(() => new Leetrovacki({ leetDensity: 1.5 })).toThrow();
    });

    test('invalid density negative throws', () => {
      expect(() => new Leetrovacki({ leetDensity: -0.1 })).toThrow();
    });
  });

  describe('za style', () => {
    test('zaStyle z4 used in utro mode', () => {
      const l = new Leetrovacki({ base: 'utro', zaStyle: 'z4', leetDensity: 0.0 });
      const result = l.encodeWord('bazen');
      expect(result).toContain('z4');
    });

    test('zaStyle 24 used in utro mode', () => {
      const l = new Leetrovacki({ base: 'utro', zaStyle: '24', leetDensity: 0.0 });
      const result = l.encodeWord('bazen');
      expect(result).toContain('24');
    });
  });

  describe('nje style', () => {
    test('njeStyle n73 in utro mode', () => {
      const l = new Leetrovacki({ base: 'utro', njeStyle: 'n73', leetDensity: 0.0 });
      const result = l.encodeWord('bazen');
      expect(result).toContain('n73');
    });
  });

  describe('leet profiles', () => {
    test('basic profile', () => {
      const l = new Leetrovacki({ base: 'satro', leetProfile: 'basic', leetDensity: 1.0 });
      expect(typeof l.encodeWord('bazen')).toBe('string');
    });

    test('full profile complexity', () => {
      const l = new Leetrovacki({ base: 'satro', leetProfile: 'full', leetComplexity: 0, leetDensity: 1.0 });
      expect(typeof l.encodeWord('bazen')).toBe('string');
    });
  });
});
