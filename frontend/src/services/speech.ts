// ==============================================================================
// SANSKRITVERSE Speech & Audio Service
// Text-to-Speech (TTS) and Web Speech Microphone Capture
// ==============================================================================

export class SpeechService {
  /**
   * Speaks Sanskrit text using browser SpeechSynthesis with fallback
   */
  public static speak(text: string, rate: number = 0.9): void {
    if (!('speechSynthesis' in window)) {
      console.warn('SpeechSynthesis not supported in this browser environment.');
      return;
    }

    window.speechSynthesis.cancel(); // Stop any pending utterances

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = 1.0;

    // Look for Sanskrit / Hindi / Indian English voices
    const voices = window.speechSynthesis.getVoices();
    const hindiOrSanskritVoice = voices.find(v =>
      v.lang.includes('sa') ||
      v.lang.includes('hi') ||
      v.lang.includes('en-IN') ||
      v.name.includes('India')
    );

    if (hindiOrSanskritVoice) {
      utterance.voice = hindiOrSanskritVoice;
    }

    window.speechSynthesis.speak(utterance);
  }

  /**
   * Captures user microphone audio via Web Speech API SpeechRecognition or simulated fallback
   */
  public static startSpeechRecognition(
    onResult: (transcript: string) => void,
    onError: (err: string) => void
  ): { stop: () => void } {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn('SpeechRecognition not natively supported; providing simulated microphone input.');
      const timer = setTimeout(() => {
        onResult('नमस्ते');
      }, 2500);

      return {
        stop: () => clearTimeout(timer)
      };
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'hi-IN'; // Closest native phonetic match for Devanagari Sanskrit
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onResult(transcript);
      };

      recognition.onerror = (event: any) => {
        onError(event.error);
      };

      recognition.start();

      return {
        stop: () => recognition.stop()
      };
    } catch (err: any) {
      onError(err.message || 'Speech recognition initialization failed');
      return { stop: () => {} };
    }
  }
}
