
import { useCallback } from 'react';

export const useVoice = () => {
    const speak = useCallback((text: string) => {
        if (!('speechSynthesis' in window)) {

            return;
        }

        const utterance = new SpeechSynthesisUtterance(text);
        const voices = window.speechSynthesis.getVoices();

        // Find the first available English voice
        const englishVoice = voices.find(voice => voice.name.includes('English') || voice.lang.includes('en'));

        if (englishVoice) {
            utterance.voice = englishVoice;
        }

        utterance.rate = 1.0;
        utterance.pitch = 1.0;

        window.speechSynthesis.speak(utterance);
    }, []);

    return { speak };
};
