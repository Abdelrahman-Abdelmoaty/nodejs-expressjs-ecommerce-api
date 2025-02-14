import mongoose, { Document, Schema } from "mongoose";

export interface IProduct extends Document {
  id: string;
  name: string;
  price: number;
  description: string;
  inStock: boolean;
  stockQuantity: number;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    stockQuantity: { type: Number, required: true },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (_, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: function (_, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

productSchema.virtual("inStock").get(function (this: IProduct) {
  return this.stockQuantity > 0;
});

export default mongoose.model<IProduct>("Product", productSchema);
