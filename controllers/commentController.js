 const commentsModel = require('../models/commentsModel');
const replyModel = require('../models/replyModel');
const mongoose = require("mongoose");

//add comment
const addCommentController = async (req, res) => {
    try {
        const { user, comm} = req.body;
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

//get single comment
const getSingleCommentController = async (req, res) => {
    try {
        const comment = await commentsModel.findById(req.params.id);

        if (!comment) {
            return res.status(404).send({
                success: false,
                message: "Comment not found",
            });
        }

        res.status(200).send({
            success: true,
            message: "Single comment",
            comment,
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).send({
            success: false,
            message: "Error in getting single comment",
            error: err.message,
        });
    }
}       

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
        const {   comm } = req.body;
        const product_id = req.params.id;

        // Find product by ID
        const comment = await commentsModel.findById(req.params.id);
        if (!comment) {
            return res.status(404).send({ message: "comment not found" });
        }

        const updatedUser = await commentsModel.findByIdAndUpdate(
            req.params.id,
            {
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












// add reply to comment
const addCommentReplyController = async (req, res) => {
  try {
    const { user, reply } = req.body;
    const comm_id = req.params.id;

    if (!reply || !reply.trim()) {
      return res.status(400).send({
        success: false,
        message: "Reply is required",
      });
    }

    const newReply = await new replyModel({
      comm_id,
      user,
      reply,
    }).save();

    res.status(201).send({
      success: true,
      message: "Reply Added Successfully",
      reply: newReply,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: "Error adding reply",
      err,
    });
  }
};

const updateCommentReplyController = async (req, res) => {
  try {
    const { reply } = req.body;
    const existingReply = await replyModel.findById(req.params.id);
    if (!existingReply) {
      return res.status(404).send({ success: false, message: "Reply not found" });
    }

    existingReply.reply = reply || existingReply.reply;
    await existingReply.save();

    res.status(200).send({
      success: true,
      message: "Reply Updated Successfully",
      reply: existingReply,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Error While Updating reply",
      error: err.message,
    });
  }
};

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

//delete reply
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
     
//get single reply
const getSingleReplyController = async (req, res) => {
    try {
        const reply = await replyModel.findById(req.params.id);

        if (!reply) {
            return res.status(404).send({
                success: false,
                message: "Reply not found",
            });
        }

        res.status(200).send({
            success: true,
            message: "Single reply",
            reply,
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).send({
            success: false,
            message: "Error in getting single reply",
            error: err.message,
        });
    }
};  

module.exports = {
    addCommentController,
    addCommentReplyController,

    getAllComments,
    getAllReply,

    deleteComment,
    deleteCommentReply,

    updateCommentController,
    updateCommentReplyController,

    getSingleCommentController,
    getSingleReplyController,
};