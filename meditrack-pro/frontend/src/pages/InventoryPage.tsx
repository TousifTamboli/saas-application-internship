import { useState } from 'react';
import { format } from 'date-fns';
import { Plus, Search, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import AddEquipmentModal from '../components/equipment/AddEquipmentModal';
import { useEquipment } from '../hooks/useEquipment';
import type { Equipment, EquipmentStatus } from '../types';
import { cn } from '../lib/utils';

const DEPARTMENTS = ['Radiology', 'Cardiology', 'Pathology Lab', 'ICU Monitoring', 'Teleconsultancy', 'Obstetrics', 'Diagnostic', 'Emergency', 'Other'];
const STATUSES: EquipmentStatus[] = ['Active', 'Maintenance', 'Offline'];

function StatusBadge({ status }: { status: Equipment['status'] }) {
  const cfg = {
    Active: 'bg-primary/10 text-primary',
    Maintenance: 'bg-tertiary/10 text-tertiary',
    Offline: 'bg-error/10 text-error',
  };
  const dot = { Active: 'bg-primary', Maintenance: 'bg-tertiary', Offline: 'bg-error' };
  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold', cfg[status])}>
      <span className={cn('w-1.5 h-1.5 rounded-full', dot[status])} />
      {status}
    </span>
  );
}

export default function InventoryPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deptFilter, setDeptFilter] = useState('');

  const { data, isLoading, setFilters, deleteMutation, updateStatusMutation } = useEquipment({
    page: 1, limit: 10,
    ...(search ? { search } : {}),
    ...(statusFilter ? { status: statusFilter as EquipmentStatus } : {}),
    ...(deptFilter ? { department: deptFilter as Equipment['department'] } : {}),
  });

  const handleSearch = () => setSearch(searchInput);

  const selectCls = 'bg-surface-container-low border border-outline-variant/20 rounded-md px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-primary/50 transition-all';

  return (
    <AppLayout>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="font-headline text-3xl font-extrabold tracking-tight text-on-surface">Equipment Inventory</h2>
          <p className="text-on-surface-variant text-sm mt-1">Manage and monitor all medical equipment</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-primary-container text-on-primary px-4 py-2 rounded-md text-xs font-semibold flex items-center gap-2 hover:bg-primary transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Equipment
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <div className="flex items-center gap-2 bg-surface-container-low border border-outline-variant/20 rounded-md px-3 py-2 flex-1 min-w-[200px] max-w-xs">
          <Search className="w-4 h-4 text-on-surface-variant/50" />
          <input
            type="text"
            placeholder="Search equipment..."
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="bg-transparent border-none focus:outline-none text-xs text-on-surface placeholder:text-on-surface-variant/40 w-full"
          />
        </div>
        <select value={deptFilter} onChange={e => { setDeptFilter(e.target.value); setFilters(f => ({ ...f, department: e.target.value as Equipment['department'], page: 1 })); }} className={selectCls}>
          <option value="">All Departments</option>
          {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setFilters(f => ({ ...f, status: e.target.value as EquipmentStatus, page: 1 })); }} className={selectCls}>
          <option value="">All Statuses</option>
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-surface-container rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-surface-container-high">
            <tr>
              {['Equipment', 'Type', 'Department', 'Status', 'Last Serviced', 'Assigned Tech', 'Actions'].map(h => (
                <th key={h} className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td colSpan={7} className="px-4 py-4">
                    <div className="h-8 bg-surface-container-high rounded animate-pulse-soft" />
                  </td>
                </tr>
              ))
            ) : data?.data.map(eq => (
              <tr key={eq._id} className="hover:bg-surface-container-low transition-colors group">
                <td className="px-4 py-3">
                  <p className="text-sm font-bold text-on-surface">{eq.name}</p>
                  <p className="text-[10px] text-on-surface-variant">SN: {eq.serialNumber}</p>
                </td>
                <td className="px-4 py-3 text-xs text-on-surface-variant">{eq.type}</td>
                <td className="px-4 py-3 text-xs text-on-surface-variant">{eq.department}</td>
                <td className="px-4 py-3"><StatusBadge status={eq.status} /></td>
                <td className="px-4 py-3 text-xs text-on-surface-variant">
                  {eq.lastServiced ? format(new Date(eq.lastServiced), 'MMM dd, yyyy') : '—'}
                </td>
                <td className="px-4 py-3 text-xs text-on-surface-variant">{eq.assignedTech || '—'}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <select
                      value={eq.status}
                      onChange={(e) => updateStatusMutation.mutate({ id: eq._id, status: e.target.value })}
                      className="text-[10px] bg-surface-container-high border border-outline-variant/20 rounded px-2 py-1 text-on-surface focus:outline-none"
                    >
                      {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <button
                      onClick={() => { if (confirm('Delete this equipment?')) deleteMutation.mutate(eq._id); }}
                      className="text-on-surface-variant hover:text-error transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        {data && data.pagination.pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-outline-variant/10">
            <p className="text-xs text-on-surface-variant">
              Showing {((data.pagination.page - 1) * data.pagination.limit) + 1}–{Math.min(data.pagination.page * data.pagination.limit, data.pagination.total)} of {data.pagination.total}
            </p>
            <div className="flex gap-2">
              <button
                disabled={data.pagination.page <= 1}
                onClick={() => setFilters(f => ({ ...f, page: (f.page || 1) - 1 }))}
                className="p-1.5 rounded border border-outline-variant/20 text-on-surface-variant hover:bg-surface-container disabled:opacity-30 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={data.pagination.page >= data.pagination.pages}
                onClick={() => setFilters(f => ({ ...f, page: (f.page || 1) + 1 }))}
                className="p-1.5 rounded border border-outline-variant/20 text-on-surface-variant hover:bg-surface-container disabled:opacity-30 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {showAddModal && <AddEquipmentModal onClose={() => setShowAddModal(false)} />}
    </AppLayout>
  );
}
