import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Loader2 } from 'lucide-react';
import { useServiceRequests } from '../../hooks/useServiceRequests';
import { useEquipment } from '../../hooks/useEquipment';

const schema = z.object({
  equipment: z.string().min(1, 'Equipment is required'),
  requestedBy: z.string().min(1, 'Requester name is required'),
  department: z.string().min(1, 'Department is required'),
  priority: z.enum(['Low', 'Medium', 'High', 'Critical']),
  issue: z.string().min(1, 'Issue description is required'),
  assignedTo: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const departments = ['Radiology', 'Cardiology', 'Pathology Lab', 'ICU Monitoring', 'Teleconsultancy', 'Obstetrics', 'Diagnostic', 'Emergency', 'Other'];

interface Props { onClose: () => void }

export default function AddServiceRequestModal({ onClose }: Props) {
  const [error, setError] = useState('');
  const { data: equipmentData } = useEquipment({ limit: 100 });
  const { createMutation } = useServiceRequests();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { priority: 'Medium' },
  });

  const onSubmit = async (data: FormData) => {
    setError('');
    try {
      await createMutation.mutateAsync(data);
      onClose();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message || 'Failed to create service request');
    }
  };

  const cls = 'w-full bg-surface-container-low border border-outline-variant/20 rounded-md px-3 py-2 text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary/50 transition-all';
  const lbl = 'block text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant mb-1.5';

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-surface-container-low w-full max-w-xl rounded-xl border border-outline-variant/20 max-h-[90vh] overflow-y-auto scroll-hide animate-slide-up">
        <div className="flex items-center justify-between p-6 border-b border-outline-variant/15">
          <h2 className="font-headline text-lg font-bold">New Service Request</h2>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div>
            <label className={lbl}>Equipment *</label>
            <select {...register('equipment')} className={cls}>
              <option value="">Select equipment</option>
              {equipmentData?.data.map(eq => (
                <option key={eq._id} value={eq._id}>{eq.name} — SN: {eq.serialNumber}</option>
              ))}
            </select>
            {errors.equipment && <p className="text-error text-[10px] mt-1">{errors.equipment.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={lbl}>Requested By *</label>
              <input {...register('requestedBy')} className={cls} placeholder="Dr. Name / Staff" />
              {errors.requestedBy && <p className="text-error text-[10px] mt-1">{errors.requestedBy.message}</p>}
            </div>
            <div>
              <label className={lbl}>Department *</label>
              <select {...register('department')} className={cls}>
                <option value="">Select department</option>
                {departments.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              {errors.department && <p className="text-error text-[10px] mt-1">{errors.department.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={lbl}>Priority</label>
              <select {...register('priority')} className={cls}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
            <div>
              <label className={lbl}>Assign To</label>
              <input {...register('assignedTo')} className={cls} placeholder="Technician name" />
            </div>
          </div>

          <div>
            <label className={lbl}>Issue Description *</label>
            <textarea {...register('issue')} className={cls} rows={3} placeholder="Describe the issue..." />
            {errors.issue && <p className="text-error text-[10px] mt-1">{errors.issue.message}</p>}
          </div>

          {error && <div className="bg-error/10 border border-error/30 text-error text-xs p-3 rounded-lg">{error}</div>}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-md border border-outline-variant/30 text-on-surface-variant text-sm font-medium hover:bg-surface-container transition-colors">Cancel</button>
            <button type="submit" disabled={createMutation.isPending} className="flex-1 py-2.5 rounded-md bg-primary-container text-on-primary text-sm font-semibold hover:bg-primary flex items-center justify-center gap-2">
              {createMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
