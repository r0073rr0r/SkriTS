// D:\Projects\SkriTS\src\core\tokenizer.ts

/** Splits text into word tokens and non-word tokens (spaces, punctuation, digits) */
export function tokenize(text: string): string[] {
  // Match: word chars (letters), digits, whitespace, or any single char
  const matches = text.match(/[^\W\d_]+|\d+|\s+|./gsu);
  return matches ?? [];
}

export function isAlpha(token: string): boolean {
  return /^[^\W\d_]+$/u.test(token);
}
