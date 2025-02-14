import { Request, Response } from "express";
import Cart from "../models/Cart";
import Product from "../models/Product";
import { z } from "zod";
import { Types } from "mongoose";

export const getCart = async (req: Request, res: Response) => {
  try {
    const cart = await Cart.findOne({ user: req.body.user.id }).populate("items.product");

    if (!cart) {
      res.status(404).json({ message: "Cart not found" });
      return;
    }

    res.json({
      cart: {
        id: cart.id,
        items: cart.items.map((item) => ({
          id: item.id,
          product: item.product,
          quantity: item.quantity,
        })),
        total: cart.total,
      },
      message: "Cart loaded successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching cart" });
  }
};

const addToCartSchema = z.object({
  productId: z.string({ message: "Product ID is required" }),
  quantity: z.number({ message: "Quantity is required" }).min(1, { message: "Quantity must be at least 1" }),
});

export const addToCart = async (req: Request, res: Response) => {
  try {
    const result = addToCartSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({
        message: "Validation error",
        errors: result.error.flatten().fieldErrors,
      });
      return;
    }

    const { productId, quantity } = result.data;

    const cart = await Cart.findOne({ user: req.body.user.id }).populate("items.product");

    if (!cart) {
      res.status(404).json({ message: "Cart not found" });
      return;
    }

    const product = await Product.findById(productId);

    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    const existingItem = cart.items.find((item) => item.product.id.toString() === productId);

    if (existingItem) {
      res.status(400).json({ message: "Product already in cart" });
      return;
    }

    cart.items.push({
      product: productId as unknown as Types.ObjectId,
      quantity,
      id: productId as unknown as Types.ObjectId,
    });

    await cart.save();
    await cart.populate("items.product");

    res.json({
      cart: {
        id: cart.id,
        items: cart.items.map((item) => ({
          id: item.id,
          product: item.product,
          quantity: item.quantity,
        })),
        total: cart.total,
      },
      message: "Product added to cart successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error adding to cart" });
  }
};

const removeFromCartSchema = z.object({
  productId: z.string({ message: "Product ID is required" }),
});

export const removeFromCart = async (req: Request, res: Response) => {
  try {
    const result = removeFromCartSchema.safeParse(req.params);
    if (!result.success) {
      res.status(400).json({
        message: "Validation error",
        errors: result.error.flatten().fieldErrors,
      });
      return;
    }

    const { productId } = result.data;

    const cart = await Cart.findOne({ user: req.body.user.id }).populate("items.product");

    if (!cart) {
      res.status(404).json({ message: "Cart not found" });
      return;
    }

    const product = await Product.findById(productId);

    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    cart.items = cart.items.filter((item) => item.id.toString() !== productId);

    await cart.save();
    await cart.populate("items.product");

    res.json({
      cart: {
        id: cart.id,
        items: cart.items.map((item) => ({
          id: item.id,
          product: item.product,
          quantity: item.quantity,
        })),
        total: cart.total,
      },
      message: "Product removed from cart successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error removing from cart" });
  }
};

const editCartSchema = z.object({
  productId: z.string({ message: "Product ID is required" }),
  quantity: z
    .number({ required_error: "Quantity is required", invalid_type_error: "Quantity must be a number" })
    .positive({ message: "Quantity must be positive" })
    .int({ message: "Quantity must be an integer" }),
});

export const editCart = async (req: Request, res: Response) => {
  try {
    console.log({ productId: req.body.productId, quantity: req.body.quantity });

    const result = editCartSchema.safeParse({
      productId: req.body.productId,
      quantity: req.body.quantity,
    });

    if (!result.success) {
      res.status(400).json({
        message: "Validation error",
        errors: result.error.flatten().fieldErrors,
      });
      return;
    }

    const { productId, quantity } = result.data;

    const cart = await Cart.findOne({ user: req.body.user.id }).populate("items.product");

    if (!cart) {
      res.status(404).json({ message: "Cart not found" });
      return;
    }

    const existingItem = cart.items.find((item) => item.id.toString() === productId);

    if (!existingItem) {
      res.status(404).json({ message: "Product not found in cart" });
      return;
    }

    existingItem.quantity = quantity;

    await cart.save();
    await cart.populate("items.product");

    res.json({
      cart: {
        id: cart.id,
        items: cart.items.map((item) => ({
          id: item.id,
          product: item.product,
          quantity: item.quantity,
        })),
        total: cart.total,
      },
      message: "Cart updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error editing cart" });
  }
};

export const clearCart = async (req: Request, res: Response) => {
  try {
    const cart = await Cart.findOne({ user: req.body.user.id });

    if (!cart) {
      res.status(404).json({ message: "Cart not found" });
      return;
    }

    cart.items = [];

    await cart.save();
    await cart.populate("items.product");

    res.json({
      cart: {
        id: cart.id,
        items: cart.items.map((item) => ({
          id: item.id,
          product: item.product,
          quantity: item.quantity,
        })),
        total: cart.total,
      },
      message: "Cart cleared successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error clearing cart" });
  }
};
