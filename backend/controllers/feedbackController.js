const feedbackModel = require('../models/feedbackModel');
 const mongoose = require("mongoose");

const addFeedbackController = async (req, res) => {
    try {
        const { name,msg,phone,address } = req.body;
        //validations 
        if (!msg) {
            return res.send({ message: "Msg is Required" });
        } 
        
        //save
        const feedback = await new feedbackModel({
            name,msg,phone,address
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

module.exports = {
    addFeedbackController, 
    getAllFeedback
};