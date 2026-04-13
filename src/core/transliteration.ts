// D:\Projects\SkriTS\src\core\transliteration.ts

export const CYR_TO_LAT: Record<string, string> = {
  'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'ђ': 'đ',
  'е': 'e', 'ж': 'ž', 'з': 'z', 'и': 'i', 'ј': 'j', 'к': 'k',
  'л': 'l', 'љ': 'lj', 'м': 'm', 'н': 'n', 'њ': 'nj', 'о': 'o',
  'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'ћ': 'ć', 'у': 'u',
  'ф': 'f', 'х': 'h', 'ц': 'c', 'ч': 'č', 'џ': 'dž', 'ш': 'š',
  'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Ђ': 'Đ',
  'Е': 'E', 'Ж': 'Ž', 'З': 'Z', 'И': 'I', 'Ј': 'J', 'К': 'K',
  'Л': 'L', 'Љ': 'Lj', 'М': 'M', 'Н': 'N', 'Њ': 'Nj', 'О': 'O',
  'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T', 'Ћ': 'Ć', 'У': 'U',
  'Ф': 'F', 'Х': 'H', 'Ц': 'C', 'Ч': 'Č', 'Џ': 'Dž', 'Ш': 'Š',
};

export const LAT_TO_CYR_DIGRAPHS: Record<string, string> = {
  'lj': 'љ', 'nj': 'њ', 'dž': 'џ',
  'Lj': 'Љ', 'Nj': 'Њ', 'Dž': 'Џ',
  'LJ': 'Љ', 'NJ': 'Њ', 'DŽ': 'Џ',
};

export const LAT_TO_CYR_SINGLE: Record<string, string> = {
  'a': 'а', 'b': 'б', 'v': 'в', 'g': 'г', 'd': 'д', 'đ': 'ђ',
  'e': 'е', 'ž': 'ж', 'z': 'з', 'i': 'и', 'j': 'ј', 'k': 'к',
  'l': 'л', 'm': 'м', 'n': 'н', 'o': 'о', 'p': 'п', 'r': 'р',
  's': 'с', 't': 'т', 'ć': 'ћ', 'u': 'у', 'f': 'ф', 'h': 'х',
  'c': 'ц', 'č': 'ч', 'š': 'ш',
  'A': 'А', 'B': 'Б', 'V': 'В', 'G': 'Г', 'D': 'Д', 'Đ': 'Ђ',
  'E': 'Е', 'Ž': 'Ж', 'Z': 'З', 'I': 'И', 'J': 'Ј', 'K': 'К',
  'L': 'Л', 'M': 'М', 'N': 'Н', 'O': 'О', 'P': 'П', 'R': 'Р',
  'S': 'С', 'T': 'Т', 'Ć': 'Ћ', 'U': 'У', 'F': 'Ф', 'H': 'Х',
  'C': 'Ц', 'Č': 'Ч', 'Š': 'Ш',
};

export const OPTIONAL_TJ_TO_CYR: Record<string, string> = {
  'tj': 'ћ', 'Tj': 'Ћ', 'TJ': 'Ћ',
};

export function cyrillicToLatin(text: string): string {
  let result = '';
  const chars = [...text]; // unicode-safe split
  for (const ch of chars) {
    result += CYR_TO_LAT[ch] ?? ch;
  }
  return result;
}

export function latinToCyrillic(text: string, softTjToCyrillic = false, plainCTarget = 'ц'): string {
  let result = '';
  const chars = [...text];
  let i = 0;
  while (i < chars.length) {
    // Try digraphs (2-char)
    const two = chars[i] + (chars[i + 1] ?? '');
    if (LAT_TO_CYR_DIGRAPHS[two] !== undefined) {
      result += LAT_TO_CYR_DIGRAPHS[two];
      i += 2;
      continue;
    }
    // Try optional tj
    if (softTjToCyrillic && OPTIONAL_TJ_TO_CYR[two] !== undefined) {
      result += OPTIONAL_TJ_TO_CYR[two];
      i += 2;
      continue;
    }
    // Single char
    const ch = chars[i];
    if (ch === 'c' || ch === 'C') {
      // plain_c_target: 'ц' (default), 'ч', 'ћ'
      const target = plainCTarget === 'ч' ? (ch === 'C' ? 'Ч' : 'ч')
                   : plainCTarget === 'ћ' ? (ch === 'C' ? 'Ћ' : 'ћ')
                   : (ch === 'C' ? 'Ц' : 'ц');
      result += target;
    } else {
      result += LAT_TO_CYR_SINGLE[ch] ?? ch;
    }
    i++;
  }
  return result;
}

export function containsCyrillic(text: string): boolean {
  return /[а-яёА-ЯЁа-щА-ЩЮЯЁа-щА-ЩЮЯЁжйхцчшщъыьэюяЖЙХЦЧШЩЪЫЬЭЮЯ\u0400-\u04FF]/u.test(text);
}
