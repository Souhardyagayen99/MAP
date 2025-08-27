import mongoose, { Schema, InferSchemaType, Model } from 'mongoose';

const LocationSchema = new Schema({
  address: { type: String },
  lat: { type: Number },
  lng: { type: Number }
}, { _id: false });

const ActivitySchema = new Schema({
  // Student identifiers (store as plain strings for flexibility)
  studentId: { type: String, required: true },
  studentName: { type: String, required: true },

  // Activity taxonomy
  categoryId: { type: String, required: true },
  subActivityId: { type: String },
  activityName: { type: String, required: true },

  // Participation details
  level: { type: String, required: true },
  isWinner: { type: Boolean, default: false },
  startDate: { type: String },
  endDate: { type: String },
  evidenceType: { type: String },
  duration: { type: String },
  remarks: { type: String },
  grade: { type: String },
  location: { type: LocationSchema },

  // Status & points
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  points: { type: Number, required: true },
  submissionDate: { type: String },

  // Review metadata
  teacherRemarks: { type: String },
  approvedBy: { type: String },
  approvedDate: { type: String },

  // Legacy/optional fields
  marksObtained: { type: String },
  totalMarks: { type: String },
  marksEvidence: { type: String },
  marksApproved: { type: Boolean },
  marksApprovedBy: { type: String },
  marksApprovedDate: { type: String }
}, { timestamps: true });

export type ActivityDoc = InferSchemaType<typeof ActivitySchema> & { _id: string };

export const ActivityModel: Model<ActivityDoc> =
  (mongoose.models.Activity as Model<ActivityDoc>) ||
  mongoose.model<ActivityDoc>('Activity', ActivitySchema);


