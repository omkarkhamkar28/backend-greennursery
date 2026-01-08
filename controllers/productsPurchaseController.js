const purchaseProductModel = require('../models/purchaseProductModel');
const Notification = require('../models/notificationModel');
const productsModel = require('../models/productsModel');

const mongoose = require("mongoose");

const purchaseProductsController = async (req, res) => {
    try {
        const { user_id, product_id, user, name_en, name_mr, type_en, type_mr, quantity, totalPrice, states, paymentStates } = req.body;

        const product = await productsModel.findById(product_id);
        if (!product) return res.status(404).send({ success: false, message: "Product not found" });

        if (Number(quantity) > Number(product.stock)) return res.status(400).send({ success: false, message: "Not enough stock" });

        // Stock update
        product.stock = Number(product.stock) - Number(quantity);
        await product.save();

        // Purchase save
        const productsPurchase = await purchaseProductModel.create({ user_id, product_id, user, name_en, name_mr, type_en, type_mr, quantity, totalPrice, states, paymentStates });

        // Create notifications based on product schedule
        const purchaseDate = new Date();
        const notifications = product.schedule.map(sch => ({
            day: sch.day,
            message: sch.message,
            notifyDate: new Date(purchaseDate.getTime() + sch.day * 24 * 60 * 60 * 1000)
        }));

        await Notification.create({
            user: user_id,
            product: product_id,
            schedule: notifications
        });

        res.status(201).send({
            success: true,
            message: "Product purchased & notifications created",
            productsPurchase,
            remainingStock: product.stock
        });

    } catch (err) {
        console.log(err);
        res.status(500).send({ success: false, message: 'Error in purchasing', err });
    }
};

 const getSingleuserOrdersDetails = async (req, res) => {
  try {
    const orders = await purchaseProductModel.find({
      user_id: req.params.id    });

    return res.status(200).send({
      success: true,
      message: "User orders fetched successfully",
      orders
    });

  } catch (err) {
    console.error(err);
    res.status(500).send({
      success: false,
      message: "Error fetching user orders",
      err
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

const deleteProductPurchaseController = async (req, res) => {
    try {
        const order = await purchaseProductModel.findById(req.params.id);
        if (!order)
            return res.status(404).send({ success: false, message: "Order not found" });

        // Delete order
        await purchaseProductModel.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Order Delete",
         });
    } catch (err) {
        console.error("Error deleting product purchase:", err);
        res.status(500).json({ success: false, message: "Error cancelling product purchase", error: err.message });
    }
};

const updateProductPurchaseController = async (req, res) => {
  try {
    const { quantity, states, paymentStates } = req.body;

    const order = await purchaseProductModel.findById(req.params.id);
    if (!order)
      return res.status(404).send({ success: false, message: "Order not found" });

    const product = await productsModel.findById(order.product_id);
    if (!product)
      return res.status(404).send({ success: false, message: "Product not found" });

    const prevQty = Number(order.quantity);
    const newQty = Number(quantity);
    let stockAvailable = Number(product.stock);

    const reverseStates = ["Cancelled", "Returned"];

    /* 🔴 Active → Cancelled / Returned */
    if (
      reverseStates.includes(states) &&
      !reverseStates.includes(order.states)
    ) {
      product.stock = stockAvailable + prevQty; // ✅ FIX
    }

    /* 🟢 Cancelled / Returned → Active */
    else if (
      reverseStates.includes(order.states) &&
      !reverseStates.includes(states)
    ) {
      if (stockAvailable < newQty) {
        return res.status(400).send({
          success: false,
          message: `Not enough stock. Available: ${stockAvailable}`,
        });
      }
      product.stock = stockAvailable - newQty;
    }

    /* ✏️ Active → Active quantity update */
    else if (!reverseStates.includes(states)) {
      const stockChange = newQty - prevQty;

      if (stockAvailable - stockChange < 0) {
        return res.status(400).send({
          success: false,
          message: `Not enough stock. Available: ${stockAvailable}`,
        });
      }

      product.stock = stockAvailable - stockChange;
    }

    await product.save({ validateBeforeSave: false });

    order.quantity = newQty;
    order.totalPrice = newQty * Number(product.rate);
    order.states = states || order.states;
    order.paymentStates = paymentStates || order.paymentStates;

    await order.save();

    res.status(200).send({
      success: true,
      message: "Order updated successfully",
      order,
      remainingStock: product.stock,
    });

  } catch (err) {
    console.error(err);
    res.status(500).send({
      success: false,
      message: "Error updating order",
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