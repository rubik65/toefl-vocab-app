# TOEFL Vocab Master (TOEFL対策 頻出英単語学習アプリ)

Vite + React + TypeScript + Tailwind CSS で構築された、モバイルファーストな TOEFL iBT 頻出英単語学習 Web アプリケーションです。

## 主な機能

1. **フラッシュカードモード（モードA）**
   - 表面：英単語・品詞・発音記号・Web Speech API によるネイティブ発音再生ボタン
   - カードタップで 3D 反転アニメーションにより裏面（日本語訳・英語例文・例文音声再生・例文和訳）を表示
   - 「覚えた」「まだ」ボタンで進捗を記録して次のカードへ進行
   - 「未習得のみ」フィルタおよびシャッフル機能搭載

2. **4択テストモード（モードB）**
   - 10問または全20問の4択クイズ
   - 回答時に正解（緑）・不正解（赤）を即座にハイライト表示
   - 回答直後に解説（意味・英語例文・例文音声・和訳）を表示し、次の問題へ進行

3. **進捗・一覧画面**
   - `localStorage` を用いた「覚えた」フラグ・クイズ正答率・連続正解数の自動保存
   - 全20語の検索・フィルタ・音声再生・進捗リセット機能

## 開発サーバーの起動方法

```bash
npm install
npm run dev
```

## 将来の Android APK 化（Capacitor 導入手順）

本プロジェクトには `capacitor.config.json` が同梱されており、以下の手順で Android アプリ化が可能です。

```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
npm run build
npx cap add android
npx cap sync android
npx cap open android
```
