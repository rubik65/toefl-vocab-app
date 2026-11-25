import { useState, useEffect, useCallback } from 'react';
import { StudyStats, WordProgress, ReviewRating } from '../types/vocab';
import {
  DEFAULT_WORD_PROGRESS,
  SRS_CONFIG,
  migrateWordProgress,
  calculateNextReview,
} from '../utils/srs';

const STORAGE_KEY = 'toefl_vocab_study_stats_v1';

const initialStats: StudyStats = {
  wordProgress: {},
  totalQuizAnswered: 0,
  totalQuizCorrect: 0,
  currentStreak: 0,
  bestStreak: 0,
};

function loadInitialStats(): StudyStats {
  if (typeof window === 'undefined') return initialStats;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialStats;
    const parsed = JSON.parse(raw) as Partial<StudyStats>;

    // 保存済みの既存進捗を壊さずに SRS フィールドを補完するマイグレーション
    const rawWordProgress = parsed.wordProgress ?? {};
    const migratedWordProgress: Record<number, WordProgress> = {};
    for (const [key, value] of Object.entries(rawWordProgress)) {
      const id = Number(key);
      if (!Number.isNaN(id)) {
        migratedWordProgress[id] = migrateWordProgress(value);
      }
    }

    return {
      wordProgress: migratedWordProgress,
      totalQuizAnswered: parsed.totalQuizAnswered ?? 0,
      totalQuizCorrect: parsed.totalQuizCorrect ?? 0,
      currentStreak: parsed.currentStreak ?? 0,
      bestStreak: parsed.bestStreak ?? 0,
    };
  } catch (e) {
    console.error('Failed to load progress from localStorage:', e);
    return initialStats;
  }
}

export function useProgress() {
  const [stats, setStats] = useState<StudyStats>(loadInitialStats);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    } catch (e) {
      console.error('Failed to save progress to localStorage:', e);
    }
  }, [stats]);

  const getWordProgress = useCallback(
    (wordId: number): WordProgress => {
      return stats.wordProgress[wordId] ?? DEFAULT_WORD_PROGRESS;
    },
    [stats.wordProgress]
  );

  // カード学習の4段階評価（もう一度 / 難しい / 普通 / 簡単）をSM-2スケジューラに反映
  const rateWord = useCallback((wordId: number, rating: ReviewRating) => {
    setStats((prev) => {
      const existing = migrateWordProgress(prev.wordProgress[wordId]);
      const updated = calculateNextReview(existing, rating);
      return {
        ...prev,
        wordProgress: {
          ...prev.wordProgress,
          [wordId]: updated,
        },
      };
    });
  }, []);

  // 手動での定着トグル（一覧画面やクイズ解説パネル用）
  const setWordMemorized = useCallback((wordId: number, memorized: boolean) => {
    setStats((prev) => {
      const existing = migrateWordProgress(prev.wordProgress[wordId]);
      const now = new Date();
      const nextIntervalDays = memorized
        ? Math.max(existing.intervalDays ?? 0, SRS_CONFIG.MEMORIZED_INTERVAL_DAYS)
        : 1;
      const nextReviewAt = new Date(
        now.getTime() + (memorized ? nextIntervalDays * 24 * 60 * 60 * 1000 : 0)
      ).toISOString();

      return {
        ...prev,
        wordProgress: {
          ...prev.wordProgress,
          [wordId]: {
            ...existing,
            memorized,
            intervalDays: nextIntervalDays,
            consecutiveCorrect: memorized
              ? Math.max(
                  existing.consecutiveCorrect ?? 0,
                  SRS_CONFIG.MEMORIZED_CONSECUTIVE_CORRECT
                )
              : 0,
            lastReviewedAt: now.toISOString(),
            nextReviewAt,
          },
        },
      };
    });
  }, []);

  // クイズの正解/不正解も同じスケジューラに反映（不正解なら「学習中」に戻す）
  const recordQuizResult = useCallback((wordId: number, isCorrect: boolean) => {
    setStats((prev) => {
      const existing = migrateWordProgress(prev.wordProgress[wordId]);
      const scheduled = calculateNextReview(
        existing,
        isCorrect ? 'good' : 'again'
      );
      const newStreak = isCorrect ? prev.currentStreak + 1 : 0;
      const newBestStreak = Math.max(prev.bestStreak, newStreak);

      return {
        ...prev,
        totalQuizAnswered: prev.totalQuizAnswered + 1,
        totalQuizCorrect: prev.totalQuizCorrect + (isCorrect ? 1 : 0),
        currentStreak: newStreak,
        bestStreak: newBestStreak,
        wordProgress: {
          ...prev.wordProgress,
          [wordId]: {
            ...scheduled,
            correctCount: existing.correctCount + (isCorrect ? 1 : 0),
            incorrectCount: existing.incorrectCount + (isCorrect ? 0 : 1),
          },
        },
      };
    });
  }, []);

  const resetAllProgress = useCallback(() => {
    setStats(initialStats);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error('Failed to clear localStorage:', e);
    }
  }, []);

  return {
    stats,
    getWordProgress,
    rateWord,
    setWordMemorized,
    recordQuizResult,
    resetAllProgress,
  };
}
