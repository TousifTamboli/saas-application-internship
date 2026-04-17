import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Loader2 } from 'lucide-react';
import { useStaff } from '../../hooks/useStaff';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  role: z.string().min(1, 'Role is required'),
  department: z.string().min(1, 'Department is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const departments = ['Radiology', 'Cardiology', 'Pathology Lab', 'ICU Monitoring', 'Teleconsultancy', 'Obstetrics', 'Diagnostic', 'Emergency', 'Maintenance', 'Other'];

interface Props { onClose: () => void }

export default function AddStaffModal({ onClose }: Props) {
  const [error, setError] = useState('');
  const { createMutation } = useStaff();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setError('');
    try {
      await createMutation.mutateAsync(data);
      onClose();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message || 'Failed to add staff member');
    }
  };

  const cls = 'w-full bg-surface-container-low border border-outline-variant/20 rounded-md px-3 py-2 text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary/50 transition-all';
  const lbl = 'block text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant mb-1.5';

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-surface-container-low w-full max-w-md rounded-xl border border-outline-variant/20 animate-slide-up">
        <div className="flex items-center justify-between p-6 border-b border-outline-variant/15">
          <h2 className="font-headline text-lg font-bold">Add Staff Member</h2>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div>
            <label className={lbl}>Full Name *</label>
            <input {...register('name')} className={cls} placeholder="Dr. First Last" />
            {errors.name && <p className="text-error text-[10px] mt-1">{errors.name.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={lbl}>Role *</label>
              <input {...register('role')} className={cls} placeholder="e.g. Senior Radiologist" />
              {errors.role && <p className="text-error text-[10px] mt-1">{errors.role.message}</p>}
            </div>
            <div>
              <label className={lbl}>Department *</label>
              <select {...register('department')} className={cls}>
                <option value="">Select dept</option>
                {departments.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              {errors.department && <p className="text-error text-[10px] mt-1">{errors.department.message}</p>}
            </div>
          </div>
          <div>
            <label className={lbl}>Email *</label>
            <input {...register('email')} type="email" className={cls} placeholder="doctor@meditrack.com" />
            {errors.email && <p className="text-error text-[10px] mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className={lbl}>Phone</label>
            <input {...register('phone')} className={cls} placeholder="+91-XXXXX-XXXXX" />
          </div>

          {error && <div className="bg-error/10 border border-error/30 text-error text-xs p-3 rounded-lg">{error}</div>}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-md border border-outline-variant/30 text-on-surface-variant text-sm">Cancel</button>
            <button type="submit" disabled={createMutation.isPending} className="flex-1 py-2.5 rounded-md bg-primary-container text-on-primary text-sm font-semibold hover:bg-primary flex items-center justify-center gap-2">
              {createMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              Add Staff
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
