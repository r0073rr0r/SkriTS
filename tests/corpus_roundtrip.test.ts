/**
 * Инваријантни тестови над корпусом од 963 српске речи.
 *
 * Исти корпус (CORPUS_963) користе сва три система:
 *   - Шатровачки   (Satrovacki)
 *   - Утровачки    (Utrovacki)
 *   - Литровачки   (Leetrovacki)
 *
 * Тестови проверавају инваријанте (структурна правила), а не хардкодоване
 * вредности — јер се ради о формалним системима чији је доказ алгоритам сам.
 *
 * Инваријанте по систему:
 *   Шатровачки:
 *     [S1] encode не пада ни наједној речи
 *     [S2] дужина речи је очувана (|encode(w)| == |w|)
 *     [S3] слаби roundtrip: encode(decode(encode(w))) == encode(w)
 *     [S4] кратке речи (< min_word_length) се не мењају
 *     [S5] велико слово на почетку је очувано
 *
 *   Утровачки:
 *     [U1] encode не пада ни наједној речи
 *     [U2] излаз је дужи од улаза за речи ≥ min_word_length
 *     [U3] излаз почиње са 'u'/'у'
 *     [U4] излаз садржи инфикс 'za'/'за'
 *     [U5] излаз завршава са 'nje'/'ње'
 *     [U6] строги roundtrip: decode(encode(w)) == w
 *     [U7] кратке речи се не мењају
 *
 *   Литровачки:
 *     [L1] encode не пада ни на једној речи (satro и utro режим)
 *     [L2] у satro режиму: излаз садржи leet карактере за речи са a/e/i/o/u/s/t/z
 *     [L3] у utro режиму: излаз почиње са '00' за речи ≥ min_word_length
 *     [L4] у utro режиму: излаз садржи '24' (zaStyle='24')
 *     [L5] у utro режиму: излаз завршава са 'n73' (njeStyle='n73')
 *     [L6] кратке речи се не мењају у оба режима
 */

import { Satrovacki } from '../src/satrovacki';
import { Utrovacki } from '../src/utrovacki';
import { Leetrovacki } from '../src/leetrovacki';
import { CORPUS_963 } from './corpus963';

const MIN = 3; // default minWordLength

// Basic leet profile character set (all substitution outputs), including b→8 and g→6
const LEET_SATRO_CHARS = new Set([...'4310572086']);

// ── [S1–S5] Шатровачки инваријанте ───────────────────────────────────────────
describe('Satrovacki corpus invariants', () => {
  const enc = new Satrovacki();

  test('[S1] encode does not crash on any word', () => {
    for (const word of CORPUS_963) {
      expect(() => enc.encode(word)).not.toThrow();
    }
  });

  test('[S2] encoded length equals input length', () => {
    for (const word of CORPUS_963) {
      const encoded = enc.encodeWord(word);
      expect([...encoded].length).toBe([...word].length);
    }
  });

  test('[S3] weak roundtrip: encode(decode(encode(w))) == encode(w)', () => {
    for (const word of CORPUS_963) {
      if ([...word].length < MIN) continue;
      const encoded = enc.encodeWord(word.toLowerCase());
      const decoded = enc.decodeWord(encoded);
      const reEncoded = enc.encodeWord(decoded);
      expect(reEncoded).toBe(encoded);
    }
  });

  test('[S4] words shorter than minWordLength are unchanged', () => {
    for (const word of CORPUS_963) {
      if ([...word].length >= MIN) continue;
      expect(enc.encodeWord(word)).toBe(word);
    }
  });

  test('[S5] title-case initial capital is preserved', () => {
    for (const word of CORPUS_963) {
      if ([...word].length < MIN) continue;
      const titled = word[0].toUpperCase() + word.slice(1).toLowerCase();
      const encoded = enc.encodeWord(titled);
      expect(encoded[0]).toBe(encoded[0].toUpperCase());
    }
  });
});

// ── [U1–U7] Утровачки инваријанте ────────────────────────────────────────────
describe('Utrovacki corpus invariants', () => {
  const enc = new Utrovacki();

  test('[U1] encode does not crash on any word', () => {
    for (const word of CORPUS_963) {
      expect(() => enc.encode(word)).not.toThrow();
    }
  });

  test('[U2] encoded output is longer than input for words >= minWordLength', () => {
    for (const word of CORPUS_963) {
      if ([...word].length < MIN) continue;
      const encoded = enc.encodeWord(word);
      expect([...encoded].length).toBeGreaterThan([...word].length);
    }
  });

  test("[U3] encoded output starts with 'u' or 'у'", () => {
    for (const word of CORPUS_963) {
      if ([...word].length < MIN) continue;
      const encoded = enc.encodeWord(word.toLowerCase());
      expect(encoded.startsWith('u') || encoded.startsWith('у')).toBe(true);
    }
  });

  test("[U4] encoded output contains infix 'za' or 'за'", () => {
    for (const word of CORPUS_963) {
      if ([...word].length < MIN) continue;
      const encoded = enc.encodeWord(word.toLowerCase());
      expect(encoded.includes('za') || encoded.includes('за')).toBe(true);
    }
  });

  test("[U5] encoded output ends with suffix 'nje' or 'ње'", () => {
    for (const word of CORPUS_963) {
      if ([...word].length < MIN) continue;
      const encoded = enc.encodeWord(word.toLowerCase());
      expect(encoded.endsWith('nje') || encoded.endsWith('ње')).toBe(true);
    }
  });

  test('[U6] strict roundtrip: decode(encode(w)) == w', () => {
    for (const word of CORPUS_963) {
      if ([...word].length < MIN) continue;
      const lower = word.toLowerCase();
      const encoded = enc.encodeWord(lower);
      const decoded = enc.decodeWord(encoded);
      expect(decoded).toBe(lower);
    }
  });

  test('[U7] words shorter than minWordLength are unchanged', () => {
    for (const word of CORPUS_963) {
      if ([...word].length >= MIN) continue;
      expect(enc.encodeWord(word)).toBe(word);
    }
  });
});

// ── [L1–L6] Литровачки инваријанте ───────────────────────────────────────────
describe('Leetrovacki corpus invariants', () => {
  const satroCoder = new Leetrovacki({ base: 'satro', leetDensity: 1.0 });
  const utroCoder = new Leetrovacki({ base: 'utro', leetDensity: 1.0 });

  test('[L1a] satro mode: encode does not crash on any word', () => {
    for (const word of CORPUS_963) {
      expect(() => satroCoder.encode(word)).not.toThrow();
    }
  });

  test('[L1b] utro mode: encode does not crash on any word', () => {
    for (const word of CORPUS_963) {
      expect(() => utroCoder.encode(word)).not.toThrow();
    }
  });

  test('[L2] satro mode: output contains leet chars for words with a/e/i/o/u/s/t/z', () => {
    const leetTrigger = new Set([...'aeioustz']);
    for (const word of CORPUS_963) {
      if ([...word].length < MIN) continue;
      if (![...word.toLowerCase()].some(c => leetTrigger.has(c))) continue;
      const encoded = satroCoder.encodeWord(word.toLowerCase());
      expect([...encoded].some(c => LEET_SATRO_CHARS.has(c))).toBe(true);
    }
  });

  test("[L3] utro mode: output starts with '00' for words >= minWordLength", () => {
    for (const word of CORPUS_963) {
      if ([...word].length < MIN) continue;
      const encoded = utroCoder.encodeWord(word.toLowerCase());
      expect(encoded.startsWith('00')).toBe(true);
    }
  });

  test("[L4] utro mode: output contains '24' (zaStyle='24')", () => {
    for (const word of CORPUS_963) {
      if ([...word].length < MIN) continue;
      const encoded = utroCoder.encodeWord(word.toLowerCase());
      expect(encoded.includes('24')).toBe(true);
    }
  });

  test("[L5] utro mode: output ends with 'n73' (njeStyle='n73')", () => {
    for (const word of CORPUS_963) {
      if ([...word].length < MIN) continue;
      const encoded = utroCoder.encodeWord(word.toLowerCase());
      expect(encoded.endsWith('n73')).toBe(true);
    }
  });

  test('[L6] words shorter than minWordLength are unchanged in both modes', () => {
    for (const word of CORPUS_963) {
      if ([...word].length >= MIN) continue;
      expect(satroCoder.encodeWord(word)).toBe(word);
      expect(utroCoder.encodeWord(word)).toBe(word);
    }
  });
});
