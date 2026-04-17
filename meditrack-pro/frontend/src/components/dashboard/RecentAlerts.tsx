import { AlertTriangle, Info, XCircle, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useAlerts } from '../../hooks/useAlerts';
import type { Alert } from '../../types';

const alertConfig = {
  error: {
    bgClass: 'bg-error/5 border-l-2 border-error',
    iconClass: 'text-error',
    timeClass: 'text-error/60',
    Icon: XCircle,
  },
  warning: {
    bgClass: 'bg-tertiary/5 border-l-2 border-tertiary',
    iconClass: 'text-tertiary',
    timeClass: 'text-tertiary/60',
    Icon: AlertTriangle,
  },
  info: {
    bgClass: 'bg-surface-container-highest border-l-2 border-outline-variant',
    iconClass: 'text-on-surface-variant',
    timeClass: 'text-on-surface-variant/40',
    Icon: Info,
  },
};

function AlertItem({ alert, onDelete }: { alert: Alert; onDelete: (id: string) => void }) {
  const config = alertConfig[alert.severity] || alertConfig.info;
  const { bgClass, iconClass, timeClass, Icon } = config;

  return (
    <div className={`flex gap-3 p-3 rounded-lg relative group ${bgClass}`}>
      <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconClass}`} />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-on-surface truncate">{alert.title}</p>
        <p className="text-[10px] text-on-surface-variant mt-0.5 line-clamp-2">{alert.message}</p>
        <p className={`text-[9px] mt-1 font-semibold uppercase ${timeClass}`}>
          {formatDistanceToNow(new Date(alert.createdAt), { addSuffix: true })}
        </p>
      </div>
      <button
        onClick={() => onDelete(alert._id)}
        className="opacity-0 group-hover:opacity-100 text-on-surface/30 hover:text-on-surface transition-all absolute top-2 right-2"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}

export default function RecentAlerts() {
  const { data: alerts, isLoading, deleteMutation, clearAllMutation } = useAlerts();

  const recentAlerts = alerts?.slice(0, 5) ?? [];

  return (
    <div className="bg-surface-container p-6 rounded-xl">
      <div className="flex justify-between items-center mb-5">
        <h3 className="font-headline text-sm font-bold text-on-surface">Recent Alerts</h3>
        <button
          onClick={() => clearAllMutation.mutate()}
          className="text-[10px] text-primary font-bold hover:underline cursor-pointer"
        >
          Clear All
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-surface-container-highest rounded-lg animate-pulse-soft" />
          ))}
        </div>
      ) : recentAlerts.length === 0 ? (
        <div className="text-center py-8 text-on-surface-variant text-xs">
          <Info className="w-8 h-8 mx-auto mb-2 opacity-30" />
          No recent alerts
        </div>
      ) : (
        <div className="space-y-3">
          {recentAlerts.map((alert) => (
            <AlertItem
              key={alert._id}
              alert={alert}
              onDelete={(id) => deleteMutation.mutate(id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
