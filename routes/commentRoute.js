const express = require('express');
const { addCommentController, deleteComment,
    updateCommentController, getAllComments,
    addCommentReplyController, updateCommentReplyController,
    deleteCommentReply, getSingleCommentController,
    getAllReply, getSingleReplyController } = require('../controllers/commentController');
const { requireSignIn, isAdmin } = require('../middlewares/authMiddlewares');

//router object 
const router = express.Router();



//add comment
router.post('/add-comment/:id', addCommentController);

// delete comment
router.delete('/delete-comment/:id', deleteComment);

// update comment
router.put('/edit-comment/:id', updateCommentController);

//all comments
router.get('/get-all-comment/:id', getAllComments);

//all comments
router.get('/get-single-comment/:id', getSingleCommentController);




//add reply
router.post('/add-comment-reply/:id', addCommentReplyController);

// delete reply
router.delete('/delete-comment-reply/:id', deleteCommentReply);

// update reply
router.put('/edit-reply/:id', updateCommentReplyController);

//all reply
router.get('/get-all-reply/:id', getAllReply);

//single reply
router.get('/get-single-reply/:id', getSingleReplyController);



module.exports = router;