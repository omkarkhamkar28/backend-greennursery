const userModel = require('../models/userModel');
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const { hashPassword, comparePassword } = require('../helpers/authHelper');
const dotenv = require('dotenv');
dotenv.config();
const JWT = require("jsonwebtoken");
const cloudinary = require("../config/cloudinary.js");

const registerController = async (req, res) => {
  try {
    const { name, address, email, password, phone, answer } = req.body;
  
    if (!name) {
      return res.send({ message: "Name is Required" });
    }
    if (!password) {
      return res.send({ message: "Password is Required" });
    }
    if (!phone) {
      return res.send({ message: "Phone no is Required" });
    }
    if (!answer) {
      return res.send({ message: "answer is Required" });
    }

    const exisitingUser = await userModel.findOne({ phone });

    if (exisitingUser) {
      return res.status(200).send({
        success: false,
        message: "Already Register please ",
      });
    }
    const hashedPassword = await hashPassword(password);
    const user = await new userModel({
      name,
      // address,
      // email,
      phone,
      password: hashedPassword,
      answer
    }).save();

    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    console.log(token);

    res.status(201).send({
      success: true,
      message: "User Register Successfully",
      user,
      user: {
        _id: user._id,
        name: user.name,
        address: user.address,
        email: user.email,
        phone: user.phone,
        photo: user.photo,
        role: user.role,
        likedProducts: user.likedProducts,
        collectedProducts: user.collectedProducts,
        cartProducts: user.cartProducts,
      },
      token,
    });
  }
  catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: 'Error in registration',
      err
    })
  }
}

const loginController = async (req, res) => {
  try {
    const { phone, password } = req.body;

    // Check if phone or password missing
    if (!phone || !password) {
      return res.status(400).send({
        success: false,
        message: 'कृपया मोबाईल नंबर आणि पासवर्ड भरा'
      });
    }

    // Find user by phone
    const user = await userModel.findOne({ phone });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: 'मोबाईल नंबर नोंदलेला नाही'
      });
    }

    // Compare password
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(401).send({
        success: false,
        message: 'पासवर्ड चुकीचा आहे'
      });
    }

    // Generate token
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Send success response
    res.status(200).send({
      success: true,
      message: 'लॉगिन यशस्वी!',
      user: {
        _id: user._id,
        name: user.name,
        phone: user.phone,
        photo: user.photo,
        address: user.address,
        role: user.role,
        likedProducts: user.likedProducts,
        collectedProducts: user.collectedProducts,
        cartProducts: user.cartProducts,
      },
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: 'लॉगिन करताना काहीतरी चूक झाली. कृपया पुन्हा प्रयत्न करा',
      err
    });
  }
};

const forgotPasswordController = async (req, res) => {
  try {
    const { phone, answer, newPassword } = req.body;
    if (!phone) {
      res.status(400).send({ message: "phone is required" });
    }
    if (!answer) {
      res.status(400).send({ message: "answer is required" });
    }
    if (!newPassword) {
      res.status(400).send({ message: "New Password is required" });
    }
    const user = await userModel.findOne({ phone, answer });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Wrong phone Or Answer",
      });
    }
    const hashed = await hashPassword(newPassword);
    await userModel.findByIdAndUpdate(user._id, { password: hashed });
    res.status(200).send({
      success: true,
      message: "Password Reset Successfully",
    });
  }
  catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};

const verifyPasswordController = async (req, res) => {
  try {
    const { userId, oldPassword, answer } = req.body;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    if (oldPassword) {
      const match = await comparePassword(oldPassword, user.password);
      if (match) {
        return res.send({
          success: true,
          message: "Old password verified",
        });
      }
    }

    if (answer && user.answer && answer === user.answer) {
      return res.send({
        success: true,
        message: "Security answer verified",
      });
    }

    return res.send({
      success: false,
      message: "Wrong password or answer",
    });

  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Verification failed",
    });
  }
};

const updateUserController = async (req, res) => {
  try {
    const { name, password, phone, address, photo } = req.body;
    const userId = req.params.id;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    let updateData = {};

    // text fields
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;

    // password
    if (password) {
      if (password.length < 6) {
        return res.status(400).send({
          success: false,
          message: "Password must be at least 6 characters long",
        });
      }
      updateData.password = await hashPassword(password);
    }
    
    if (photo === null) {
      updateData.$unset = { photo: "" };
    }

    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "profileImages" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });

      updateData.$set = { photo: result.secure_url };
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: "User updated successfully",
      updatedUser,
    });

  } catch (err) {
    console.log("Error in updateUserController:", err);
    res.status(500).send({
      success: false,
      message: "Error while updating user",
      error: err.message,
    });
  }
};


const testController = (req, res) => {
  try {
    res.send("Protected Routes");
  } catch (error) {
    console.log(error);
    res.send({ error });
  }
};

//all users
const getAllUsers = async (req, res) => {
  try {
    const users = await userModel
      .find({ role: 0 })
      .sort({ name: 1 });
    res.status(200).send({
      success: true,
      message: "All users ",
      users
    });
  }
  catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Geting users",
      error,
    });
  }
};

//single user
const getSingleUser = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);

    res.status(200).send({
      success: true,
      message: "Single user fetched successfully",
      user,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).send({
      success: false,
      message: "Error while fetching user",
      error: error.message,
    });
  }
};

//admin delete account
const deleteUserController = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Deleting user with ID:", id); // Debugging

    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await userModel.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({
      success: false,
      message: "Error deleting user",
      error: err.message,
    });
  }
};

const toggleLikeProductController = async (req, res) => {
  try {
    const _id = req.body;
    const productId = req.params.id;

    const user = await userModel.findById(_id);

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    const isLiked = user.likedProducts.includes(productId);

    if (isLiked) {
      // ✅ UNLIKE
      user.likedProducts = user.likedProducts.filter(
        (id) => id.toString() !== productId
      );

      await user.save();

      return res.status(200).send({
        success: true,
        message: "Product unliked 💔",
        likedProducts: user.likedProducts,
      });
    }

    // ✅ LIKE
    user.likedProducts.push(productId);
    await user.save();

    res.status(200).send({
      success: true,
      message: "Product liked ❤️",
      likedProducts: user.likedProducts,
    });

  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Like toggle failed",
    });
  }
};


const getLikedProductsController = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await userModel
      .findById(userId)
      .populate("likedProducts");

    res.status(200).send({
      success: true,
      likedProducts: user.likedProducts,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Failed to fetch liked products",
    });
  }
};

const toggleCollectProductController = async (req, res) => {
  try {
    const _id = req.body;
    const productId = req.params.id;

    const user = await userModel.findById(_id);

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    const isCollected = user.collectedProducts.includes(productId);

    if (isCollected) {
      // ✅ REMOVE from collection
      user.collectedProducts = user.collectedProducts.filter(
        (id) => id.toString() !== productId
      );

      await user.save();

      return res.status(200).send({
        success: true,
        message: "Removed from collection 📂",
        collectedProducts: user.collectedProducts,
      });
    }

    // ✅ ADD to collection
    user.collectedProducts.push(productId);
    await user.save();

    res.status(200).send({
      success: true,
      message: "Added to collection ⭐",
      collectedProducts: user.collectedProducts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Collect toggle failed",
    });
  }
};

const getCollectedProductsController = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await userModel
      .findById(userId)
      .populate("collectedProducts");

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).send({
      success: true,
      collectedProducts: user.collectedProducts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Failed to fetch collected products",
    });
  }
};

const toggleCartProductController = async (req, res) => {
  try {
    const _id = req.body;
    const productId = req.params.id;

    const user = await userModel.findById(_id);

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    const alreadyInCart = user.cartProducts.some(
      (id) => id && id.toString() === productId
    );

    if (alreadyInCart) {
      user.cartProducts = user.cartProducts.filter(
        (id) => id && id.toString() !== productId
      );
      await user.save();

      return res.status(200).send({
        success: true,
        message: "Product removed from cart",
        cartProducts: user.cartProducts,
      });
    }

    user.cartProducts.push(productId);
    await user.save();

    res.status(200).send({
      success: true,
      message: "Product added to cart 🛒",
      cartProducts: user.cartProducts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Cart update failed",
    });
  }
};

const getCartProductsController = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await userModel
      .findById(userId)
      .populate("cartProducts");

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).send({
      success: true,
      cartProducts: user.cartProducts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Failed to fetch cart products",
    });
  }
};

module.exports = {
  registerController,
  loginController,
  forgotPasswordController,
  testController,
  updateUserController,
  getAllUsers,
  deleteUserController,
  getSingleUser,
  toggleLikeProductController,
  toggleCollectProductController,
  toggleCartProductController,
  getCartProductsController,
  getCollectedProductsController,
  getLikedProductsController,
  verifyPasswordController,
};

 
