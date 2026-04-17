import mongoose, { Document, Schema } from 'mongoose';

export interface IEquipment extends Document {
  name: string;
  serialNumber: string;
  type: string;
  department: string;
  status: 'Active' | 'Maintenance' | 'Offline';
  assignedTech: string;
  lastServiced?: Date;
  nextServiceDue?: Date;
  location?: string;
  manufacturer?: string;
  modelName?: string;
  purchaseDate?: Date;
  warrantyExpiry?: Date;
  notes?: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const EquipmentSchema = new Schema<IEquipment>(
  {
    name: { type: String, required: true, trim: true },
    serialNumber: { type: String, required: true, unique: true, trim: true },
    type: {
      type: String,
      enum: ['CT Scanner', 'MRI', 'Sonography', 'ECG', 'X-Ray', 'Blood Analyzer', 'Patient Monitor', 'Ventilator', 'Online Consult', 'Defibrillator', 'Other'],
      required: true,
    },
    department: {
      type: String,
      enum: ['Radiology', 'Cardiology', 'Pathology Lab', 'ICU Monitoring', 'Teleconsultancy', 'Obstetrics', 'Diagnostic', 'Emergency', 'Other'],
      required: true,
    },
    status: {
      type: String,
      enum: ['Active', 'Maintenance', 'Offline'],
      default: 'Active',
    },
    assignedTech: { type: String, trim: true },
    lastServiced: { type: Date },
    nextServiceDue: { type: Date },
    location: { type: String, trim: true },
    manufacturer: { type: String, trim: true },
    modelName: { type: String, trim: true },
    purchaseDate: { type: Date },
    warrantyExpiry: { type: Date },
    notes: { type: String },
    imageUrl: { type: String },
  },
  { timestamps: true }
);

EquipmentSchema.index({ name: 'text', serialNumber: 'text' });

export default mongoose.model<IEquipment>('Equipment', EquipmentSchema);
