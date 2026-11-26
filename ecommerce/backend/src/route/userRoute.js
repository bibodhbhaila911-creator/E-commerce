import { Router } from "express";
import User from "../schema/userSchema.js";

let UserRoute = Router();

UserRoute
    .route('/')
    .post(async (req, res) => {
        try {
            let result = await User.create(req.body);
            res.status(201).json({
                success: true,
                message: 'User Created Successfully',
                result: result
            });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    })
    .get(async (req, res) => {
        try {
            let result = await User.find();
            res.status(200).json({
                success: true,
                message: 'User Read Successfully',
                result: result
            });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    });

UserRoute
    .route('/:id')
    .get(async (req, res) => {
        try {
            let result = await User.findById(req.params.id);
            res.status(200).json({
                success: true,
                message: 'User Read Successfully',
                result: result
            });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    })
    .patch(async (req, res) => {
        try {
            let result = await User.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after', runValidators: true });
            res.status(200).json({
                success: true,
                message: 'User Updated Successfully',
                result: result
            });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    })
    .delete(async (req, res) => {
        try {
            let result = await User.findByIdAndDelete(req.params.id);
            res.status(200).json({
                success: true,
                message: 'User Deleted Successfully',
                result: result
            });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    });

export default UserRoute;
