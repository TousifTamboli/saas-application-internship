import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import type { EnhancedStats } from '../../types';

const PRIORITY_COLORS: Record<string, string> = {
  Critical: '#ffb4ab',
  High: '#ffba61',
  Medium: '#4be277',
  Low: '#bccbb9',
};

const STATUS_COLORS: Record<string, string> = {
  Open: '#4be277',
  'In Progress': '#ffba61',
  Resolved: '#bccbb9',
  Closed: '#353534',
};

interface Props {
  byPriority: EnhancedStats['serviceRequestsByPriority'];
  byStatus: EnhancedStats['serviceRequestsByStatus'];
  total: number;
}

export default function ServiceRequestBreakdown({ byPriority, byStatus, total }: Props) {
  return (
    <div className="bg-surface-container p-6 rounded-xl">
      <div className="flex justify-between items-center mb-5">
        <h3 className="font-headline text-sm font-bold text-on-surface">Service Requests</h3>
        <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{total} total</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* By Priority */}
        <div>
          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-3">By Priority</p>
          <div className="w-28 h-28 mx-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={byPriority.map(p => ({ name: p.priority, value: p.count }))} innerRadius={28} outerRadius={42} paddingAngle={3} dataKey="value">
                  {byPriority.map((entry, i) => (
                    <Cell key={`priority-${i}`} fill={PRIORITY_COLORS[entry.priority] || '#353534'} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#201f1f', border: '1px solid #3d4a3d', borderRadius: '8px', color: '#e5e2e1', fontSize: '11px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5 mt-2">
            {byPriority.map(p => (
              <div key={p.priority} className="flex items-center justify-between text-[10px]">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: PRIORITY_COLORS[p.priority] }} />
                  <span className="text-on-surface-variant">{p.priority}</span>
                </div>
                <span className="font-bold text-on-surface">{p.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* By Status */}
        <div>
          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-3">By Status</p>
          <div className="w-28 h-28 mx-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={byStatus.map(s => ({ name: s.status, value: s.count }))} innerRadius={28} outerRadius={42} paddingAngle={3} dataKey="value">
                  {byStatus.map((entry, i) => (
                    <Cell key={`status-${i}`} fill={STATUS_COLORS[entry.status] || '#353534'} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#201f1f', border: '1px solid #3d4a3d', borderRadius: '8px', color: '#e5e2e1', fontSize: '11px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5 mt-2">
            {byStatus.map(s => (
              <div key={s.status} className="flex items-center justify-between text-[10px]">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: STATUS_COLORS[s.status] }} />
                  <span className="text-on-surface-variant">{s.status}</span>
                </div>
                <span className="font-bold text-on-surface">{s.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
