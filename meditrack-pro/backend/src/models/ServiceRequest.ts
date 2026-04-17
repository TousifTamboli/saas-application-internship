import mongoose, { Document, Schema } from 'mongoose';

export interface IServiceRequest extends Document {
  equipment: mongoose.Types.ObjectId;
  requestedBy: string;
  department: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  issue: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  assignedTo?: string;
  resolvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceRequestSchema = new Schema<IServiceRequest>(
  {
    equipment: { type: Schema.Types.ObjectId, ref: 'Equipment', required: true },
    requestedBy: { type: String, required: true, trim: true },
    department: { type: String, required: true, trim: true },
    priority: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], required: true },
    issue: { type: String, required: true },
    status: { type: String, enum: ['Open', 'In Progress', 'Resolved', 'Closed'], default: 'Open' },
    assignedTo: { type: String, trim: true },
    resolvedAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model<IServiceRequest>('ServiceRequest', ServiceRequestSchema);
