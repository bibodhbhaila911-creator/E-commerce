import { Router } from "express";
import Order from "../schema/orderSchema.js";

let OrderRoute = Router();

OrderRoute
    .route('/')
    .post(async (req, res) => {
        try {
            let result = await Order.create(req.body);
            res.status(201).json({
                success: true,
                message: 'Order Created Successfully',
                result: result
            });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    })
    .get(async (req, res) => {
        try {
            let result = await Order.find();
            res.status(200).json({
                success: true,
                message: 'Order Read Successfully',
                result: result
            });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    });

OrderRoute
    .route('/:id')
    .get(async (req, res) => {
        try {
            let result = await Order.findById(req.params.id);
            res.status(200).json({
                success: true,
                message: 'Order Read Successfully',
                result: result
            });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    })
    .patch(async (req, res) => {
        try {
            let result = await Order.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after', runValidators: true });
            res.status(200).json({
                success: true,
                message: 'Order Updated Successfully',
                result: result
            });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    })
    .delete(async (req, res) => {
        try {
            let result = await Order.findByIdAndDelete(req.params.id);
            res.status(200).json({
                success: true,
                message: 'Order Deleted Successfully',
                result: result
            });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    });

export default OrderRoute;
