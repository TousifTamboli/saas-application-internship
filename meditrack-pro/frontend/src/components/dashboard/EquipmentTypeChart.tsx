import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { EnhancedStats } from '../../types';

const TYPE_COLORS = ['#4be277', '#22c55e', '#ffba61', '#ef9900', '#bccbb9', '#ffb4ab', '#c6c5cf', '#353534', '#4ae176', '#6bff8f'];

interface Props {
  data: EnhancedStats['equipmentByType'];
}

export default function EquipmentTypeChart({ data }: Props) {
  return (
    <div className="bg-surface-container-low rounded-xl p-6">
      <div className="mb-6">
        <h3 className="font-headline text-sm font-bold text-on-surface">Equipment by Type</h3>
        <p className="text-on-surface-variant text-xs mt-0.5">Distribution of medical equipment across categories</p>
      </div>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
            <XAxis type="number" tick={{ fill: '#bccbb9', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis
              type="category"
              dataKey="type"
              tick={{ fill: '#bccbb9', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              width={100}
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#201f1f', border: '1px solid #3d4a3d', borderRadius: '8px', color: '#e5e2e1', fontSize: '12px' }}
              formatter={(value) => [`${Number(value)} units`, 'Count']}
            />
            <Bar dataKey="count" radius={[0, 6, 6, 0]} maxBarSize={20}>
              {data.map((_, i) => (
                <Cell key={`type-${i}`} fill={TYPE_COLORS[i % TYPE_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
