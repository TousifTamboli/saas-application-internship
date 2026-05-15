import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts';
import type { EnhancedStats } from '../../types';

interface Props {
  data: EnhancedStats['monthlyCostTrend'];
  totalCost: number;
}

export default function MaintenanceCostChart({ data, totalCost }: Props) {
  return (
    <div className="bg-surface-container-low rounded-xl p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="font-headline text-sm font-bold text-on-surface">Maintenance Cost Trend</h3>
          <p className="text-on-surface-variant text-xs mt-0.5">Monthly expenditure across all departments</p>
        </div>
        <div className="text-right">
          <p className="font-headline text-2xl font-extrabold text-on-surface">₹{totalCost.toLocaleString()}</p>
          <p className="text-[10px] text-on-surface-variant font-semibold uppercase tracking-wider">Total Spend</p>
        </div>
      </div>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis
              dataKey="month"
              tick={{ fill: '#bccbb9', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#bccbb9', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#201f1f',
                border: '1px solid #3d4a3d',
                borderRadius: '8px',
                color: '#e5e2e1',
                fontSize: '12px',
              }}
              formatter={(value) => [`₹${Number(value).toLocaleString()}`, 'Cost']}
            />
            <defs>
              <linearGradient id="costGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4be277" />
                <stop offset="100%" stopColor="#22c55e" />
              </linearGradient>
            </defs>
            <Bar
              dataKey="cost"
              fill="url(#costGradient)"
              radius={[6, 6, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
