const express = require('express');
const { requireSignIn, isAdmin } = require('../middlewares/authMiddlewares');
const { addFeedbackController, getAllFeedback, deleteFeedbackController, getSingleFeedbackController, updateFeedbackController } = require('../controllers/feedbackController');

//router object 
const router = express.Router();

//add
router.post('/add-feedback', addFeedbackController);

//  all users
router.get("/all-feedbacks", getAllFeedback);

// /get single user
router.get('/view-feedback/:id', getSingleFeedbackController);

//edit user
router.put('/edit-feedback/:id', updateFeedbackController);

//  Delete user route by admin
router.delete("/delete-feedback/:id", deleteFeedbackController);


module.exports = router;