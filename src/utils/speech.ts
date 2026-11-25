/**
 * Web Speech API (SpeechSynthesis) を使用した英語音声再生ユーティリティ
 */

let cachedVoices: SpeechSynthesisVoice[] = [];

function loadVoices(): SpeechSynthesisVoice[] {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return [];
  }
  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    cachedVoices = voices;
  }
  return cachedVoices;
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  loadVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    loadVoices();
  };
}

function getPreferredEnglishVoice(): SpeechSynthesisVoice | null {
  const voices = loadVoices();
  if (voices.length === 0) return null;

  // 高品質な英語ネイティブ音声（Google US English, Microsoft Natural, Samantha 等）を優先
  const preferredMatchers = [
    (v: SpeechSynthesisVoice) => v.lang === 'en-US' && /Google|Natural|Samantha|Aria|Guy|Jenny/i.test(v.name),
    (v: SpeechSynthesisVoice) => v.lang === 'en-US' && v.localService,
    (v: SpeechSynthesisVoice) => v.lang === 'en-US',
    (v: SpeechSynthesisVoice) => v.lang.startsWith('en-'),
    (v: SpeechSynthesisVoice) => v.lang.startsWith('en'),
  ];

  for (const matcher of preferredMatchers) {
    const found = voices.find(matcher);
    if (found) return found;
  }
  return null;
}

export interface SpeakOptions {
  rate?: number;
  pitch?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: () => void;
}

export function speakEnglish(text: string, options: SpeakOptions = {}): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('このブラウザは Web Speech API に対応していません。');
    options.onError?.();
    return;
  }

  try {
    // 再生中の音声をキャンセルして即座に新しい音声を再生
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = options.rate ?? 0.92; // リスニングしやすい自然な速度
    utterance.pitch = options.pitch ?? 1.0;

    const voice = getPreferredEnglishVoice();
    if (voice) {
      utterance.voice = voice;
    }

    utterance.onstart = () => {
      options.onStart?.();
    };
    utterance.onend = () => {
      options.onEnd?.();
    };
    utterance.onerror = () => {
      options.onError?.();
    };

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.error('音声再生エラー:', err);
    options.onError?.();
  }
}

export function stopSpeaking(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
