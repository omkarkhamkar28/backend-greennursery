const express = require('express');
const {
  addProductController,
  getAllProducts,
  deleteProductController,
  getSingleProductController,
  updateProductController 

} = require('../controllers/productController');
const { requireSignIn, isAdmin } = require('../middlewares/authMiddlewares');
const { ProductImageUpload } = require("../middlewares/uploadProductImage");

//router object 
const router = express.Router();

//add
router.post("/add-product", ProductImageUpload.single("image"), addProductController);

//all products
router.get("/all-products", getAllProducts);

// get single user
router.get('/viewproduct/:id', getSingleProductController);

//edit user
router.put(
  "/editproduct/:id",
  ProductImageUpload.single("photo"),
  updateProductController
);

// Delete user route by admin
router.delete("/deleteproduct/:id", deleteProductController);


module.exports = router;
