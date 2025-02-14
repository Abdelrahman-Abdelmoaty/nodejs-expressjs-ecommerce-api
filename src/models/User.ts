import mongoose, { Document, Schema, Types } from "mongoose";
import { ICart } from "./Cart";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
  cart: Types.ObjectId | ICart;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    cart: { type: Schema.Types.ObjectId, ref: "Cart" },
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

userSchema.pre("save", async function (next) {
  if (this.isNew && !this.isAdmin) {
    const Cart = mongoose.model("Cart");
    const cart = await Cart.create({ user: this._id });
    this.cart = cart._id;
  }
  next();
});

export default mongoose.model<IUser>("User", userSchema);
