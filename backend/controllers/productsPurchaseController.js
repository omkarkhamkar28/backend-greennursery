const purchaseProductModel = require('../models/purchaseProductModel');
const Notification = require('../models/notificationModel');
const productsModel = require('../models/productsModel');

const mongoose = require("mongoose");


//add product purchase
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

//single user all orders  
const getSingleuserOrdersDetails = async (req, res) => {
    try {
        const { userId } = req.params; // URL मधून userId घेतला

        // user_id नुसार orders fetch करा
        const orders = await productsModel.find({ user_id: userId })
            .sort({ purchaseDate: -1 }); // latest first

        if (!orders || orders.length === 0) {
            return res.status(200).send({
                success: true,
                message: "No orders found for this user",
                orders: []
            });
        }

        res.status(200).send({
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

// Delete product purchase & notifications
const deleteProductPurchaseController = async (req, res) => {
    try {
        const { id } = req.params;

        // 1️⃣ Find the purchase
        const purchase = await purchaseProductModel.findById(id);
        if (!purchase) {
            return res.status(404).json({ success: false, message: "Product purchase not found" });
        }

        // 2️⃣ Fetch the product
        const product = await productsModel.findById(purchase.product_id);
        if (!product) {
            return res.status(404).json({ success: false, message: "Associated product not found" });
        }

        // 3️⃣ Restore the stock
        product.stock = Number(product.stock) + Number(purchase.quantity);
        await product.save();

        // 4️⃣ Delete the purchase record
        await purchaseProductModel.findByIdAndDelete(id);

        // 5️⃣ Delete related notifications
        await Notification.deleteMany({ user: purchase.user_id, product: purchase.product_id });

        res.status(200).json({
            success: true,
            message: "Product purchase cancelled, stock restored & notifications deleted",
            restoredStock: product.stock
        });
    } catch (err) {
        console.error("Error deleting product purchase:", err);
        res.status(500).json({ success: false, message: "Error cancelling product purchase", error: err.message });
    }
};

// Update product purchase & notifications
const updateProductPurchaseController = async (req, res) => {
    try {
        const { quantity, totalPrice, states, paymentStates, purchaseDate } = req.body;

        // 1️⃣ Find purchase order
        const purchase = await purchaseProductModel.findById(req.params.id);
        if (!purchase) return res.status(404).send({ message: "Order not found" });

        // 2️⃣ Find the related product
        const product = await productsModel.findById(purchase.product_id);
        if (!product) return res.status(404).send({ message: "Associated product not found" });

        // 3️⃣ Adjust stock
        const oldQuantity = Number(purchase.quantity);
        const newQuantity = Number(quantity || oldQuantity);
        const diff = newQuantity - oldQuantity; // positive = increase, negative = decrease
        product.stock = Number(product.stock) - diff;
        if (product.stock < 0) return res.status(400).send({ success: false, message: "Not enough stock available" });
        await product.save();

        // 4️⃣ Update purchase
        const updatedPurchase = await purchaseProductModel.findByIdAndUpdate(
            req.params.id,
            {
                quantity: newQuantity,
                totalPrice: totalPrice || purchase.totalPrice,
                states: states || purchase.states,
                paymentStates: paymentStates || purchase.paymentStates,
                purchaseDate: purchaseDate || purchase.purchaseDate
            },
            { new: true }
        );

        // 5️⃣ Update notifications if purchaseDate changed
        if (purchaseDate) {
            const existingNotifications = await Notification.findOne({ user: purchase.user_id, product: purchase.product_id });
            if (existingNotifications) {
                const newStartDate = new Date(purchaseDate);
                const updatedSchedule = product.schedule.map(sch => ({
                    day: sch.day,
                    message: sch.message,
                    notifyDate: new Date(newStartDate.getTime() + sch.day * 24 * 60 * 60 * 1000)
                }));
                existingNotifications.schedule = updatedSchedule;
                await existingNotifications.save();
            }
        }

        res.status(200).send({
            success: true,
            message: "Order & notifications updated successfully",
            updatedPurchase
        });

    } catch (err) {
        console.log("Error updating product purchase:", err);
        res.status(500).send({ success: false, message: "Error while updating order", error: err.message });
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