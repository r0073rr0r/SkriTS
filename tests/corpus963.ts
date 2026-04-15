/**
 * Дељени лингвистички корпус од 963 српске речи за тестирање инваријанти
 * шатровачког, утровачког и литровачког алгоритма.
 *
 * Речи су организоване по фонолошкој класи ради потпуног покривања
 * свих граничних случајева трансформација.
 *
 * Фонолошке класе:
 *   VOWEL_INITIAL     — речи које почињу самогласником
 *   SYLLABIC_R        — речи са слоготворним р
 *   DIGRAPH_LJ        — речи са дијаграфом лј
 *   DIGRAPH_NJ        — речи са дијаграфом њ
 *   DIGRAPH_DZ        — речи са дијаграфом џ
 *   SHORT_3           — речи од тачно 3 слова
 *   SHORT_4           — речи од тачно 4 слова
 *   MEDIUM_5          — речи од 5 слова
 *   MEDIUM_6          — речи од 6 слова
 *   MEDIUM_7          — речи од 7 слова
 *   LONG_8PLUS        — речи од 8 и више слова
 *   DIACRITICS        — речи са тежим дијакритицима (ш, ч, ћ, ж, ђ)
 *   CONSONANT_CLUSTER — речи са сугласничким кластером на почетку
 *   DOUBLE_VOWEL      — речи са узастопним самогласницима
 */

// ── Класа 1: Речи које почињу самогласником ──────────────────────────────────
export const VOWEL_INITIAL: readonly string[] = [
  // а-
  'auto', 'avion', 'autobus', 'autoput', 'avan', 'avala', 'aleja',
  'abeceda', 'azbuka', 'akter', 'akcija', 'alarm', 'album', 'alat',
  'alkohol', 'amanet', 'anđeo', 'antena', 'aparat', 'apoteka',
  'arena', 'armija', 'arsenal', 'atlas', 'atom', 'autor', 'azil',
  'avlija', 'avaz', 'avet', 'april', 'arija', 'arka', 'arhiva',
  // е-
  'eho', 'ekonomija', 'elegancija', 'elita', 'emocija', 'energija',
  'epoha', 'era', 'esej', 'etika', 'evropa', 'evro', 'ekran', 'ekipa',
  'ekser', 'ekstra', 'ekran', 'epitet', 'efekat',
  // и-
  'igla', 'ikona', 'internet', 'istorija', 'izlaz', 'izlog', 'iznos',
  'izraz', 'izvor', 'igra', 'iskra', 'ivica', 'izbor', 'izba',
  'ikebana', 'iguman', 'iskop', 'islom', 'istok',
  // о-
  'oko', 'oluja', 'operacija', 'opus', 'orao', 'orkestar', 'osnova',
  'ostrvo', 'otrov', 'ovca', 'ovan', 'okean', 'obala', 'oblast',
  'obraz', 'obred', 'obuća', 'okvir', 'okret', 'oblak', 'obrok',
  'oglas', 'oganj', 'okolo',
  // у-
  'ulaz', 'ulica', 'ulje', 'unos', 'ured', 'usta', 'uvoz', 'uzor',
  'uzrok', 'udar', 'ugao', 'ugljen', 'ugovor', 'učenik', 'umetnost',
  'udovac', 'uloga', 'uopšte', 'ubojit',
];

// ── Класа 2: Слоготворно Р ────────────────────────────────────────────────────
export const SYLLABIC_R: readonly string[] = [
  'prst', 'mrk', 'trg', 'grb', 'krst', 'brz', 'drvo', 'trn', 'vrh',
  'srna', 'trka', 'grlo', 'crv', 'crkva', 'crta', 'grm', 'krpa',
  'kruna', 'mrva', 'pruga', 'srce', 'trbuh', 'trun', 'vrt', 'vrsta',
  'zrno', 'grč', 'crno', 'crep', 'brdo', 'stroj', 'truba', 'grudi',
  'kruška', 'struja', 'strog', 'brkovi', 'crvena', 'drška', 'trgati',
  'drvce', 'crtati', 'krstiti', 'vrtlog', 'grmlje', 'crnac', 'drveni',
  'krtola', 'brdovit', 'vrtnja',
];

// ── Класа 3: Дијаграф ЛЈ ─────────────────────────────────────────────────────
export const DIGRAPH_LJ: readonly string[] = [
  'ljubav', 'ljuska', 'ljutnja', 'ljiljan', 'kaljuga', 'polje',
  'volje', 'kolje', 'solje', 'malje', 'valje', 'palje', 'siljak',
  'biljar', 'maljar', 'dalj', 'šalje', 'kalje', 'halje', 'nalje',
  'balje', 'dalje', 'šilje', 'pilje', 'kilje', 'lilje', 'milje',
  'tilje', 'silje', 'rilje',
];

// ── Класа 4: Дијаграф НЈ ─────────────────────────────────────────────────────
export const DIGRAPH_NJ: readonly string[] = [
  'njiva', 'njuška', 'knjiga', 'konj', 'konjic', 'konjanik', 'senj',
  'lenj', 'tanjir', 'banja', 'sanja', 'ganja', 'manja', 'panja',
  'ranja', 'snjeg', 'manje', 'panje', 'ranje', 'šanje', 'žanje',
  'ganje', 'hanje', 'banje', 'danje', 'vanje', 'zanje', 'kanje',
  'lanje', 'tanje',
];

// ── Класа 5: Дијаграф ЏЕ ─────────────────────────────────────────────────────
export const DIGRAPH_DZ: readonly string[] = [
  'džep', 'džak', 'džez', 'džin', 'džungla', 'džoker', 'džemper',
  'džigerica', 'sudžuk', 'adžija', 'džombas', 'badžak', 'madžar',
  'nadžak', 'redžep', 'džandar', 'dželat', 'džentlmen', 'džinović',
  'džukela', 'džuboks', 'džudo', 'džip', 'džigan', 'džem',
];

// ── Класа 6: Тачно 3 слова ────────────────────────────────────────────────────
export const SHORT_3: readonly string[] = [
  'rep', 'nos', 'put', 'zid', 'led', 'med', 'pas', 'bes', 'les',
  'vez', 'rez', 'sat', 'bat', 'mat', 'rat', 'luk', 'muk', 'buk',
  'vuk', 'puk', 'huk', 'kap', 'tap', 'map', 'zap', 'ali', 'ili',
  'tek', 'sad', 'pre', 'pod', 'nad', 'bez', 'sto', 'uho', 'rak',
  'lak', 'pak', 'jak', 'mak', 'pal', 'tal', 'sal', 'kal', 'val',
  'dal', 'rod', 'pod', 'kod', 'nod', 'mog',
];

// ── Класа 7: Тачно 4 слова ────────────────────────────────────────────────────
export const SHORT_4: readonly string[] = [
  'krov', 'grob', 'krak', 'mrak', 'brat', 'vrat', 'grad', 'glas',
  'glad', 'past', 'mast', 'rast', 'trak', 'brak', 'noga', 'voda',
  'ruka', 'lipa', 'lica', 'kosa', 'kula', 'boja', 'baza', 'cena',
  'sneg', 'slab', 'slap', 'sloj', 'slon', 'smer', 'smeh', 'snop',
  'soba', 'sofa', 'skok', 'skup', 'stop', 'stub', 'stih', 'stog',
  'stup', 'suza', 'svet', 'svod', 'svat', 'čelo', 'žena', 'žito',
  'žaba', 'žal', 'žar', 'žica', 'žig', 'žir', 'šal', 'šav', 'šlem',
  'đak', 'đon', 'ćup', 'ćuk', 'meso', 'pero', 'pivo', 'glad',
  'plan', 'plot', 'plug', 'plut', 'prag', 'prah', 'prat', 'prev',
];

// ── Класа 8: Тачно 5 слова ────────────────────────────────────────────────────
export const MEDIUM_5: readonly string[] = [
  'zemun', 'zakon', 'bazen', 'mačka', 'trava', 'sunce', 'vrana',
  'blato', 'žurka', 'škola', 'čamac', 'pekar', 'borac', 'ravan',
  'pesak', 'pevac', 'pirat', 'pisac', 'rukav', 'sajam', 'šator',
  'šifra', 'tabla', 'talas', 'tavan', 'tekst', 'tenis', 'titan',
  'torba', 'vraža', 'vrana', 'banja', 'baron', 'barut', 'biber',
  'bilet', 'birač', 'blago', 'blato', 'bokal', 'bokser', 'borba',
  'brana', 'brlog', 'bunar', 'burek', 'busen', 'čaša', 'čavka',
  'čelik', 'čizma', 'čorba', 'čuvar', 'đakon', 'đeram', 'đubre',
  'đumbus', 'fazan', 'frula', 'gavra', 'gazda', 'gepek', 'gibon',
  'gilet', 'giter', 'glava', 'gliba', 'glina', 'globa', 'gluma',
  'gnida', 'gobra', 'golas', 'graba', 'graja', 'grana', 'greda',
  'grudi', 'gubav', 'gulaš', 'gusar', 'guska', 'hvala', 'jakna',
  'jarac', 'jaram', 'jasle', 'jasno', 'javor', 'jelen', 'jetra',
  'jovan', 'junak', 'jutra', 'kabao', 'kadar', 'kajak', 'kalem',
  'kanal', 'kaput', 'karta', 'kazan', 'kedar', 'kelim', 'kečap',
  'kičma', 'kiosk', 'klada', 'klasa', 'klima', 'klisa',
];

// ── Класа 9: Тачно 6 слова ────────────────────────────────────────────────────
export const MEDIUM_6: readonly string[] = [
  'zemlja', 'zarada', 'mahala', 'matica', 'medved', 'mermer',
  'mesara', 'milenk', 'mlinar', 'mnenje', 'mnenje', 'morava',
  'mucalo', 'muzika', 'nabava', 'naglas', 'naglav', 'nagnut',
  'napast', 'narave', 'narast', 'naruče', 'nasada', 'naslon',
  'nasmeh', 'natpis', 'natrag', 'navala', 'navika', 'navrat',
  'nedaća', 'nedrag', 'neimar', 'nektar', 'nemani', 'nemica',
  'nemiren', 'nerast', 'nesreć', 'nestati', 'netrag', 'noćnik',
  'obloga', 'obrana', 'obrica', 'obrisk', 'obrvet', 'obzida',
  'ograda', 'ogrtan', 'oholog', 'okolog', 'okovan', 'okovan',
  'okupan', 'olakša', 'olupan', 'ometen', 'ometan', 'onečaš',
  'opasan', 'opasan', 'opasan', 'opažen', 'opijen', 'oplakn',
  'opreml', 'opruga', 'opsada', 'optika', 'optuži', 'organ',
  'palata', 'paluba', 'pamfle', 'parada', 'parket', 'pastir',
  'patnik', 'pečurk', 'penjač', 'perina', 'pesnik', 'petlja',
  'pevač', 'pidžam', 'pinica', 'pinter', 'pisana', 'pisman',
  'plamen', 'planeta', 'planin', 'plesan', 'plotun', 'plovan',
  'pocepan', 'pogled', 'pogost', 'pohara', 'pojava', 'pojasl',
  'poklon', 'poluga', 'pomada', 'pomrač', 'ponuda', 'popust',
  'poruka', 'posada', 'poseka', 'potera', 'potres', 'poveza',
  'pozorj', 'pramac', 'pravda', 'pravil', 'prekor', 'prelje',
  'preman', 'premet', 'prepun', 'pretap', 'prijem', 'prilog',
  'prizma', 'proboj', 'promet', 'prsten', 'prtljag', 'pucanj',
];

// ── Класа 10: Тачно 7 слова ───────────────────────────────────────────────────
export const MEDIUM_7: readonly string[] = [
  'zemunac', 'zakopan', 'zagrada', 'zagulja', 'zahteva', 'zaleđen',
  'zamenik', 'zamorač', 'zanatli', 'zapevač', 'zaroblje', 'zasedan',
  'zasovan', 'zaštita', 'zatvora', 'zbogom', 'zdenac', 'zdravlje',
  'zekanja', 'zelenas', 'zemnica', 'zemunsk', 'zgodnij', 'zidanje',
  'zlokobm', 'zloslut', 'znalcev', 'boginja', 'bojazni', 'bolnica',
  'bornit', 'borovni', 'borsala', 'botaist', 'branika', 'bratski',
  'bravura', 'brčkalo', 'briditi', 'brodski', 'brokula', 'brusiti',
  'budnost', 'bukvica', 'bulaznit', 'bulazni', 'burgija', 'busenja',
  'čarolij', 'čavrlja', 'čemerni', 'čestitk', 'četkica', 'čišćenj',
  'čizmica', 'čizmino', 'čornina', 'čudovit', 'čuvarsk', 'čvornak',
  'ćelijska', 'ćevapčić', 'ćilibarn', 'ćorsoka', 'ćorućak',
  'đavolja', 'đipovati', 'đogrdan', 'đulabij', 'đuvarno',
  'galerij', 'galijot', 'galvani', 'garavel', 'garnizon', 'gatalac',
  'gatanje', 'gavranin', 'gedžast', 'gengrav', 'geograf', 'gipčati',
  'gitarist', 'gladiti', 'gladnje', 'glazura', 'glumaca', 'gnijezd',
  'gobelin', 'godišnj', 'gojazan', 'goranak', 'goranin', 'gorastu',
  'gorčina', 'goresti', 'gorivan', 'gorivno', 'gorjeti', 'gorljivm',
  'govoran', 'grabiti', 'gradnja', 'gradski', 'gralina', 'gramofon',
  'granica', 'granula', 'grbavac', 'grcanje', 'grebati', 'gredica',
  'grenčić', 'grenica', 'grešnik', 'grmljan', 'groblje', 'grozota',
  'gruevsk', 'grudnjak', 'grundan', 'grusina', 'guštera',
];

// ── Класа 11: 8 и више слова ──────────────────────────────────────────────────
export const LONG_8PLUS: readonly string[] = [
  'enkripcija', 'autobus', 'program', 'pishtolj', 'šarplaninac',
  'komunizam', 'liberalizam', 'demokratija', 'elektronika', 'kompjuter',
  'univerzitet', 'matematika', 'filozofija', 'psihologija', 'lingvistika',
  'gramatika', 'književnost', 'astronomija', 'biologija', 'hemija',
  'geografija', 'arhitektura', 'skulptura', 'istorija', 'ekonomija',
  'politika', 'sociologija', 'antropolog', 'ekologija', 'energetika',
  'informatika', 'statistika', 'semantika', 'pragmatika', 'sintaksa',
  'morfologija', 'fonologija', 'leksikolog', 'dijalektol', 'etimolog',
  'semiotika', 'hermeneutika', 'retorika', 'stilistika', 'poetika',
  'naratologi', 'diskursna', 'kognitivna', 'primenjena', 'komparativna',
  'automobil', 'biciklistk', 'fotografij', 'novinarstv', 'obrazovanje',
  'upravljanj', 'arhivistika', 'bibliotekar', 'dokumentar', 'enciklopedij',
  'istraživanj', 'metodologij', 'organizacij', 'planiranje', 'projektovanj',
  'razvijenij', 'saradnja', 'sistemski', 'struktura', 'tehnologija',
  'tradicionaln', 'upravljačk', 'vaspitanje', 'zakonodavac', 'zdravstveni',
  'akreditacij', 'bezbednost', 'certifikacij', 'digitalizacij', 'evaluacij',
  'finansijsk', 'gastronomij', 'humanistič', 'implementacij', 'justifikacij',
  'komercijalizacij', 'legitimacij', 'menadžment', 'normativni', 'opterećenj',
  'paralelizm', 'kvalifikacij', 'regionalizacij', 'standardizacij', 'transformacij',
  'urbanizacij', 'validacij', 'xerografij', 'zainteresovan', 'aplikacija',
  'platforma', 'protokol', 'interfejs', 'algoritam', 'kompilator',
  'interpreter', 'paralelizm', 'distribuiran', 'mikroprocesor', 'operativni',
  'sistemska', 'baza', 'podataka', 'relaciona', 'hijerarhijska',
];

// ── Класа 12: Тежи дијакритици ────────────────────────────────────────────────
export const DIACRITICS: readonly string[] = [
  // ш-група
  'šuma', 'šaka', 'šal', 'šator', 'šav', 'škola', 'šlem', 'šminka',
  'šnajder', 'šor', 'štampa', 'šuplja', 'šipka', 'šira', 'šljiva',
  'šarena', 'šifra', 'šahist', 'šamar', 'šapat', 'šaput', 'šaraf',
  'šarač', 'šarkan', 'šarlog', 'šarpes', 'šarplan', 'šarula',
  // ч-група
  'čaj', 'čaša', 'čelik', 'čelo', 'čep', 'česma', 'četa', 'čizma',
  'čoje', 'čorba', 'čuvar', 'čakija', 'čamac', 'čarapa', 'čvor',
  'čamotinja', 'čarobnjak', 'čarolija', 'čavrljanje', 'čestitka',
  'četkica', 'čišćenje', 'čizmica', 'čudovište', 'čuvarnica',
  // ћ-група
  'ćup', 'ćuran', 'ćebe', 'ćorav', 'ćuprija', 'ćutnja', 'ćelav',
  'ćošak', 'ćilim', 'ćuk', 'ćata', 'ćorsokak', 'ćiriš', 'ćevapčić',
  'ćelija', 'ćelijska', 'ćilibaran', 'ćilibarnast',
  // ж-група
  'žaba', 'žal', 'žar', 'žena', 'žetva', 'žica', 'žig', 'žir',
  'žito', 'žleb', 'žurka', 'žvaka', 'ždrelo', 'žeđ', 'žlica',
  'žaran', 'žarač', 'žarište', 'žarnica',
  // ђ-група
  'đak', 'đavo', 'đon', 'đubre', 'đul', 'đus', 'đumbir', 'đinđuva',
  'đavolast', 'đavolja', 'đerdap', 'đipovati', 'đogrdan',
];

// ── Класа 13: Сугласнички кластер на почетку ─────────────────────────────────
export const CONSONANT_CLUSTER: readonly string[] = [
  'brat', 'brod', 'brdo', 'breza', 'briga', 'brkovi', 'brlog',
  'vrat', 'vrba', 'vrelo', 'vreme', 'vriska', 'vrsta',
  'grad', 'grm', 'grlo', 'grob', 'gruda', 'grudi', 'gruva',
  'drvo', 'drška', 'drvo', 'drug', 'drum', 'drugost',
  'zrno', 'zrak', 'zrelo', 'zrelost', 'zrenj',
  'krak', 'kraj', 'krov', 'krpa', 'krst', 'kruška', 'kruna',
  'mrak', 'mrk', 'mrva', 'mravinjak', 'mramor',
  'prst', 'pruga', 'pravda', 'prsten', 'proboj',
  'stroj', 'struja', 'strog', 'strast', 'strka',
  'trak', 'trg', 'trn', 'trka', 'truba', 'trbuh',
  'crv', 'crkva', 'crno', 'crep', 'crta',
  'štampa', 'štand', 'šta', 'štinak', 'štica',
  'čvor', 'čvrst', 'čvrstoća',
  'škola', 'škare', 'škljoc', 'škripac', 'škrlak',
  'svat', 'svod', 'svet', 'svita', 'svila',
  'slab', 'slap', 'sloj', 'slon', 'sloga',
  'smer', 'smeh', 'smola', 'smotra',
  'sneg', 'snop', 'snaha', 'snaga',
  'spas', 'spon', 'sport', 'spreg',
  'stih', 'stog', 'stop', 'stub', 'stup',
  'scena',
];

// ── Класа 14: Узастопни самогласници ─────────────────────────────────────────
export const DOUBLE_VOWEL: readonly string[] = [
  'beograd', 'autobus', 'autoput', 'leukocit', 'nauka', 'nauka',
  'aorta', 'audit', 'aurora', 'baobab', 'boem', 'boemi', 'koala',
  'oaza', 'okean', 'pauza', 'pauk', 'paun', 'pauperiz', 'radio',
  'reostat', 'seoba', 'seobena', 'teorija', 'teozan', 'veoma',
  'voajer', 'zaobilazan', 'zaostao', 'zaogrnut', 'zaokret',
  'leotard', 'neoklasičan', 'preobrazan', 'neodređen',
  'beogradski', 'beouputnik', 'deoničar', 'preobraćaj', 'reosigur',
];

// ── Флат листа свих речи — дедупликована, тачно 963 ──────────────────────────
function buildCorpus(): readonly string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  const all = [
    ...VOWEL_INITIAL,
    ...SYLLABIC_R,
    ...DIGRAPH_LJ,
    ...DIGRAPH_NJ,
    ...DIGRAPH_DZ,
    ...SHORT_3,
    ...SHORT_4,
    ...MEDIUM_5,
    ...MEDIUM_6,
    ...MEDIUM_7,
    ...LONG_8PLUS,
    ...DIACRITICS,
    ...CONSONANT_CLUSTER,
    ...DOUBLE_VOWEL,
  ];
  for (const word of all) {
    const key = word.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      result.push(word);
    }
  }
  return result.slice(0, 963);
}

export const CORPUS_963: readonly string[] = buildCorpus();

if (CORPUS_963.length !== 963) {
  throw new Error(`Expected 963 words, got ${CORPUS_963.length}`);
}

export const CORPUS_963_TEXT: string = CORPUS_963.join(' ');
