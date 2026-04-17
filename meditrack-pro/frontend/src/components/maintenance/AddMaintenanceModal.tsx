import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Loader2 } from 'lucide-react';
import { useMaintenance } from '../../hooks/useMaintenance';
import { useEquipment } from '../../hooks/useEquipment';

const schema = z.object({
  equipment: z.string().min(1, 'Equipment is required'),
  technicianName: z.string().min(1, 'Technician name is required'),
  type: z.enum(['Scheduled', 'Emergency', 'Preventive']),
  description: z.string().min(1, 'Description is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  status: z.enum(['Pending', 'In Progress', 'Completed']),
  cost: z.string().optional(),
  parts: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface Props { onClose: () => void }

export default function AddMaintenanceModal({ onClose }: Props) {
  const [error, setError] = useState('');
  const { data: equipmentData } = useEquipment({ limit: 100 });
  const { createMutation } = useMaintenance();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { type: 'Scheduled', status: 'Pending' },
  });

  const onSubmit = async (data: FormData) => {
    setError('');
    try {
      await createMutation.mutateAsync({
        ...data,
        cost: data.cost ? parseFloat(data.cost) : undefined,
        parts: data.parts ? data.parts.split(',').map(p => p.trim()) : [],
      });
      onClose();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message || 'Failed to create maintenance log');
    }
  };

  const cls = 'w-full bg-surface-container-low border border-outline-variant/20 rounded-md px-3 py-2 text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary/50 transition-all';
  const lbl = 'block text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant mb-1.5';

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-surface-container-low w-full max-w-xl rounded-xl border border-outline-variant/20 max-h-[90vh] overflow-y-auto scroll-hide animate-slide-up">
        <div className="flex items-center justify-between p-6 border-b border-outline-variant/15">
          <h2 className="font-headline text-lg font-bold">Log Maintenance</h2>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface transition-colors"><X className="w-5 h-5" /></button>
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
              <label className={lbl}>Technician *</label>
              <input {...register('technicianName')} className={cls} placeholder="Tech name" />
              {errors.technicianName && <p className="text-error text-[10px] mt-1">{errors.technicianName.message}</p>}
            </div>
            <div>
              <label className={lbl}>Type</label>
              <select {...register('type')} className={cls}>
                <option value="Scheduled">Scheduled</option>
                <option value="Emergency">Emergency</option>
                <option value="Preventive">Preventive</option>
              </select>
            </div>
          </div>

          <div>
            <label className={lbl}>Description *</label>
            <textarea {...register('description')} className={cls} rows={2} placeholder="Describe the maintenance work..." />
            {errors.description && <p className="text-error text-[10px] mt-1">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={lbl}>Start Date *</label>
              <input {...register('startDate')} type="date" className={cls} />
            </div>
            <div>
              <label className={lbl}>End Date</label>
              <input {...register('endDate')} type="date" className={cls} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={lbl}>Status</label>
              <select {...register('status')} className={cls}>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div>
              <label className={lbl}>Cost (₹)</label>
              <input {...register('cost')} type="number" className={cls} placeholder="0.00" />
            </div>
          </div>

          <div>
            <label className={lbl}>Parts Used (comma separated)</label>
            <input {...register('parts')} className={cls} placeholder="e.g. Filter, Valve, Sensor" />
          </div>

          {error && <div className="bg-error/10 border border-error/30 text-error text-xs p-3 rounded-lg">{error}</div>}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-md border border-outline-variant/30 text-on-surface-variant text-sm font-medium hover:bg-surface-container transition-colors">Cancel</button>
            <button type="submit" disabled={createMutation.isPending} className="flex-1 py-2.5 rounded-md bg-primary-container text-on-primary text-sm font-semibold hover:bg-primary transition-colors flex items-center justify-center gap-2">
              {createMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              Log Maintenance
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
