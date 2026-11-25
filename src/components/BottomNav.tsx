import React from 'react';
import { Layers, HelpCircle, ListChecks } from 'lucide-react';
import { AppMode } from '../types/vocab';

interface BottomNavProps {
  activeMode: AppMode;
  onChangeMode: (mode: AppMode) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeMode,
  onChangeMode,
}) => {
  const navItems: { mode: AppMode; label: string; subLabel: string; icon: React.ReactNode }[] = [
    {
      mode: 'flashcard',
      label: 'カード学習',
      subLabel: 'モードA',
      icon: <Layers className="w-5 h-5" />,
    },
    {
      mode: 'quiz',
      label: '4択テスト',
      subLabel: 'モードB',
      icon: <HelpCircle className="w-5 h-5" />,
    },
    {
      mode: 'wordlist',
      label: '進捗・一覧',
      subLabel: '全956語',
      icon: <ListChecks className="w-5 h-5" />,
    },
  ];

  return (
    <nav className="shrink-0 z-20 bg-[#0F172A]/95 backdrop-blur-md border-t border-[#334155] px-2 py-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))]">
      <div className="grid grid-cols-3 gap-1.5">
        {navItems.map((item) => {
          const isActive = activeMode === item.mode;
          return (
            <button
              key={item.mode}
              type="button"
              onClick={() => onChangeMode(item.mode)}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all cursor-pointer select-none border outline-none focus:outline-none focus-visible:outline-none ${
                isActive
                  ? 'bg-[#60A5FA] text-[#0F172A] border-[#60A5FA] shadow-md shadow-[#60A5FA]/20'
                  : 'bg-transparent text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#1E293B] border-transparent'
              }`}
            >
              <div>{item.icon}</div>
              <span className="text-xs font-bold mt-1 leading-none">
                {item.label}
              </span>
              <span
                className={`text-[10px] mt-0.5 leading-none ${
                  isActive ? 'text-[#0F172A]/80 font-medium' : 'text-[#94A3B8]'
                }`}
              >
                {item.subLabel}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
