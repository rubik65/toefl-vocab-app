/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        app: {
          bg: '#0F172A',       // slate-900: 背景
          surface: '#1E293B',  // slate-800: カード・コンテナ面
          border: '#334155',   // slate-700: 境界線（ボーダー）
          text: '#F1F5F9',     // slate-100: メインテキスト
          muted: '#94A3B8',    // slate-400: 補助テキスト
          primary: '#60A5FA',  // blue-400: メインアクション
          accent: '#FBBF24',   // amber-400: アクセント（文字色は #0F172A）
        },
        status: {
          correct: '#16A34A',     // green-600: 正解・定着（覚えた）
          incorrect: '#DC2626',   // red-600: 不正解
          unstudied: '#94A3B8',   // slate-400: 未学習
          learning: '#F59E0B',    // amber-500: 学習中
          memorized: '#16A34A',   // green-600: 定着（覚えた）
        },
      },
    },
  },
  plugins: [],
};
