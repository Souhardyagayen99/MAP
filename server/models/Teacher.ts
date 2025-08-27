import mongoose, { Schema, InferSchemaType, Model } from 'mongoose';

const TeacherSchema = new Schema({
  facultyId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  department: { type: String, required: true },
  designation: { type: String, required: true },
  profilePhoto: { type: String },
  // Teaching assignments
  assignedStudents: [{ type: Schema.Types.ObjectId, ref: 'Student' }],
  // Status
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, { timestamps: true });

export type TeacherDoc = InferSchemaType<typeof TeacherSchema> & { _id: string };

export const TeacherModel: Model<TeacherDoc> =
  (mongoose.models.Teacher as Model<TeacherDoc>) ||
  mongoose.model<TeacherDoc>('Teacher', TeacherSchema);
