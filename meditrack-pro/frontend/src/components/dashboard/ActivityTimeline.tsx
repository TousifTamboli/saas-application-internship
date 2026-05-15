import { formatDistanceToNow } from 'date-fns';
import { Bell, Wrench, AlertTriangle, Info } from 'lucide-react';
import type { EnhancedStats } from '../../types';

interface Props {
  activities: EnhancedStats['recentActivity'];
}

const iconMap: Record<string, { Icon: typeof Bell; color: string; bg: string }> = {
  alert: { Icon: Bell, color: 'text-error', bg: 'bg-error/10' },
  maintenance: { Icon: Wrench, color: 'text-tertiary', bg: 'bg-tertiary/10' },
  default: { Icon: Info, color: 'text-on-surface-variant', bg: 'bg-surface-container-highest' },
};

export default function ActivityTimeline({ activities }: Props) {
  return (
    <div className="bg-surface-container p-6 rounded-xl">
      <h3 className="font-headline text-sm font-bold text-on-surface mb-5">Activity Timeline</h3>
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-[15px] top-2 bottom-2 w-px bg-outline-variant/20" />

        <div className="space-y-4">
          {activities.map((activity, i) => {
            const config = iconMap[activity.type] || iconMap.default;
            const { Icon, color, bg } = config;
            const severityIcon = activity.severity === 'error' ? AlertTriangle : activity.severity === 'warning' ? Bell : Info;
            const UseIcon = activity.type === 'alert' ? severityIcon : Icon;

            return (
              <div key={i} className="flex gap-3 relative">
                <div className={`w-[30px] h-[30px] rounded-full ${bg} flex items-center justify-center flex-shrink-0 z-10`}>
                  <UseIcon className={`w-3.5 h-3.5 ${color}`} />
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                  <p className="text-xs font-bold text-on-surface truncate">{activity.title}</p>
                  <p className="text-[10px] text-on-surface-variant mt-0.5 line-clamp-1">{activity.description}</p>
                  <p className="text-[9px] text-on-surface-variant/50 mt-1 font-semibold uppercase">
                    {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
