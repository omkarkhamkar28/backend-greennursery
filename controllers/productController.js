const productsModel = require('../models/productsModel');
const commentsModel = require('../models/commentsModel');
const replyModel = require('../models/replyModel');
const mongoose = require("mongoose");
const dotenv = require('dotenv');
dotenv.config();
const cloudinary = require("../config/cloudinary.js");


const addProductController = async (req, res) => {
  try {
    const {
      name_en,
      name_mr,
      type_en,
      type_mr,
      description_en,
      description_mr,
      rate,
      stock,
    } = req.body;

    let schedule = [];
    if (req.body.schedule) {
      schedule = JSON.parse(req.body.schedule);
    }

    if (
      !name_en ||
      !name_mr ||
      !type_en ||
      !type_mr ||
      !description_en ||
      !description_mr ||
      !rate ||
      !stock
    ) {
      return res.status(400).send({
        success: false,
        message: "All fields are required",
      });
    }

    const existing = await productsModel.findOne({
      $or: [{ name_en }, { name_mr }],
    });

    if (existing) {
      return res.status(200).send({
        success: false,
        message: "Product already exists",
      });
    }

    // ✅ Upload image to Cloudinary if file exists
    let photoUrl = null;
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "productImages" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });
      photoUrl = result.secure_url;
    }

    const product = new productsModel({
      name_en,
      name_mr,
      type_en,
      type_mr,
      description_en,
      description_mr,
      rate,
      stock,
      schedule,
      photo: photoUrl,
    });

    await product.save();

    res.status(201).send({
      success: true,
      message: "Product added successfully",
      product,
    });
  } catch (err) {
    console.log("Error in addProductController:", err);
    res.status(500).send({
      success: false,
      message: "Error in adding product",
      error: err.message,
    });
  }
};

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

const updateProductController = async (req, res) => {
  try {
    const {
      name_en,
      name_mr,
      description_en,
      description_mr,
      type_en,
      type_mr,
      rate,
      stock,
      schedule
    } = req.body;

    const product = await productsModel.findById(req.params.id);
    if (!product) {
      return res.status(404).send({
        success: false,
        message: "Product not found",
      });
    }

    // Parse schedule if provided
    let parsedSchedule = product.schedule;
    if (schedule) {
      parsedSchedule = JSON.parse(schedule);
    }

    // Upload photo to Cloudinary if provided
    let photoPath = product.photo; // existing photo
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "productImages" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });
      photoPath = result.secure_url; // Cloudinary URL
    }

    const updatedProduct = await productsModel.findByIdAndUpdate(
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
        schedule: parsedSchedule,
        photo: photoPath,
      },
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: "Product Updated Successfully",
      updatedProduct,
    });
  } catch (error) {
    console.log("Error in updateProductController:", error);
    res.status(400).send({
      success: false,
      message: "Error While Updating Product",
      error: error.message,
    });
  }
};

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
