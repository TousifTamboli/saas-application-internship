import { Shield, ShieldAlert, ShieldOff } from 'lucide-react';
import type { EnhancedStats } from '../../types';

interface Props {
  warranty: EnhancedStats['warranty'];
}

export default function WarrantyTracker({ warranty }: Props) {
  const total = warranty.valid + warranty.expiring + warranty.expired;
  const items = [
    { label: 'Valid', count: warranty.valid, icon: Shield, color: 'text-primary', bg: 'bg-primary/10', pct: total > 0 ? Math.round((warranty.valid / total) * 100) : 0, barColor: 'bg-primary' },
    { label: 'Expiring Soon', count: warranty.expiring, icon: ShieldAlert, color: 'text-tertiary', bg: 'bg-tertiary/10', pct: total > 0 ? Math.round((warranty.expiring / total) * 100) : 0, barColor: 'bg-tertiary' },
    { label: 'Expired', count: warranty.expired, icon: ShieldOff, color: 'text-error', bg: 'bg-error/10', pct: total > 0 ? Math.round((warranty.expired / total) * 100) : 0, barColor: 'bg-error' },
  ];

  return (
    <div className="bg-surface-container p-6 rounded-xl">
      <h3 className="font-headline text-sm font-bold text-on-surface mb-5">Warranty Tracker</h3>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.label}>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <div className={`p-1 rounded ${item.bg}`}>
                  <item.icon className={`w-3.5 h-3.5 ${item.color}`} />
                </div>
                <span className="text-xs text-on-surface-variant font-medium">{item.label}</span>
              </div>
              <span className="text-xs font-bold text-on-surface">{item.count}</span>
            </div>
            <div className="h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${item.barColor}`}
                style={{ width: `${item.pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
