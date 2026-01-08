const express = require('express');
const {
  registerController,
  loginController,
  forgotPasswordController,
  testController,
  getAllUsers,
  deleteUserController,
  getSingleUser,
  toggleLikeProductController,
  getLikedProductsController,
  toggleCollectProductController,
  getCollectedProductsController,
  toggleCartProductController,
  getCartProductsController,
  verifyPasswordController,
  updateUserController
} = require('../controllers/authController');
const { requireSignIn, isAdmin } = require('../middlewares/authMiddlewares');
const { ProfileImageUpload } = require("../middlewares/uploadImage");

//router object 
const router = express.Router();

//register
router.post('/register', registerController);

//login
router.post('/login', loginController);

//Forgot Password || POST
router.post('/forgot-password', forgotPasswordController);

router.post("/verify-password", verifyPasswordController);

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

router.put(
  "/update-user/:id",
  ProfileImageUpload.single("photo"),
  updateUserController
);

// Delete user route by admin
router.delete("/deleteuser/:id", deleteUserController);



//add to liked products
router.put(
  "/like-product/:id",
  requireSignIn,
  toggleLikeProductController
);

router.get("/liked-products/:id", requireSignIn, getLikedProductsController);

router.put(
  "/collect-product/:id",
  requireSignIn,
  toggleCollectProductController
);

router.get("/collected-products/:id", requireSignIn, getCollectedProductsController);


router.put(
  "/cart-product/:id",
  requireSignIn,
  toggleCartProductController
);

router.get("/cart-products/:id", requireSignIn, getCartProductsController);


module.exports = router;
