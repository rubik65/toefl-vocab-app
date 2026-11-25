import { useState, useMemo } from 'react';
import wordsData from './data/words.json';
import { VocabWord, AppMode, SectionKey } from './types/vocab';
import { useProgress } from './hooks/useProgress';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { FlashcardMode } from './components/FlashcardMode';
import { QuizMode } from './components/QuizMode';
import { WordListView } from './components/WordListView';

const words = wordsData as VocabWord[];

export function App() {
  const [activeMode, setActiveMode] = useState<AppMode>('flashcard');
  const [selectedSection, setSelectedSection] = useState<SectionKey>('1-40');
  const {
    stats,
    getWordProgress,
    rateWord,
    setWordMemorized,
    recordQuizResult,
    resetAllProgress,
  } = useProgress();

  const memorizedCount = useMemo(
    () => words.filter((w) => getWordProgress(w.id).memorized).length,
    [getWordProgress]
  );

  return (
    // 外枠：実機では画面全体（100dvh）、PCでは中央寄せのプレビュー背景
    <div className="h-[100dvh] w-full bg-[#0F172A] text-[#F1F5F9] flex justify-center items-center overflow-hidden min-[500px]:bg-[#020617]">
      {/*
        アプリ本体：
        - モバイル（幅 < 500px）: 画面幅・高さいっぱいにフィット
        - PC（幅 >= 500px）: Xiaomi 11T Pro の CSS ビューポート（393 × 873px）基準のプレビュー枠
      */}
      <div className="w-full h-full bg-[#0F172A] flex flex-col overflow-hidden relative min-[500px]:w-[393px] min-[500px]:h-[min(873px,calc(100dvh-2rem))] min-[500px]:rounded-[36px] min-[500px]:border min-[500px]:border-[#334155] min-[500px]:shadow-2xl">
        <Header
          totalWords={words.length}
          memorizedCount={memorizedCount}
          totalQuizAnswered={stats.totalQuizAnswered}
          totalQuizCorrect={stats.totalQuizCorrect}
        />

        <main className="flex-1 min-h-0 flex flex-col overflow-hidden bg-[#0F172A]">
          {activeMode === 'flashcard' && (
            <FlashcardMode
              words={words}
              selectedSection={selectedSection}
              onChangeSection={setSelectedSection}
              getWordProgress={getWordProgress}
              onRateWord={rateWord}
            />
          )}

          {activeMode === 'quiz' && (
            <QuizMode
              words={words}
              selectedSection={selectedSection}
              onChangeSection={setSelectedSection}
              currentStreak={stats.currentStreak}
              getWordProgress={getWordProgress}
              onRecordResult={recordQuizResult}
              onSetMemorized={setWordMemorized}
            />
          )}

          {activeMode === 'wordlist' && (
            <WordListView
              words={words}
              selectedSection={selectedSection}
              onChangeSection={setSelectedSection}
              stats={stats}
              getWordProgress={getWordProgress}
              onSetMemorized={setWordMemorized}
              onResetProgress={resetAllProgress}
            />
          )}
        </main>

        <BottomNav activeMode={activeMode} onChangeMode={setActiveMode} />
      </div>
    </div>
  );
}

export default App;
