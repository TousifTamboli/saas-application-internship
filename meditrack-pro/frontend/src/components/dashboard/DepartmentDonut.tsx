import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useMachinesByDepartment } from '../../hooks/useDashboard';

const DEPT_COLORS = ['#4be277', '#ffba61', '#353534', '#bccbb9'];

export default function DepartmentDonut() {
  const { data, isLoading } = useMachinesByDepartment();

  const chartData = data?.departments.map((d, i) => ({
    name: d.department,
    value: d.count,
    percentage: d.percentage,
    color: DEPT_COLORS[i] || DEPT_COLORS[DEPT_COLORS.length - 1],
  })) ?? [];

  return (
    <div className="bg-surface-container p-6 rounded-xl">
      <h3 className="font-headline text-sm font-bold text-on-surface mb-5">Machines by Department</h3>

      {isLoading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse-soft" />
        </div>
      ) : (
        <>
          <div className="relative flex items-center justify-center py-2">
            <div className="w-44 h-44">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    innerRadius={52}
                    outerRadius={72}
                    paddingAngle={3}
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#201f1f',
                      border: '1px solid #3d4a3d',
                      borderRadius: '8px',
                      color: '#e5e2e1',
                      fontSize: '12px',
                    }}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    formatter={(value: any) => [`${value} units`, '']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Center label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <p className="font-headline text-2xl font-extrabold text-on-surface">{data?.total ?? 0}</p>
              <p className="text-[8px] text-on-surface-variant font-bold uppercase tracking-wider">Total Units</p>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-5 space-y-2.5">
            {chartData.map((entry) => (
              <div key={entry.name} className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: entry.color }} />
                  <span className="text-on-surface-variant">{entry.name}</span>
                </div>
                <span className="font-bold text-on-surface">{entry.percentage}%</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
