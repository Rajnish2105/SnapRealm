// global.d.ts
interface Window {
  webkitSpeechRecognition: typeof SpeechRecognition;
}
interface SpeechRecognition {
  language?: string; // Add the language property
}
