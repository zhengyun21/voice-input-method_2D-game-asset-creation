import { useCallback, useRef, useState } from 'react';
import { getAcceptedMimeTypes } from '../services/documentParser';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
}

export const FileUploader = ({ onFileSelect, isProcessing }: FileUploaderProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) onFileSelect(file);
  }, [onFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
    if (inputRef.current) inputRef.current.value = '';
  }, [onFileSelect]);

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() => !isProcessing && inputRef.current?.click()}
      className={`dark-card p-8 text-center cursor-pointer transition-all duration-200 ${
        isDragOver
          ? 'border-accent/50 bg-accent/5'
          : isProcessing
          ? 'opacity-60 cursor-wait'
          : 'hover:border-accent/30'
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={getAcceptedMimeTypes()}
        onChange={handleChange}
        className="hidden"
      />
      <div className="flex flex-col items-center gap-4">
        <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-colors ${
          isDragOver ? 'bg-accent/15' : 'bg-surface-elevated'
        }`}>
          <svg className={`w-7 h-7 transition-colors ${isDragOver ? 'text-accent' : 'text-text-muted'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
        </div>
        <div>
          <p className="text-sm text-text-secondary mb-1">
            {isDragOver ? '松开以上传文件' : '拖拽文件到此处，或点击选择'}
          </p>
          <p className="text-xs text-text-muted">支持 .txt / .docx / .pdf / .pptx 格式</p>
        </div>
      </div>
    </div>
  );
};
