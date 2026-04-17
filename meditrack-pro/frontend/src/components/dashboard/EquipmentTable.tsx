import { format } from 'date-fns';
import { Activity, Cpu, Heart, Wind } from 'lucide-react';
import type { Equipment } from '../../types';
import { cn } from '../../lib/utils';

const typeIcons: Record<string, React.ReactNode> = {
  'CT Scanner': <Cpu className="w-5 h-5" />,
  'MRI': <Activity className="w-5 h-5" />,
  'Ventilator': <Wind className="w-5 h-5" />,
  'Patient Monitor': <Heart className="w-5 h-5" />,
  'default': <Activity className="w-5 h-5" />,
};

function StatusBadge({ status }: { status: Equipment['status'] }) {
  const config = {
    Active: { cls: 'bg-primary/10 text-primary', dot: 'bg-primary' },
    Maintenance: { cls: 'bg-tertiary/10 text-tertiary', dot: 'bg-tertiary' },
    Offline: { cls: 'bg-error/10 text-error', dot: 'bg-error' },
  };
  const { cls, dot } = config[status];
  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold', cls)}>
      <span className={cn('w-1.5 h-1.5 rounded-full', dot)} />
      {status}
    </span>
  );
}

interface EquipmentTableProps {
  equipment: Equipment[];
  isLoading: boolean;
}

export default function EquipmentTable({ equipment, isLoading }: EquipmentTableProps) {
  if (isLoading) {
    return (
      <div className="bg-surface-container rounded-xl overflow-hidden">
        <div className="space-y-1 p-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 bg-surface-container-high rounded-lg animate-pulse-soft" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface-container rounded-xl overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-surface-container-high">
          <tr>
            {['Equipment', 'Status', 'Department', 'Last Serviced'].map((h) => (
              <th key={h} className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-outline-variant/10">
          {equipment.map((equip) => {
            const Icon = typeIcons[equip.type] || typeIcons['default'];
            const iconColor = equip.status === 'Active' ? 'text-primary' : equip.status === 'Maintenance' ? 'text-tertiary' : 'text-error';
            return (
              <tr key={equip._id} className="hover:bg-surface-container-low transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-surface-container-highest flex items-center justify-center flex-shrink-0">
                      <span className={iconColor}>{Icon}</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-on-surface">{equip.name}</p>
                      <p className="text-[10px] text-on-surface-variant">SN: {equip.serialNumber}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={equip.status} />
                </td>
                <td className="px-6 py-4 text-sm text-on-surface-variant">{equip.department}</td>
                <td className="px-6 py-4 text-sm text-on-surface-variant">
                  {equip.lastServiced
                    ? format(new Date(equip.lastServiced), 'MMM dd, yyyy')
                    : '—'}
                </td>
              </tr>
            );
          })}
          {equipment.length === 0 && (
            <tr>
              <td colSpan={4} className="px-6 py-12 text-center text-on-surface-variant text-sm">
                No equipment found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
