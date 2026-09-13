export interface SpeechStats {
  transcript: string;
  interimTranscript: string;
  wordCount: number;
  fillerCount: number;
  fillerWordsFound: string[];
}

const FILLER_PATTERNS = [
  /\bum\b/gi,
  /\buh\b/gi,
  /\blike\b/gi,
  /\byou know\b/gi,
  /\bbasically\b/gi,
  /\bliterally\b/gi,
  /\bso yeah\b/gi,
  /\bactually\b/gi,
  /\bhonest to god\b/gi,
  /\bI mean\b/gi
];

export class SpeechRecognitionEngine {
  private recognition: any = null;
  private isListening = false;
  private fullTranscript = '';
  private interimTranscript = '';
  private onStatsCallback: ((stats: SpeechStats) => void) | null = null;
  private isSupported = false;

  constructor() {
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRec) {
      this.isSupported = true;
      this.recognition = new SpeechRec();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';

      this.recognition.onresult = (event: any) => {
        let interim = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            this.fullTranscript += (this.fullTranscript ? ' ' : '') + result[0].transcript;
          } else {
            interim += result[0].transcript;
          }
        }
        this.interimTranscript = interim;
        this.emitStats();
      };

      this.recognition.onerror = (event: any) => {
        console.warn('Speech recognition notice:', event.error);
        if (event.error === 'no-speech' && this.isListening) {
          // Keep active
        }
      };

      this.recognition.onend = () => {
        if (this.isListening) {
          try {
            this.recognition.start();
          } catch (e) {
            // Already started or restarting
          }
        }
      };
    }
  }

  public getIsSupported(): boolean {
    return this.isSupported;
  }

  public start() {
    this.fullTranscript = '';
    this.interimTranscript = '';
    this.isListening = true;
    if (this.recognition) {
      try {
        this.recognition.start();
      } catch (err) {
        console.warn('Recognition start handled:', err);
      }
    }
    this.emitStats();
  }

  public appendManualText(text: string) {
    this.fullTranscript += (this.fullTranscript ? ' ' : '') + text;
    this.emitStats();
  }

  public stop() {
    this.isListening = false;
    if (this.interimTranscript.trim()) {
      this.fullTranscript += (this.fullTranscript ? ' ' : '') + this.interimTranscript.trim();
      this.interimTranscript = '';
    }
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (err) {
        // Ignored
      }
    }
    this.emitStats();
  }

  public getFinalTranscript(): string {
    if (this.interimTranscript.trim()) {
      this.fullTranscript += (this.fullTranscript ? ' ' : '') + this.interimTranscript.trim();
      this.interimTranscript = '';
    }
    return this.fullTranscript.trim();
  }

  public clear() {
    this.fullTranscript = '';
    this.interimTranscript = '';
    this.emitStats();
  }

  public onStats(callback: (stats: SpeechStats) => void) {
    this.onStatsCallback = callback;
  }

  private emitStats() {
    const combined = (this.fullTranscript + ' ' + this.interimTranscript).trim();
    const words = combined.split(/\s+/).filter(Boolean);
    
    let fillerCount = 0;
    const fillersFound: string[] = [];

    FILLER_PATTERNS.forEach(pattern => {
      const matches = combined.match(pattern);
      if (matches) {
        fillerCount += matches.length;
        fillersFound.push(...matches.map(m => m.toLowerCase()));
      }
    });

    if (this.onStatsCallback) {
      this.onStatsCallback({
        transcript: this.fullTranscript,
        interimTranscript: this.interimTranscript,
        wordCount: words.length,
        fillerCount,
        fillerWordsFound: Array.from(new Set(fillersFound))
      });
    }
  }
}
