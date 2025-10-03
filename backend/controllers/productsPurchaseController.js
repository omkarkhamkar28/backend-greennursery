const purchaseCourseModel = require('../models/purchaseProductModel');
 const notificationModel = require('../models/notificationModel');

const mongoose = require("mongoose");
const dotenv = require('dotenv');
const purchaseProductModel = require('../models/purchaseProductModel');
dotenv.config();

//add product purchase
const purchaseProductsController = async (req, res) => {
    try {
        const { user_id, product_id,user, name_en, name_mr, type_en, type_mr, quantity, totalPrice, states, paymentStates } = req.body;
        const startDate = new Date(req.body.startDate);

        // Save purchase details in database
        const productsPurchase = await new purchaseCourseModel({
            user_id, 
            product_id,
            user,
            name_en,
            name_mr,
            type_en,
            type_mr,
            quantity,
            totalPrice,
            states,
            paymentStates
        }).save();

    // const productsPurchase3 = await new notificationModel({
        //     name_en,
        //     name_mr,
        //     type_en,
        //     type_mr,
        //     startDate,
        //     states,
        //     firstWater: fwater,
        //     secondWater: swater,
        //     thirdWater: twater,
        //     fourthWater: fowater,
        //     fifthhWater: fiwater
        // }).save();

        const fwater = new Date(startDate.getTime() + 1000 * 60 * 60 * 24 * 7);
        const swater = new Date(startDate.getTime() + 1000 * 60 * 60 * 24 * 15);
        const twater = new Date(startDate.getTime() + 1000 * 60 * 60 * 24 * 30);
        const fowater = new Date(startDate.getTime() + 1000 * 60 * 60 * 24 * 50);
        const fiwater = new Date(startDate.getTime() + 1000 * 60 * 60 * 24 * 75);

        res.status(201).send({
            success: true,
            message: "Purchase product Successfully",
            productsPurchase,
            // productsPurchase2,
            // productsPurchase3
        });

        if (!productsPurchase ) { //&& !productsPurchase2 && !productsPurchase3
            return res.status(404).send({
                success: false,
                message: "User not found",
            });
        }

    }
    catch (err) {
        console.log(err);
        res.status(500).send({
            success: false,
            message: 'Error in purchase course',
            err
        })
    }
}

//single user all orders  
const getSingleuserOrdersDetails = async (req, res) => {
    try {
        const id = req.params.id;
        const orders = await purchaseProductModel.find({ id });
        res.status(200).send({
            success: true,
            message: "Single user Order Details ",
            orders
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error While Geting all order detail",
            error,
        });
    }
};

//all Orders Details
const getAllOrdersDetails = async (req, res) => {
    try {
        const orders = await purchaseProductModel.find({});
        res.status(200).send({
            success: true,
            message: "All Order Details ",
            orders
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error While Geting all order detail",
            error,
        });
    }
};

//all Orders Details
const getSingleOrdersDetails = async (req, res) => {
    try {
         const order = await purchaseProductModel.findById(req.params.id);
        res.status(200).send({
            success: true,
            message: "Single Order Details ",
            order
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error While Geting all order detail",
            error,
        });
    }
};

//delete product purchase
const deleteProductPurchaseController = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("Deleting product purchase with ID:", id); // Debugging

        const user = await purchaseProductModel.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "product puchase not found",
            });
        }

        await purchaseProductModel.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "product purchase deleted successfully",
        });
    } catch (err) {
        console.error("Error deleting product:", err);
        res.status(500).json({
            success: false,
            message: "Error deleting product",
            error: err.message,
        });
    }
};

// update product
const updateProductPurchaseController = async (req, res) => {
    try {

        const {   quantity, totalPrice, states, paymentStates,purchaseDate } = req.body;
        const startDate = new Date(req.body.startDate);

        // Find product by ID
        const product = await purchaseCourseModel.findById(req.params.id);

        if (!product) {
            return res.status(404).send({ message: "Order not found" });
        }

        const updatedUser = await purchaseCourseModel.findByIdAndUpdate(
            req.params.id,
            { 
                quantity: quantity || product.quantity,
                totalPrice: totalPrice || product.totalPrice,
                states: states || product.states,
                paymentStates: paymentStates || product.paymentStates,
                purchaseDate: purchaseDate || product.purchaseDate
            },
            { new: true }
        );

        res.status(200).send({
            success: true,
            message: "Order Updated Successfully",
            updatedUser,
        });
    } catch (err) {
        console.log("Error in Product purchase:", err);
        res.status(400).send({
            success: false,
            message: "Error While Updating Product purchase",
            error: err.message,
        });
    }
};


module.exports = {
    purchaseProductsController,
    getAllOrdersDetails,
    deleteProductPurchaseController,
    getSingleuserOrdersDetails,
    updateProductPurchaseController,
    getSingleOrdersDetails
};