import mongoose, { Document, Schema } from 'mongoose';

export interface IMaintenanceLog extends Document {
  equipment: mongoose.Types.ObjectId;
  technicianName: string;
  type: 'Scheduled' | 'Emergency' | 'Preventive';
  description: string;
  startDate: Date;
  endDate?: Date;
  status: 'Pending' | 'In Progress' | 'Completed';
  cost?: number;
  parts?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const MaintenanceLogSchema = new Schema<IMaintenanceLog>(
  {
    equipment: { type: Schema.Types.ObjectId, ref: 'Equipment', required: true },
    technicianName: { type: String, required: true, trim: true },
    type: { type: String, enum: ['Scheduled', 'Emergency', 'Preventive'], required: true },
    description: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' },
    cost: { type: Number },
    parts: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model<IMaintenanceLog>('MaintenanceLog', MaintenanceLogSchema);
