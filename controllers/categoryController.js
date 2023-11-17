import slugify from "slugify";
import categoryModel from "../models/categoryModel.js";

// create category
const createCategoryController = async (req, res) => {
    try {
        const { name } = req.body;

        if(!name) {
            return res.status(401).send({
                message: 'Name is required'
            })
        }

        // checking existing category
        const existingCategory = await categoryModel.findOne({ name });
        if(existingCategory) {
            return res.status(201).send({
                success: true,
                message: 'Category Already Exist'
            })
        }

        const category = await new categoryModel({ name, slug: slugify(name)}).save();

        res.status(200).send({
            success: true,
            message: 'New Category Added',
            category
        })
    } 
    catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: 'Error in Category',
        })
    }
}

// update category
const updateCategoryController = async (req, res) => {
    try {
        const { name } = req.body;
        const { id } = req.params;

        const category = await categoryModel.findByIdAndUpdate(id, { name, slug: slugify(name)}, {new: true});
        res.status(200).send({
            success: true,
            message: 'Category updated successfully',
            category,
        })
    } 
    catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: 'Error While updating Category',
        })
    }
}

// get all category list
const categoryController = async (req, res) => {
    try {
        const category = await categoryModel.find({});4
        res.status(200).send({
            success: true,
            message: 'All Category List',
            category
        })
    } 
    catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: 'Error While getting all Category',
        })
    }
}

// get single category[]
const singleCategoryController = async (req, res) => {
    try {
        const { slug } = req.params;
        const  category = await categoryModel.findOne({slug: req.params.slug});
        res.status(200).send({
            success: true,
            message: 'Getting single category Successfully',
            category
        })
    } 
    catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: 'Error While getting single Category',
        })
    }
}

// delete category
const deleteCategoryController = async (req, res) => {
    try {
        const { id } = req.params;
        await categoryModel.findByIdAndDelete(id);
        res.status(200).send({
            success: true,
            message: 'Category deleted successfully',
        })
    } 
    catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: 'Error While deleting Category',
        })
    }
}

export { categoryController, createCategoryController, deleteCategoryController, singleCategoryController, updateCategoryController };