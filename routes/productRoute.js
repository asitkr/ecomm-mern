import express from 'express';
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js';
import { createProductController, deleteProductController, getProductController, getSingleProductController, productCountController, productFiltersController, productListController, productPhotoController, updateProductController } from '../controllers/productController.js';
import formidable from 'express-formidable';

const router = express.Router();

// create product route || post method
router.post('/create-product', requireSignIn, isAdmin, formidable(), createProductController);

// get products route || get method
router.get('/get-product', getProductController);

// get single product route || get method
router.get('/get-product/:slug', getSingleProductController);

// get photo product route || get method
router.get('/product-photo/:pid', productPhotoController);

// delete product route || delete method
router.delete('/delete-product/:pid', deleteProductController);

// update product route || put method
router.put('/update-product/:pid', requireSignIn, isAdmin, formidable(), updateProductController);

//filter product
router.post("/product-filters", productFiltersController);

//product count
router.get("/product-count", productCountController);

//product per page
router.get("/product-list/:page", productListController);

export default router;