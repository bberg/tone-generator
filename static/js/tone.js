/**
 * Tone Generator - Web Audio API Implementation
 * Generates pure tones with sine, square, sawtooth, and triangle waveforms
 */

class ToneGenerator {
    constructor() {
        this.audioContext = null;
        this.masterGain = null;
        this.analyser = null;

        // Primary oscillator
        this.oscillator1 = null;
        this.gain1 = null;

        // Secondary oscillator (dual tone mode)
        this.oscillator2 = null;
        this.gain2 = null;
        this.dualToneEnabled = false;

        this.isPlaying = false;

        // Settings
        this.settings = {
            frequency1: 440,
            frequency2: 554,
            waveform: 'sine',
            volume: 0.5,
            volume2: 0.5,
            attack: 10,
            release: 50
        };

        // Note names for display
        this.noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

        // Visualization
        this.canvas = null;
        this.canvasCtx = null;
        this.animationId = null;

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupCanvas();
        this.updateNoteDisplay();
        this.updateWaveformInfo();
    }

    initAudioContext() {
        if (this.audioContext) return;

        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();

        // Create master gain
        this.masterGain = this.audioContext.createGain();
        this.masterGain.gain.value = this.settings.volume;

        // Create analyser for visualization
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 2048;

        // Connect master gain to analyser to destination
        this.masterGain.connect(this.analyser);
        this.analyser.connect(this.audioContext.destination);

        // Create gain nodes for each oscillator
        this.gain1 = this.audioContext.createGain();
        this.gain1.gain.value = 0;
        this.gain1.connect(this.masterGain);

        this.gain2 = this.audioContext.createGain();
        this.gain2.gain.value = 0;
        this.gain2.connect(this.masterGain);
    }

    createOscillator(frequency, gainNode) {
        const osc = this.audioContext.createOscillator();
        osc.type = this.settings.waveform;
        osc.frequency.value = frequency;
        osc.connect(gainNode);
        osc.start();
        return osc;
    }

    play() {
        this.initAudioContext();

        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }

        // Create primary oscillator
        this.oscillator1 = this.createOscillator(this.settings.frequency1, this.gain1);

        // Fade in primary
        const attackTime = this.settings.attack / 1000;
        this.gain1.gain.setValueAtTime(0, this.audioContext.currentTime);
        this.gain1.gain.linearRampToValueAtTime(1, this.audioContext.currentTime + attackTime);

        // Create secondary oscillator if dual tone enabled
        if (this.dualToneEnabled) {
            this.oscillator2 = this.createOscillator(this.settings.frequency2, this.gain2);
            this.gain2.gain.setValueAtTime(0, this.audioContext.currentTime);
            this.gain2.gain.linearRampToValueAtTime(this.settings.volume2, this.audioContext.currentTime + attackTime);
        }

        this.isPlaying = true;
        this.updatePlayButton();
        this.updateStatus('playing');
        this.startVisualization();
    }

    stop() {
        if (!this.audioContext) return;

        const releaseTime = this.settings.release / 1000;
        const now = this.audioContext.currentTime;

        // Fade out primary
        if (this.gain1) {
            this.gain1.gain.setValueAtTime(this.gain1.gain.value, now);
            this.gain1.gain.linearRampToValueAtTime(0, now + releaseTime);
        }

        // Fade out secondary
        if (this.gain2) {
            this.gain2.gain.setValueAtTime(this.gain2.gain.value, now);
            this.gain2.gain.linearRampToValueAtTime(0, now + releaseTime);
        }

        // Stop oscillators after fade out
        setTimeout(() => {
            if (this.oscillator1) {
                this.oscillator1.stop();
                this.oscillator1.disconnect();
                this.oscillator1 = null;
            }
            if (this.oscillator2) {
                this.oscillator2.stop();
                this.oscillator2.disconnect();
                this.oscillator2 = null;
            }
        }, releaseTime * 1000 + 50);

        this.isPlaying = false;
        this.updatePlayButton();
        this.updateStatus('ready');
        this.stopVisualization();
    }

    toggle() {
        if (this.isPlaying) {
            this.stop();
        } else {
            this.play();
        }
    }

    setFrequency(freq, oscillatorNum = 1) {
        freq = Math.max(20, Math.min(20000, freq));

        if (oscillatorNum === 1) {
            this.settings.frequency1 = freq;
            if (this.oscillator1) {
                this.oscillator1.frequency.setTargetAtTime(freq, this.audioContext.currentTime, 0.01);
            }
            this.updateNoteDisplay();
            this.updateWaveformInfo();
            this.updateFrequencyDisplay(freq);
        } else {
            this.settings.frequency2 = freq;
            if (this.oscillator2) {
                this.oscillator2.frequency.setTargetAtTime(freq, this.audioContext.currentTime, 0.01);
            }
            this.updateFrequency2Display(freq);
        }
    }

    setWaveform(type) {
        this.settings.waveform = type;
        if (this.oscillator1) {
            this.oscillator1.type = type;
        }
        if (this.oscillator2) {
            this.oscillator2.type = type;
        }
        this.updateWaveformInfo();

        // Update waveform buttons
        document.querySelectorAll('[data-waveform]').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.waveform === type) {
                btn.classList.add('active');
            }
        });
    }

    setMasterVolume(value) {
        this.settings.volume = value;
        if (this.masterGain) {
            this.masterGain.gain.setTargetAtTime(value, this.audioContext.currentTime, 0.05);
        }
    }

    setVolume2(value) {
        this.settings.volume2 = value;
        if (this.gain2 && this.dualToneEnabled && this.isPlaying) {
            this.gain2.gain.setTargetAtTime(value, this.audioContext.currentTime, 0.05);
        }
    }

    enableDualTone(enabled) {
        this.dualToneEnabled = enabled;

        const controls = document.getElementById('dualToneControls');
        if (enabled) {
            controls.classList.add('active');
            if (this.isPlaying) {
                // Start second oscillator
                this.oscillator2 = this.createOscillator(this.settings.frequency2, this.gain2);
                this.gain2.gain.setTargetAtTime(this.settings.volume2, this.audioContext.currentTime, 0.05);
            }
        } else {
            controls.classList.remove('active');
            if (this.oscillator2) {
                this.gain2.gain.setTargetAtTime(0, this.audioContext.currentTime, 0.05);
                setTimeout(() => {
                    if (this.oscillator2) {
                        this.oscillator2.stop();
                        this.oscillator2.disconnect();
                        this.oscillator2 = null;
                    }
                }, 100);
            }
        }
    }

    setIntervalFromBase(ratio) {
        const newFreq = this.settings.frequency1 * ratio;
        this.setFrequency(newFreq, 2);

        // Update slider and input
        document.getElementById('frequencySlider2').value = newFreq;
        document.getElementById('frequencyInput2').value = Math.round(newFreq * 100) / 100;

        // Update interval button states
        document.querySelectorAll('.interval-btn').forEach(btn => {
            btn.classList.remove('active');
            if (parseFloat(btn.dataset.interval) === ratio) {
                btn.classList.add('active');
            }
        });
    }

    // Helper: frequency to note name
    frequencyToNote(freq) {
        // A4 = 440 Hz, MIDI note 69
        const noteNum = 12 * (Math.log2(freq / 440)) + 69;
        const noteIndex = Math.round(noteNum) % 12;
        const octave = Math.floor(Math.round(noteNum) / 12) - 1;
        const cents = Math.round((noteNum - Math.round(noteNum)) * 100);

        return {
            name: this.noteNames[noteIndex < 0 ? noteIndex + 12 : noteIndex],
            octave: octave,
            cents: cents
        };
    }

    updateNoteDisplay() {
        const note = this.frequencyToNote(this.settings.frequency1);
        document.getElementById('noteValue').textContent = `${note.name}${note.octave}`;

        const centsText = note.cents === 0 ? '0 cents' :
            (note.cents > 0 ? `+${note.cents} cents` : `${note.cents} cents`);
        document.getElementById('noteCents').textContent = centsText;
    }

    updateFrequencyDisplay(freq) {
        document.getElementById('frequencySlider').value = freq;
        document.getElementById('frequencyInput').value = Math.round(freq * 100) / 100;
        document.getElementById('frequencyValue').textContent = freq.toFixed(1) + ' Hz';
    }

    updateFrequency2Display(freq) {
        const note = this.frequencyToNote(freq);
        document.getElementById('frequencyValue2').textContent =
            `${freq.toFixed(1)} Hz (${note.name}${note.octave})`;
    }

    updateWaveformInfo() {
        const waveformNames = {
            'sine': 'Sine',
            'square': 'Square',
            'sawtooth': 'Sawtooth',
            'triangle': 'Triangle'
        };
        document.getElementById('waveformInfo').textContent =
            `${waveformNames[this.settings.waveform]} @ ${this.settings.frequency1.toFixed(1)} Hz`;
    }

    updatePlayButton() {
        const btn = document.getElementById('playButton');
        const icon = btn.querySelector('i');
        const text = btn.querySelector('span');

        if (this.isPlaying) {
            btn.classList.add('playing');
            icon.className = 'ri-stop-fill';
            text.textContent = 'Stop';
        } else {
            btn.classList.remove('playing');
            icon.className = 'ri-play-fill';
            text.textContent = 'Play';
        }
    }

    updateStatus(state) {
        const badge = document.getElementById('statusBadge');
        const text = badge.querySelector('.status-text');

        badge.className = 'status-badge ' + state;
        text.textContent = state === 'playing' ? 'Playing' : 'Ready';
    }

    applyPreset(preset) {
        const presets = {
            'a440': { freq: 440 },
            'middleC': { freq: 261.63 },
            'bass': { freq: 100 },
            'treble': { freq: 1000 }
        };

        if (presets[preset]) {
            this.setFrequency(presets[preset].freq, 1);
            if (!this.isPlaying) {
                this.play();
            }
        }
    }

    // Visualization
    setupCanvas() {
        this.canvas = document.getElementById('waveformCanvas');
        if (!this.canvas) return;

        this.canvasCtx = this.canvas.getContext('2d');
        this.resizeCanvas();

        window.addEventListener('resize', () => this.resizeCanvas());

        // Draw initial waveform shape
        this.drawStaticWaveform();
    }

    resizeCanvas() {
        if (!this.canvas) return;

        const container = this.canvas.parentElement;
        const dpr = window.devicePixelRatio || 1;

        this.canvas.width = container.clientWidth * dpr;
        this.canvas.height = 120 * dpr;

        this.canvas.style.width = container.clientWidth + 'px';
        this.canvas.style.height = '120px';

        this.canvasCtx.scale(dpr, dpr);

        if (!this.isPlaying) {
            this.drawStaticWaveform();
        }
    }

    drawStaticWaveform() {
        if (!this.canvasCtx) return;

        const width = this.canvas.width / (window.devicePixelRatio || 1);
        const height = this.canvas.height / (window.devicePixelRatio || 1);

        this.canvasCtx.fillStyle = '#000';
        this.canvasCtx.fillRect(0, 0, width, height);

        // Draw a preview of the current waveform type
        this.canvasCtx.strokeStyle = '#333';
        this.canvasCtx.lineWidth = 1;
        this.canvasCtx.beginPath();
        this.canvasCtx.moveTo(0, height / 2);
        this.canvasCtx.lineTo(width, height / 2);
        this.canvasCtx.stroke();

        // Draw preview waveform
        this.canvasCtx.strokeStyle = 'rgba(16, 185, 129, 0.3)';
        this.canvasCtx.lineWidth = 2;
        this.canvasCtx.beginPath();

        const cycles = 3;
        const amplitude = height * 0.35;
        const centerY = height / 2;

        for (let x = 0; x < width; x++) {
            const t = (x / width) * cycles * 2 * Math.PI;
            let y;

            switch (this.settings.waveform) {
                case 'sine':
                    y = Math.sin(t);
                    break;
                case 'square':
                    y = Math.sin(t) > 0 ? 1 : -1;
                    break;
                case 'sawtooth':
                    y = ((t % (2 * Math.PI)) / Math.PI) - 1;
                    break;
                case 'triangle':
                    y = (2 / Math.PI) * Math.asin(Math.sin(t));
                    break;
                default:
                    y = Math.sin(t);
            }

            const screenY = centerY - y * amplitude;

            if (x === 0) {
                this.canvasCtx.moveTo(x, screenY);
            } else {
                this.canvasCtx.lineTo(x, screenY);
            }
        }

        this.canvasCtx.stroke();
    }

    startVisualization() {
        if (!this.analyser) return;

        const draw = () => {
            if (!this.isPlaying) return;

            this.animationId = requestAnimationFrame(draw);

            const bufferLength = this.analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);
            this.analyser.getByteTimeDomainData(dataArray);

            const width = this.canvas.width / (window.devicePixelRatio || 1);
            const height = this.canvas.height / (window.devicePixelRatio || 1);

            this.canvasCtx.fillStyle = '#000';
            this.canvasCtx.fillRect(0, 0, width, height);

            this.canvasCtx.lineWidth = 2;
            this.canvasCtx.strokeStyle = '#10b981';
            this.canvasCtx.beginPath();

            const sliceWidth = width / bufferLength;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
                const v = dataArray[i] / 128.0;
                const y = (v * height) / 2;

                if (i === 0) {
                    this.canvasCtx.moveTo(x, y);
                } else {
                    this.canvasCtx.lineTo(x, y);
                }

                x += sliceWidth;
            }

            this.canvasCtx.lineTo(width, height / 2);
            this.canvasCtx.stroke();
        };

        draw();
    }

    stopVisualization() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        this.drawStaticWaveform();
    }

    setupEventListeners() {
        // Play button
        document.getElementById('playButton')?.addEventListener('click', () => {
            this.toggle();
        });

        // Waveform buttons
        document.querySelectorAll('[data-waveform]').forEach(btn => {
            btn.addEventListener('click', () => {
                this.setWaveform(btn.dataset.waveform);
                this.drawStaticWaveform();
            });
        });

        // Preset buttons
        document.querySelectorAll('[data-preset]').forEach(btn => {
            btn.addEventListener('click', () => {
                this.applyPreset(btn.dataset.preset);
            });
        });

        // Frequency slider
        const freqSlider = document.getElementById('frequencySlider');
        freqSlider?.addEventListener('input', (e) => {
            this.setFrequency(parseFloat(e.target.value), 1);
        });

        // Frequency input
        const freqInput = document.getElementById('frequencyInput');
        freqInput?.addEventListener('change', (e) => {
            this.setFrequency(parseFloat(e.target.value), 1);
        });

        // Fine tune buttons
        document.querySelectorAll('.fine-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const adjust = parseFloat(btn.dataset.adjust);
                this.setFrequency(this.settings.frequency1 + adjust, 1);
            });
        });

        // Master volume
        const volumeSlider = document.getElementById('volume');
        const volumeDisplay = document.getElementById('volumeValue');
        volumeSlider?.addEventListener('input', (e) => {
            const value = e.target.value / 100;
            volumeDisplay.textContent = Math.round(value * 100) + '%';
            this.setMasterVolume(value);
        });

        // Attack
        const attackSlider = document.getElementById('attack');
        const attackDisplay = document.getElementById('attackValue');
        attackSlider?.addEventListener('input', (e) => {
            this.settings.attack = parseInt(e.target.value);
            attackDisplay.textContent = e.target.value + ' ms';
        });

        // Release
        const releaseSlider = document.getElementById('release');
        const releaseDisplay = document.getElementById('releaseValue');
        releaseSlider?.addEventListener('input', (e) => {
            this.settings.release = parseInt(e.target.value);
            releaseDisplay.textContent = e.target.value + ' ms';
        });

        // Dual tone toggle
        const dualToneCheckbox = document.getElementById('dualToneEnabled');
        dualToneCheckbox?.addEventListener('change', (e) => {
            this.enableDualTone(e.target.checked);
        });

        // Frequency 2 slider
        const freq2Slider = document.getElementById('frequencySlider2');
        freq2Slider?.addEventListener('input', (e) => {
            this.setFrequency(parseFloat(e.target.value), 2);
            // Clear interval button active state
            document.querySelectorAll('.interval-btn').forEach(btn => btn.classList.remove('active'));
        });

        // Frequency 2 input
        const freq2Input = document.getElementById('frequencyInput2');
        freq2Input?.addEventListener('change', (e) => {
            this.setFrequency(parseFloat(e.target.value), 2);
            document.querySelectorAll('.interval-btn').forEach(btn => btn.classList.remove('active'));
        });

        // Volume 2
        const volume2Slider = document.getElementById('volume2');
        const volume2Display = document.getElementById('volumeValue2');
        volume2Slider?.addEventListener('input', (e) => {
            const value = e.target.value / 100;
            volume2Display.textContent = Math.round(value * 100) + '%';
            this.setVolume2(value);
        });

        // Interval buttons
        document.querySelectorAll('.interval-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.setIntervalFromBase(parseFloat(btn.dataset.interval));
                if (!this.dualToneEnabled) {
                    document.getElementById('dualToneEnabled').checked = true;
                    this.enableDualTone(true);
                }
            });
        });

        // Frequency preset buttons
        document.querySelectorAll('.freq-preset-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const freq = parseFloat(btn.dataset.freq);
                this.setFrequency(freq, 1);
                if (!this.isPlaying) {
                    this.play();
                }
            });
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT') return;

            if (e.code === 'Space') {
                e.preventDefault();
                this.toggle();
            }

            // Arrow keys for frequency adjustment
            if (e.code === 'ArrowUp') {
                e.preventDefault();
                this.setFrequency(this.settings.frequency1 + (e.shiftKey ? 10 : 1), 1);
            }
            if (e.code === 'ArrowDown') {
                e.preventDefault();
                this.setFrequency(this.settings.frequency1 - (e.shiftKey ? 10 : 1), 1);
            }
        });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.toneGenerator = new ToneGenerator();
});
