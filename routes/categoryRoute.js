import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import { categoryController, createCategoryController, deleteCategoryController, singleCategoryController, updateCategoryController } from "../controllers/categoryController.js";

const router = express.Router();

// create category routes || post method
router.post('/create-category', requireSignIn, isAdmin, createCategoryController);

// update category route || put method
router.put('/update-category/:id', requireSignIn, isAdmin, updateCategoryController);

// get all type category route || get method
router.get('/get-category', categoryController);

// get single category route || get method
router.get('/single-category/:slug', singleCategoryController);

// delete category route || delete method
router.delete('/delete-category/:id', requireSignIn, isAdmin, deleteCategoryController);

export default router;