import { useState } from 'react';
import { Download, Plus, Monitor, Wrench, Video, Clock, AlertTriangle, DollarSign } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import StatCard from '../components/dashboard/StatCard';
import UtilizationChart from '../components/dashboard/UtilizationChart';
import EquipmentTable from '../components/dashboard/EquipmentTable';
import DepartmentDonut from '../components/dashboard/DepartmentDonut';
import RecentAlerts from '../components/dashboard/RecentAlerts';
import MaintenanceCostChart from '../components/dashboard/MaintenanceCostChart';
import WarrantyTracker from '../components/dashboard/WarrantyTracker';
import ServiceRequestBreakdown from '../components/dashboard/ServiceRequestBreakdown';
import ActivityTimeline from '../components/dashboard/ActivityTimeline';
import EquipmentTypeChart from '../components/dashboard/EquipmentTypeChart';
import StaffWorkload from '../components/dashboard/StaffWorkload';
import AddEquipmentModal from '../components/equipment/AddEquipmentModal';
import { useDashboardStats, useEnhancedStats } from '../hooks/useDashboard';
import { useEquipment } from '../hooks/useEquipment';
import { useMaintenance } from '../hooks/useMaintenance';
import { useServiceRequests } from '../hooks/useServiceRequests';

type Tab = 'Overview' | 'Maintenance Log' | 'Service Requests' | 'Teleconsultancy';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>('Overview');
  const [showAddModal, setShowAddModal] = useState(false);

  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: equipmentData, isLoading: equipLoading } = useEquipment({ limit: 10 });
  const { data: maintenanceLogs } = useMaintenance();
  const { data: serviceRequests } = useServiceRequests();
  const { data: enhanced } = useEnhancedStats();

  const tabs: Tab[] = ['Overview', 'Maintenance Log', 'Service Requests', 'Teleconsultancy'];
  const tabCounts: Partial<Record<Tab, number>> = {
    'Maintenance Log': maintenanceLogs?.length ?? 5,
    'Service Requests': serviceRequests?.length ?? 9,
  };

  return (
    <AppLayout>
      {/* Page Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="font-headline text-3xl font-extrabold tracking-tight text-on-surface">
            Equipment Overview
          </h2>
          <p className="text-on-surface-variant text-sm mt-1">
            Real-time health and utilization metrics across all departments.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="bg-surface-container-high text-on-surface px-4 py-2 rounded-md text-xs font-semibold flex items-center gap-2 hover:bg-surface-bright transition-colors">
            <Download className="w-4 h-4" />
            Export Report
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-primary-container text-on-primary px-4 py-2 rounded-md text-xs font-semibold flex items-center gap-2 hover:bg-primary transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Inventory
          </button>
        </div>
      </div>

      {/* Stat Cards — Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="Total Machines"
          value={statsLoading ? '—' : stats?.totalMachines ?? 0}
          change={stats?.totalMachinesChange ?? '+8.5%'}
          icon={<Monitor className="w-5 h-5" />}
          colorClass="primary"
          isPositive={true}
        />
        <StatCard
          title="Under Maintenance"
          value={statsLoading ? '—' : stats?.underMaintenance ?? 0}
          change={stats?.maintenanceChange ?? '-3 units'}
          icon={<Wrench className="w-5 h-5" />}
          colorClass="tertiary"
          isPositive={false}
        />
        <StatCard
          title="Online Consults"
          value={statsLoading ? '—' : stats?.onlineConsultsToday ?? 0}
          change={stats?.consultsChange ?? '+22.4%'}
          icon={<Video className="w-5 h-5" />}
          colorClass="primary"
          isPositive={true}
        />
        <StatCard
          title="Uptime Rate"
          value={statsLoading ? '—' : `${stats?.uptimeRate ?? 0}%`}
          change={stats?.uptimeChange ?? '+1.2%'}
          icon={<Clock className="w-5 h-5" />}
          colorClass="primary"
          isPositive={true}
        />
      </div>

      {/* Stat Cards — Row 2 (New KPIs) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Critical Alerts"
          value={enhanced ? enhanced.recentActivity.filter(a => a.severity === 'error').length : '—'}
          change="Needs attention"
          icon={<AlertTriangle className="w-5 h-5" />}
          colorClass="tertiary"
          isPositive={false}
        />
        <StatCard
          title="Maintenance Cost"
          value={enhanced ? `₹${(enhanced.totalMaintenanceCost / 1000).toFixed(0)}k` : '—'}
          change="+12.3%"
          icon={<DollarSign className="w-5 h-5" />}
          colorClass="primary"
          isPositive={true}
        />
        <StatCard
          title="Open Tickets"
          value={enhanced ? enhanced.serviceRequestsByStatus.find(s => s.status === 'Open')?.count ?? 0 : '—'}
          change={`${enhanced?.totalServiceRequests ?? 0} total`}
          icon={<Monitor className="w-5 h-5" />}
          colorClass="tertiary"
          isPositive={false}
        />
        <StatCard
          title="Warranty Expiring"
          value={enhanced?.warranty.expiring ?? '—'}
          change={`${enhanced?.warranty.expired ?? 0} expired`}
          icon={<Clock className="w-5 h-5" />}
          colorClass="tertiary"
          isPositive={false}
        />
      </div>

      {/* Utilization Chart */}
      <UtilizationChart />

      {/* Enhanced Stats Row: Cost Trend + Equipment Type */}
      {enhanced && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <MaintenanceCostChart data={enhanced.monthlyCostTrend} totalCost={enhanced.totalMaintenanceCost} />
          <EquipmentTypeChart data={enhanced.equipmentByType} />
        </div>
      )}

      {/* Bottom Grid: Table + Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Tabs + Table */}
        <div className="lg:col-span-2 space-y-5">
          {/* Tabs */}
          <div className="flex items-center border-b border-outline-variant/20 gap-8 overflow-x-auto scroll-hide">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-sm font-semibold whitespace-nowrap flex items-center gap-2 transition-colors ${
                  activeTab === tab
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {tab}
                {tabCounts[tab] !== undefined && (
                  <span className="bg-surface-container-highest px-2 py-0.5 rounded-full text-[10px] text-on-surface-variant">
                    {tabCounts[tab]}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'Overview' && (
            <EquipmentTable equipment={equipmentData?.data ?? []} isLoading={equipLoading} />
          )}

          {activeTab === 'Maintenance Log' && (
            <div className="bg-surface-container rounded-xl overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-surface-container-high">
                  <tr>
                    {['Equipment', 'Type', 'Status', 'Technician', 'Start Date'].map(h => (
                      <th key={h} className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {maintenanceLogs?.map(log => {
                    const eq = typeof log.equipment === 'object' ? log.equipment : null;
                    const statusCls = log.status === 'Completed' ? 'text-primary bg-primary/10' : log.status === 'In Progress' ? 'text-tertiary bg-tertiary/10' : 'text-on-surface-variant bg-surface-container-high';
                    return (
                      <tr key={log._id} className="hover:bg-surface-container-low transition-colors">
                        <td className="px-4 py-3 text-sm font-medium text-on-surface">{eq ? eq.name : 'N/A'}</td>
                        <td className="px-4 py-3 text-xs text-on-surface-variant">{log.type}</td>
                        <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${statusCls}`}>{log.status}</span></td>
                        <td className="px-4 py-3 text-xs text-on-surface-variant">{log.technicianName}</td>
                        <td className="px-4 py-3 text-xs text-on-surface-variant">{new Date(log.startDate).toLocaleDateString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'Service Requests' && (
            <div className="bg-surface-container rounded-xl overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-surface-container-high">
                  <tr>
                    {['Equipment', 'Priority', 'Status', 'Requested By', 'Issue'].map(h => (
                      <th key={h} className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {serviceRequests?.map(req => {
                    const eq = typeof req.equipment === 'object' ? req.equipment : null;
                    const priorityCls = req.priority === 'Critical' ? 'text-error bg-error/10' : req.priority === 'High' ? 'text-tertiary bg-tertiary/10' : 'text-on-surface-variant bg-surface-container-high';
                    const statusCls = req.status === 'Open' ? 'text-primary bg-primary/10' : req.status === 'Resolved' ? 'text-on-surface-variant bg-surface-container-high' : 'text-tertiary bg-tertiary/10';
                    return (
                      <tr key={req._id} className="hover:bg-surface-container-low transition-colors">
                        <td className="px-4 py-3 text-sm font-medium text-on-surface">{eq ? eq.name : 'N/A'}</td>
                        <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${priorityCls}`}>{req.priority}</span></td>
                        <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${statusCls}`}>{req.status}</span></td>
                        <td className="px-4 py-3 text-xs text-on-surface-variant">{req.requestedBy}</td>
                        <td className="px-4 py-3 text-xs text-on-surface-variant max-w-[200px] truncate">{req.issue}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'Teleconsultancy' && (
            <div className="bg-surface-container rounded-xl p-8 text-center">
              <p className="text-on-surface-variant text-sm">Teleconsultancy sessions data coming soon...</p>
            </div>
          )}
        </div>

        {/* Right Widgets */}
        <div className="space-y-6">
          <DepartmentDonut />
          {enhanced && (
            <ServiceRequestBreakdown
              byPriority={enhanced.serviceRequestsByPriority}
              byStatus={enhanced.serviceRequestsByStatus}
              total={enhanced.totalServiceRequests}
            />
          )}
          <RecentAlerts />
        </div>
      </div>

      {/* Enhanced Bottom Section */}
      {enhanced && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <WarrantyTracker warranty={enhanced.warranty} />
          <StaffWorkload staffWorkload={enhanced.staffWorkload} />
          <ActivityTimeline activities={enhanced.recentActivity} />
        </div>
      )}

      {showAddModal && <AddEquipmentModal onClose={() => setShowAddModal(false)} />}
    </AppLayout>
  );
}
