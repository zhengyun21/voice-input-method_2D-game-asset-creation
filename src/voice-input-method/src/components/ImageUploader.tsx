import { useCallback, useRef, useState } from 'react';

interface ImageUploaderProps {
  onImageSelect: (file: File, base64: string) => void;
  isProcessing: boolean;
  previewUrl?: string;
}

export const ImageUploader = ({ onImageSelect, isProcessing, previewUrl }: ImageUploaderProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      const base64 = result.split(',')[1];
      onImageSelect(file, base64);
    };
    reader.readAsDataURL(file);
  }, [onImageSelect]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, [processFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    if (inputRef.current) inputRef.current.value = '';
  }, [processFile]);

  if (previewUrl) {
    return (
      <div className="dark-card overflow-hidden">
        <div className="relative">
          <img
            src={previewUrl}
            alt="上传的图片"
            className="w-full max-h-80 object-contain bg-surface-bg"
          />
          {!isProcessing && (
            <button
              onClick={() => inputRef.current?.click()}
              className="absolute top-3 right-3 p-2 bg-surface-base/80 backdrop-blur-sm rounded-lg text-text-secondary hover:text-text-primary transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
              </svg>
            </button>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />
      </div>
    );
  }

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
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />
      <div className="flex flex-col items-center gap-4">
        <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-colors ${
          isDragOver ? 'bg-accent/15' : 'bg-surface-elevated'
        }`}>
          <svg className={`w-7 h-7 transition-colors ${isDragOver ? 'text-accent' : 'text-text-muted'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M2.25 18V6a2.25 2.25 0 012.25-2.25h15A2.25 2.25 0 0121.75 6v12A2.25 2.25 0 0119.5 20.25H4.5A2.25 2.25 0 012.25 18z" />
          </svg>
        </div>
        <div>
          <p className="text-sm text-text-secondary mb-1">
            {isDragOver ? '松开以上传图片' : '拖拽图片到此处，或点击选择'}
          </p>
          <p className="text-xs text-text-muted">支持 JPG / PNG / GIF / WebP 格式</p>
        </div>
      </div>
    </div>
  );
};
