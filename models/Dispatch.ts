import mongoose, { Document, Schema, model } from 'mongoose';

export interface IDispatch extends Document {
  partnerId: mongoose.Types.ObjectId;
  createdAt: Date;
  articleName: string;
  quantity: number;
  kg: number;
  average: number;
  numberOfBags?: number;
}

const DispatchSchema = new Schema<IDispatch>(
  {
    partnerId: { type: Schema.Types.ObjectId, ref: 'Partner', required: true },
    createdAt: { type: Date, required: true, default: Date.now },
    articleName: { type: String, required: true },
    quantity: { type: Number, required: true },
    kg: { type: Number, required: true },
    average: { type: Number, required: true },
    numberOfBags: { type: Number },
  },
  {
    timestamps: true,
  }
);

export const Dispatch = mongoose.models.Dispatch || model<IDispatch>('Dispatch', DispatchSchema);
