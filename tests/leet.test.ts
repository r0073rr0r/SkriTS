import {
  LEET_TABLE,
  BASIC_LEET_PROFILE,
  availableProfiles,
  getLeetProfile,
  buildFullLeetProfile,
  applyLeet,
  looksLikeLeet,
  LeetEncoder,
  DEFAULT_LEET_DENSITY,
} from '../src/leet';

// v1.1.0: b→8 and g→6 added to BASIC_LEET_PROFILE

describe('Leet', () => {
  describe('availableProfiles', () => {
    test('returns three profiles', () => {
      const profiles = availableProfiles();
      expect(profiles).toContain('basic');
      expect(profiles).toContain('readable');
      expect(profiles).toContain('full');
    });
  });

  describe('LEET_TABLE', () => {
    test('has 26 letters', () => {
      expect(Object.keys(LEET_TABLE).length).toBe(26);
    });

    test('each letter has at least one variant', () => {
      for (const variants of Object.values(LEET_TABLE)) {
        expect(variants.length).toBeGreaterThan(0);
      }
    });
  });

  describe('getLeetProfile', () => {
    test('basic profile returns BASIC_LEET_PROFILE', () => {
      const profile = getLeetProfile('basic');
      expect(profile).toEqual(BASIC_LEET_PROFILE);
    });

    test('unknown profile throws', () => {
      expect(() => getLeetProfile('unknown')).toThrow();
    });

    test('custom map returned as-is', () => {
      const custom = { a: 'x' };
      expect(getLeetProfile('basic', custom)).toEqual(custom);
    });
  });

  describe('buildFullLeetProfile', () => {
    test('complexity 0 returns first variant', () => {
      const profile = buildFullLeetProfile(0);
      expect(profile['a']).toBe(LEET_TABLE['a'][0]);
    });

    test('complexity 1 returns second variant where available', () => {
      const profile = buildFullLeetProfile(1);
      expect(profile['a']).toBe(LEET_TABLE['a'][1]);
    });
  });

  describe('applyLeet', () => {
    test('density 1.0 replaces all mappable chars', () => {
      const result = applyLeet('a', { a: '4' }, 1.0);
      expect(result).toBe('4');
    });

    test('density 0.0 replaces nothing', () => {
      const result = applyLeet('aaaa', { a: '4' }, 0.0);
      expect(result).toBe('aaaa');
    });

    test('non-mapped chars unchanged', () => {
      const result = applyLeet('xyz', { a: '4' }, 1.0);
      expect(result).toBe('xyz');
    });

    test('invalid density throws', () => {
      expect(() => applyLeet('a', { a: '4' }, 1.5)).toThrow();
      expect(() => applyLeet('a', { a: '4' }, -0.1)).toThrow();
    });
  });

  describe('looksLikeLeet', () => {
    test('leet text detected', () => {
      expect(looksLikeLeet('h3ll0')).toBe(true);
    });

    test('plain text not leet', () => {
      expect(looksLikeLeet('hello')).toBe(false);
    });

    test('single signal char not enough', () => {
      expect(looksLikeLeet('h3llo')).toBe(false); // only one signal char
    });
  });

  describe('LeetEncoder', () => {
    test('basic profile encodes', () => {
      const enc = new LeetEncoder({ profile: 'basic', density: 1.0 });
      // 'a' -> '4' at density 1.0
      const result = enc.encode('aaa');
      expect(result).not.toBe('aaa');
    });

    test('density 0 encodes nothing', () => {
      const enc = new LeetEncoder({ profile: 'basic', density: 0.0 });
      expect(enc.encode('aeiou')).toBe('aeiou');
    });

    test('default density is 0.86', () => {
      const enc = new LeetEncoder();
      expect(enc.density).toBe(DEFAULT_LEET_DENSITY);
    });
  });

  describe('BASIC_LEET_PROFILE (v1.1.0)', () => {
    test('basic profile contains b→8', () => {
      expect(BASIC_LEET_PROFILE['b']).toBe('8');
    });

    test('basic profile contains g→6', () => {
      expect(BASIC_LEET_PROFILE['g']).toBe('6');
    });

    test('basic profile encodes b to 8 at density 1.0', () => {
      const enc = new LeetEncoder({ profile: 'basic', density: 1.0 });
      expect(enc.encode('b')).toBe('8');
    });

    test('basic profile encodes g to 6 at density 1.0', () => {
      const enc = new LeetEncoder({ profile: 'basic', density: 1.0 });
      expect(enc.encode('g')).toBe('6');
    });

    test('basic profile encodes Beograd satro form (Gradbeo) with b→8 and g→6', () => {
      // satro of 'Beograd' is 'Gradbeo'; leet of 'gradbeo' at density 1.0:
      // g→6, r unchanged, a→4, d unchanged, b→8, e→3, o→0
      const enc = new LeetEncoder({ profile: 'basic', density: 1.0 });
      expect(enc.encode('gradbeo')).toBe('6r4d830');
    });
  });
});
