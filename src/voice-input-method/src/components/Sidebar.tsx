import { useState, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { SettingsPopover } from './SettingsPopover';

const navItems = [
  {
    path: '/voice',
    label: '语音翻译',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
      </svg>
    ),
  },
  {
    path: '/manual',
    label: '手动翻译',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
      </svg>
    ),
  },
  {
    path: '/document',
    label: '文档翻译',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
  },

];

interface SidebarProps {
  isDark: boolean;
  onToggleTheme: () => void;
}

export const Sidebar = ({ isDark, onToggleTheme }: SidebarProps) => {
  const location = useLocation();
  const [showSettings, setShowSettings] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMouseInside, setIsMouseInside] = useState(false);
  const settingsBtnRef = useRef<HTMLButtonElement>(null);

  const handleMouseEnter = () => {
    setIsMouseInside(true);
    setIsExpanded(true);
  };

  const handleMouseLeave = () => {
    setIsMouseInside(false);
    if (!showSettings) {
      setIsExpanded(false);
    }
  };

  const handleSettingsClose = () => {
    setShowSettings(false);
    if (!isMouseInside) {
      setIsExpanded(false);
    }
  };

  const handlePopoverMouseEnter = () => {
    setIsExpanded(true);
  };

  const handlePopoverMouseLeave = () => {
    if (!isMouseInside && !showSettings) {
      setIsExpanded(false);
    }
  };

  return (
    <aside
      className={`${isExpanded ? 'w-52' : 'w-16'} transition-all duration-300 ease-in-out bg-surface-base border-r border-surface-border-subtle flex flex-col h-screen overflow-hidden relative`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="px-4 py-5 flex items-center gap-3 border-b border-surface-border-subtle">
        <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
          <svg className="w-4.5 h-4.5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802" />
          </svg>
        </div>
        <div className={`transition-opacity duration-200 whitespace-nowrap ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
          <h1 className="text-sm font-display font-semibold text-text-primary tracking-tight">语音输入法</h1>
          <p className="text-[10px] text-text-muted">Voice Input Method</p>
        </div>
      </div>

      <nav className="flex-1 py-3 px-2 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 relative ${
                isActive
                  ? 'bg-accent/10 text-accent'
                  : 'text-text-muted hover:text-text-secondary hover:bg-surface-elevated'
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 bg-accent rounded-r-full" />
              )}
              <span className="flex-shrink-0">{item.icon}</span>
              <span className={`transition-opacity duration-200 text-sm whitespace-nowrap ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </nav>

      <div className="px-2 py-3 border-t border-surface-border-subtle">
        <button
          ref={settingsBtnRef}
          onClick={() => {
            setShowSettings(!showSettings);
            setIsExpanded(true);
          }}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
            showSettings
              ? 'text-accent bg-accent/10'
              : 'text-text-muted hover:text-text-secondary hover:bg-surface-elevated'
          }`}
        >
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className={`transition-opacity duration-200 text-sm whitespace-nowrap ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>设置</span>
        </button>

        {showSettings && settingsBtnRef.current && (
          <SettingsPopover
            isDark={isDark}
            onToggleTheme={onToggleTheme}
            onClose={handleSettingsClose}
            onMouseEnter={handlePopoverMouseEnter}
            onMouseLeave={handlePopoverMouseLeave}
            anchorRect={settingsBtnRef.current.getBoundingClientRect()}
          />
        )}
      </div>
    </aside>
  );
};
