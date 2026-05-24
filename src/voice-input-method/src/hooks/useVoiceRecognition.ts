import { useState, useCallback, useRef, useEffect } from 'react';
import { XfyunVoiceRecognizer } from '../services/xfyunVoice';

const APP_ID = import.meta.env.VITE_XFYUN_APP_ID || '';
const API_KEY = import.meta.env.VITE_XFYUN_API_KEY || '';
const API_SECRET = import.meta.env.VITE_XFYUN_API_SECRET || '';

export const useVoiceRecognition = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);

  const recognizerRef = useRef<XfyunVoiceRecognizer | null>(null);
  const timerRef = useRef<number | null>(null);
  const isStoppingRef = useRef(false);

  useEffect(() => {
    if (!APP_ID || !API_KEY || !API_SECRET) {
      console.warn('讯飞 ASR 未配置，请在 .env 中设置 VITE_XFYUN_APP_ID, VITE_XFYUN_API_KEY, VITE_XFYUN_API_SECRET');
      return;
    }

    const recognizer = new XfyunVoiceRecognizer({
      appId: APP_ID,
      apiKey: API_KEY,
      apiSecret: API_SECRET,
      language: 'zh_cn'
    }, {
      onStart: () => {
        setIsRecording(true);
        setDuration(0);
        timerRef.current = window.setInterval(() => {
          setDuration(prev => prev + 1);
        }, 1000);
      },
      onStop: () => {
        setIsRecording(false);
        if (timerRef.current !== null) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      },
      onRecognitionResult: (text) => {
        setTranscript(prev => prev + text);
      },
      onError: (err) => {
        const msg = err.code ? '[' + err.code + '] ' + err.message : err.message;
        setError('语音识别失败: ' + msg);
        console.error('XfyunASR error:', { code: err.code, message: err.message });
        setIsRecording(false);
        setIsProcessing(false);
        if (timerRef.current !== null) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      }
    });

    recognizerRef.current = recognizer;

    return () => {
      if (recognizerRef.current) {
        recognizerRef.current.destroy();
      }
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      setTranscript('');
      isStoppingRef.current = false;
      
      const recognizer = recognizerRef.current;
      if (!recognizer) {
        setError('讯飞 ASR 未初始化，请检查 API 配置');
        return;
      }

      await recognizer.start();
    } catch (err: any) {
      const msg = err?.name === 'NotAllowedError' || err?.name === 'PermissionDeniedError'
        ? '无法访问麦克风，请检查权限设置'
        : err?.message?.includes('WebSocket') || err?.code === 99999
        ? '语音服务连接失败，请检查网络和 API 配置'
        : err instanceof Error
        ? err.message
        : '启动录音失败';
      setError(msg);
      console.error('Recording error:', err);
    }
  }, []);

  const stopRecording = useCallback(async () => {
    if (isStoppingRef.current) return;
    isStoppingRef.current = true;

    const recognizer = recognizerRef.current;
    if (!recognizer) {
      isStoppingRef.current = false;
      return;
    }

    setIsProcessing(true);
    
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setIsRecording(false);

    try {
      recognizer.stop();
    } catch (err) {
      setError(err instanceof Error ? err.message : '识别失败');
      console.error('Stop recognition error:', err);
    }

    setIsProcessing(false);
    isStoppingRef.current = false;
  }, []);

  const clearTranscript = useCallback(() => {
    setTranscript('');
    setError(null);
    setDuration(0);
  }, []);

  return {
    isRecording,
    isProcessing,
    transcript,
    error,
    duration,
    startRecording,
    stopRecording,
    clearTranscript,
  };
};
