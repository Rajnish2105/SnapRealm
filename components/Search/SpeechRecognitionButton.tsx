import { IconMicrophone, IconMicrophoneFilled } from '@tabler/icons-react';
import { useEffect, useState } from 'react';

let recognition: SpeechRecognition | null = null;

// Initialize SpeechRecognition
if ('webkitSpeechRecognition' in window) {
  recognition = new window.webkitSpeechRecognition();
  if (recognition) {
    recognition.continuous = true; // Enable continuous recognition
    recognition.interimResults = true; // Enable interim results
    recognition.language = 'en-US'; // Set language
  }
}

export default function SpeechRecognitionButton({
  msgStateUpdater,
}: {
  msgStateUpdater: (value: string) => void;
}) {
  const [isListening, setListening] = useState<boolean>(false);

  useEffect(() => {
    if (!recognition) return;

    recognition.onresult = (e: SpeechRecognitionEvent) => {
      // Combine final and interim results
      let transcript = '';
      for (let i = 0; i < e.results.length; i++) {
        transcript += e.results[i][0].transcript;
      }

      // Update state with live text
      msgStateUpdater(transcript);
    };

    recognition.onerror = (e: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', e.error);
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };
  }, []);

  const startListening = () => {
    if (!recognition) return;
    if (isListening) return;
    setListening(true);
    recognition.start();
  };

  const stopListening = () => {
    if (!recognition) return;
    setListening(false);
    recognition.stop();
  };

  return (
    !!recognition &&
    (isListening ? (
      <>
        <IconMicrophoneFilled
          className="cursor-pointer"
          onClick={stopListening}
        />
      </>
    ) : (
      <IconMicrophone className="cursor-pointer" onClick={startListening} />
    ))
  );
}
