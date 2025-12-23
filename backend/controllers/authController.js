const userModel = require('../models/userModel');
const mongoose = require("mongoose");

const { hashPassword, comparePassword } = require('../helpers/authHelper');
const dotenv = require('dotenv');
dotenv.config();
const JWT = require("jsonwebtoken");

const registerController = async (req, res) => {
  try {
    const { name,address, email, password, phone, answer } = req.body;
    //validations
    if (!name) {
      return res.send({ message: "Name is Required" });
    }
    if (!address) {
      return res.send({ message: "Address is Required" });
    }
    if (!email) {
      return res.send({ message: "Email is Required" });
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

    //check user
    const exisitingUser = await userModel.findOne({ email });

    //exisiting user
    if (exisitingUser) {
      return res.status(200).send({
        success: false,
        message: "Already Register please login",
      });
    }
    //register user
    const hashedPassword = await hashPassword(password);
    //save
    const user = await new userModel({
      name,
      address,
      email,
      phone,
      password: hashedPassword,
      answer
    }).save();

    //token
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
        role: user.role,
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
    const { email, password } = req.body;

    //validate email
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: 'Invalid email or password'
      })
    }
    
    //check user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: 'User not found'
      })
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(404).send({
        success: false,
        message: 'Password is invalid'
      });
    }

    //token
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    console.log(token);
    
    res.status(200).send({
      success: true,
      message: 'Login successful',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      token,
    });


  }
  catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: 'Error in login',
      err
    });
  }
};

//forgotPasswordController
const forgotPasswordController = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;
    if (!email) {
      res.status(400).send({ message: "Email is required" });
    }
    if (!answer) {
      res.status(400).send({ message: "answer is required" });
    }
    if (!newPassword) {
      res.status(400).send({ message: "New Password is required" });
    }
    //check
    const user = await userModel.findOne({ email, answer });
    //validation
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Wrong Email Or Answer",
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

const updateProfileController = async (req, res) => {
  try {
    const { name, password, phone ,address} = req.body;

    console.log("Received ID:", req.params.id);

    // Find user by ID
    const user = await userModel.findById(req.params.id);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Password validation
    if (password && password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters long" });
    }

    const hashedPassword = password ? await hashPassword(password) : user.password;

    // Update user data
    const updatedUser = await userModel.findByIdAndUpdate(
      req.params.id,
      {
        name: name || user.name,
        password: hashedPassword,
        phone: phone || user.phone,
        address: address || user.address,
      },
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: "Profile Updated Successfully",
      updatedUser,
    });
  } catch (err) {
    console.log("Error in updateProfileController:", err);
    res.status(400).send({
      success: false,
      message: "Error While Updating Profile",
      error: err.message,
    });
  }
};

//test controller
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

// Like a product
const addLikeProductController = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    // Check user
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).send({ success: false, message: "User not found" });
    }

    // Already liked?
    if (user.likedProducts.includes(productId)) {
      return res.status(400).send({ success: false, message: "Product already liked" });
    }

    // Push product
    user.likedProducts.push(productId);
    await user.save();

    res.status(200).send({
      success: true,
      message: "Product liked successfully",
      likedProducts: user.likedProducts
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false, message: "Error while liking product", err });
  }
};

// Remove Like Product
const removeLikeProductController = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).send({ success: false, message: "User not found" });
    }

    if (!user.likedProducts.includes(productId)) {
      return res.status(400).send({ success: false, message: "Product not found in liked list" });
    }

    // filter  
    user.likedProducts = user.likedProducts.filter(
      (id) => id.toString() !== productId.toString()
    );

    await user.save();

    res.status(200).send({
      success: true,
      message: "Product unliked successfully",
      likedProducts: user.likedProducts,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      success: false,
      message: "Error while unliking product",
      err,
    });
  }
};

// Collect / Add to wishlist
const addCollectProductController = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).send({ success: false, message: "User not found" });
    }

    if (user.collectedProducts.includes(productId)) {
      return res.status(400).send({ success: false, message: "Product already in collection" });
    }

    user.collectedProducts.push(productId);
    await user.save();

    res.status(200).send({
      success: true,
      message: "Product added to collection successfully",
      collectedProducts: user.collectedProducts
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false, message: "Error while collecting product", err });
  }
};

// Remove Collect Product
const removeCollectProductController = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).send({ success: false, message: "User not found" });
    }

    if (!user.collectedProducts.includes(productId)) {
      return res.status(400).send({ success: false, message: "Product not found in collection" });
    }

    user.collectedProducts = user.collectedProducts.filter(
      (id) => id.toString() !== productId.toString()
    );

    await user.save();

    res.status(200).send({
      success: true,
      message: "Product removed from collection successfully",
      collectedProducts: user.collectedProducts,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      success: false,
      message: "Error while removing product from collection",
      err,
    });
  }
};


module.exports = {
  registerController,
  loginController,
  forgotPasswordController,
  addLikeProductController,
  addCollectProductController,
  testController,
  updateProfileController,
  getAllUsers,
  deleteUserController,
  getSingleUser,
  updateProfileController,
  removeLikeProductController,
  removeCollectProductController
};