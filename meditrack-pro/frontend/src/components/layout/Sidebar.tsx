import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, Wrench, Users, BarChart3,
  Activity, Plus, LogOut
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useState } from 'react';
import AddEquipmentModal from '../equipment/AddEquipmentModal';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/inventory', icon: Package, label: 'Inventory' },
  { to: '/maintenance', icon: Wrench, label: 'Maintenance' },
  { to: '/staff', icon: Users, label: 'Staff' },
  { to: '/reports', icon: BarChart3, label: 'Reports' },
];

export default function Sidebar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <aside className="h-screen w-64 fixed left-0 top-0 glass-panel flex flex-col py-6 z-50 border-r border-outline-variant/10">
        {/* Logo */}
        <div className="px-6 mb-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <Activity className="w-5 h-5 text-primary" />
            </div>
            <h1 className="font-headline text-lg font-bold text-on-surface tracking-tight">
              MediTrack Pro
            </h1>
          </div>
          <p className="text-[10px] uppercase tracking-widest text-on-surface/30 mt-1.5 ml-10">
            Clinical Precision
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-0.5">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group relative ${
                  isActive
                    ? 'text-primary-container bg-primary/10 border-r-2 border-primary-container'
                    : 'text-on-surface/50 hover:bg-surface-container hover:text-on-surface'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-primary-container' : 'text-on-surface/40 group-hover:text-on-surface/70'}`} />
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom section */}
        <div className="px-4 mt-auto space-y-4">
          <button
            onClick={() => setShowAddModal(true)}
            className="w-full bg-primary-container hover:bg-primary text-on-primary py-3 rounded-md font-semibold text-xs transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Quick Add Equipment
          </button>

          {/* User info */}
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <span className="text-primary font-bold text-sm">
                {user?.name?.charAt(0).toUpperCase() || 'A'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate text-on-surface">{user?.name || 'Admin'}</p>
              <p className="text-[10px] text-on-surface-variant truncate">{user?.role || 'Administrator'}</p>
            </div>
            <button
              onClick={handleLogout}
              className="text-on-surface/30 hover:text-error transition-colors flex-shrink-0"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {showAddModal && <AddEquipmentModal onClose={() => setShowAddModal(false)} />}
    </>
  );
}
