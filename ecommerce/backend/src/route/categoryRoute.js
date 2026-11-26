import { Router } from "express";
import Category from "../schema/categorySchema.js";

let CategoryRoute = Router();

CategoryRoute
    .route('/')
    .post(async (req, res) => {
        try {
            let result = await Category.create(req.body);
            res.status(201).json({
                success: true,
                message: 'Category Created Successfully',
                result: result
            });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    })
    .get(async (req, res) => {
        try {
            let result = await Category.find();
            res.status(200).json({
                success: true,
                message: 'Category Read Successfully',
                result: result
            });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    });

CategoryRoute
    .route('/:id')
    .get(async (req, res) => {
        try {
            let result = await Category.findById(req.params.id);
            res.status(200).json({
                success: true,
                message: 'Category Read Successfully',
                result: result
            });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    })
    .patch(async (req, res) => {
        try {
            let result = await Category.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after', runValidators: true });
            res.status(200).json({
                success: true,
                message: 'Category Updated Successfully',
                result: result
            });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    })
    .delete(async (req, res) => {
        try {
            let result = await Category.findByIdAndDelete(req.params.id);
            res.status(200).json({
                success: true,
                message: 'Category Deleted Successfully',
                result: result
            });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    });

export default CategoryRoute;
