const feedbackModel = require('../models/feedbackModel');
const mongoose = require("mongoose");

const addFeedbackController = async (req, res) => {
    try {
        const { name,address , phone,user, msg  } = req.body;
        //validations 
        if (!msg) {
            return res.send({ message: "Msg is Required" });
        }

        //save
        const feedback = await new feedbackModel({
           name,address , phone, user, msg 
        }).save();

        res.status(201).send({
            success: true,
            message: "Feedback Added Successfully",
            feedback,
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).send({
            success: false,
            message: 'Error in adding feedback',
            err
        });
    }
}

const getSingleFeedbackController = async (req, res) => {
    try {
        const feedback = await feedbackModel.findById(req.params.id);

        if (!feedback) {
            return res.status(404).send({
                success: false,
                message: "Feedback not found",
            });
        }

        res.status(200).send({
            success: true,
            message: "Single feedback",
            feedback,
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).send({
            success: false,
            message: "Error in getting single feedback",
            error: err.message,
        });
    }
}             

const getAllFeedback = async (req, res) => {
    try {
        const feedbacks = await feedbackModel.find({});
        res.status(200).send({
            success: true,
            message: "All feedbacks ",
            feedbacks
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error While Geting feedbacks",
            error,
        });
    }
};

const updateFeedbackController = async (req, res) => {
    try {
        const { msg } = req.body;

        // Find feedback by ID
        const feedback = await feedbackModel.findById(req.params.id);
        if (!feedback) {
            return res.status(404).send({ message: "Feedback not found" });
        }

        const updatedFeedback = await feedbackModel.findByIdAndUpdate(
            req.params.id,
            {
                msg: msg || feedback.msg,
            },
            { new: true }
        );

        res.status(200).send({
            success: true,
            message: "Feedback Updated Successfully",
            updatedFeedback,
        });
    } catch (err) {
        console.log("Error in Feedback:", err);
        res.status(400).send({
            success: false,
            message: "Error While Updating Feedback",
            error: err.message,
        });
    }
};

const deleteFeedbackController = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("Deleting feedback with ID:", id); // Debugging

        const feedback = await feedbackModel.findById(id);
        if (!feedback) {
            return res.status(404).json({
                success: false,
                message: "Feedback not found",
            });
        }

        await feedbackModel.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Feedback deleted successfully",
        });
    } catch (err) {
        console.error("Error deleting feedback:", err);
        res.status(500).json({
            success: false,
            message: "Error deleting feedback",
            error: err.message,
        });
    }
};

module.exports = {
    addFeedbackController,
    getAllFeedback,
    deleteFeedbackController,
    getSingleFeedbackController,
    updateFeedbackController
};