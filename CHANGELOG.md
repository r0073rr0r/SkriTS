# Changelog

## 1.1.0 - 2026-04-15

Synced with Python `skrit` v0.6.0.

- **leet**: Added `b→8` and `g→6` to `BASIC_LEET_PROFILE`. Any text containing `b` or `g` will now produce different output when using the `basic` leet profile.
- **satrovacki**: Fixed `_findSplitIndex()` for vowel-initial words — now uses a two-phase scan: skip the leading vowel block, then seek the first interior vowel (after at least one consonant), with midpoint fallback when the resulting split would be degenerate.
- **satrovacki**: Reordered decode candidate scoring — consonant-initial candidates are now preferred as the primary criterion (previously it was proximity to midpoint), which improves decode accuracy across a broader word corpus.
- **utrovacki**: Fixed `_splitEncodedParts()` — replaced single `indexOf` with a forward scan over all infix occurrences, validating each candidate by re-running `_findSplitIndex`. This corrects decoding of words that contain the infix string (`za`) inside their own parts (e.g. `zakon`, `zapad`, `zaklon`).
- **docs**: Added formal linguistic analysis of all three cryptolects (`Leetrovacki - Linguistic Analysis.md` and Cyrillic edition).

## 1.0.0 - 2026-04-13

- First stable public release of `SkriTS`.
- Full TypeScript port of Skrit core modules and unified router:
  - `satrovacki`
  - `utrovacki`
  - `leetrovacki`
  - `auto` mode detection and decode/encode routing
- Full Latin/Cyrillic support with transliteration.
- Leet profiles (`basic`, `readable`, `full`), complexity and density control.
- 90 tests, 100% coverage enforced.
- Community standards: `CODE_OF_CONDUCT`, `CONTRIBUTING`, `SECURITY`, `SUPPORT`, issue/PR templates.
- CI workflow and Dependabot config included.
