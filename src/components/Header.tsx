import React from 'react';
import { BookOpen, CheckCircle2, Award } from 'lucide-react';

interface HeaderProps {
  totalWords: number;
  memorizedCount: number;
  totalQuizAnswered: number;
  totalQuizCorrect: number;
}

export const Header: React.FC<HeaderProps> = ({
  totalWords,
  memorizedCount,
  totalQuizAnswered,
  totalQuizCorrect,
}) => {
  const accuracy =
    totalQuizAnswered > 0
      ? Math.round((totalQuizCorrect / totalQuizAnswered) * 100)
      : null;

  return (
    <header className="shrink-0 z-20 bg-[#0F172A]/95 backdrop-blur-md border-b border-[#334155] px-4 pb-2.5 pt-[max(0.625rem,env(safe-area-inset-top))]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#60A5FA] flex items-center justify-center shadow-md shadow-[#60A5FA]/20">
            <BookOpen className="w-4 h-4 text-[#0F172A] stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-[#F1F5F9] leading-tight">
              TOEFL Vocab Master
            </h1>
            <p className="text-[11px] text-[#94A3B8]">頻出アカデミック英単語</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* 定着（覚えた）カウントバッジ */}
          <div
            className="flex items-center gap-1 bg-[#1E293B] border border-[#334155] rounded-full px-2.5 py-1 text-[11px] whitespace-nowrap"
            title="定着（覚えた）単語数"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A] shrink-0" />
            <span className="text-[#CBD5E1] font-semibold">定着</span>
            <span className="font-bold text-[#F1F5F9]">
              {memorizedCount}
            </span>
            <span className="text-[#CBD5E1]">/ {totalWords}</span>
          </div>

          {/* 重要バッジ：正答率（#FBBF24 アクセント背景 × #0F172A 濃色テキスト） */}
          <div
            className="flex items-center gap-1 bg-[#FBBF24] text-[#0F172A] rounded-full px-2.5 py-1 text-[11px] font-bold shadow-sm whitespace-nowrap"
            title="4択クイズ通算正答率"
          >
            <Award className="w-3.5 h-3.5 text-[#0F172A] shrink-0 stroke-[2.2]" />
            <span>正答率 {accuracy !== null ? `${accuracy}%` : '--%'}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
