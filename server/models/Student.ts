import mongoose, { Schema, InferSchemaType, Model } from 'mongoose';

const StudentSchema = new Schema({
  enrollmentNumber: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  department: { type: String, required: true },
  year: { type: String, required: true },
  division: { type: String, required: true },
  program: { type: String, required: true },
  address: { type: String },
  dateOfBirth: { type: String },
  profilePhoto: { type: String },
  // Academic records
  sscPercentage: { type: Number, min: 0, max: 100 },
  hscPercentage: { type: Number, min: 0, max: 100 },
  // Points tracking
  totalPoints: { type: Number, default: 0 },
  requiredPoints: { type: Number, default: 100 },
  // Status
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, { timestamps: true });

export type StudentDoc = InferSchemaType<typeof StudentSchema> & { _id: string };

export const StudentModel: Model<StudentDoc> =
  (mongoose.models.Student as Model<StudentDoc>) ||
  mongoose.model<StudentDoc>('Student', StudentSchema);
