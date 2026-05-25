import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { useTheme } from '../hooks/useTheme';

export const AppLayout = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="flex h-screen bg-surface-bg font-body overflow-hidden">
      <Sidebar isDark={isDark} onToggleTheme={toggleTheme} />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};
