import React, { useState, useMemo, useCallback } from 'react';
import {
  Volume2,
  Check,
  X,
  ArrowRight,
  Trophy,
  RotateCcw,
  Flame,
  BookmarkCheck,
  Filter,
  Sparkles,
} from 'lucide-react';
import {
  VocabWord,
  WordProgress,
  getLearningStatus,
  SectionKey,
  filterWordsBySection,
  formatWordNumber,
} from '../types/vocab';
import { speakEnglish } from '../utils/speech';
import { generateQuizQuestions, QuizQuestion } from '../utils/quizGenerator';
import { highlightTargetWord } from '../utils/highlightWord';
import { SectionSelector } from './SectionSelector';

interface QuizModeProps {
  words: VocabWord[];
  selectedSection: SectionKey;
  onChangeSection: (section: SectionKey) => void;
  currentStreak: number;
  getWordProgress: (wordId: number) => WordProgress;
  onRecordResult: (wordId: number, isCorrect: boolean) => void;
  onSetMemorized: (wordId: number, memorized: boolean) => void;
}

export const QuizMode: React.FC<QuizModeProps> = ({
  words,
  selectedSection,
  onChangeSection,
  currentStreak,
  getWordProgress,
  onRecordResult,
  onSetMemorized,
}) => {
  const [onlyUnmemorized, setOnlyUnmemorized] = useState<boolean>(false);
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [questions, setQuestions] = useState<QuizQuestion[]>(() => {
    const sectionWords = filterWordsBySection(words, selectedSection);
    return generateQuizQuestions(sectionWords, words, 10);
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedChoiceId, setSelectedChoiceId] = useState<number | null>(null);
  const [sessionResults, setSessionResults] = useState<
    { word: VocabWord; isCorrect: boolean }[]
  >([]);
  const [isQuizFinished, setIsQuizFinished] = useState(false);

  const sectionWords = useMemo(
    () => filterWordsBySection(words, selectedSection),
    [words, selectedSection]
  );

  const startQuiz = useCallback(
    (count: number, filterUnmemorized: boolean, section: SectionKey) => {
      const secWords = filterWordsBySection(words, section);
      const candidates = filterUnmemorized
        ? secWords.filter((w) => !getWordProgress(w.id).memorized)
        : secWords;
      setQuestionCount(count);
      setOnlyUnmemorized(filterUnmemorized);
      setQuestions(generateQuizQuestions(candidates, words, count));
      setCurrentIndex(0);
      setSelectedChoiceId(null);
      setSessionResults([]);
      setIsQuizFinished(false);
    },
    [words, getWordProgress]
  );

  const handleSelectSection = (section: SectionKey) => {
    onChangeSection(section);
    const nextSecWords = filterWordsBySection(words, section);
    const nextCount = questionCount > 10 ? nextSecWords.length : 10;
    startQuiz(nextCount, onlyUnmemorized, section);
  };

  const handleToggleFilter = () => {
    const nextFilter = !onlyUnmemorized;
    startQuiz(questionCount, nextFilter, selectedSection);
  };

  const currentQuestion = questions[currentIndex];
  const isAnswered = selectedChoiceId !== null;
  const isCorrect =
    isAnswered && selectedChoiceId === currentQuestion?.targetWord.id;

  const handleSelectChoice = (choiceId: number) => {
    if (isAnswered || !currentQuestion) return;
    setSelectedChoiceId(choiceId);
    const correct = choiceId === currentQuestion.targetWord.id;
    onRecordResult(currentQuestion.targetWord.id, correct);
    setSessionResults((prev) => [
      ...prev,
      { word: currentQuestion.targetWord, isCorrect: correct },
    ]);
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setSelectedChoiceId(null);
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsQuizFinished(true);
    }
  };

  const sessionCorrectCount = useMemo(
    () => sessionResults.filter((r) => r.isCorrect).length,
    [sessionResults]
  );

  const sectionBar = (
    <SectionSelector
      selectedSection={selectedSection}
      onSelectSection={handleSelectSection}
    />
  );

  // 未定着のみフィルター選択時に該当単語が0件の場合
  if (questions.length === 0) {
    return (
      <div className="flex flex-col flex-1 min-h-0 px-4 py-3 justify-between gap-3 overflow-y-auto no-scrollbar">
        <div className="space-y-2">{sectionBar}</div>
        <div className="flex flex-col items-center justify-center flex-1 px-4 py-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#1E293B] border border-[#334155] flex items-center justify-center mb-4 shadow-lg">
            <Sparkles className="w-8 h-8 text-[#FBBF24]" />
          </div>
          <h2 className="text-xl font-bold text-[#F1F5F9] mb-2">
            この範囲に未定着の単語はありません！
          </h2>
          <p className="text-sm text-[#94A3B8] mb-6 max-w-xs">
            選択範囲の全 {sectionWords.length} 語が「定着（覚えた）」状態です。すべての単語を対象に復習テストを行えます。
          </p>
          <button
            type="button"
            onClick={() => startQuiz(questionCount, false, selectedSection)}
            className="w-full max-w-xs py-3.5 px-4 rounded-xl bg-[#60A5FA] hover:bg-blue-300 text-[#0F172A] font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#60A5FA]/20 transition cursor-pointer focus:outline-none"
          >
            選択範囲のすべての単語でテストを開始
          </button>
        </div>
        <div />
      </div>
    );
  }

  if (isQuizFinished) {
    const scorePercent = Math.round(
      (sessionCorrectCount / questions.length) * 100
    );
    return (
      <div className="flex flex-col flex-1 min-h-0 px-4 py-3 space-y-4 overflow-y-auto no-scrollbar">
        {sectionBar}

        <div className="rounded-3xl bg-[#1E293B] border border-[#334155] p-6 text-center shadow-xl">
          <div className="w-14 h-14 rounded-2xl bg-[#FBBF24] text-[#0F172A] flex items-center justify-center mx-auto mb-3 shadow-md">
            <Trophy className="w-7 h-7 text-[#0F172A] stroke-[2.2]" />
          </div>
          <h2 className="text-xl font-bold text-[#F1F5F9]">テスト結果</h2>
          <p className="text-4xl font-extrabold text-[#60A5FA] my-2">
            {sessionCorrectCount}{' '}
            <span className="text-lg text-[#94A3B8] font-normal">
              / {questions.length} 問正解 ({scorePercent}%)
            </span>
          </p>
          <p className="text-xs text-[#94A3B8]">
            {scorePercent >= 80
              ? '素晴らしい成績です！TOEFL本番レベルの語彙力が身についています。'
              : '間違えた単語の例文と音声を確認して復習しましょう。'}
          </p>

          <div className="grid grid-cols-2 gap-2.5 mt-5">
            <button
              type="button"
              onClick={() => startQuiz(10, onlyUnmemorized, selectedSection)}
              className="py-3 px-3 rounded-xl bg-[#60A5FA] hover:bg-blue-300 text-[#0F172A] font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-[#60A5FA]/20 transition cursor-pointer focus:outline-none"
            >
              <RotateCcw className="w-4 h-4 stroke-[2.5]" />
              10問テストを再挑戦
            </button>
            <button
              type="button"
              onClick={() =>
                startQuiz(sectionWords.length, onlyUnmemorized, selectedSection)
              }
              className="py-3 px-3 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-[#F1F5F9] font-semibold text-xs flex items-center justify-center gap-1.5 border border-[#334155] transition cursor-pointer focus:outline-none"
            >
              範囲全{sectionWords.length}問に挑戦
            </button>
          </div>
        </div>

        {/* 回答した単語の振り返りリスト */}
        <div className="space-y-2 pb-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8] px-1">
            今回の出題単語と結果
          </h3>
          <div className="space-y-2">
            {sessionResults.map(({ word, isCorrect: correct }, idx) => (
              <div
                key={`${word.id}-${idx}`}
                className="flex items-center justify-between p-3 rounded-2xl bg-[#1E293B] border border-[#334155]"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {correct ? (
                    <span className="w-6 h-6 rounded-full bg-[#16A34A] text-[#F1F5F9] flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    </span>
                  ) : (
                    <span className="w-6 h-6 rounded-full bg-[#DC2626] text-[#F1F5F9] flex items-center justify-center shrink-0">
                      <X className="w-3.5 h-3.5 stroke-[2.5]" />
                    </span>
                  )}
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-mono text-[#94A3B8]">
                        {formatWordNumber(word.id)}
                      </span>
                      <span className="font-bold text-sm text-[#F1F5F9]">
                        {word.word}
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#0F172A] text-[#60A5FA] border border-[#334155]">
                        {word.pos}
                      </span>
                      <span className="text-[11px] text-[#CBD5E1] font-ipa">
                        {word.phonetic}
                      </span>
                    </div>
                    <p className="text-xs text-[#94A3B8] truncate">
                      {word.meaning}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => speakEnglish(word.word)}
                  aria-label={`${word.word}の発音を再生`}
                  className="p-2 rounded-xl bg-[#60A5FA] hover:bg-blue-300 text-[#0F172A] shrink-0 cursor-pointer focus:outline-none"
                >
                  <Volume2 className="w-4 h-4 stroke-[2.2]" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const wordProgress = getWordProgress(currentQuestion.targetWord.id);
  const learningStatus = getLearningStatus(wordProgress);

  return (
    <div className="flex flex-col flex-1 min-h-0 px-4 pt-3 pb-3 gap-2.5 overflow-hidden">
      {/* 上部バー：セクション選択・出題フィルター・問題番号・連続正解ストリーク・問題数切替 */}
      <div className="space-y-2 shrink-0">
        {sectionBar}

        <div className="flex items-center justify-between gap-1.5">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleToggleFilter}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border transition cursor-pointer focus:outline-none ${
                onlyUnmemorized
                  ? 'bg-[#FBBF24] text-[#0F172A] border-[#FBBF24]'
                  : 'bg-[#1E293B] text-[#F1F5F9] border-[#334155] hover:border-[#60A5FA]'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              {onlyUnmemorized ? '未定着のみ' : 'すべて'}
            </button>

            <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-[#1E293B] text-[#60A5FA] border border-[#334155]">
              Q. {currentIndex + 1} / {questions.length}
            </span>

            {currentStreak > 0 && (
              <span className="flex items-center gap-1 text-xs font-bold bg-[#FBBF24] text-[#0F172A] px-2 py-1 rounded-lg shadow-sm">
                <Flame className="w-3.5 h-3.5 text-[#0F172A] fill-[#0F172A]" />
                {currentStreak}連続
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 bg-[#1E293B] p-0.5 rounded-lg border border-[#334155] shrink-0">
            <button
              type="button"
              onClick={() => startQuiz(10, onlyUnmemorized, selectedSection)}
              className={`px-2 py-1 rounded-md text-[11px] font-bold transition cursor-pointer focus:outline-none ${
                questionCount === 10
                  ? 'bg-[#60A5FA] text-[#0F172A]'
                  : 'text-[#94A3B8] hover:text-[#F1F5F9]'
              }`}
            >
              10問
            </button>
            <button
              type="button"
              onClick={() =>
                startQuiz(sectionWords.length, onlyUnmemorized, selectedSection)
              }
              className={`px-2 py-1 rounded-md text-[11px] font-bold transition cursor-pointer focus:outline-none ${
                questionCount !== 10
                  ? 'bg-[#60A5FA] text-[#0F172A]'
                  : 'text-[#94A3B8] hover:text-[#F1F5F9]'
              }`}
            >
              全{sectionWords.length}問
            </button>
          </div>
        </div>

        <div className="w-full h-1.5 bg-[#1E293B] rounded-full overflow-hidden border border-[#334155]/60">
          <div
            className="h-full bg-[#60A5FA] transition-all duration-300"
            style={{
              width: `${((currentIndex + 1) / questions.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* 出題カード（回答前は残り領域を使って中央表示、回答後はコンパクト化。品詞バッジは回答後のみ） */}
      <div
        className={`rounded-3xl bg-[#1E293B] border border-[#334155] text-center shadow-lg relative flex flex-col ${
          isAnswered ? 'shrink-0 p-3' : 'flex-1 min-h-[180px] p-4'
        }`}
      >
        <div className="flex items-center justify-between mb-1.5 min-h-[22px] shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-[#0F172A] text-[#94A3B8] border border-[#334155]">
              {formatWordNumber(currentQuestion.targetWord.id)}
            </span>
            {isAnswered && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#0F172A] text-[#60A5FA] border border-[#334155]">
                {currentQuestion.targetWord.pos}
              </span>
            )}
          </div>

          {learningStatus === 'memorized' && (
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#16A34A] text-[#F1F5F9]">
              定着（覚えた）
            </span>
          )}
          {learningStatus === 'learning' && (
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#F59E0B] text-[#0F172A]">
              学習中
            </span>
          )}
          {learningStatus === 'unstudied' && (
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#0F172A] text-[#CBD5E1] border border-[#475569]">
              未学習
            </span>
          )}
        </div>

        <div className="my-auto">
        <h2
          className={`font-extrabold text-[#F1F5F9] tracking-tight ${
            isAnswered ? 'text-2xl' : 'text-3xl'
          }`}
        >
          {currentQuestion.targetWord.word}
        </h2>
        <p
          className={`text-sm text-[#CBD5E1] font-ipa mt-1 ${
            isAnswered ? 'mb-2' : 'mb-4'
          }`}
        >
          {currentQuestion.targetWord.phonetic}
        </p>
        <button
          type="button"
          onClick={() => speakEnglish(currentQuestion.targetWord.word)}
          className={`inline-flex items-center gap-1.5 rounded-xl bg-[#60A5FA] hover:bg-blue-300 active:scale-95 text-[#0F172A] font-bold shadow-md shadow-[#60A5FA]/20 transition cursor-pointer focus:outline-none ${
            isAnswered ? 'px-3.5 py-1.5 text-xs' : 'px-5 py-2.5 text-sm'
          }`}
        >
          <Volume2 className="w-4 h-4 stroke-[2.2]" />
          <span>発音を聞く</span>
        </button>
        </div>
      </div>

      {/* 4択の選択肢（画面下部寄り・タップ領域 56px 以上） */}
      <div className="space-y-2 shrink-0">
        {currentQuestion.choices.map((choice, idx) => {
          const isTarget = choice.id === currentQuestion.targetWord.id;
          const isSelected = choice.id === selectedChoiceId;

          let buttonStyle =
            'bg-[#1E293B] hover:border-[#60A5FA] border-[#334155] text-[#F1F5F9]';
          let badgeStyle =
            'bg-[#0F172A] border-[#334155] text-[#94A3B8]';

          if (isAnswered) {
            if (isTarget) {
              buttonStyle =
                'bg-[#16A34A] border-[#16A34A] text-[#F1F5F9] shadow-lg shadow-[#16A34A]/25';
              badgeStyle =
                'bg-[#0F172A]/30 border-white/30 text-[#F1F5F9]';
            } else if (isSelected && !isTarget) {
              buttonStyle =
                'bg-[#DC2626] border-[#DC2626] text-[#F1F5F9] shadow-lg shadow-[#DC2626]/25';
              badgeStyle =
                'bg-[#0F172A]/30 border-white/30 text-[#F1F5F9]';
            } else {
              buttonStyle =
                'bg-[#1E293B]/50 border-[#334155]/60 text-[#94A3B8] opacity-60';
            }
          }

          return (
            <button
              key={choice.id}
              type="button"
              disabled={isAnswered}
              onClick={() => handleSelectChoice(choice.id)}
              className={`w-full text-left px-3 py-3 min-h-[56px] rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer disabled:cursor-default focus:outline-none ${buttonStyle}`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className={`w-6 h-6 rounded-lg border text-xs font-bold flex items-center justify-center shrink-0 ${badgeStyle}`}
                >
                  {idx + 1}
                </span>
                <span className="text-sm font-semibold leading-snug">
                  {choice.meaning}
                </span>
              </div>

              {isAnswered && isTarget && (
                <span className="w-6 h-6 rounded-full bg-[#0F172A]/25 flex items-center justify-center shrink-0">
                  <Check className="w-4 h-4 text-[#F1F5F9] stroke-[3]" />
                </span>
              )}
              {isAnswered && isSelected && !isTarget && (
                <span className="w-6 h-6 rounded-full bg-[#0F172A]/25 flex items-center justify-center shrink-0">
                  <X className="w-4 h-4 text-[#F1F5F9] stroke-[3]" />
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 回答後の即時解説パネル（回答後に品詞も併記） */}
      {isAnswered ? (
        <div className="rounded-2xl bg-[#1E293B] border border-[#334155] p-3 space-y-2 shadow-xl flex-1 min-h-[140px] flex flex-col overflow-hidden">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              {isCorrect ? (
                <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-[#16A34A] text-[#F1F5F9] shrink-0">
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  正解
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-[#DC2626] text-[#F1F5F9] shrink-0">
                  <X className="w-3.5 h-3.5 stroke-[2.5]" />
                  不正解
                </span>
              )}
              <span className="text-xs font-bold text-[#F1F5F9] truncate">
                {currentQuestion.targetWord.word} (
                {currentQuestion.targetWord.pos})：
                {currentQuestion.targetWord.meaning}
              </span>
            </div>

            <button
              type="button"
              onClick={() =>
                onSetMemorized(
                  currentQuestion.targetWord.id,
                  !wordProgress.memorized
                )
              }
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold border transition shrink-0 cursor-pointer focus:outline-none ${
                wordProgress.memorized
                  ? 'bg-[#16A34A] text-[#F1F5F9] border-[#16A34A]'
                  : 'bg-[#0F172A] text-[#94A3B8] border-[#334155] hover:text-[#F1F5F9]'
              }`}
            >
              <BookmarkCheck className="w-3.5 h-3.5" />
              {wordProgress.memorized ? '定着済' : '覚えた'}
            </button>
          </div>

          <div className="bg-[#0F172A] rounded-xl p-2.5 border border-[#334155] space-y-1 flex-1 min-h-0 overflow-y-auto no-scrollbar">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#60A5FA]">
                例文 (Example)
              </span>
              <button
                type="button"
                onClick={() =>
                  speakEnglish(currentQuestion.targetWord.exampleSentence)
                }
                className="flex items-center gap-1 text-xs font-bold bg-[#60A5FA] hover:bg-blue-300 text-[#0F172A] px-2.5 py-1 rounded-md cursor-pointer focus:outline-none"
              >
                <Volume2 className="w-3.5 h-3.5 stroke-[2.2]" />
                <span>例文を聞く</span>
              </button>
            </div>
            <p className="text-xs text-[#F1F5F9] leading-relaxed">
              {highlightTargetWord(
                currentQuestion.targetWord.exampleSentence,
                currentQuestion.targetWord.word
              )}
            </p>
            <p className="text-[11px] text-[#CBD5E1] leading-relaxed">
              {currentQuestion.targetWord.exampleTranslation}
            </p>
          </div>

          <button
            type="button"
            onClick={handleNextQuestion}
            className="w-full shrink-0 min-h-[52px] py-3 px-4 rounded-xl bg-[#60A5FA] hover:bg-blue-300 active:scale-[0.99] text-[#0F172A] font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#60A5FA]/20 transition cursor-pointer focus:outline-none"
          >
            <span>
              {currentIndex < questions.length - 1
                ? '次の問題へ'
                : 'テスト結果を見る'}
            </span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      ) : (
        <div className="text-center py-1 text-xs text-[#94A3B8] shrink-0">
          4つの選択肢から正しい日本語訳を選んでください
        </div>
      )}
    </div>
  );
};
