import { useState } from 'react';
import { Plus, Mail, Phone, Package, Trash2 } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import AddStaffModal from '../components/staff/AddStaffModal';
import { useStaff } from '../hooks/useStaff';

export default function StaffPage() {
  const [showModal, setShowModal] = useState(false);
  const { data: staff, isLoading, deleteMutation } = useStaff();

  return (
    <AppLayout>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="font-headline text-3xl font-extrabold tracking-tight text-on-surface">Staff Directory</h2>
          <p className="text-on-surface-variant text-sm mt-1">Manage clinical and biomedical staff assignments</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-primary-container text-on-primary px-4 py-2 rounded-md text-xs font-semibold flex items-center gap-2 hover:bg-primary transition-colors">
          <Plus className="w-4 h-4" />Add Staff
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-40 bg-surface-container rounded-xl animate-pulse-soft" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {staff?.map(member => (
            <div key={member._id} className="bg-surface-container rounded-xl p-5 hover:scale-[1.01] transition-all group relative">
              <button
                onClick={() => { if (confirm('Delete this staff member?')) deleteMutation.mutate(member._id); }}
                className="absolute top-4 right-4 text-on-surface/20 hover:text-error transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-bold text-lg">{member.name.charAt(0)}</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-on-surface">{member.name}</p>
                  <p className="text-[10px] text-primary font-medium">{member.role}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                  <Package className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{member.department}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                  <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">{member.email}</span>
                </div>
                {member.phone && (
                  <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                    <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{member.phone}</span>
                  </div>
                )}
              </div>

              {member.assignedEquipment.length > 0 && (
                <div className="mt-4 pt-4 border-t border-outline-variant/10">
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-wider mb-2">Assigned Equipment</p>
                  <p className="text-xs text-on-surface">
                    {member.assignedEquipment.length} device{member.assignedEquipment.length !== 1 ? 's' : ''} assigned
                  </p>
                </div>
              )}
            </div>
          ))}

          {staff?.length === 0 && (
            <div className="col-span-3 text-center py-16 text-on-surface-variant">
              <p className="text-sm">No staff members found. Add your first staff member!</p>
            </div>
          )}
        </div>
      )}

      {showModal && <AddStaffModal onClose={() => setShowModal(false)} />}
    </AppLayout>
  );
}
