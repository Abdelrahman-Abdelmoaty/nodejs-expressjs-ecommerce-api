import mongoose, { Document, Schema, Types } from "mongoose";
import { IUser } from "./User";
import { IProduct } from "./Product";

export interface ICartItem {
  id: Types.ObjectId;
  product: Types.ObjectId | IProduct;
  quantity: number;
}

export interface ICart extends Document {
  id: Types.ObjectId;
  user: Types.ObjectId | IUser;
  items: Array<ICartItem>;
  total: number;
}

const cartSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    items: [
      {
        product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true, min: 1 },
        id: { type: Schema.Types.ObjectId, required: true },
      },
    ],
  },
  {
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

cartSchema.virtual("total").get(function (this: ICart) {
  if (!this.populated("items.product")) {
    return 0;
  }
  return this.items.reduce((total, item) => {
    const product = item.product as IProduct;
    if (!product || !product.price) {
      return total;
    }
    return total + product.price * item.quantity;
  }, 0);
});

export default mongoose.model<ICart>("Cart", cartSchema);
