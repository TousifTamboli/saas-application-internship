import { Bell, Settings, HelpCircle, Search } from 'lucide-react';
import { useAlerts } from '../../hooks/useAlerts';
import { useAuthStore } from '../../store/authStore';

export default function TopBar() {
  const { unreadCount } = useAlerts();
  const { user } = useAuthStore();

  return (
    <header className="fixed top-0 right-0 w-[calc(100%-256px)] h-16 bg-surface z-40 flex justify-between items-center px-8 border-b border-outline-variant/10">
      {/* Search */}
      <div className="flex items-center bg-surface-container-low px-4 py-2 rounded-md w-96 gap-3">
        <Search className="w-4 h-4 text-on-surface-variant/50 flex-shrink-0" />
        <input
          type="text"
          placeholder="Search medical equipment, logs, or staff..."
          className="bg-transparent border-none focus:outline-none text-xs w-full text-on-surface placeholder:text-on-surface-variant/40"
        />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-4">
          {/* Bell with badge */}
          <div className="relative">
            <button className="text-on-surface-variant hover:text-primary transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-error text-on-error rounded-full text-[9px] font-bold flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </div>
          <button className="text-on-surface-variant hover:text-primary transition-colors">
            <Settings className="w-5 h-5" />
          </button>
          <button className="text-on-surface-variant hover:text-primary transition-colors">
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>

        <div className="h-6 w-px bg-outline-variant/30" />

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-primary/40 transition-all">
          <span className="text-primary font-bold text-xs">
            {user?.name?.charAt(0).toUpperCase() || 'A'}
          </span>
        </div>
      </div>
    </header>
  );
}
