import CryptoJS from 'crypto-js';

interface RecognizerCallbacks {
  onStart?: () => void;
  onStop?: () => void;
  onRecognitionResult?: (text: string) => void;
  onProcess?: (volume: number) => void;
  onError?: (error: { code: number; message: string }) => void;
  onStateChange?: (state: string) => void;
}

interface RecognizerConfig {
  appId: string;
  apiKey: string;
  apiSecret: string;
  language?: string;
  domain?: string;
  accent?: string;
}

const logger = {
  info: (msg: string) => console.log('[XfyunASR]', msg),
  warn: (msg: string) => console.warn('[XfyunASR]', msg),
  error: (msg: string) => console.error('[XfyunASR]', msg)
};

export class XfyunVoiceRecognizer {
  private appId: string;
  private apiKey: string;
  private apiSecret: string;
  private language: string;
  private domain: string;
  private accent: string;
  private callbacks: RecognizerCallbacks;
  private state: string;
  private ws: WebSocket | null;
  private stream: MediaStream | null;
  private audioContext: AudioContext | null;
  private mediaRecorder: MediaRecorder | null;
  private analyser: AnalyserNode | null;
  private volumeInterval: number | null;
  private processor: ScriptProcessorNode | null;
  private audioSource: MediaStreamAudioSourceNode | null;
  private audioChunks: Blob[];
  private isFirstFrame: boolean;

  constructor(config: RecognizerConfig, callbacks: RecognizerCallbacks = {}) {
    this.appId = config.appId;
    this.apiKey = config.apiKey;
    this.apiSecret = config.apiSecret;
    this.language = config.language || 'zh_cn';
    this.domain = config.domain || 'iat';
    this.accent = config.accent || 'mandarin';
    this.callbacks = callbacks;
    this.state = 'idle';
    this.ws = null;
    this.stream = null;
    this.audioContext = null;
    this.mediaRecorder = null;
    this.analyser = null;
    this.volumeInterval = null;
    this.processor = null;
    this.audioSource = null;
    this.audioChunks = [];
    this.isFirstFrame = true;
    logger.info('[XfyunASR] 实例创建');
  }

  private setState(newState: string) {
    logger.info('[XfyunASR] 状态变化: ' + this.state + ' -> ' + newState);
    this.state = newState;
    if (this.callbacks.onStateChange) {
      this.callbacks.onStateChange(newState);
    }
  }

  private generateAuthUrl(): string {
    const date = new Date().toUTCString();
    const host = 'iat-api.xfyun.cn';
    const signatureOrigin = 'host: ' + host + '\ndate: ' + date + '\nGET /v2/iat HTTP/1.1';
    const signatureSha = CryptoJS.HmacSHA256(signatureOrigin, this.apiSecret);
    const signature = CryptoJS.enc.Base64.stringify(signatureSha);
    const authorizationOrigin = 'api_key="' + this.apiKey + '", algorithm="hmac-sha256", headers="host date request-line", signature="' + signature + '"';
    const authorization = btoa(authorizationOrigin);
    const url = 'wss://' + host + '/v2/iat?authorization=' + encodeURIComponent(authorization) + '&date=' + encodeURIComponent(date) + '&host=' + encodeURIComponent(host);
    return url;
  }

  private floatTo16BitPCM(input: Float32Array): Uint8Array {
    const output = new Int16Array(input.length);
    for (let i = 0; i < input.length; i++) {
      const s = Math.max(-1, Math.min(1, input[i]));
      output[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }
    return new Uint8Array(output.buffer);
  }

  private sendAudioFrame(audioData: Uint8Array, isLast: boolean = false) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      return;
    }

    const status = this.isFirstFrame ? 0 : (isLast ? 2 : 1);

    const data: any = {
      status: status,
      format: 'audio/L16;rate=16000',
      encoding: 'raw',
      audio: btoa(String.fromCharCode.apply(null, audioData as unknown as number[]))
    };

    if (this.isFirstFrame) {
      const message = {
        common: {
          app_id: this.appId
        },
        business: {
          domain: this.domain,
          language: this.language,
          accent: this.accent,
          vinfo: 1,
          dwa: 'wpgs',
          pd: 'game'
        },
        data: data
      };
      this.ws.send(JSON.stringify(message));
    } else {
      this.ws.send(JSON.stringify({ data: data }));
    }

    this.isFirstFrame = false;
  }

  private parseResult(data: any): string {
    let text = '';
    if (data.data && data.data.result) {
      const resultData = data.data.result;
      if (resultData.ws && Array.isArray(resultData.ws)) {
        for (let i = 0; i < resultData.ws.length; i++) {
          const w = resultData.ws[i];
          if (w.cw && Array.isArray(w.cw)) {
            for (let j = 0; j < w.cw.length; j++) {
              text += w.cw[j].w;
            }
          }
        }
      }
    }
    return text;
  }

  private connectWebSocket() {
    return new Promise<void>((resolve, reject) => {
      const authUrl = this.generateAuthUrl();
      this.setState('connecting');
      logger.info('[XfyunASR] 正在连接 WebSocket');

      this.ws = new WebSocket(authUrl);

      this.ws.onopen = () => {
        logger.info('[XfyunASR] WebSocket 连接成功');
        this.setState('connected');
        resolve();
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          logger.info('[XfyunASR] 收到消息');

          if (data.code !== 0) {
            const errorMsg = '[' + data.code + '] ' + data.message;
            logger.error('[XfyunASR] 错误: ' + errorMsg);
            if (this.callbacks.onError) {
              this.callbacks.onError({ code: data.code, message: data.message });
            }
            this.setState('error');
            this.stop();
            return;
          }

          const text = this.parseResult(data);
          if (text && this.callbacks.onRecognitionResult) {
            this.callbacks.onRecognitionResult(text);
          }

          if (data.data && data.data.status === 2) {
            logger.info('[XfyunASR] 识别结束');
            this.stop();
          }
        } catch (e) {
          logger.error('[XfyunASR] 消息解析错误: ' + e);
        }
      };

      this.ws.onerror = (error) => {
        logger.error('[XfyunASR] WebSocket 错误: ' + error);
        if (this.callbacks.onError) {
          this.callbacks.onError({ code: 99999, message: 'WebSocket 连接失败' });
        }
        this.setState('error');
        reject(error);
      };

      this.ws.onclose = (event) => {
        logger.info('[XfyunASR] WebSocket 连接关闭: ' + event.code + ' ' + event.reason);
        if (this.state !== 'stopped' && this.state !== 'error') {
          this.setState('idle');
        }
      };
    });
  }

  public async start() {
    if (this.state !== 'idle') {
      logger.warn('[XfyunASR] 警告：识别器已经在运行中');
      return;
    }

    this.audioChunks = [];
    this.isFirstFrame = true;

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        sampleRate: 16000,
        channelCount: 1,
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
      }
    });

    this.stream = stream;
    logger.info('[XfyunASR] 成功获取麦克风权限');

    await this.connectWebSocket();

    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    this.audioContext = new AudioContextClass({ sampleRate: 16000 });
    this.audioSource = this.audioContext.createMediaStreamSource(stream);
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 256;
    this.audioSource.connect(this.analyser);

    this.processor = this.audioContext.createScriptProcessor(4096, 1, 1);
    this.audioSource.connect(this.processor);
    this.processor.connect(this.audioContext.destination);

    this.volumeInterval = window.setInterval(() => {
      const dataArray = new Uint8Array(this.analyser!.frequencyBinCount);
      this.analyser!.getByteFrequencyData(dataArray);
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
      }
      const average = sum / dataArray.length;
      if (this.callbacks.onProcess) {
        this.callbacks.onProcess(average / 255);
      }
    }, 100);

    const self = this;
    this.processor.onaudioprocess = (e) => {
      const inputData = e.inputBuffer.getChannelData(0);
      const pcmData = self.floatTo16BitPCM(inputData);
      if (self.ws && self.ws.readyState === WebSocket.OPEN) {
        self.sendAudioFrame(pcmData, false);
      }
    };

    this.mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' });
    this.mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        self.audioChunks.push(e.data);
      }
    };
    this.mediaRecorder.start(100);
    logger.info('[XfyunASR] 使用音频格式: audio/webm');
    logger.info('[XfyunASR] 麦克风和录音器初始化完成');
    logger.info('[XfyunASR] 开始录音');

    this.setState('recording');
    if (this.callbacks.onStart) {
      this.callbacks.onStart();
    }
  }

  public stop() {
    if (this.state !== 'recording') {
      return;
    }

    logger.info('[XfyunASR] 停止录音');

    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const endMsg = {
        data: {
          status: 2,
          format: 'audio/L16;rate=16000',
          encoding: 'raw',
          audio: ''
        }
      };
      this.ws.send(JSON.stringify(endMsg));
    }

    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }

    if (this.processor) {
      this.processor.disconnect();
      this.processor.onaudioprocess = null;
      this.processor = null;
    }

    if (this.audioSource) {
      this.audioSource.disconnect();
      this.audioSource = null;
    }

    if (this.analyser) {
      this.analyser.disconnect();
      this.analyser = null;
    }

    if (this.volumeInterval) {
      clearInterval(this.volumeInterval);
      this.volumeInterval = null;
    }

    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }

    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }

    this.setState('stopped');
    if (this.callbacks.onStop) {
      this.callbacks.onStop();
    }
    // 重置状态为 idle，以便下次可以重新启动
    this.setState('idle');
  }

  public destroy() {
    logger.info('[XfyunASR] XfyunASR 实例已销毁');
    this.stop();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.setState('idle');
  }
}
