import mongoose, { Document, Schema, model } from 'mongoose';

export interface IPartner extends Document {
  partnerName: string;
  createdAt: Date;
}

const PartnerSchema = new Schema<IPartner>(
  {
    partnerName: { type: String, required: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const Partner = mongoose.models.Partner || model<IPartner>('Partner', PartnerSchema);
