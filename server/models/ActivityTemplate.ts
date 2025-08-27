import mongoose, { Schema, InferSchemaType, Model } from 'mongoose';

const ActivityTemplateSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  subCategory: { type: String },
  level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
  points: { type: Number, required: true },
  maxPoints: { type: Number, required: true },
  evidenceType: { type: String, required: true }, // photo, document, video, etc.
  requirements: { type: String },
  startDate: { type: Date },
  endDate: { type: Date },
  isActive: { type: Boolean, default: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'Teacher', required: true },
  department: { type: String, required: true },
  year: { type: String }, // Specific year if applicable
  division: { type: String } // Specific division if applicable
}, { timestamps: true });

export type ActivityTemplateDoc = InferSchemaType<typeof ActivityTemplateSchema> & { _id: string };

export const ActivityTemplateModel: Model<ActivityTemplateDoc> =
  (mongoose.models.ActivityTemplate as Model<ActivityTemplateDoc>) ||
  mongoose.model<ActivityTemplateDoc>('ActivityTemplate', ActivityTemplateSchema);
