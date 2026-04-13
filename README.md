# SkriTS

[![CI](https://img.shields.io/github/actions/workflow/status/r0073rr0r/SkriTS/ci.yml?branch=master&label=CI)](https://github.com/r0073rr0r/SkriTS/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/@r0073rr0r/skrts)](https://www.npmjs.com/package/@r0073rr0r/skrts)
[![License: GPL-3.0-or-later](https://img.shields.io/badge/License-GPL--3.0--or--later-blue.svg)](LICENSE)
[![Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen)](#testing)
[![GitHub Stars](https://img.shields.io/github/stars/r0073rr0r/SkriTS?style=social)](https://github.com/r0073rr0r/SkriTS/stargazers)
[![GitHub Issues](https://img.shields.io/github/issues/r0073rr0r/SkriTS)](https://github.com/r0073rr0r/SkriTS/issues)
[![Last Commit](https://img.shields.io/github/last-commit/r0073rr0r/SkriTS)](https://github.com/r0073rr0r/SkriTS/commits/master)

TypeScript port of Python [`skrit`](https://github.com/r0073rr0r/Skrit) (`v0.5.x`) for Serbian slang-style text transforms:

- `satrovacki`
- `utrovacki`
- `leetrovacki`
- unified `auto` router with encode/decode detection

Also available as:
- Python: [`r0073rr0r/Skrit`](https://github.com/r0073rr0r/Skrit)
- PHP: [`r0073rr0r/SkritPHP`](https://github.com/r0073rr0r/SkritPHP)

## Requirements

- Node.js `>=18`
- TypeScript `^5.0` (for direct use)

## Install

```bash
npm install @r0073rr0r/skrts
```

## Usage

### Unified Router (`encodeText`)

```typescript
import { encodeText } from '@r0073rr0r/skrts';

const result = encodeText('Zemun zakon matori', { mode: 'satro' });
// 'Munze konza torima'

const decoded = encodeText('Munze konza', { mode: 'auto' });
// 'Zemun zakon'
```

### Force specific mode

```typescript
import { encodeText } from '@r0073rr0r/skrts';

encodeText('bazen', { mode: 'satro' }); // 'zenba'
encodeText('bazen', { mode: 'utro' });  // 'uzenzabanje'
encodeText('bazen', { mode: 'leet', leetBase: 'satro', leetDensity: 1.0 }); // '23nb4'
```

### Direct transformer classes

```typescript
import { Satrovacki, Utrovacki, Leetrovacki } from '@r0073rr0r/skrts';

const satro = new Satrovacki();
satro.encode('Beograd'); // 'Gradbeo'
satro.decode('Gradbeo'); // 'Beograd'

const utro = new Utrovacki({ prefix: 'x', infix: 'yy', suffix: 'zz' });
utro.encode('bazen'); // 'xzenyybazz'

const leet = new Leetrovacki({ base: 'utro', leetDensity: 1.0 });
leet.encode('bazen'); // 'uzen24ban73'
```

### Cyrillic support

```typescript
import { Satrovacki } from '@r0073rr0r/skrts';

const s = new Satrovacki();
s.encode('Земун закон матори'); // 'Мунзе конза матори'
s.encode('Beograd');            // 'Gradbeo'
```

### Leet engine

```typescript
import { LeetEncoder, applyLeet, getLeetProfile } from '@r0073rr0r/skrts';

const enc = new LeetEncoder({ profile: 'basic', density: 1.0 });
enc.encode('bazen'); // '54z3n'

const mapping = getLeetProfile('full', undefined, 0);
applyLeet('hello', mapping, 0.9);
```

## Supported Options

All options for `encodeText` and transformer constructors:

| Option | Values | Default | Description |
|---|---|---|---|
| `mode` | `auto\|satro\|utro\|leet` | `auto` | Transformation mode |
| `detectFrom` | `satro\|utro\|leet\|null` | `null` | Force decode detection source |
| `minWordLength` | number | `3` | Skip words shorter than this |
| `plainCTarget` | `ц\|ч\|ћ` | `ц` | Cyrillic target for plain `c` |
| `softTjToCyrillic` | boolean | `false` | Map `tj` → `ћ` |
| `exceptions` | `Record<string, string>` | `{}` | Word-level overrides |
| `leetBase` | `auto\|satro\|utro` | `auto` | Base mode for leet |
| `leetProfile` | `basic\|readable\|full` | `basic` | Leet substitution profile |
| `leetComplexity` | number | `0` | Variant depth for full profile |
| `leetDensity` | `0.0–1.0` | `0.86` | Fraction of chars to substitute |
| `zaStyle` | `24\|z4` | `24` | Utro infix leet style |
| `njeStyle` | `n73\|nj3\|њ` | `n73` | Utro suffix leet style |
| `utroPrefix` | string | `u` | Utro prefix |
| `utroInfix` | string | `za` | Utro infix |
| `utroSuffix` | string | `nje` | Utro suffix |

## Testing

```bash
npm test
```

```bash
npm run test:coverage
```

Tests cover:

- satrovacki encode/decode roundtrip (Latin + Cyrillic)
- utrovacki affix encoding and decode
- leet profiles, density, and detection
- leetrovacki base mode resolution and styling
- unified router auto-detection and decode routing
- transliteration edge cases

## License

GPL-3.0-or-later

## Community

- [Code of Conduct](CODE_OF_CONDUCT.md)
- [Contributing](CONTRIBUTING.md)
- [Security Policy](SECURITY.md)
- [Support](SUPPORT.md)
