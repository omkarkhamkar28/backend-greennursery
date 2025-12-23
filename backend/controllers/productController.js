const productsModel = require('../models/productsModel');
const commentsModel = require('../models/commentsModel');
const replyModel = require('../models/replyModel');
const mongoose = require("mongoose");

// add product
const addProductController = async (req, res) => {
    try {
        const { name_en, name_mr, description_en, description_mr, type_en, type_mr, rate, stock, photo, schedule } = req.body;

        // Validations
        if (!name_en) {
            return res.status(400).send({ success: false, message: "English name is required" });
        }
        if (!name_mr) {
            return res.status(400).send({ success: false, message: "Marathi name is required" });
        }
        if (!type_en) {
            return res.status(400).send({ success: false, message: "English type/category is required" });
        }
        if (!type_mr) {
            return res.status(400).send({ success: false, message: "Marathi type/category is required" });
        }
        if (!description_en) {
            return res.status(400).send({ success: false, message: "English description is required" });
        }
        if (!description_mr) {
            return res.status(400).send({ success: false, message: "Marathi description is required" });
        }
        if (!rate) {
            return res.status(400).send({ success: false, message: "Rate is required" });
        }
        if (!stock) {
            return res.status(400).send({ success: false, message: "Stock is required" });
        }

        // Check if product already exists
        const existingProduct = await productsModel.findOne({
            $or: [
                { name_en },
                { name_mr },
                { type_en },
                { type_mr }
            ]
        });

        if (existingProduct) {
            return res.status(200).send({
                success: false,
                message: "Product already exists",
            });
        }

        // Save product
        const product = await new productsModel({
            name_en, name_mr, description_en, description_mr, type_en, type_mr, rate, stock, photo, schedule: schedule || []
        }).save();

        res.status(201).send({
            success: true,
            message: "Product added successfully",
            product,
        });

    } catch (err) {
        console.log(err);
        res.status(500).send({
            success: false,
            message: 'Error in adding product',
            err
        });
    }
};

//all products
const getAllProducts = async (req, res) => {
    try {
        const products = await productsModel.find({});
        res.status(200).send({
            success: true,
            message: "All products ",
            products
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error While Geting products",
            error,
        });
    }
};

// update product
const updateProductController = async (req, res) => {
    try {
        const { name_en, name_mr, description_en, description_mr, type_en, type_mr, rate, stock, photo, schedule } = req.body;

        // Find product by ID
        const product = await productsModel.findById(req.params.id);
        if (!product) {
            return res.status(404).send({ message: "product not found" });
        }

        const updatedUser = await productsModel.findByIdAndUpdate(
            req.params.id,
            {
                name_en: name_en || product.name_en,
                name_mr: name_mr || product.name_mr,
                description_en: description_en || product.description_en,
                description_mr: description_mr || product.description_mr,
                type_en: type_en || product.type_en,
                type_mr: type_mr || product.type_mr,
                rate: rate || product.rate,
                stock: stock || product.stock,
                schedule: schedule || product.schedule,
                photo: photo || product.photo,
            },
            { new: true }
        );

        res.status(200).send({
            success: true,
            message: "Product Updated Successfully",
            updatedUser,
        });
    } catch (err) {
        console.log("Error in Product:", err);
        res.status(400).send({
            success: false,
            message: "Error While Updating Product",
            error: err.message,
        });
    }
};

// single product
const getSingleProductController = async (req, res) => {
    try {
        const product = await productsModel.findById(req.params.id);

        if (!product) {
            return res.status(404).send({
                success: false,
                message: "Product not found",
            });
        }

        res.status(200).send({
            success: true,
            message: "Single product",
            product,
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).send({
            success: false,
            message: "Error in getting single product",
            error: err.message,
        });
    }
}

//delete product
const deleteProductController = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("Deleting product with ID:", id); // Debugging

        const product = await productsModel.findById(id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "product not found",
            });
        }

        await productsModel.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "product deleted successfully",
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


module.exports = {
    addProductController,
    getAllProducts,
    deleteProductController,
    getSingleProductController,
    updateProductController,
};