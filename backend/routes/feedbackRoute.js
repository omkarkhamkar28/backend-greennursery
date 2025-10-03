const express = require('express');
const { requireSignIn, isAdmin } = require('../middlewares/authMiddlewares');
const { addFeedbackController, getAllFeedback } = require('../controllers/feedbackController');

//router object 
const router = express.Router();

//add
router.post('/add-feedback', addFeedbackController,);

// // //all users
router.get("/all-feedbacks", getAllFeedback);

// // //get single user
// router.get('/viewfeedback/:id', getSingleProductController);

// // //edit user
// router.put('/editfeedback/:id', updateProductController);

// // // Delete user route by admin
// router.delete("/deletefeedback/:id", deleteProductController);


module.exports = router;