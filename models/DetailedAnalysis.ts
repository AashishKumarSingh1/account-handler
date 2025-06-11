import mongoose, { Document, Schema, model } from 'mongoose';

export interface IDetailedAnalysis extends Document {
  partnerId: mongoose.Types.ObjectId;
  articleName: string;
  type: 'buy' | 'sell';
  quantity: number;
  weight: number;
  average: number;
  numberOfBags?: number;
  transactionDate: Date;
  notes?: string;
}

const DetailedAnalysisSchema = new Schema<IDetailedAnalysis>(
  {
    partnerId: { type: Schema.Types.ObjectId, ref: 'Partner', required: true },
    articleName: { type: String, required: true },
    type: { type: String, enum: ['buy', 'sell'], required: true },
    quantity: { type: Number, required: true },
    weight: { type: Number, required: true },
    average: { type: Number, required: true },
    numberOfBags: { type: Number },
    transactionDate: { type: Date, required: true, default: Date.now },
    notes: { type: String },
  },
  {
    timestamps: true,
  }
);

export const DetailedAnalysis = mongoose.models.DetailedAnalysis || model<IDetailedAnalysis>('DetailedAnalysis', DetailedAnalysisSchema);
