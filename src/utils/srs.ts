import { WordProgress, ReviewRating, getLearningStatus } from '../types/vocab';

/**
 * 間隔反復（SM-2ベース）および「定着」自動判定の基準値定数。
 * 1か所に集約し、後からバランス調整しやすくしています。
 */
export const SRS_CONFIG = {
  /** 復習間隔がこの日数以上に達した場合に自動で「定着」にする */
  MEMORIZED_INTERVAL_DAYS: 21,
  /** 連続正解（カード「難しい/普通/簡単」またはクイズ正解）がこの回数に達した場合に自動で「定着」にする */
  MEMORIZED_CONSECUTIVE_CORRECT: 5,
  /** SM-2 難易度係数（Ease Factor）の初期値 */
  INITIAL_EASE_FACTOR: 2.5,
  /** SM-2 難易度係数（Ease Factor）の下限値 */
  MIN_EASE_FACTOR: 1.3,
  /** 「もう一度 (again)」選択時の次回復習までの分数 */
  AGAIN_INTERVAL_MINUTES: 10,
  /** 初回（またはリセット後）の各評価に対する基本復習間隔（日） */
  INITIAL_INTERVALS_DAYS: {
    hard: 1,
    good: 3,
    easy: 7,
  },
} as const;

export const DEFAULT_WORD_PROGRESS: WordProgress = {
  memorized: false,
  correctCount: 0,
  incorrectCount: 0,
  intervalDays: 0,
  easeFactor: SRS_CONFIG.INITIAL_EASE_FACTOR,
  repetitions: 0,
  consecutiveCorrect: 0,
};

/**
 * 既存の保存済み WordProgress を壊さずに SRS フィールドを補完するマイグレーション関数
 */
export function migrateWordProgress(raw: Partial<WordProgress> | undefined | null): WordProgress {
  if (!raw) {
    return { ...DEFAULT_WORD_PROGRESS };
  }

  const memorized = Boolean(raw.memorized);
  const correctCount = typeof raw.correctCount === 'number' ? raw.correctCount : 0;
  const incorrectCount = typeof raw.incorrectCount === 'number' ? raw.incorrectCount : 0;
  const lastReviewedAt = typeof raw.lastReviewedAt === 'string' ? raw.lastReviewedAt : undefined;

  const hasStudied = Boolean(lastReviewedAt) || correctCount > 0 || incorrectCount > 0 || memorized;

  const easeFactor =
    typeof raw.easeFactor === 'number' && raw.easeFactor >= SRS_CONFIG.MIN_EASE_FACTOR
      ? raw.easeFactor
      : SRS_CONFIG.INITIAL_EASE_FACTOR;

  let intervalDays = typeof raw.intervalDays === 'number' ? raw.intervalDays : 0;
  let repetitions = typeof raw.repetitions === 'number' ? raw.repetitions : 0;
  let consecutiveCorrect =
    typeof raw.consecutiveCorrect === 'number' ? raw.consecutiveCorrect : correctCount;
  let nextReviewAt = typeof raw.nextReviewAt === 'string' ? raw.nextReviewAt : undefined;

  if (memorized) {
    // 既に「定着」していた既存データは定着状態を維持し、未設定なら基準間隔を補完
    if (intervalDays < SRS_CONFIG.MEMORIZED_INTERVAL_DAYS) {
      intervalDays = SRS_CONFIG.MEMORIZED_INTERVAL_DAYS;
    }
    if (repetitions === 0) {
      repetitions = Math.max(1, correctCount);
    }
    if (consecutiveCorrect < SRS_CONFIG.MEMORIZED_CONSECUTIVE_CORRECT) {
      consecutiveCorrect = Math.max(correctCount, SRS_CONFIG.MEMORIZED_CONSECUTIVE_CORRECT);
    }
    if (!nextReviewAt && lastReviewedAt) {
      const base = new Date(lastReviewedAt);
      if (!Number.isNaN(base.getTime())) {
        nextReviewAt = new Date(
          base.getTime() + intervalDays * 24 * 60 * 60 * 1000
        ).toISOString();
      }
    }
  } else if (hasStudied) {
    // 学習中だった既存データは「今日の復習」対象になるよう補完
    if (!nextReviewAt && lastReviewedAt) {
      nextReviewAt = lastReviewedAt;
    }
  }

  return {
    memorized,
    correctCount,
    incorrectCount,
    lastReviewedAt,
    intervalDays,
    easeFactor,
    repetitions,
    consecutiveCorrect,
    nextReviewAt,
    lastRating: raw.lastRating,
  };
}

/**
 * 現在の進捗と選んだ評価（hard / good / easy）から次回の復習間隔（日数）を算出する
 */
export function computeNextIntervalDays(
  current: WordProgress,
  rating: Exclude<ReviewRating, 'again'>
): number {
  const prevInterval = current.intervalDays ?? 0;
  const prevReps = current.repetitions ?? 0;
  const ef = current.easeFactor ?? SRS_CONFIG.INITIAL_EASE_FACTOR;

  if (prevReps <= 0 || prevInterval <= 0) {
    return SRS_CONFIG.INITIAL_INTERVALS_DAYS[rating];
  }

  if (rating === 'hard') {
    return Math.max(1, Math.round(prevInterval * 1.2));
  }
  if (rating === 'good') {
    return Math.max(prevInterval + 1, Math.round(prevInterval * ef));
  }
  // easy
  return Math.max(prevInterval + 2, Math.round(prevInterval * ef * 1.3));
}

/**
 * 4段階評価ボタンに表示する次回復習までの目安テキスト（例: "10分" / "1日" / "3日" / "7日"）
 */
export function getPreviewIntervalLabel(
  current: WordProgress | null | undefined,
  rating: ReviewRating
): string {
  if (rating === 'again') {
    return `${SRS_CONFIG.AGAIN_INTERVAL_MINUTES}分`;
  }
  const base = current ?? DEFAULT_WORD_PROGRESS;
  const days = computeNextIntervalDays(base, rating);
  return `${days}日`;
}

/**
 * 評価結果を反映して新しい WordProgress を返す（SM-2ベース）
 */
export function calculateNextReview(
  current: WordProgress,
  rating: ReviewRating,
  now: Date = new Date()
): WordProgress {
  const prevEf = current.easeFactor ?? SRS_CONFIG.INITIAL_EASE_FACTOR;
  const prevReps = current.repetitions ?? 0;
  const prevConsecutive = current.consecutiveCorrect ?? 0;
  const nowIso = now.toISOString();

  if (rating === 'again') {
    const nextEf = Math.max(
      SRS_CONFIG.MIN_EASE_FACTOR,
      Number((prevEf - 0.2).toFixed(2))
    );
    const nextReviewDate = new Date(
      now.getTime() + SRS_CONFIG.AGAIN_INTERVAL_MINUTES * 60 * 1000
    );

    return {
      ...current,
      memorized: false, // 不正解・もう一度なら「学習中」に戻す
      intervalDays: 0,
      easeFactor: nextEf,
      repetitions: 0,
      consecutiveCorrect: 0,
      lastReviewedAt: nowIso,
      nextReviewAt: nextReviewDate.toISOString(),
      lastRating: 'again',
    };
  }

  const nextIntervalDays = computeNextIntervalDays(current, rating);
  const nextReps = prevReps + 1;
  const nextConsecutive = prevConsecutive + 1;

  let nextEf = prevEf;
  if (rating === 'hard') {
    nextEf = Math.max(
      SRS_CONFIG.MIN_EASE_FACTOR,
      Number((prevEf - 0.15).toFixed(2))
    );
  } else if (rating === 'easy') {
    nextEf = Number((prevEf + 0.15).toFixed(2));
  }

  const nextReviewDate = new Date(
    now.getTime() + nextIntervalDays * 24 * 60 * 60 * 1000
  );

  // 定着判定: 1回の評価では定着にせず、復習間隔が基準以上または連続正解がN回以上に達した場合に自動で定着にする
  // 既に定着済みだった単語が hard/good/easy で復習された場合は定着を維持する
  const reachedMemorizedThreshold =
    nextIntervalDays >= SRS_CONFIG.MEMORIZED_INTERVAL_DAYS ||
    nextConsecutive >= SRS_CONFIG.MEMORIZED_CONSECUTIVE_CORRECT;

  const memorized = current.memorized || reachedMemorizedThreshold;

  return {
    ...current,
    memorized,
    intervalDays: nextIntervalDays,
    easeFactor: nextEf,
    repetitions: nextReps,
    consecutiveCorrect: nextConsecutive,
    lastReviewedAt: nowIso,
    nextReviewAt: nextReviewDate.toISOString(),
    lastRating: rating,
  };
}

/**
 * 「今日の復習」の対象単語かどうかを判定する
 * - 復習期日（nextReviewAt）が到来している単語
 * - 学習中（learning）で、まだ1日以上先の復習予定日が設定されていない単語（もう一度評価中・マイグレーション直後・クイズ不正解直後を含む）
 */
export function isWordDueForReview(
  progress?: WordProgress | null,
  now: Date = new Date()
): boolean {
  if (!progress) return false;
  const status = getLearningStatus(progress);
  if (status === 'unstudied') return false;

  // 直近が「もう一度 (again)」または intervalDays === 0 の学習中単語は当日復習対象
  if (status === 'learning' && (progress.lastRating === 'again' || (progress.intervalDays ?? 0) === 0)) {
    return true;
  }

  if (progress.nextReviewAt) {
    const dueTime = new Date(progress.nextReviewAt).getTime();
    if (!Number.isNaN(dueTime)) {
      return dueTime <= now.getTime();
    }
  }

  // nextReviewAt が未設定の学習中単語は復習対象
  return status === 'learning';
}
