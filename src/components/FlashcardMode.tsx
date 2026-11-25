import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Volume2,
  RotateCw,
  Check,
  Shuffle,
  Filter,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  RotateCcw,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import {
  VocabWord,
  WordProgress,
  ReviewRating,
  getLearningStatus,
  LearningStatus,
  SectionKey,
  filterWordsBySection,
  formatWordNumber,
} from '../types/vocab';
import { speakEnglish } from '../utils/speech';
import {
  getPreviewIntervalLabel,
  isWordDueForReview,
} from '../utils/srs';
import { highlightTargetWord } from '../utils/highlightWord';
import { SectionSelector } from './SectionSelector';

interface FlashcardModeProps {
  words: VocabWord[];
  selectedSection: SectionKey;
  onChangeSection: (section: SectionKey) => void;
  getWordProgress: (wordId: number) => WordProgress;
  onRateWord: (wordId: number, rating: ReviewRating) => void;
}

function renderStatusBadge(status: LearningStatus) {
  switch (status) {
    case 'memorized':
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#16A34A] text-[#F1F5F9] border border-[#16A34A] flex items-center gap-1 shadow-sm">
          <Check className="w-3 h-3 stroke-[2.5]" /> 定着（覚えた）
        </span>
      );
    case 'learning':
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#F59E0B] text-[#0F172A] border border-[#F59E0B] flex items-center gap-1 shadow-sm">
          学習中
        </span>
      );
    case 'unstudied':
    default:
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#0F172A] text-[#CBD5E1] border border-[#475569]">
          未学習
        </span>
      );
  }
}

const RATING_BUTTONS: {
  rating: ReviewRating;
  label: string;
  style: string;
  subTextStyle: string;
}[] = [
  {
    rating: 'again',
    label: 'もう一度',
    style:
      'bg-[#1E293B] hover:bg-[#EF4444]/15 border-[#EF4444] text-[#FCA5A5]',
    subTextStyle: 'text-[#FECACA]',
  },
  {
    rating: 'hard',
    label: '難しい',
    style:
      'bg-[#1E293B] hover:bg-[#F59E0B]/15 border-[#F59E0B] text-[#FCD34D]',
    subTextStyle: 'text-[#FDE68A]',
  },
  {
    rating: 'good',
    label: '普通',
    style:
      'bg-[#1E293B] hover:bg-[#60A5FA]/15 border-[#60A5FA] text-[#93C5FD]',
    subTextStyle: 'text-[#BFDBFE]',
  },
  {
    rating: 'easy',
    label: '簡単',
    style:
      'bg-[#1E293B] hover:bg-[#22C55E]/15 border-[#22C55E] text-[#86EFAC]',
    subTextStyle: 'text-[#BBF7D0]',
  },
];

export const FlashcardMode: React.FC<FlashcardModeProps> = ({
  words,
  selectedSection,
  onChangeSection,
  getWordProgress,
  onRateWord,
}) => {
  const [onlyUnmemorized, setOnlyUnmemorized] = useState(false);
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [reviewQueueIds, setReviewQueueIds] = useState<number[]>([]);
  const [shuffledIds, setShuffledIds] = useState<number[]>(() =>
    words.map((w) => w.id)
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [speakingTarget, setSpeakingTarget] = useState<'word' | 'example' | null>(
    null
  );
  const [isSessionComplete, setIsSessionComplete] = useState(false);

  // 左右スワイプ用 state & ref
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const [swipeDeltaX, setSwipeDeltaX] = useState(0);

  // 全単語から「今日の復習」対象語（復習期日到来＋学習中）を算出
  const dueReviewWords = useMemo(
    () => words.filter((w) => isWordDueForReview(getWordProgress(w.id))),
    [words, getWordProgress]
  );

  // セクションで絞った単語リスト
  const sectionWords = useMemo(
    () => filterWordsBySection(words, selectedSection),
    [words, selectedSection]
  );

  // セクション変更時は通常モードに戻し、インデックスと裏面状態をリセット
  const handleSelectSection = (section: SectionKey) => {
    setIsReviewMode(false);
    onChangeSection(section);
    setShuffledIds(words.map((w) => w.id));
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsSessionComplete(false);
  };

  // 「今日の復習」を開始
  const handleStartTodayReview = () => {
    if (dueReviewWords.length === 0) return;
    setReviewQueueIds(dueReviewWords.map((w) => w.id));
    setIsReviewMode(true);
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsSessionComplete(false);
  };

  // 通常範囲学習に戻る
  const handleExitReviewMode = () => {
    setIsReviewMode(false);
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsSessionComplete(false);
  };

  // フィルタリングされた単語デッキを構築
  const deck = useMemo(() => {
    if (isReviewMode) {
      const wordMap = new Map(words.map((w) => [w.id, w]));
      return reviewQueueIds
        .map((id) => wordMap.get(id))
        .filter((w): w is VocabWord => Boolean(w));
    }

    const wordMap = new Map(sectionWords.map((w) => [w.id, w]));
    const ordered = shuffledIds
      .map((id) => wordMap.get(id))
      .filter((w): w is VocabWord => Boolean(w));

    if (!onlyUnmemorized) return ordered;
    return ordered.filter((w) => !getWordProgress(w.id).memorized);
  }, [
    isReviewMode,
    reviewQueueIds,
    words,
    sectionWords,
    shuffledIds,
    onlyUnmemorized,
    getWordProgress,
  ]);

  useEffect(() => {
    if (deck.length > 0 && currentIndex >= deck.length) {
      setCurrentIndex(0);
    }
  }, [deck.length, currentIndex]);

  const currentWord = deck[currentIndex] ?? null;
  const currentProgress = currentWord
    ? getWordProgress(currentWord.id)
    : null;
  const learningStatus = getLearningStatus(currentProgress);

  const handlePlayWord = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    setSpeakingTarget('word');
    speakEnglish(text, {
      rate: 0.9,
      onEnd: () => setSpeakingTarget(null),
      onError: () => setSpeakingTarget(null),
    });
  };

  const handlePlayExample = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    setSpeakingTarget('example');
    speakEnglish(text, {
      rate: 0.95,
      onEnd: () => setSpeakingTarget(null),
      onError: () => setSpeakingTarget(null),
    });
  };

  const handleShuffle = () => {
    if (isReviewMode) {
      const nextQueue = [...reviewQueueIds];
      for (let i = nextQueue.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [nextQueue[i], nextQueue[j]] = [nextQueue[j], nextQueue[i]];
      }
      setReviewQueueIds(nextQueue);
    } else {
      const nextIds = [...shuffledIds];
      for (let i = nextIds.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [nextIds[i], nextIds[j]] = [nextIds[j], nextIds[i]];
      }
      setShuffledIds(nextIds);
    }
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsSessionComplete(false);
  };

  const handleToggleFilter = () => {
    setOnlyUnmemorized((prev) => !prev);
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsSessionComplete(false);
  };

  const handleRate = (rating: ReviewRating) => {
    if (!currentWord) return;

    const currentProgressBefore = getWordProgress(currentWord.id);
    onRateWord(currentWord.id, rating);
    setIsFlipped(false);
    setSwipeDeltaX(0);

    if (isReviewMode) {
      if (rating === 'again') {
        // 「もう一度」の場合はデッキ末尾に回して再確認できるようにする
        if (reviewQueueIds.length <= 1) {
          setCurrentIndex(0);
        } else {
          setReviewQueueIds((prev) => {
            const next = [...prev];
            const [removed] = next.splice(currentIndex, 1);
            next.push(removed);
            return next;
          });
        }
      } else {
        // 「難しい / 普通 / 簡単」の場合は今回の復習キューから完了として除外
        if (reviewQueueIds.length <= 1) {
          setReviewQueueIds([]);
          setIsSessionComplete(true);
        } else {
          setReviewQueueIds((prev) => prev.filter((_, idx) => idx !== currentIndex));
          if (currentIndex >= reviewQueueIds.length - 1) {
            setCurrentIndex(0);
          }
        }
      }
      return;
    }

    const isLastCard = currentIndex >= deck.length - 1;
    if (isLastCard) {
      setIsSessionComplete(true);
    } else {
      // 未定着のみフィルタ中に、今回の評価で定着になった場合は配列から要素が消えるためインデックス据え置き
      const willBecomeMemorized =
        rating !== 'again' &&
        (currentProgressBefore.memorized ||
          (currentProgressBefore.consecutiveCorrect ?? 0) + 1 >= 5);
      if (onlyUnmemorized && willBecomeMemorized) {
        // 同じインデックスが次の単語を指す
      } else {
        setCurrentIndex((prev) => prev + 1);
      }
    }
  };

  const handlePrevCard = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleNextCard = () => {
    if (currentIndex < deck.length - 1) {
      setIsFlipped(false);
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsSessionComplete(true);
    }
  };

  const handleRestartSession = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsSessionComplete(false);
  };

  // タッチスワイプハンドラ（左=もう一度、右=普通）
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (!touch) return;
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    setSwipeDeltaX(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const touch = e.touches[0];
    if (!touch) return;
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    if (Math.abs(dx) > Math.abs(dy)) {
      setSwipeDeltaX(dx);
    }
  };

  const handleTouchEnd = () => {
    if (!touchStartRef.current) return;
    const dx = swipeDeltaX;
    touchStartRef.current = null;
    setSwipeDeltaX(0);

    const SWIPE_THRESHOLD = 65;
    if (dx <= -SWIPE_THRESHOLD) {
      handleRate('again');
    } else if (dx >= SWIPE_THRESHOLD) {
      handleRate('good');
    }
  };

  // 今日の復習バー
  const todayReviewBanner = (
    <div className="w-full shrink-0">
      {isReviewMode ? (
        <div className="flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl bg-[#1E293B] border border-[#FBBF24]/60 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-[#FBBF24]">
            <Clock className="w-3.5 h-3.5 shrink-0" />
            <span>今日の復習モード（残り {deck.length}語）</span>
          </div>
          <button
            type="button"
            onClick={handleExitReviewMode}
            className="px-2 py-0.5 rounded-md bg-[#0F172A] text-[#CBD5E1] hover:text-[#F1F5F9] border border-[#334155] text-[11px] font-semibold cursor-pointer focus:outline-none"
          >
            範囲学習へ戻る
          </button>
        </div>
      ) : dueReviewWords.length > 0 ? (
        <button
          type="button"
          onClick={handleStartTodayReview}
          className="w-full flex items-center justify-between px-3 py-1.5 rounded-xl bg-[#1E293B] hover:bg-[#1E293B]/80 border border-[#FBBF24]/60 text-xs transition cursor-pointer focus:outline-none group"
        >
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#FBBF24] shrink-0" />
            <span className="font-bold text-[#F1F5F9]">
              今日の復習{' '}
              <span className="text-[#FBBF24]">{dueReviewWords.length}語</span>
            </span>
          </div>
          <span className="text-[11px] font-bold text-[#60A5FA] group-hover:underline flex items-center gap-0.5">
            復習を始める
            <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </button>
      ) : (
        <div className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1E293B]/70 border border-[#334155] text-xs text-[#CBD5E1]">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A] shrink-0" />
          <span className="font-semibold">今日の復習は完了しました</span>
        </div>
      )}
    </div>
  );

  const sectionBar = (
    <SectionSelector
      selectedSection={selectedSection}
      onSelectSection={handleSelectSection}
    />
  );

  if (deck.length === 0 || isSessionComplete) {
    const memorizedTotal = sectionWords.filter(
      (w) => getWordProgress(w.id).memorized
    ).length;

    return (
      <div className="flex flex-col flex-1 min-h-0 px-4 py-3 justify-between gap-3 overflow-y-auto no-scrollbar">
        <div className="space-y-2">
          {todayReviewBanner}
          {!isReviewMode && sectionBar}
        </div>

        <div className="flex flex-col items-center justify-center flex-1 px-4 py-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#1E293B] border border-[#334155] flex items-center justify-center mb-4 shadow-lg">
            <Sparkles className="w-8 h-8 text-[#FBBF24]" />
          </div>
          <h2 className="text-xl font-bold text-[#F1F5F9] mb-2">
            {isReviewMode
              ? '今日の復習は完了しました'
              : deck.length === 0
              ? 'この範囲に未定着の単語はありません！'
              : 'この範囲のカード学習が完了しました！'}
          </h2>
          <p className="text-sm text-[#CBD5E1] mb-6 max-w-xs">
            {isReviewMode ? (
              '復習期日が来た単語と学習中の単語をすべて確認しました。'
            ) : (
              <>
                選択範囲の{' '}
                <span className="text-[#22C55E] font-bold">
                  {memorizedTotal} / {sectionWords.length} 語
                </span>{' '}
                が「定着（覚えた）」状態です。
              </>
            )}
          </p>

          <div className="flex flex-col w-full gap-3 max-w-xs">
            {isReviewMode ? (
              <button
                type="button"
                onClick={handleExitReviewMode}
                className="w-full py-3.5 px-4 rounded-xl bg-[#60A5FA] hover:bg-blue-300 active:scale-[0.99] text-[#0F172A] font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#60A5FA]/20 transition cursor-pointer focus:outline-none"
              >
                通常範囲のカード学習に戻る
              </button>
            ) : (
              <>
                {deck.length > 0 && (
                  <button
                    type="button"
                    onClick={handleRestartSession}
                    className="w-full py-3.5 px-4 rounded-xl bg-[#60A5FA] hover:bg-blue-300 active:scale-[0.99] text-[#0F172A] font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#60A5FA]/20 transition cursor-pointer focus:outline-none"
                  >
                    <RotateCcw className="w-4 h-4 stroke-[2.5]" />
                    もう一度最初からめくる
                  </button>
                )}
                {onlyUnmemorized && (
                  <button
                    type="button"
                    onClick={() => {
                      setOnlyUnmemorized(false);
                      setCurrentIndex(0);
                      setIsFlipped(false);
                      setIsSessionComplete(false);
                    }}
                    className="w-full py-3.5 px-4 rounded-xl bg-[#1E293B] hover:bg-slate-700 text-[#F1F5F9] font-semibold text-sm flex items-center justify-center gap-2 border border-[#334155] transition cursor-pointer focus:outline-none"
                  >
                    選択範囲の全 {sectionWords.length} 語を表示する
                  </button>
                )}
              </>
            )}
          </div>
        </div>
        <div />
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 min-h-0 px-4 pt-2.5 pb-2.5 gap-2 overflow-hidden">
      {/* 上部コントロールバー（今日の復習・セクション選択・フィルタ・シャッフル・進捗） */}
      <div className="flex flex-col gap-1.5 shrink-0">
        {todayReviewBanner}
        {!isReviewMode && sectionBar}

        <div className="flex items-center justify-between">
          {!isReviewMode ? (
            <button
              type="button"
              onClick={handleToggleFilter}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold border transition cursor-pointer focus:outline-none ${
                onlyUnmemorized
                  ? 'bg-[#FBBF24] text-[#0F172A] border-[#FBBF24]'
                  : 'bg-[#1E293B] text-[#F1F5F9] border-[#334155] hover:border-[#60A5FA]'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              {onlyUnmemorized ? '未定着のみ表示中' : 'すべての単語'}
            </button>
          ) : (
            <span className="text-xs font-semibold text-[#CBD5E1]">
              復習キュー出題中
            </span>
          )}

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#CBD5E1]">
              {currentIndex + 1} / {deck.length}
            </span>
            <button
              type="button"
              onClick={handleShuffle}
              title="シャッフル"
              className="p-1.5 rounded-lg bg-[#1E293B] hover:border-[#60A5FA] text-[#F1F5F9] border border-[#334155] transition cursor-pointer focus:outline-none"
            >
              <Shuffle className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* プログレスバー */}
        <div className="w-full h-1.5 bg-[#1E293B] rounded-full overflow-hidden border border-[#334155]/60">
          <div
            className="h-full bg-[#60A5FA] transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / deck.length) * 100}%` }}
          />
        </div>
      </div>

      {/* メイン3Dフラッシュカード（残りの縦領域をすべて使用・左右スワイプ対応） */}
      <div className="flex-1 min-h-0 flex flex-col relative">
        {Math.abs(swipeDeltaX) > 30 && (
          <div
            className={`pointer-events-none absolute top-3 z-30 px-3 py-1 rounded-full text-xs font-bold shadow-md ${
              swipeDeltaX < 0
                ? 'left-3 bg-[#EF4444] text-[#F1F5F9]'
                : 'right-3 bg-[#60A5FA] text-[#0F172A]'
            }`}
          >
            {swipeDeltaX < 0 ? '◀ もう一度' : '普通 ▶'}
          </div>
        )}

        <div
          onClick={() => setIsFlipped((prev) => !prev)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setIsFlipped((prev) => !prev);
            }
          }}
          style={{
            transform:
              Math.abs(swipeDeltaX) > 10
                ? `translateX(${Math.max(-90, Math.min(90, swipeDeltaX * 0.45))}px) rotate(${Math.max(-6, Math.min(6, swipeDeltaX * 0.03))}deg)`
                : undefined,
          }}
          className="relative w-full flex-1 min-h-[210px] perspective-1000 cursor-pointer select-none focus:outline-none transition-transform duration-150"
        >
          <div
            className={`relative w-full h-full duration-500 transform-style-3d transition-transform ${
              isFlipped ? 'rotate-y-180' : ''
            }`}
          >
            {/* 表面 (Front): 単語番号・品詞・英単語・発音記号・音声ボタン */}
            <div className="absolute inset-0 w-full h-full backface-hidden rounded-3xl bg-[#1E293B] border border-[#334155] shadow-2xl p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-[#0F172A] text-[#CBD5E1] border border-[#334155]">
                    {formatWordNumber(currentWord.id)}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#0F172A] text-[#60A5FA] border border-[#334155]">
                    {currentWord.pos}
                  </span>
                </div>
                {renderStatusBadge(learningStatus)}
              </div>

              <div className="flex flex-col items-center text-center my-auto py-2">
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#F1F5F9] mb-2">
                  {currentWord.word}
                </h2>
                <p className="text-base text-[#CBD5E1] font-ipa mb-4">
                  {currentWord.phonetic}
                </p>

                <button
                  type="button"
                  onClick={(e) => handlePlayWord(e, currentWord.word)}
                  aria-label="単語の発音を聞く"
                  className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm transition-all shadow-lg cursor-pointer focus:outline-none ${
                    speakingTarget === 'word'
                      ? 'bg-[#60A5FA] text-[#0F172A] ring-4 ring-[#60A5FA]/30 scale-105'
                      : 'bg-[#60A5FA] hover:bg-blue-300 text-[#0F172A] active:scale-95 shadow-[#60A5FA]/20'
                  }`}
                >
                  <Volume2
                    className={`w-5 h-5 stroke-[2.2] ${
                      speakingTarget === 'word' ? 'animate-pulse' : ''
                    }`}
                  />
                  <span>発音を聞く</span>
                </button>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-xs text-[#CBD5E1] pt-2 border-t border-[#334155]">
                <RotateCw className="w-3.5 h-3.5 text-[#60A5FA]" />
                <span>カードをタップして意味・例文を確認</span>
              </div>
            </div>

            {/* 裏面 (Back): 日本語の意味・英語例文・例文訳 */}
            <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-3xl bg-[#1E293B] border-2 border-[#60A5FA]/60 shadow-2xl p-5 flex flex-col justify-between overflow-y-auto no-scrollbar">
              <div className="flex items-center justify-between border-b border-[#334155] pb-2.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-mono text-[#CBD5E1]">
                    {formatWordNumber(currentWord.id)}
                  </span>
                  <span className="text-lg font-bold text-[#F1F5F9]">
                    {currentWord.word}
                  </span>
                  <span className="text-xs text-[#CBD5E1] font-ipa">
                    {currentWord.phonetic}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={(e) => handlePlayWord(e, currentWord.word)}
                  aria-label="単語の発音を聞く"
                  className="p-2 rounded-xl bg-[#60A5FA] hover:bg-blue-300 text-[#0F172A] transition cursor-pointer focus:outline-none"
                >
                  <Volume2 className="w-4 h-4 stroke-[2.2]" />
                </button>
              </div>

              <div className="my-auto py-2 space-y-2.5">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#60A5FA] block mb-1">
                    日本語の意味 ({currentWord.pos})
                  </span>
                  <p className="text-xl font-bold text-[#F1F5F9] leading-snug">
                    {currentWord.meaning}
                  </p>
                </div>

                <div className="bg-[#0F172A] rounded-2xl p-3 border border-[#334155] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#CBD5E1]">
                      Example Sentence
                    </span>
                    <button
                      type="button"
                      onClick={(e) =>
                        handlePlayExample(e, currentWord.exampleSentence)
                      }
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer focus:outline-none ${
                        speakingTarget === 'example'
                          ? 'bg-[#60A5FA] text-[#0F172A]'
                          : 'bg-[#60A5FA] hover:bg-blue-300 text-[#0F172A]'
                      }`}
                    >
                      <Volume2 className="w-3.5 h-3.5 stroke-[2.2]" />
                      <span>例文再生</span>
                    </button>
                  </div>
                  <p className="text-sm text-[#F1F5F9] leading-relaxed">
                    {highlightTargetWord(
                      currentWord.exampleSentence,
                      currentWord.word
                    )}
                  </p>
                  <p className="text-xs text-[#CBD5E1] leading-relaxed pt-1 border-t border-[#334155]">
                    {currentWord.exampleTranslation}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-xs text-[#CBD5E1] pt-2 border-t border-[#334155]">
                <RotateCw className="w-3.5 h-3.5 text-[#60A5FA]" />
                <span>タップして表面に戻る</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 下部アクションボタン：4段階評価（もう一度 / 難しい / 普通 / 簡単） */}
      <div className="space-y-1 shrink-0">
        <div className="grid grid-cols-4 gap-2">
          {RATING_BUTTONS.map(({ rating, label, style, subTextStyle }) => {
            const nextLabel = getPreviewIntervalLabel(currentProgress, rating);
            return (
              <button
                key={rating}
                type="button"
                onClick={() => handleRate(rating)}
                className={`flex flex-col items-center justify-center min-h-[58px] py-2 px-1 rounded-2xl border-2 font-bold transition active:scale-[0.97] cursor-pointer focus:outline-none ${style}`}
              >
                <span className="text-xs sm:text-sm leading-tight">{label}</span>
                <span className={`text-[10px] font-semibold mt-0.5 ${subTextStyle}`}>
                  {nextLabel}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between pt-0.5">
          <button
            type="button"
            onClick={handlePrevCard}
            disabled={currentIndex === 0}
            className="flex items-center gap-1 text-xs font-semibold text-[#CBD5E1] hover:text-[#F1F5F9] disabled:text-[#94A3B8] disabled:pointer-events-none px-2 py-1.5 min-h-[36px] cursor-pointer focus:outline-none"
          >
            <ChevronLeft className="w-4 h-4" />
            前の単語
          </button>
          <button
            type="button"
            onClick={handleNextCard}
            className="flex items-center gap-1 text-xs font-semibold text-[#CBD5E1] hover:text-[#F1F5F9] px-2 py-1.5 min-h-[36px] cursor-pointer focus:outline-none"
          >
            次の単語
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
