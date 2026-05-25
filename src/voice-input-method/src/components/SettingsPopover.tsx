import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface SettingsPopoverProps {
  isDark: boolean;
  onToggleTheme: () => void;
  onClose: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  anchorRect: DOMRect;
}

export const SettingsPopover = ({
  isDark,
  onToggleTheme,
  onClose,
  onMouseEnter,
  onMouseLeave,
  anchorRect,
}: SettingsPopoverProps) => {
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const style: React.CSSProperties = {
    position: "fixed",
    bottom: window.innerHeight - anchorRect.top + 8,
    left: anchorRect.right + 8,
    width: 208,
  };

  return createPortal(
    <div
      ref={popoverRef}
      style={style}
      className="bg-surface-card border border-surface-border rounded-xl shadow-lg shadow-black/20 p-3 animate-fade-in-up z-50"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {isDark ? (
            <svg
              className="w-4 h-4 text-text-muted"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
              />
            </svg>
          ) : (
            <svg
              className="w-4 h-4 text-text-muted"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
              />
            </svg>
          )}
          <span className="text-sm text-text-primary">
            {isDark ? "夜间模式" : "日间模式"}
          </span>
        </div>
        <button
          onClick={onToggleTheme}
          className="relative w-9 h-5 rounded-full transition-colors duration-200 focus:outline-none"
          style={{
            backgroundColor: isDark
              ? "var(--accent)"
              : "var(--surface-elevated)",
          }}
        >
          <div
            className="absolute top-0.5 w-4 h-4 rounded-full transition-all duration-200"
            style={{
              left: isDark ? "18px" : "2px",
              backgroundColor: isDark
                ? "var(--surface-bg)"
                : "var(--text-muted)",
            }}
          />
        </button>
      </div>
    </div>,
    document.body,
  );
};
