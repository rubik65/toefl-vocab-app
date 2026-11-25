import React, { useState, useMemo } from 'react';
import {
  Volume2,
  Check,
  Trash2,
  Search,
  Award,
  Flame,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
} from 'lucide-react';
import {
  VocabWord,
  StudyStats,
  WordProgress,
  getLearningStatus,
  SectionKey,
  filterWordsBySection,
  formatWordNumber,
} from '../types/vocab';
import { speakEnglish } from '../utils/speech';
import { highlightTargetWord } from '../utils/highlightWord';
import { SectionSelector } from './SectionSelector';

interface WordListViewProps {
  words: VocabWord[];
  selectedSection: SectionKey;
  onChangeSection: (section: SectionKey) => void;
  stats: StudyStats;
  getWordProgress: (wordId: number) => WordProgress;
  onSetMemorized: (wordId: number, memorized: boolean) => void;
  onResetProgress: () => void;
}

function formatNextReviewBadge(progress: WordProgress): string | null {
  if (!progress.nextReviewAt) return null;
  const due = new Date(progress.nextReviewAt);
  if (Number.isNaN(due.getTime())) return null;

  const diffMs = due.getTime() - Date.now();
  if (diffMs <= 0) {
    return '復習期日: 今日';
  }
  const diffMins = Math.ceil(diffMs / (60 * 1000));
  if (diffMins < 60) {
    return `次回: 約${diffMins}分後`;
  }
  const diffHours = Math.ceil(diffMs / (60 * 60 * 1000));
  if (diffHours < 24) {
    return `次回: 約${diffHours}時間後`;
  }
  const diffDays = Math.round(diffMs / (24 * 60 * 60 * 1000));
  return `次回: ${diffDays}日後 (${due.getMonth() + 1}/${due.getDate()})`;
}

export const WordListView: React.FC<WordListViewProps> = ({
  words,
  selectedSection,
  onChangeSection,
  stats,
  getWordProgress,
  onSetMemorized,
  onResetProgress,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<
    'all' | 'memorized' | 'learning' | 'unstudied'
  >('all');
  const [expandedWordIds, setExpandedWordIds] = useState<Record<number, boolean>>(
    {}
  );
  const [showResetDialog, setShowResetDialog] = useState(false);

  const toggleExpand = (wordId: number) => {
    setExpandedWordIds((prev) => ({
      ...prev,
      [wordId]: !prev[wordId],
    }));
  };

  const sectionWords = useMemo(
    () => filterWordsBySection(words, selectedSection),
    [words, selectedSection]
  );

  const memorizedCount = sectionWords.filter(
    (w) => getLearningStatus(getWordProgress(w.id)) === 'memorized'
  ).length;
  const learningCount = sectionWords.filter(
    (w) => getLearningStatus(getWordProgress(w.id)) === 'learning'
  ).length;
  const unstudiedCount = sectionWords.length - memorizedCount - learningCount;

  const totalMemorizedAll = words.filter(
    (w) => getLearningStatus(getWordProgress(w.id)) === 'memorized'
  ).length;
  const memorizedRatioAll = Math.round((totalMemorizedAll / words.length) * 100);
  const quizAccuracy =
    stats.totalQuizAnswered > 0
      ? Math.round((stats.totalQuizCorrect / stats.totalQuizAnswered) * 100)
      : 0;

  const filteredWords = sectionWords.filter((w) => {
    const status = getLearningStatus(getWordProgress(w.id));
    if (filterType !== 'all' && status !== filterType) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      w.word.toLowerCase().includes(q) ||
      w.meaning.toLowerCase().includes(q) ||
      String(w.id).includes(q)
    );
  });

  return (
    <div className="flex flex-col flex-1 min-h-0 px-4 py-3 space-y-3.5 overflow-y-auto no-scrollbar relative">
      {/* 学習統計サマリーカード */}
      <div className="rounded-3xl bg-[#1E293B] border border-[#334155] p-4 space-y-3 shadow-lg">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#F1F5F9]">学習進捗データ</h2>
        </div>

        {/* 単語定着率バー */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-[#CBD5E1]">Rank 1 単語定着率</span>
            <span className="font-bold text-[#22C55E]">
              {totalMemorizedAll} / {words.length} 語 ({memorizedRatioAll}%)
            </span>
          </div>
          <div className="w-full h-2 bg-[#0F172A] rounded-full overflow-hidden border border-[#334155]">
            <div
              className="h-full bg-[#16A34A] transition-all duration-300"
              style={{ width: `${memorizedRatioAll}%` }}
            />
          </div>
        </div>

        {/* クイズ統計（3枚の高さ・数字位置を揃え、同トーンに統一） */}
        <div className="grid grid-cols-3 gap-2 pt-1 items-stretch">
          <div className="bg-[#0F172A] border border-[#334155] rounded-2xl p-2.5 text-center flex flex-col justify-between min-h-[62px]">
            <div className="flex items-center justify-center gap-1 text-[11px] text-[#CBD5E1] whitespace-nowrap">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#60A5FA] shrink-0" />
              <span>総回答数</span>
            </div>
            <p className="text-base font-bold text-[#F1F5F9] leading-tight mt-1">
              {stats.totalQuizAnswered}
              <span className="text-[11px] font-normal text-[#CBD5E1] ml-0.5">
                問
              </span>
            </p>
          </div>

          <div className="bg-[#0F172A] border border-[#334155] rounded-2xl p-2.5 text-center flex flex-col justify-between min-h-[62px]">
            <div className="flex items-center justify-center gap-1 text-[11px] text-[#CBD5E1] whitespace-nowrap">
              <Award className="w-3.5 h-3.5 text-[#FBBF24] shrink-0" />
              <span>正答率</span>
            </div>
            <p className="text-base font-bold text-[#F1F5F9] leading-tight mt-1">
              {stats.totalQuizAnswered > 0 ? `${quizAccuracy}%` : '--%'}
            </p>
          </div>

          <div className="bg-[#0F172A] border border-[#334155] rounded-2xl p-2.5 text-center flex flex-col justify-between min-h-[62px]">
            <div className="flex items-center justify-center gap-1 text-[11px] text-[#CBD5E1] whitespace-nowrap">
              <Flame className="w-3.5 h-3.5 text-[#FBBF24] fill-[#FBBF24] shrink-0" />
              <span>最高連続</span>
            </div>
            <p className="text-base font-extrabold text-[#FBBF24] leading-tight mt-1">
              {stats.bestStreak}
              <span className="text-[11px] font-normal text-[#CBD5E1] ml-0.5">
                回
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* セクション選択＆検索＆ステータス別フィルタ */}
      <div className="space-y-2">
        <SectionSelector
          selectedSection={selectedSection}
          onSelectSection={onChangeSection}
        />

        <div className="relative">
          <Search className="w-4 h-4 text-[#CBD5E1] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="単語番号・英単語・日本語の意味で検索..."
            className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-[#1E293B] border border-[#334155] text-xs text-[#F1F5F9] placeholder-[#94A3B8] focus:outline-none focus:border-[#60A5FA]"
          />
        </div>

        <div className="grid grid-cols-4 gap-1.5">
          {(
            [
              { key: 'all', label: `全 (${sectionWords.length})` },
              { key: 'unstudied', label: `未学習 (${unstudiedCount})` },
              { key: 'learning', label: `学習中 (${learningCount})` },
              { key: 'memorized', label: `定着 (${memorizedCount})` },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setFilterType(tab.key)}
              className={`py-1.5 px-1.5 rounded-xl text-[11px] font-bold border transition cursor-pointer focus:outline-none ${
                filterType === tab.key
                  ? 'bg-[#60A5FA] text-[#0F172A] border-[#60A5FA]'
                  : 'bg-[#1E293B] text-[#CBD5E1] border-[#334155] hover:text-[#F1F5F9]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 単語リスト（例文は初期状態で折りたたみ、タップで展開） */}
      <div className="space-y-2">
        {filteredWords.map((word) => {
          const progress = getWordProgress(word.id);
          const status = getLearningStatus(progress);
          const isExpanded = Boolean(expandedWordIds[word.id]);
          const nextReviewText = formatNextReviewBadge(progress);

          return (
            <div
              key={word.id}
              className="rounded-2xl bg-[#1E293B] border border-[#334155] p-3 space-y-2 transition-colors"
            >
              <div
                role="button"
                tabIndex={0}
                onClick={() => toggleExpand(word.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleExpand(word.id);
                  }
                }}
                className="flex items-start justify-between gap-2 cursor-pointer select-none focus:outline-none"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#0F172A] text-[#CBD5E1] border border-[#334155]">
                      {formatWordNumber(word.id)}
                    </span>
                    <span className="text-base font-bold text-[#F1F5F9]">
                      {word.word}
                    </span>
                    <span className="text-xs text-[#CBD5E1] font-ipa">
                      {word.phonetic}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#0F172A] text-[#60A5FA] border border-[#334155]">
                      {word.pos}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2 mt-1">
                    <p className="text-sm font-semibold text-[#F1F5F9]">
                      {word.meaning}
                    </p>
                  </div>
                  <div className="flex items-center gap-2.5 mt-1 flex-wrap text-[11px] text-[#CBD5E1]">
                    <span className="inline-flex items-center gap-0.5 text-[#60A5FA] font-medium">
                      {isExpanded ? (
                        <>
                          <ChevronUp className="w-3.5 h-3.5" />
                          例文を閉じる
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-3.5 h-3.5" />
                          例文を表示
                        </>
                      )}
                    </span>
                    {nextReviewText && (
                      <span className="text-[#CBD5E1]">{nextReviewText}</span>
                    )}
                    {(progress.correctCount > 0 || progress.incorrectCount > 0) && (
                      <span>
                        正解:{' '}
                        <strong className="text-[#22C55E]">
                          {progress.correctCount}
                        </strong>{' '}
                        / 不正解:{' '}
                        <strong className="text-[#FCA5A5]">
                          {progress.incorrectCount}
                        </strong>
                      </span>
                    )}
                  </div>
                </div>

                {/* 右上：音声ボタン＆3段階ステータスバッジ（タップで定着トグル可能） */}
                <div
                  className="flex items-center gap-1.5 shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={() => speakEnglish(word.word)}
                    title="単語の発音を聞く"
                    className="p-2 rounded-xl bg-[#60A5FA] hover:bg-blue-300 text-[#0F172A] transition cursor-pointer focus:outline-none"
                  >
                    <Volume2 className="w-4 h-4 stroke-[2.2]" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onSetMemorized(word.id, !progress.memorized)}
                    title="タップして定着（覚えた）状態を切り替え"
                    className={`flex items-center gap-1 px-2.5 py-2 rounded-xl text-xs font-bold border transition cursor-pointer focus:outline-none ${
                      status === 'memorized'
                        ? 'bg-[#16A34A] text-[#F1F5F9] border-[#16A34A]'
                        : status === 'learning'
                        ? 'bg-[#F59E0B] text-[#0F172A] border-[#F59E0B]'
                        : 'bg-[#0F172A] text-[#CBD5E1] border-[#475569] hover:text-[#F1F5F9]'
                    }`}
                  >
                    {status === 'memorized' && (
                      <>
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>定着</span>
                      </>
                    )}
                    {status === 'learning' && <span>学習中</span>}
                    {status === 'unstudied' && <span>未学習</span>}
                  </button>
                </div>
              </div>

              {isExpanded && (
                <div className="bg-[#0F172A] rounded-xl p-2.5 border border-[#334155] text-xs space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-[#F1F5F9] leading-relaxed">
                      {highlightTargetWord(word.exampleSentence, word.word)}
                    </p>
                    <button
                      type="button"
                      onClick={() => speakEnglish(word.exampleSentence)}
                      title="例文の音声を聞く"
                      className="p-1.5 rounded-lg bg-[#60A5FA] hover:bg-blue-300 text-[#0F172A] shrink-0 cursor-pointer focus:outline-none"
                    >
                      <Volume2 className="w-3.5 h-3.5 stroke-[2.2]" />
                    </button>
                  </div>
                  <p className="text-[#CBD5E1] text-[11px] leading-relaxed">
                    {word.exampleTranslation}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 画面下部：データ管理セクション（進捗リセットを安全化） */}
      <div className="rounded-3xl bg-[#1E293B] border border-[#334155] p-4 space-y-2.5 mt-2 mb-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#CBD5E1]">
          データ管理
        </h3>
        <p className="text-xs text-[#CBD5E1] leading-relaxed">
          学習進捗（定着ステータス・復習スケジュール・クイズ履歴）を初期状態に戻します。
        </p>
        <button
          type="button"
          onClick={() => setShowResetDialog(true)}
          className="w-full py-2.5 px-4 rounded-xl bg-[#0F172A] hover:bg-[#DC2626]/20 text-[#FCA5A5] border border-[#DC2626]/60 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer focus:outline-none"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>進捗リセット</span>
        </button>
      </div>

      {/* 確認ダイアログ（モーダル） */}
      {showResetDialog && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="reset-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4"
        >
          <div className="w-full max-w-xs rounded-3xl bg-[#1E293B] border border-[#334155] p-5 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#DC2626]/20 border border-[#DC2626]/50 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6 text-[#FCA5A5]" />
            </div>
            <div className="space-y-1.5">
              <h4
                id="reset-dialog-title"
                className="text-base font-bold text-[#F1F5F9]"
              >
                進捗データのリセット
              </h4>
              <p className="text-xs text-[#CBD5E1] leading-relaxed">
                本当にリセットしますか？この操作は元に戻せません
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setShowResetDialog(false)}
                className="py-2.5 px-3 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-[#CBD5E1] border border-[#334155] text-xs font-bold transition cursor-pointer focus:outline-none"
              >
                キャンセル
              </button>
              <button
                type="button"
                onClick={() => {
                  onResetProgress();
                  setShowResetDialog(false);
                }}
                className="py-2.5 px-3 rounded-xl bg-[#DC2626] hover:bg-red-500 text-[#F1F5F9] text-xs font-bold transition shadow-md shadow-[#DC2626]/30 cursor-pointer focus:outline-none"
              >
                リセットする
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
