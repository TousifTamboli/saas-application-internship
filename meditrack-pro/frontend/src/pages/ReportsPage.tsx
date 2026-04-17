import { Download, TrendingUp, Activity, AlertTriangle, CheckCircle } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  LineChart, Line, ResponsiveContainer
} from 'recharts';
import { useEquipment } from '../hooks/useEquipment';
import { useMaintenance } from '../hooks/useMaintenance';

const monthlyMaintenanceCost = [
  { month: 'Sep', cost: 45000 }, { month: 'Oct', cost: 62000 }, { month: 'Nov', cost: 38000 },
  { month: 'Dec', cost: 91000 }, { month: 'Jan', cost: 55000 }, { month: 'Feb', cost: 44000 },
];

export default function ReportsPage() {
  const { data: equipData } = useEquipment({ limit: 100 });
  const { data: maintenanceData } = useMaintenance();

  const activeCount = equipData?.data.filter(e => e.status === 'Active').length ?? 0;
  const maintenanceCount = equipData?.data.filter(e => e.status === 'Maintenance').length ?? 0;
  const offlineCount = equipData?.data.filter(e => e.status === 'Offline').length ?? 0;
  const totalCost = maintenanceData?.reduce((sum, l) => sum + (l.cost || 0), 0) ?? 0;

  const statusData = [
    { name: 'Active', count: activeCount, fill: '#4be277' },
    { name: 'Maintenance', count: maintenanceCount, fill: '#ffba61' },
    { name: 'Offline', count: offlineCount, fill: '#ffb4ab' },
  ];

  const tooltipStyle = {
    contentStyle: { backgroundColor: '#201f1f', border: '1px solid #3d4a3d', borderRadius: '8px', color: '#e5e2e1', fontSize: '12px' },
  };

  return (
    <AppLayout>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="font-headline text-3xl font-extrabold tracking-tight text-on-surface">Reports & Analytics</h2>
          <p className="text-on-surface-variant text-sm mt-1">Comprehensive overview of equipment performance and costs</p>
        </div>
        <button className="bg-surface-container-high text-on-surface px-4 py-2 rounded-md text-xs font-semibold flex items-center gap-2 hover:bg-surface-bright transition-colors">
          <Download className="w-4 h-4" />Export Report
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {[
          { label: 'Active Equipment', value: activeCount, icon: <CheckCircle className="w-5 h-5" />, color: 'text-primary bg-primary/10' },
          { label: 'Under Maintenance', value: maintenanceCount, icon: <AlertTriangle className="w-5 h-5" />, color: 'text-tertiary bg-tertiary/10' },
          { label: 'Offline Units', value: offlineCount, icon: <Activity className="w-5 h-5" />, color: 'text-error bg-error/10' },
          { label: 'Total Maintenance Cost', value: `₹${totalCost.toLocaleString()}`, icon: <TrendingUp className="w-5 h-5" />, color: 'text-primary bg-primary/10' },
        ].map(card => (
          <div key={card.label} className="bg-surface-container p-5 rounded-xl">
            <div className={`w-10 h-10 rounded-lg ${card.color} flex items-center justify-center mb-3`}>
              {card.icon}
            </div>
            <p className="text-[10px] uppercase tracking-wider text-on-surface-variant font-semibold mb-1">{card.label}</p>
            <p className="font-headline text-2xl font-bold text-on-surface">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Equipment Status Bar Chart */}
        <div className="bg-surface-container-low rounded-xl p-6">
          <h3 className="font-headline text-base font-bold text-on-surface mb-1">Equipment Status Distribution</h3>
          <p className="text-on-surface-variant text-xs mb-6">Current operational status across all units</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData} margin={{ left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="name" tick={{ fill: '#bccbb9', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#bccbb9', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip {...tooltipStyle} />
                <Bar dataKey="count" name="Units" radius={[4, 4, 0, 0]}>
                  {statusData.map((entry, index) => (
                    <rect key={index} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Maintenance Cost Line Chart */}
        <div className="bg-surface-container-low rounded-xl p-6">
          <h3 className="font-headline text-base font-bold text-on-surface mb-1">Monthly Maintenance Cost</h3>
          <p className="text-on-surface-variant text-xs mb-6">Total maintenance expenditure over 6 months</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyMaintenanceCost} margin={{ left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" tick={{ fill: '#bccbb9', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#bccbb9', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                <Tooltip {...tooltipStyle} formatter={(v: any) => [`₹${Number(v).toLocaleString()}`, 'Cost']} />
                <Line type="monotone" dataKey="cost" stroke="#4be277" strokeWidth={2.5} dot={{ fill: '#4be277', strokeWidth: 0, r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
