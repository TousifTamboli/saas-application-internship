import type { EnhancedStats } from '../../types';

interface Props {
  staffWorkload: EnhancedStats['staffWorkload'];
}

export default function StaffWorkload({ staffWorkload }: Props) {
  const maxAssigned = Math.max(...staffWorkload.map(s => s.assignedCount), 1);

  return (
    <div className="bg-surface-container p-6 rounded-xl">
      <h3 className="font-headline text-sm font-bold text-on-surface mb-5">Staff Workload</h3>
      <div className="space-y-3.5">
        {staffWorkload.map((staff) => (
          <div key={staff.name}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-bold text-[10px]">{staff.name.charAt(0)}</span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-on-surface leading-none">{staff.name}</p>
                  <p className="text-[9px] text-on-surface-variant mt-0.5">{staff.role}</p>
                </div>
              </div>
              <span className="text-xs font-bold text-primary">{staff.assignedCount}</span>
            </div>
            <div className="h-1 bg-surface-container-highest rounded-full overflow-hidden ml-9">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-primary-container transition-all duration-700"
                style={{ width: `${(staff.assignedCount / maxAssigned) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
