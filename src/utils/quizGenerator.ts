import { VocabWord } from '../types/vocab';

export interface QuizQuestion {
  targetWord: VocabWord;
  choices: VocabWord[];
}

export function shuffleArray<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * 2つの文字列間のレーベンシュタイン編集距離を計算する
 */
export function levenshteinDistance(a: string, b: string): number {
  const s = a.toLowerCase();
  const t = b.toLowerCase();
  const m = s.length;
  const n = t.length;

  if (m === 0) return n;
  if (n === 0) return m;

  const dp: number[] = Array.from({ length: n + 1 }, (_, j) => j);

  for (let i = 1; i <= m; i++) {
    let prevDiag = dp[0];
    dp[0] = i;
    for (let j = 1; j <= n; j++) {
      const temp = dp[j];
      const cost = s[i - 1] === t[j - 1] ? 0 : 1;
      dp[j] = Math.min(
        dp[j] + 1,       // 削除
        dp[j - 1] + 1,   // 挿入
        prevDiag + cost  // 置換
      );
      prevDiag = temp;
    }
  }

  return dp[n];
}

/**
 * 日本語の意味文字列から括弧書き（補足説明）や記号を除き、主要な訳語トークン配列を抽出する
 */
function extractMeaningTokens(meaning: string): string[] {
  const withoutParens = meaning
    .replace(/（[^）]*）/g, '')
    .replace(/\([^)]*\)/g, '')
    .replace(/［[^］]*］/g, '')
    .replace(/\[[^\]]*\]/g, '')
    .trim();

  return withoutParens
    .split(/[，、,／/・;；\s]+/)
    .map((token) => token.trim())
    .filter((token) => token.length > 0);
}

/**
 * 2つの単語の日本語訳が同一またはほぼ同一（主要な訳語が重複している）かどうかを判定する
 */
export function areMeaningsTooSimilar(meaningA: string, meaningB: string): boolean {
  if (meaningA.trim() === meaningB.trim()) return true;

  const tokensA = extractMeaningTokens(meaningA);
  const tokensB = extractMeaningTokens(meaningB);

  if (tokensA.length === 0 || tokensB.length === 0) {
    return meaningA.trim() === meaningB.trim();
  }

  // いずれかの主要訳語トークンが完全一致する場合は同義・類義語として除外
  for (const ta of tokensA) {
    for (const tb of tokensB) {
      if (ta === tb) return true;
      // 3文字以上の訳語で一方が他方を完全に包含する場合も除外
      if (ta.length >= 3 && tb.length >= 3 && (ta.includes(tb) || tb.includes(ta))) {
        return true;
      }
    }
  }

  return false;
}

/**
 * ターゲット単語に対する誤答候補の優先度スコア（小さいほど優先）を計算する
 * 優先順位:
 *   1. 同じ品詞
 *   2. 難易度/頻度が近い語（同Rank内で単語IDが近い語）
 *   3. 綴りが似た語（編集距離が小さい語。例: vibration に対して variation）
 */
function computeCandidateScore(target: VocabWord, candidate: VocabWord): number {
  const editDist = levenshteinDistance(target.word, candidate.word);
  const maxLen = Math.max(target.word.length, candidate.word.length, 1);
  const normEditDist = editDist / maxLen;

  // 頭文字や末尾2文字の一致ボーナス
  const sameFirstChar =
    target.word[0]?.toLowerCase() === candidate.word[0]?.toLowerCase() ? -0.5 : 0;
  const sameSuffix =
    target.word.length >= 4 &&
    candidate.word.length >= 4 &&
    target.word.slice(-2).toLowerCase() === candidate.word.slice(-2).toLowerCase()
      ? -0.4
      : 0;

  // 難易度/頻度の近さ（IDの差を正規化: 40語セクション単位）
  const idDiff = Math.abs(target.id - candidate.id);
  const frequencyCost = Math.min(idDiff / 120, 3.0);

  // 綴りが特に似ている語（例: vibration vs variation）は強く優先されるように重み付け
  const spellingCost = editDist <= 3 ? normEditDist * 2.5 : normEditDist * 6.0;

  // 毎回完全に同じ選択肢に固定されすぎないよう微小なランダム揺らぎを加える
  const jitter = Math.random() * 0.45;

  return spellingCost + frequencyCost + sameFirstChar + sameSuffix + jitter;
}

/**
 * 出題対象の単語プール（candidateWords）から4択問題を生成する
 */
export function generateQuizQuestions(
  candidateWords: VocabWord[],
  allWords: VocabWord[],
  count = 10
): QuizQuestion[] {
  if (candidateWords.length === 0) return [];

  const pool = shuffleArray(candidateWords);
  const selectedTargets = pool.slice(0, Math.min(count, pool.length));

  return selectedTargets.map((targetWord) => {
    // 正解自身および意味が同一・ほぼ同一の語を除外
    const validCandidates = allWords.filter(
      (w) =>
        w.id !== targetWord.id &&
        w.word.toLowerCase() !== targetWord.word.toLowerCase() &&
        !areMeaningsTooSimilar(targetWord.meaning, w.meaning)
    );

    // 1. 同じ品詞（かつ同じRank）の候補をスコア順にソート
    const samePosCandidates = validCandidates
      .filter((w) => w.rank === targetWord.rank && w.pos === targetWord.pos)
      .map((w) => ({ word: w, score: computeCandidateScore(targetWord, w) }))
      .sort((a, b) => a.score - b.score)
      .map((entry) => entry.word);

    // 2. フォールバック1: 同じRank内で品詞が一部重なる、または他品詞の候補
    const sameRankOtherPosCandidates = validCandidates
      .filter((w) => w.rank === targetWord.rank && w.pos !== targetWord.pos)
      .map((w) => ({ word: w, score: computeCandidateScore(targetWord, w) }))
      .sort((a, b) => a.score - b.score)
      .map((entry) => entry.word);

    // 3. フォールバック2: 他Rankを含む残りの候補
    const otherRankCandidates = validCandidates
      .filter((w) => w.rank !== targetWord.rank)
      .map((w) => ({ word: w, score: computeCandidateScore(targetWord, w) }))
      .sort((a, b) => a.score - b.score)
      .map((entry) => entry.word);

    const orderedPool = [
      ...samePosCandidates,
      ...sameRankOtherPosCandidates,
      ...otherRankCandidates,
    ];

    // 選択肢同士でもID・意味の重複がないように3語を選出
    const distractors: VocabWord[] = [];
    for (const candidate of orderedPool) {
      if (distractors.length >= 3) break;
      const isDuplicateOrSimilar = distractors.some(
        (d) =>
          d.id === candidate.id ||
          areMeaningsTooSimilar(d.meaning, candidate.meaning)
      );
      if (!isDuplicateOrSimilar) {
        distractors.push(candidate);
      }
    }

    // 正解の位置は毎回ランダムにする
    const choices = shuffleArray([targetWord, ...distractors]);

    return { targetWord, choices };
  });
}
