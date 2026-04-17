import mongoose, { Document, Schema } from 'mongoose';

export interface IStaff extends Document {
  name: string;
  role: string;
  department: string;
  email: string;
  phone?: string;
  assignedEquipment: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const StaffSchema = new Schema<IStaff>(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    department: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    assignedEquipment: [{ type: Schema.Types.ObjectId, ref: 'Equipment' }],
  },
  { timestamps: true }
);

export default mongoose.model<IStaff>('Staff', StaffSchema);
