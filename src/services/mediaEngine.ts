export interface AudioMetrics {
  volumeRms: number; // 0 to 100
  pitchVariance: number;
  wpm: number;
  fillerCount: number;
  pauseCount: number;
  audioEnergy: 'Low' | 'Normal' | 'High';
}

export interface VideoMetrics {
  framing: 'Optimal' | 'Too Close' | 'Too Far';
  movement: 'Steady' | 'Restless' | 'Still';
  eyeContactEstimate: 'Good' | 'Needs Focus';
}

export class MediaEngine {
  private mediaStream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private audioAnimFrame: number | null = null;

  private onAudioMetricsCallback: ((metrics: AudioMetrics) => void) | null = null;
  
  // Track metrics state
  private volumeHistory: number[] = [];
  private wordCountHistory: { time: number; count: number }[] = [];
  private totalFillers = 0;
  private totalPauses = 0;
  private isPaused = false;
  private pauseTimer: any = null;

  async startMedia(videoElement: HTMLVideoElement): Promise<boolean> {
    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
        audio: true
      });

      if (videoElement) {
        videoElement.srcObject = this.mediaStream;
        await videoElement.play().catch(e => console.warn('Video play deferred:', e));
      }

      this.initAudioAnalysis();
      return true;
    } catch (err: any) {
      console.warn('Microphone/Camera access warning:', err.message);
      // Fallback: try audio only if video failed
      try {
        this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        this.initAudioAnalysis();
        return true;
      } catch (audioErr: any) {
        console.warn('Audio-only fallback also unavailable:', audioErr.message);
        return false;
      }
    }
  }

  private initAudioAnalysis() {
    if (!this.mediaStream) return;
    const audioTracks = this.mediaStream.getAudioTracks();
    if (audioTracks.length === 0) return;

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.audioContext = new AudioCtx();
      const source = this.audioContext.createMediaStreamSource(this.mediaStream);
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 512;
      source.connect(this.analyser);

      this.analyzeAudioLoop();
    } catch (err) {
      console.error('AudioContext init error:', err);
    }
  }

  private analyzeAudioLoop = () => {
    if (!this.analyser) return;

    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(dataArray);

    // Compute RMS Volume
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      sum += dataArray[i] * dataArray[i];
    }
    const rms = Math.sqrt(sum / dataArray.length);
    const volumeRms = Math.min(100, Math.round((rms / 128) * 100));

    this.volumeHistory.push(volumeRms);
    if (this.volumeHistory.length > 50) this.volumeHistory.shift();

    // Detect speech pause (> 1.2s silence when volume < 8)
    if (volumeRms < 8) {
      if (!this.isPaused && !this.pauseTimer) {
        this.pauseTimer = setTimeout(() => {
          this.totalPauses++;
          this.isPaused = true;
        }, 1200);
      }
    } else {
      if (this.pauseTimer) {
        clearTimeout(this.pauseTimer);
        this.pauseTimer = null;
      }
      this.isPaused = false;
    }

    // Pitch variance calculation (variance of high vs low frequency bins)
    const pitchVariance = Math.round(Math.abs(dataArray[10] - dataArray[40]));

    const energy: 'Low' | 'Normal' | 'High' = volumeRms > 65 ? 'High' : volumeRms < 15 ? 'Low' : 'Normal';

    if (this.onAudioMetricsCallback) {
      this.onAudioMetricsCallback({
        volumeRms,
        pitchVariance,
        wpm: this.calculateCurrentWPM(),
        fillerCount: this.totalFillers,
        pauseCount: this.totalPauses,
        audioEnergy: energy
      });
    }

    this.audioAnimFrame = requestAnimationFrame(this.analyzeAudioLoop);
  };

  updateTranscriptStats(wordsCount: number, fillerCount: number) {
    this.totalFillers = fillerCount;
    const now = Date.now();
    this.wordCountHistory.push({ time: now, count: wordsCount });

    // Filter to last 30 seconds
    const thirtySecsAgo = now - 30000;
    this.wordCountHistory = this.wordCountHistory.filter(item => item.time >= thirtySecsAgo);
  }

  private calculateCurrentWPM(): number {
    if (this.wordCountHistory.length < 2) return 135; // Default standard pace
    const first = this.wordCountHistory[0];
    const last = this.wordCountHistory[this.wordCountHistory.length - 1];
    const timeSpanMin = (last.time - first.time) / 60000;
    if (timeSpanMin <= 0) return 135;

    const wordsSpoken = last.count - first.count;
    const wpm = Math.round(wordsSpoken / timeSpanMin);
    return Math.max(40, Math.min(260, wpm || 135));
  }

  onAudioMetrics(callback: (metrics: AudioMetrics) => void) {
    this.onAudioMetricsCallback = callback;
  }

  stopMedia() {
    if (this.audioAnimFrame) cancelAnimationFrame(this.audioAnimFrame);
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}
