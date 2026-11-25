import React from 'react';

/**
 * 代表的な不規則活用・ラテン/ギリシャ系複数形のマップ
 */
const IRREGULAR_FORMS: Record<string, string[]> = {
  arise: ['arose', 'arisen'],
  awake: ['awoke', 'awoken'],
  bear: ['bore', 'borne', 'born'],
  beat: ['beaten'],
  become: ['became'],
  begin: ['began', 'begun'],
  bend: ['bent'],
  bet: ['bet'],
  bind: ['bound'],
  bite: ['bit', 'bitten'],
  bleed: ['bled'],
  blow: ['blew', 'blown'],
  break: ['broke', 'broken'],
  breed: ['bred'],
  bring: ['brought'],
  build: ['built'],
  burn: ['burnt'],
  burst: ['burst'],
  buy: ['bought'],
  cast: ['cast'],
  catch: ['caught'],
  choose: ['chose', 'chosen'],
  cling: ['clung'],
  come: ['came'],
  cost: ['cost'],
  creep: ['crept'],
  cut: ['cut'],
  deal: ['dealt'],
  dig: ['dug'],
  do: ['did', 'done', 'does'],
  draw: ['drew', 'drawn'],
  dream: ['dreamt'],
  drink: ['drank', 'drunk'],
  drive: ['drove', 'driven'],
  dwell: ['dwelt'],
  eat: ['ate', 'eaten'],
  fall: ['fell', 'fallen'],
  feed: ['fed'],
  feel: ['felt'],
  fight: ['fought'],
  find: ['found'],
  flee: ['fled'],
  fling: ['flung'],
  fly: ['flew', 'flown'],
  forbid: ['forbade', 'forbidden'],
  forget: ['forgot', 'forgotten'],
  forgive: ['forgave', 'forgiven'],
  freeze: ['froze', 'frozen'],
  get: ['got', 'gotten'],
  give: ['gave', 'given'],
  go: ['went', 'gone', 'goes'],
  grind: ['ground'],
  grow: ['grew', 'grown'],
  hang: ['hung'],
  have: ['has', 'had'],
  hear: ['heard'],
  hide: ['hid', 'hidden'],
  hit: ['hit'],
  hold: ['held'],
  hurt: ['hurt'],
  keep: ['kept'],
  kneel: ['knelt'],
  know: ['knew', 'known'],
  lay: ['laid'],
  lead: ['led'],
  lean: ['leant'],
  leap: ['leapt'],
  learn: ['learnt'],
  leave: ['left'],
  lend: ['lent'],
  let: ['let'],
  lie: ['lay', 'lain', 'lying'],
  light: ['lit'],
  lose: ['lost'],
  make: ['made'],
  mean: ['meant'],
  meet: ['met'],
  overcome: ['overcame'],
  pay: ['paid'],
  put: ['put'],
  quit: ['quit'],
  read: ['read'],
  ride: ['rode', 'ridden'],
  ring: ['rang', 'rung'],
  rise: ['rose', 'risen'],
  run: ['ran'],
  say: ['said'],
  see: ['saw', 'seen'],
  seek: ['sought'],
  sell: ['sold'],
  send: ['sent'],
  set: ['set'],
  shake: ['shook', 'shaken'],
  shed: ['shed'],
  shine: ['shone'],
  shoot: ['shot'],
  show: ['showed', 'shown'],
  shrink: ['shrank', 'shrunk', 'shrunken'],
  shut: ['shut'],
  sing: ['sang', 'sung'],
  sink: ['sank', 'sunk', 'sunken'],
  sit: ['sat'],
  sleep: ['slept'],
  slide: ['slid'],
  slit: ['slit'],
  smell: ['smelt'],
  speak: ['spoke', 'spoken'],
  speed: ['sped'],
  spend: ['spent'],
  spill: ['spilt'],
  spin: ['spun'],
  spit: ['spat'],
  split: ['split'],
  spoil: ['spoilt'],
  spread: ['spread'],
  spring: ['sprang', 'sprung'],
  stand: ['stood'],
  steal: ['stole', 'stolen'],
  stick: ['stuck'],
  sting: ['stung'],
  stink: ['stank', 'stunk'],
  stride: ['strode', 'stridden'],
  strike: ['struck', 'stricken'],
  string: ['strung'],
  strive: ['strove', 'striven'],
  swear: ['swore', 'sworn'],
  sweep: ['swept'],
  swell: ['swelled', 'swollen'],
  swim: ['swam', 'swum'],
  swing: ['swung'],
  take: ['took', 'taken'],
  teach: ['taught'],
  tear: ['tore', 'torn'],
  tell: ['told'],
  think: ['thought'],
  thrive: ['throve', 'thriven'],
  throw: ['threw', 'thrown'],
  thrust: ['thrust'],
  tread: ['trod', 'trodden'],
  undergo: ['underwent', 'undergone'],
  understand: ['understood'],
  undertake: ['undertook', 'undertaken'],
  uphold: ['upheld'],
  upset: ['upset'],
  wake: ['woke', 'woken'],
  wear: ['wore', 'worn'],
  weave: ['wove', 'woven'],
  weep: ['wept'],
  win: ['won'],
  wind: ['wound'],
  withdraw: ['withdrew', 'withdrawn'],
  withhold: ['withheld'],
  withstand: ['withstood'],
  wring: ['wrung'],
  write: ['wrote', 'written'],
  // 名詞・形容詞の不規則形・学術語複数形
  analysis: ['analyses'],
  Axis: ['axes'],
  axis: ['axes'],
  bacterium: ['bacteria'],
  basis: ['bases'],
  child: ['children'],
  crisis: ['crises'],
  criterion: ['criteria'],
  curriculum: ['curricula'],
  datum: ['data'],
  diagnosis: ['diagnoses'],
  emphasis: ['emphases'],
  foot: ['feet'],
  formula: ['formulae', 'formulas'],
  fungus: ['fungi'],
  goose: ['geese'],
  half: ['halves'],
  hypothesis: ['hypotheses'],
  index: ['indices', 'indexes'],
  knife: ['knives'],
  larva: ['larvae'],
  leaf: ['leaves'],
  life: ['lives'],
  loaf: ['loaves'],
  man: ['men'],
  matrix: ['matrices'],
  medium: ['media'],
  memorandum: ['memoranda'],
  mouse: ['mice'],
  nebula: ['nebulae'],
  nucleus: ['nuclei'],
  oasis: ['oases'],
  ox: ['oxen'],
  parenthesis: ['parentheses'],
  person: ['people', 'persons'],
  phenomenon: ['phenomena'],
  radius: ['radii'],
  self: ['selves'],
  shelf: ['shelves'],
  stimulus: ['stimuli'],
  stratum: ['strata'],
  syllabus: ['syllabi'],
  synthesis: ['syntheses'],
  thesis: ['theses'],
  thief: ['thieves'],
  tooth: ['teeth'],
  vertebra: ['vertebrae'],
  wife: ['wives'],
  wolf: ['wolves'],
  woman: ['women'],
  worm: ['earthworm', 'earthworms'],
};

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * 英単語の原形および一般的な活用形（三単現・複数・過去・進行・比較・派生）にマッチする正規表現を構築する
 */
export function buildTargetWordRegex(targetWord: string): RegExp | null {
  const clean = targetWord.trim().toLowerCase();
  if (!clean) return null;

  const escaped = escapeRegExp(clean);
  const patterns = new Set<string>();

  // 1. 原形 + 代表的な接尾辞
  patterns.add(`${escaped}(?:s|es|ed|d|ing|er|ers|est|ly|al|ally|ment|ments)?`);

  // 2. 語末が 'e' の場合 (provide -> provides/provided/providing, large -> larger/largest)
  if (clean.endsWith('e') && clean.length >= 3) {
    const stem = escapeRegExp(clean.slice(0, -1));
    patterns.add(`${stem}(?:e|es|ed|ing|er|ers|est|able|ation|ations|al|ally)`);
  }

  // 3. 語末が 'y' の場合 (rely -> relies/relied/relying, happy -> happier/happiest/happily)
  if (clean.endsWith('y') && clean.length >= 3) {
    const stem = escapeRegExp(clean.slice(0, -1));
    patterns.add(`${stem}(?:y|ies|ied|ying|ier|iest|ily|iness)`);
  }

  // 4. 語末が 'ie' の場合 (die -> dies/died/dying)
  if (clean.endsWith('ie') && clean.length >= 3) {
    const stem = escapeRegExp(clean.slice(0, -2));
    patterns.add(`${stem}(?:ie|ies|ied|ying)`);
  }

  // 5. 語末が 'f' / 'fe' の場合 (leaf -> leaves, knife -> knives)
  if (clean.endsWith('f') && clean.length >= 3) {
    const stem = escapeRegExp(clean.slice(0, -1));
    patterns.add(`${stem}ves`);
  }
  if (clean.endsWith('fe') && clean.length >= 3) {
    const stem = escapeRegExp(clean.slice(0, -2));
    patterns.add(`${stem}ves`);
  }

  // 6. 短母音 + 単子音の重ね (dip -> dipped/dipping, occur -> occurred/occurring)
  const lastChar = clean[clean.length - 1];
  if (/[bcdfghjklmnpqrstvwxz]/.test(lastChar) && clean.length >= 3) {
    patterns.add(`${escaped}${escapeRegExp(lastChar)}(?:ed|ing|er|ers|est|y)`);
  }

  // 7. 不規則変化の登録語
  const irregulars = IRREGULAR_FORMS[clean];
  if (irregulars) {
    for (const form of irregulars) {
      patterns.add(escapeRegExp(form));
    }
  }

  const combined = Array.from(patterns).join('|');
  return new RegExp(`\\b(${combined})\\b`, 'gi');
}

/**
 * 例文中の対象語（活用形を含む）を太字＋アクセントカラーでハイライトした ReactNode を返す。
 * 一致しない場合は何も装飾せず元の文字列を返す。
 */
export function highlightTargetWord(
  sentence: string,
  targetWord: string
): React.ReactNode {
  if (!sentence || !targetWord) return sentence;

  const regex = buildTargetWordRegex(targetWord);
  if (!regex) return sentence;

  const parts = sentence.split(regex);
  // split にキャプチャグループを含めると、一致しなかった場合は要素数1の配列になる
  if (parts.length <= 1) {
    return sentence;
  }

  return parts.map((part, idx) => {
    // 奇数インデックスが正規表現のキャプチャグループ（マッチした単語）に対応する
    if (idx % 2 === 1) {
      return (
        <strong
          key={idx}
          className="font-bold text-[#FBBF24] underline decoration-[#FBBF24]/50 underline-offset-2"
        >
          {part}
        </strong>
      );
    }
    return part;
  });
}
