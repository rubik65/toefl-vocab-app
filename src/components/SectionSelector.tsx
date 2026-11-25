import React from 'react';
import { SECTION_OPTIONS, SectionKey } from '../types/vocab';

interface SectionSelectorProps {
  selectedSection: SectionKey;
  onSelectSection: (section: SectionKey) => void;
}

export const SectionSelector: React.FC<SectionSelectorProps> = ({
  selectedSection,
  onSelectSection,
}) => {
  const currentIndex = SECTION_OPTIONS.findIndex(
    (sec) => sec.key === selectedSection
  );
  const canGoPrev = currentIndex > 0;
  const canGoNext =
    currentIndex >= 0 && currentIndex < SECTION_OPTIONS.length - 1;

  const handlePrev = () => {
    if (canGoPrev) {
      onSelectSection(SECTION_OPTIONS[currentIndex - 1].key);
    }
  };

  const handleNext = () => {
    if (canGoNext) {
      onSelectSection(SECTION_OPTIONS[currentIndex + 1].key);
    }
  };

  return (
    <div className="flex items-center gap-1.5 w-full">
      <button
        type="button"
        onClick={handlePrev}
        disabled={!canGoPrev}
        aria-label="前の範囲へ移動"
        title="前の範囲"
        className="shrink-0 min-w-[36px] min-h-[34px] px-2.5 py-1.5 rounded-lg bg-[#1E293B] text-[#F1F5F9] border border-[#334155] hover:border-[#60A5FA] active:scale-95 disabled:text-[#94A3B8] disabled:bg-[#0F172A] disabled:border-[#334155] disabled:pointer-events-none text-xs font-bold flex items-center justify-center transition cursor-pointer focus:outline-none"
      >
        ◀
      </button>

      <select
        aria-label="学習セクション範囲を選択"
        value={selectedSection}
        onChange={(e) => onSelectSection(e.target.value as SectionKey)}
        className="flex-1 min-w-0 min-h-[34px] bg-[#1E293B] text-[#60A5FA] border border-[#334155] rounded-lg px-3 py-1.5 text-xs font-bold focus:outline-none focus:border-[#60A5FA] cursor-pointer"
      >
        {SECTION_OPTIONS.map((sec) => (
          <option
            key={sec.key}
            value={sec.key}
            className="bg-[#0F172A] text-[#F1F5F9]"
          >
            {sec.label}
          </option>
        ))}
      </select>

      <button
        type="button"
        onClick={handleNext}
        disabled={!canGoNext}
        aria-label="次の範囲へ移動"
        title="次の範囲"
        className="shrink-0 min-w-[36px] min-h-[34px] px-2.5 py-1.5 rounded-lg bg-[#1E293B] text-[#F1F5F9] border border-[#334155] hover:border-[#60A5FA] active:scale-95 disabled:text-[#94A3B8] disabled:bg-[#0F172A] disabled:border-[#334155] disabled:pointer-events-none text-xs font-bold flex items-center justify-center transition cursor-pointer focus:outline-none"
      >
        ▶
      </button>
    </div>
  );
};
