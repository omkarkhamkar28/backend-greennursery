const productsModel = require('../models/productsModel');
const commentsModel = require('../models/commentsModel');
const replyModel = require('../models/replyModel');
const mongoose = require("mongoose");

// add product
const addProductController = async (req, res) => {
    try {
        const { name_en, name_mr, description_en, description_mr, type_en, type_mr, rate, stock, photo, subtitles } = req.body;
        //validations
        if (!name_en) {
            return res.send({ message: "Name is Required" });
        }
        if (!name_mr) {
            return res.send({ message: "Description is Required" });
        }
        if (!type_en) {
            return res.send({ message: "Price is Required" });
        }
        if (!type_mr) {
            return res.send({ message: "Category is Required" });
        }
        if (!description_en) {
            return res.send({ message: "Stock is Required" });
        }
        if (!description_mr) {
            return res.send({ message: "Email is Required" });
        }
        if (!rate) {
            return res.send({ message: "Password is Required" });
        }
        if (!stock) {
            return res.send({ message: "Phone no is Required" });
        }
        // if (!photo) {
        //     return res.send({ message: "Photo is Required" });
        // }

        //check user
        const exisitingProduct1 = await productsModel.findOne({ name_en });
        const exisitingProduct2 = await productsModel.findOne({ name_mr });
        const exisitingProduct3 = await productsModel.findOne({ type_en });
        const exisitingProduct4 = await productsModel.findOne({ type_mr });

        //exisiting user
        if (exisitingProduct1 && exisitingProduct2 || exisitingProduct3 && exisitingProduct4) {
            return res.status(200).send({
                success: false,
                message: "Already product exist",
            });
        }

        //save
        const product = await new productsModel({
            name_en, name_mr, description_en, description_mr, type_en, type_mr, rate, stock, photo
        }).save();


        res.status(201).send({
            success: true,
            message: "Product Added Successfully",
            product,
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).send({
            success: false,
            message: 'Error in adding product',
            err
        });
    }
}

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
        const { name_en, name_mr, description_en, description_mr, type_en, type_mr, rate, stock, photo, subtitles } = req.body;

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


//add comment
const addCommentController = async (req, res) => {
    try {
        const { user, comm } = req.body;
        const product_id = req.params.id;
        //save
        const com = await new commentsModel({
            user, comm, product_id
        }).save();

        res.status(201).send({
            success: true,
            message: "Comment Added Successfully",
            com,
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).send({
            success: false,
            message: 'Error in adding product',
            err
        });
    }
}

//all comments with product
const getAllComments = async (req, res) => {
    try {
        const product_id = req.params.id;
        const comments = await commentsModel.find({ product_id: product_id }).sort({ createdAt: -1 });
        res.status(200).send({
            success: true,
            message: "All comments ",
            comments
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

//delete comment
const deleteComment = async (req, res) => {
    try {
        const id = req.params.id;
        const comment = await commentsModel.findById(id);
        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "comment not found",
            });
        }
        await commentsModel.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            message: "Comment deleted successfully",
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error While deleting comment",
            error,
        });
    }
};

// edit comment 
const updateCommentController = async (req, res) => {
    try {
        const { user, comm } = req.body;
        const product_id = req.params.id;

        // Find product by ID
        const comment = await commentsModel.findById(req.params.id);
        if (!comment) {
            return res.status(404).send({ message: "comment not found" });
        }

        const updatedUser = await commentsModel.findByIdAndUpdate(
            req.params.id,
            {
                user: user || comment.user,
                comm: comm || comment.comm, 
            },
            { new: true }
        );

        res.status(200).send({
            success: true,
            message: "Comment Updated Successfully",
            updatedUser,
        });
    } catch (err) {
        console.log("Error in comment:", err);
        res.status(400).send({
            success: false,
            message: "Error While Updating comment",
            error: err.message,
        });
    }
};


const addCommentReplyController = async (req, res) => {
    try {
        const { user, reply } = req.body;
        const comm_id = req.params.id;
        //save
        const com = await new replyModel({
            user, reply, comm_id
        }).save();

        res.status(201).send({
            success: true,
            message: "Reply Added Successfully",
            com,
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).send({
            success: false,
            message: 'Error in adding product',
            err
        });
    }
}

//all reply
const getAllReply = async (req, res) => {
    try {
        const comm_id = req.params.id;
        const replies = await replyModel.find({ comm_id: comm_id }).sort({ createdAt: -1 });
        res.status(200).send({
            success: true,
            message: "All comments ",
            replies
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

//delete comment
const deleteCommentReply = async (req, res) => {
    try {
        const id = req.params.id;
        const comment = await replyModel.findById(id);
        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Reply not found",
            });
        }
        await replyModel.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            message: "Reply deleted successfully",
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error While deleting Reply",
            error,
        });
    }
};

module.exports = {
    addProductController,
    getAllProducts,
    deleteProductController,
    getSingleProductController,
    updateProductController,
    addCommentController,
    addCommentReplyController,
    getAllComments,
    getAllReply,
    deleteComment,
    deleteCommentReply,
     updateCommentController 


    };