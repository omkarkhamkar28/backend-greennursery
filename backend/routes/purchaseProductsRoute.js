const express = require('express');
const { purchaseProductsController, getAllOrdersDetails, deleteProductPurchaseController, getSingleuserOrdersDetails, updateProductPurchaseController, getSingleOrdersDetails } = require('../controllers/productsPurchaseController');
const { requireSignIn, isAdmin } = require('../middlewares/authMiddlewares');


const router = express.Router();


router.post('/purchase-product/:id/',requireSignIn, purchaseProductsController );

router.get('/all-orders-details',requireSignIn, getAllOrdersDetails );

router.get('/single-orders-details/:id',requireSignIn, getSingleOrdersDetails );

router.get('/single-user-orders-details/:id',requireSignIn, getSingleuserOrdersDetails );

router.delete('/delete-purchase-product/:id',requireSignIn, deleteProductPurchaseController );

router.put('/update-purchase-product/:id',requireSignIn, updateProductPurchaseController );

 
// router.get('/check-access/:course/:name',requireSignIn, checkAccessCourseController);


module.exports = router;
