export interface VocabWord {
  id: number;
  rank: number;
  word: string;
  pos: string;
  phonetic: string;
  meaning: string;
  exampleSentence: string;
  exampleTranslation: string;
}

export type SectionKey =
  | '1-40'
  | '41-80'
  | '81-120'
  | '121-160'
  | '161-200'
  | '201-240'
  | '241-280'
  | '281-320'
  | '321-360'
  | '361-400'
  | '401-440'
  | '441-480'
  | '481-520'
  | '521-560'
  | '561-600'
  | '601-640'
  | '641-680'
  | '681-720'
  | '721-760'
  | '761-800'
  | '801-840'
  | '841-880'
  | '881-920'
  | '921-956'
  | 'all';

export interface SectionOption {
  key: SectionKey;
  label: string;
  shortLabel: string;
  minId: number;
  maxId: number;
}

export const SECTION_OPTIONS: SectionOption[] = [
  { key: '1-40', label: 'No.0001〜0040 (40語)', shortLabel: '1〜40', minId: 1, maxId: 40 },
  { key: '41-80', label: 'No.0041〜0080 (40語)', shortLabel: '41〜80', minId: 41, maxId: 80 },
  { key: '81-120', label: 'No.0081〜0120 (40語)', shortLabel: '81〜120', minId: 81, maxId: 120 },
  { key: '121-160', label: 'No.0121〜0160 (40語)', shortLabel: '121〜160', minId: 121, maxId: 160 },
  { key: '161-200', label: 'No.0161〜0200 (40語)', shortLabel: '161〜200', minId: 161, maxId: 200 },
  { key: '201-240', label: 'No.0201〜0240 (40語)', shortLabel: '201〜240', minId: 201, maxId: 240 },
  { key: '241-280', label: 'No.0241〜0280 (40語)', shortLabel: '241〜280', minId: 241, maxId: 280 },
  { key: '281-320', label: 'No.0281〜0320 (40語)', shortLabel: '281〜320', minId: 281, maxId: 320 },
  { key: '321-360', label: 'No.0321〜0360 (40語)', shortLabel: '321〜360', minId: 321, maxId: 360 },
  { key: '361-400', label: 'No.0361〜0400 (40語)', shortLabel: '361〜400', minId: 361, maxId: 400 },
  { key: '401-440', label: 'No.0401〜0440 (40語)', shortLabel: '401〜440', minId: 401, maxId: 440 },
  { key: '441-480', label: 'No.0441〜0480 (40語)', shortLabel: '441〜480', minId: 441, maxId: 480 },
  { key: '481-520', label: 'No.0481〜0520 (40語)', shortLabel: '481〜520', minId: 481, maxId: 520 },
  { key: '521-560', label: 'No.0521〜0560 (40語)', shortLabel: '521〜560', minId: 521, maxId: 560 },
  { key: '561-600', label: 'No.0561〜0600 (40語)', shortLabel: '561〜600', minId: 561, maxId: 600 },
  { key: '601-640', label: 'No.0601〜0640 (40語)', shortLabel: '601〜640', minId: 601, maxId: 640 },
  { key: '641-680', label: 'No.0641〜0680 (40語)', shortLabel: '641〜680', minId: 641, maxId: 680 },
  { key: '681-720', label: 'No.0681〜0720 (40語)', shortLabel: '681〜720', minId: 681, maxId: 720 },
  { key: '721-760', label: 'No.0721〜0760 (40語)', shortLabel: '721〜760', minId: 721, maxId: 760 },
  { key: '761-800', label: 'No.0761〜0800 (40語)', shortLabel: '761〜800', minId: 761, maxId: 800 },
  { key: '801-840', label: 'No.0801〜0840 (40語)', shortLabel: '801〜840', minId: 801, maxId: 840 },
  { key: '841-880', label: 'No.0841〜0880 (40語)', shortLabel: '841〜880', minId: 841, maxId: 880 },
  { key: '881-920', label: 'No.0881〜0920 (40語)', shortLabel: '881〜920', minId: 881, maxId: 920 },
  { key: '921-956', label: 'No.0921〜0956 (36語)', shortLabel: '921〜956', minId: 921, maxId: 956 },
  { key: 'all', label: 'すべて (No.0001〜0956)', shortLabel: 'すべて', minId: 1, maxId: 956 },
];

export function filterWordsBySection(
  words: VocabWord[],
  section: SectionKey
): VocabWord[] {
  const found = SECTION_OPTIONS.find((s) => s.key === section);
  if (!found || section === 'all') return words;
  return words.filter((w) => w.id >= found.minId && w.id <= found.maxId);
}

export function formatWordNumber(id: number): string {
  return `No.${String(id).padStart(4, '0')}`;
}

export type ReviewRating = 'again' | 'hard' | 'good' | 'easy';

export interface WordProgress {
  memorized: boolean;
  correctCount: number;
  incorrectCount: number;
  lastReviewedAt?: string;
  intervalDays?: number;
  easeFactor?: number;
  repetitions?: number;
  consecutiveCorrect?: number;
  nextReviewAt?: string;
  lastRating?: ReviewRating;
}

export type LearningStatus = 'unstudied' | 'learning' | 'memorized';

export function getLearningStatus(progress?: WordProgress | null): LearningStatus {
  if (!progress) return 'unstudied';
  if (progress.memorized) return 'memorized';
  if (
    Boolean(progress.lastReviewedAt) ||
    progress.correctCount > 0 ||
    progress.incorrectCount > 0 ||
    (progress.repetitions ?? 0) > 0 ||
    Boolean(progress.lastRating)
  ) {
    return 'learning';
  }
  return 'unstudied';
}

export interface StudyStats {
  wordProgress: Record<number, WordProgress>;
  totalQuizAnswered: number;
  totalQuizCorrect: number;
  currentStreak: number;
  bestStreak: number;
}

export type AppMode = 'flashcard' | 'quiz' | 'wordlist';
