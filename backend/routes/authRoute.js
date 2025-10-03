const express = require('express');
const {
  registerController,
  loginController,
  forgotPasswordController,
  testController,
  updateProfileController,
  getAllUsers,
  deleteUserController,
  getSingleUser,

} = require('../controllers/authController');
const { requireSignIn, isAdmin } = require('../middlewares/authMiddlewares');

//router object 
const router = express.Router();

//register
router.post('/register', registerController);

//login
router.post('/login', loginController);

//Forgot Password || POST
router.post('/forgot-password', forgotPasswordController);

//test
router.get('/test', requireSignIn, isAdmin, testController);

//protected User route auth
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});

//protected admin route auth
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

//all users
router.get("/all-users", requireSignIn, isAdmin, getAllUsers);

//get single user
router.get('/viewuser/:id', getSingleUser);

//edit user
router.put('/edituser/:id', updateProfileController);

// Delete user route by admin
router.delete("/deleteuser/:id", deleteUserController);

module.exports = router;