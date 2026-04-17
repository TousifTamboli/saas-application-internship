import mongoose, { Document, Schema } from 'mongoose';

export interface IAlert extends Document {
  type: 'Offline' | 'Maintenance Due' | 'Info' | 'Critical';
  equipment?: mongoose.Types.ObjectId;
  title: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
  isRead: boolean;
  createdAt: Date;
}

const AlertSchema = new Schema<IAlert>(
  {
    type: { type: String, enum: ['Offline', 'Maintenance Due', 'Info', 'Critical'], required: true },
    equipment: { type: Schema.Types.ObjectId, ref: 'Equipment' },
    title: { type: String, required: true },
    message: { type: String, required: true },
    severity: { type: String, enum: ['error', 'warning', 'info'], required: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.model<IAlert>('Alert', AlertSchema);
