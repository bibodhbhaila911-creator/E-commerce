import { Router } from "express";
import Product from "../schema/productSchema.js";

let ProductRoute = Router();

ProductRoute
    .route('/')
    .post(async (req, res) => {
        try {
            let result = await Product.create(req.body);
            res.status(201).json({
                success: true,
                message: 'Product Created Successfully',
                result: result
            });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    })
    .get(async (req, res) => {
        try {
            let result = await Product.find();
            res.status(200).json({
                success: true,
                message: 'Product Read Successfully',
                result: result
            });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    });

ProductRoute
    .route('/:id')
    .get(async (req, res) => {
        try {
            let result = await Product.findById(req.params.id);
            res.status(200).json({
                success: true,
                message: 'Product Read Successfully',
                result: result
            });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    })
    .patch(async (req, res) => {
        try {
            let result = await Product.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after', runValidators: true });
            res.status(200).json({
                success: true,
                message: 'Product Updated Successfully',
                result: result
            });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    })
    .delete(async (req, res) => {
        try {
            let result = await Product.findByIdAndDelete(req.params.id);
            res.status(200).json({
                success: true,
                message: 'Product Deleted Successfully',
                result: result
            });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    });

export default ProductRoute;
