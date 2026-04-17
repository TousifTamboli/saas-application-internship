import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Loader2 } from 'lucide-react';
import { useEquipment } from '../../hooks/useEquipment';
import { useQueryClient } from '@tanstack/react-query';

const schema = z.object({
  name: z.string().min(1, 'Equipment name is required'),
  serialNumber: z.string().min(1, 'Serial number is required'),
  type: z.string().min(1, 'Type is required'),
  department: z.string().min(1, 'Department is required'),
  status: z.string().min(1).default('Active'),
  assignedTech: z.string().optional(),
  lastServiced: z.string().optional(),
  nextServiceDue: z.string().optional(),
  location: z.string().optional(),
  manufacturer: z.string().optional(),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const equipmentTypes = ['CT Scanner', 'MRI', 'Sonography', 'ECG', 'X-Ray', 'Blood Analyzer', 'Patient Monitor', 'Ventilator', 'Online Consult', 'Defibrillator', 'Other'];
const departments = ['Radiology', 'Cardiology', 'Pathology Lab', 'ICU Monitoring', 'Teleconsultancy', 'Obstetrics', 'Diagnostic', 'Emergency', 'Other'];

interface AddEquipmentModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AddEquipmentModal({ onClose, onSuccess }: AddEquipmentModalProps) {
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const queryClient = useQueryClient();

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema) as any,
    defaultValues: { status: 'Active' },
  });

  const { createMutation } = useEquipment();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setErrorMsg('');
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await createMutation.mutateAsync(data as any);
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-departments'] });
      setSuccessMsg('Equipment added successfully!');
      reset();
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 1200);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setErrorMsg(e.response?.data?.message || 'Failed to add equipment');
    }
  };

  const inputCls = 'w-full bg-surface-container-low border border-outline-variant/20 rounded-md px-3 py-2 text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary/50 focus:bg-surface-container transition-all';
  const labelCls = 'block text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant mb-1.5';
  const errorCls = 'text-error text-[10px] mt-1';

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-surface-container-low w-full max-w-2xl rounded-xl border border-outline-variant/20 max-h-[90vh] overflow-y-auto scroll-hide animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-outline-variant/15">
          <div>
            <h2 className="font-headline text-lg font-bold text-on-surface">Add New Equipment</h2>
            <p className="text-on-surface-variant text-xs mt-0.5">Register a new medical device in the system</p>
          </div>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface transition-colors p-1 rounded-lg hover:bg-surface-container">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit as any)} className="p-6 space-y-5">
          {/* Row 1 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Equipment Name *</label>
              <input {...register('name')} className={inputCls} placeholder="e.g. SIEMENS CT-X900" />
              {errors.name && <p className={errorCls}>{errors.name.message}</p>}
            </div>
            <div>
              <label className={labelCls}>Serial Number *</label>
              <input {...register('serialNumber')} className={inputCls} placeholder="e.g. 994-01-A" />
              {errors.serialNumber && <p className={errorCls}>{errors.serialNumber.message}</p>}
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Type *</label>
              <select {...register('type')} className={inputCls}>
                <option value="">Select type</option>
                {equipmentTypes.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              {errors.type && <p className={errorCls}>{errors.type.message}</p>}
            </div>
            <div>
              <label className={labelCls}>Department *</label>
              <select {...register('department')} className={inputCls}>
                <option value="">Select dept</option>
                {departments.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
              {errors.department && <p className={errorCls}>{errors.department.message}</p>}
            </div>
            <div>
              <label className={labelCls}>Status</label>
              <select {...register('status')} className={inputCls}>
                <option value="Active">Active</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Offline">Offline</option>
              </select>
            </div>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Assigned Technician</label>
              <input {...register('assignedTech')} className={inputCls} placeholder="Technician name" />
            </div>
            <div>
              <label className={labelCls}>Location / Ward</label>
              <input {...register('location')} className={inputCls} placeholder="e.g. Radiology Wing A" />
            </div>
          </div>

          {/* Row 4 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Last Serviced</label>
              <input {...register('lastServiced')} type="date" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Next Service Due</label>
              <input {...register('nextServiceDue')} type="date" className={inputCls} />
            </div>
          </div>

          {/* Row 5 */}
          <div>
            <label className={labelCls}>Manufacturer</label>
            <input {...register('manufacturer')} className={inputCls} placeholder="e.g. Siemens Healthineers" />
          </div>

          {/* Notes */}
          <div>
            <label className={labelCls}>Notes</label>
            <textarea {...register('notes')} className={inputCls} rows={3} placeholder="Additional information..." />
          </div>

          {successMsg && (
            <div className="bg-primary/10 border border-primary/30 text-primary text-xs p-3 rounded-lg">
              ✓ {successMsg}
            </div>
          )}
          {errorMsg && (
            <div className="bg-error/10 border border-error/30 text-error text-xs p-3 rounded-lg">
              {errorMsg}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-md border border-outline-variant/30 text-on-surface-variant text-sm font-medium hover:bg-surface-container transition-colors">
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="flex-1 py-2.5 rounded-md bg-primary-container text-on-primary text-sm font-semibold hover:bg-primary transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {createMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              {createMutation.isPending ? 'Adding...' : 'Add Equipment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
