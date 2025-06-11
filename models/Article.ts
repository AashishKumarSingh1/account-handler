import mongoose, { Document, Schema, model } from 'mongoose';

export interface IArticle extends Document {
  ArticleName: string;
  createdAt: Date;
}

const ArticleSchema = new Schema<IArticle>(
  {
    ArticleName: { type: String, required: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const Partner = mongoose.models.Partner || model<IArticle>('Article', ArticleSchema);
