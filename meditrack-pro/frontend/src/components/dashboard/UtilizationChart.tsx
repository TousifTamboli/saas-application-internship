import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { useUtilization } from '../../hooks/useDashboard';

export default function UtilizationChart() {
  const { data, isLoading, range, setRange } = useUtilization();

  const ranges: Array<{ value: '3m' | '30d' | '7d'; label: string }> = [
    { value: '3m', label: '3M' },
    { value: '30d', label: '30D' },
    { value: '7d', label: '7D' },
  ];

  return (
    <div className="bg-surface-container-low rounded-xl p-8 mb-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="font-headline text-lg font-bold text-on-surface">Equipment Utilization</h3>
          <p className="text-on-surface-variant text-xs mt-0.5">
            Comparing operational capacity vs idling across facilities
          </p>
        </div>
        <div className="flex bg-surface-container rounded-lg p-1 gap-0.5">
          {ranges.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setRange(value)}
              className={`px-4 py-1.5 text-[10px] font-bold rounded-md transition-all ${
                range === value
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="flex gap-2 items-center text-on-surface-variant text-sm">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse-soft" />
            Loading utilization data...
          </div>
        </div>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorInUse" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4be277" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#4be277" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorIdle" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#e5e2e1" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#e5e2e1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis
                dataKey="date"
                tick={{ fill: '#bccbb9', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#bccbb9', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                domain={[0, 100]}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#201f1f',
                  border: '1px solid #3d4a3d',
                  borderRadius: '8px',
                  color: '#e5e2e1',
                  fontSize: '12px',
                }}
                labelStyle={{ color: '#bccbb9', marginBottom: '4px' }}
              />
              <Area
                type="monotone"
                dataKey="inUse"
                name="IN USE"
                stroke="#4be277"
                strokeWidth={2.5}
                fill="url(#colorInUse)"
                dot={false}
              />
              <Area
                type="monotone"
                dataKey="idle"
                name="IDLE"
                stroke="rgba(229, 226, 225, 0.35)"
                strokeWidth={1.5}
                strokeDasharray="8 4"
                fill="url(#colorIdle)"
                dot={false}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value) => (
                  <span style={{ color: '#bccbb9', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}>
                    {value}
                  </span>
                )}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
