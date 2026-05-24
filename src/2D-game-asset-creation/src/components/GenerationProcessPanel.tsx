import { Check, X, Loader2 } from 'lucide-react';
import type { GenerationProcess } from '../types';

interface GenerationProcessPanelProps {
  process: GenerationProcess;
}

function StepIndicator({ status }: { status: string }) {
  switch (status) {
    case 'done':
      return (
        <div className="w-5 h-5 rounded-full bg-emerald flex items-center justify-center shrink-0">
          <Check className="w-3 h-3 text-txt-inverse" />
        </div>
      );
    case 'active':
      return (
        <div className="w-5 h-5 rounded-full bg-amber flex items-center justify-center shrink-0 animate-pulse">
          <Loader2 className="w-3 h-3 text-txt-inverse animate-spin-slow" />
        </div>
      );
    case 'error':
      return (
        <div className="w-5 h-5 rounded-full bg-rose flex items-center justify-center shrink-0">
          <X className="w-3 h-3 text-txt-inverse" />
        </div>
      );
    default:
      return (
        <div className="w-5 h-5 rounded-full border-2 border-edge shrink-0" />
      );
  }
}

function statusText(status: string): string {
  switch (status) {
    case 'done': return '完成';
    case 'active': return '处理中...';
    case 'error': return '失败';
    default: return '等待中';
  }
}

export function GenerationProcessPanel({ process }: GenerationProcessPanelProps) {
  if (!process.isActive && process.steps.every(s => s.status === 'pending')) {
    return null;
  }

  return (
    <div>
      <div className="section-label">生成过程</div>
      <div className="bg-surface-2 border border-edge rounded-lg p-4">
        <div className="space-y-0">
          {process.steps.map((step, index) => (
            <div key={index} className="flex gap-3">
              <div className="flex flex-col items-center">
                <StepIndicator status={step.status} />
                {index < process.steps.length - 1 && (
                  <div className={`w-px flex-1 min-h-[16px] ${
                    step.status === 'done' ? 'bg-emerald/40' : 'bg-edge'
                  }`} />
                )}
              </div>
              <div className="flex-1 pb-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-txt-primary">{step.label}</span>
                  <span className={`text-[10px] font-mono ${
                    step.status === 'done' ? 'text-emerald' :
                    step.status === 'active' ? 'text-amber' :
                    step.status === 'error' ? 'text-rose' :
                    'text-txt-tertiary'
                  }`}>
                    {statusText(step.status)}
                  </span>
                </div>
                {(step.status === 'done' || step.status === 'active' || step.status === 'error') && step.content && (
                  <div className="bg-surface-3 border border-edge rounded-md p-2.5 mt-1.5 max-h-32 overflow-y-auto">
                    <p className="text-[11px] font-mono text-txt-secondary leading-relaxed break-all">
                      {step.content}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
