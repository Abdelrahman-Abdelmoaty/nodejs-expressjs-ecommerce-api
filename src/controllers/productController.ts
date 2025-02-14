import { Request, Response } from "express";
import { z } from "zod";
import Product from "../models/Product";

const CreateProductSchema = z.object({
  name: z.string({ message: "Name is required" }),
  price: z.number({ message: "Price is required" }).positive("Price must be positive"),
  description: z.string({ message: "Description is required" }),
  stockQuantity: z
    .number({ message: "Stock quantity is required" })
    .int({ message: "Stock quantity must be an integer" })
    .nonnegative("Stock quantity must be non-negative"),
});

const UpdateProductSchema = CreateProductSchema.partial();

export const createProduct = async (req: Request, res: Response) => {
  try {
    const result = CreateProductSchema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        message: "Validation error",
        errors: result.error.flatten().fieldErrors,
      });
      return;
    }

    const product = await Product.create(result.data);

    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const idSchema = z.string().min(1, "Product ID is required");
    const result = idSchema.safeParse(req.params.id);

    if (!result.success) {
      res.status(400).json({
        message: "Invalid product ID",
        errors: result.error.flatten().fieldErrors,
      });
      return;
    }

    const product = await Product.findById(result.data);
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    res.json(product);
  } catch (error) {
    console.error("Get product by ID error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const idSchema = z.string().min(1, "Product ID is required");
    const idResult = idSchema.safeParse(req.params.id);

    if (!idResult.success) {
      res.status(400).json({
        message: "Invalid product ID",
        errors: idResult.error.flatten().fieldErrors,
      });
      return;
    }

    const dataResult = UpdateProductSchema.safeParse(req.body);

    if (!dataResult.success) {
      res.status(400).json({
        message: "Validation error",
        errors: dataResult.error.flatten().fieldErrors,
      });
      return;
    }

    const product = await Product.findByIdAndUpdate(idResult.data, dataResult.data, { new: true });

    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    res.json(product);
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const idSchema = z.string().min(1, "Product ID is required");
    const result = idSchema.safeParse(req.params.id);

    if (!result.success) {
      res.status(400).json({
        message: "Invalid product ID",
        errors: result.error.flatten().fieldErrors,
      });
      return;
    }

    const product = await Product.findByIdAndDelete(result.data);
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const searchSchema = z.object({
  query: z.string({ message: "Search query is required" }),
});

export const searchProducts = async (req: Request, res: Response) => {
  try {
    const result = searchSchema.safeParse(req.query);

    if (!result.success) {
      res.status(400).json({ message: "Validation error", errors: result.error.flatten().fieldErrors });
      return;
    }

    const { query } = result.data;
    const products = await Product.find({ name: { $regex: query, $options: "i" } });

    res.json({ message: "Search products successfully", products });
  } catch (error) {
    console.error("Search products error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
