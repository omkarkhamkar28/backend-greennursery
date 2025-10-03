const express = require('express');
const {
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
  updateCommentController,

} = require('../controllers/productController');
 const { requireSignIn, isAdmin } = require('../middlewares/authMiddlewares');

//router object 
const router = express.Router();

//add
router.post('/add-product', addProductController,);

//all products
router.get("/all-products", getAllProducts);

// get single user
router.get('/viewproduct/:id', getSingleProductController);

//edit user
router.put('/editproduct/:id', updateProductController);

// Delete user route by admin
router.delete("/deleteproduct/:id", deleteProductController);



//add comment
router.post('/add-comment/:id', addCommentController,);

// delete comment
router.delete('/delete-comment/:id', deleteComment,);

// update comment
router.put('/edit-comment/:id', updateCommentController,);

//all comments
router.get('/get-all-comment/:id', getAllComments,);


// add reply to comment
router.post('/add-comment-reply/:id', addCommentReplyController,);

// delete comment reply
router.delete('/delete-comment-reply/:id', deleteCommentReply,);
 
//all reply
router.get('/get-all-reply/:id', getAllReply,);

module.exports = router;