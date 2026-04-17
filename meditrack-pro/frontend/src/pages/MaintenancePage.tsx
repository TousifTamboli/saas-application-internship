import { useState } from 'react';
import { format } from 'date-fns';
import { Plus, Trash2 } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import AddMaintenanceModal from '../components/maintenance/AddMaintenanceModal';
import { useMaintenance } from '../hooks/useMaintenance';
import type { MaintenanceLog } from '../types';
import { cn } from '../lib/utils';

function StatusBadge({ status }: { status: MaintenanceLog['status'] }) {
  const cfg = {
    Completed: 'bg-primary/10 text-primary',
    'In Progress': 'bg-tertiary/10 text-tertiary',
    Pending: 'bg-surface-container-highest text-on-surface-variant',
  };
  return <span className={cn('px-2.5 py-1 rounded-full text-[10px] font-bold', cfg[status])}>{status}</span>;
}

export default function MaintenancePage() {
  const [showModal, setShowModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const { data: logs, isLoading, deleteMutation } = useMaintenance({ status: statusFilter || undefined });

  return (
    <AppLayout>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="font-headline text-3xl font-extrabold tracking-tight text-on-surface">Maintenance Logs</h2>
          <p className="text-on-surface-variant text-sm mt-1">Track and manage equipment maintenance activities</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-primary-container text-on-primary px-4 py-2 rounded-md text-xs font-semibold flex items-center gap-2 hover:bg-primary transition-colors">
          <Plus className="w-4 h-4" />Log Maintenance
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="bg-surface-container-low border border-outline-variant/20 rounded-md px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-primary/50">
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      <div className="bg-surface-container rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-surface-container-high">
            <tr>
              {['Equipment', 'Type', 'Technician', 'Description', 'Start Date', 'Status', 'Cost', 'Actions'].map(h => (
                <th key={h} className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}><td colSpan={8} className="px-4 py-4"><div className="h-8 bg-surface-container-high rounded animate-pulse-soft" /></td></tr>
              ))
            ) : logs?.map(log => {
              const eq = typeof log.equipment === 'object' ? log.equipment : null;
              return (
                <tr key={log._id} className="hover:bg-surface-container-low transition-colors group">
                  <td className="px-4 py-3">
                    <p className="text-sm font-bold text-on-surface">{eq ? eq.name : 'N/A'}</p>
                    {eq && <p className="text-[10px] text-on-surface-variant">SN: {eq.serialNumber}</p>}
                  </td>
                  <td className="px-4 py-3 text-xs text-on-surface-variant">{log.type}</td>
                  <td className="px-4 py-3 text-xs text-on-surface-variant">{log.technicianName}</td>
                  <td className="px-4 py-3 text-xs text-on-surface-variant max-w-[200px] truncate">{log.description}</td>
                  <td className="px-4 py-3 text-xs text-on-surface-variant">{format(new Date(log.startDate), 'MMM dd, yyyy')}</td>
                  <td className="px-4 py-3"><StatusBadge status={log.status} /></td>
                  <td className="px-4 py-3 text-xs text-on-surface-variant">{log.cost ? `₹${log.cost.toLocaleString()}` : '—'}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => { if (confirm('Delete this log?')) deleteMutation.mutate(log._id); }} className="text-on-surface-variant hover:text-error transition-colors opacity-0 group-hover:opacity-100">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showModal && <AddMaintenanceModal onClose={() => setShowModal(false)} />}
    </AppLayout>
  );
}
