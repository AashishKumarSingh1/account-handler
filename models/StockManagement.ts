import mongoose, { Document, Schema, model } from 'mongoose';

export interface IStockManagement extends Document {
  partnerId: mongoose.Types.ObjectId;
  lastModifiedAt: Date;
  articleName: string;
  quantity: number;
  weight: number;
  average: number;
  numberOfBags?: number;
}

const StockManagementSchema = new Schema<IStockManagement>(
  {
    partnerId: { type: Schema.Types.ObjectId, ref: 'Partner', required: true },
    lastModifiedAt: { type: Date, required: true, default: Date.now },
    articleName: { type: String, required: true },
    quantity: { type: Number, required: true },
    weight: { type: Number, required: true },
    average: { type: Number, required: true },
    numberOfBags: { type: Number },
  },
  {
    timestamps: true,
  }
);

export const StockManagement = mongoose.models.StockManagement || model<IStockManagement>('StockManagement', StockManagementSchema);
