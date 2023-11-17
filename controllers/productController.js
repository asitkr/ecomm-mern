import fs from 'fs';
import slugify from 'slugify';
import productModel from '../models/productModel.js';

// create product
const createProductController = async (req, res) => {
    try {
        const { name, slug, description, price, category, quantity, shipping } = req.fields;
        const { photo } = req.files;

        // validations
        switch (true) {
            case !name:
                return res.status(401).send({ error: "Name is Required" });

            case !description:
                return res.status(500).send({ error: "Description is Required" });

            case !price:
                return res.status(500).send({ error: "Price is Required" });

            case !category:
                return res.status(500).send({ error: "Category is Required" });

            case !quantity:
                return res.status(500).send({ error: "Quantity is Required" });

            case photo && photo.size > 1000000:
                return res.status(500).send({ error: "Photo is Required and it should be less than 1mb" });
        }

        const product = new productModel({
            ...req.fields,
            slug: slugify(name)
        })

        if (photo) {
            product.photo.data = fs.readFileSync(photo.path);
            product.photo.contentType = photo.type;
        }

        await product.save();

        res.status(200).send({
            success: true,
            message: 'Product created successfully',
            product
        })
    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in creating product',
            error
        })
    }
}

// get products
const getProductController = async (req, res) => {
    try {
        const product = await productModel.find({}).populate('category').select('-photo').limit(12).sort({ createdAt: -1 })
        res.status(200).send({
            success: true,
            message: 'Getting all products',
            countTotal: product.length,
            product
        })
    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'While getting error product',
            error: error.message
        })
    }
}

// get single product
const getSingleProductController = async (req, res) => {
    try {
        const { slug } = req.params;

        const product = await productModel.findOne({ slug }).populate('category').select('-photo');

        res.status(200).send({
            success: true,
            message: 'Single product fetch successfully',
            product
        })
    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'While getting error single product',
            error: error.message
        })
    }
}

// get product photo
const productPhotoController = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.pid).select('photo');

        if (product.photo.data) {
            res.set("Content-type", product.photo.contentType);
            return res.status(200).send(product.photo.data);
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'While getting error product photo',
            error: error.message
        })
    }
}

// delete product
const deleteProductController = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.params.pid).select('-photo');
        res.status(200).send({
            success: true,
            message: 'Product Delete Successfully'
        })
    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'While getting error delete product',
            error: error.message
        })
    }
}

// update product controller
const updateProductController = async (req, res) => {
    try {
        const { name, slug, description, price, category, quantity, shipping } = req.fields;
        const { photo } = req.files;

        // validations
        switch (true) {
            case !name:
                return res.status(401).send({ error: "Name is Required" });

            case !description:
                return res.status(500).send({ error: "Description is Required" });

            case !price:
                return res.status(500).send({ error: "Price is Required" });

            case !category:
                return res.status(500).send({ error: "Category is Required" });

            case !quantity:
                return res.status(500).send({ error: "Quantity is Required" });

            case photo && photo.size > 1000000:
                return res.status(500).send({ error: "Photo is Required and it should be less than 1mb" });
        }

        const product = await productModel.findByIdAndUpdate(req.params.pid, {
            ...req.fields,
            slug: slugify(name)
        }, {
            new: true
        })

        if (photo) {
            product.photo.data = fs.readFileSync(photo.path);
            product.photo.contentType = photo.type;
        }

        await product.save();

        res.status(200).send({
            success: true,
            message: 'Product updated successfully',
            product
        })
    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'While getting error update product',
            error: error.message
        })
    }
}

// filters
const productFiltersController = async (req, res) => {
    try {
        const { checked, radio } = req.body;
        let args = {};
        if (checked.length > 0) args.category = checked;
        if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
        const products = await productModel.find(args);
        res.status(200).send({
            success: true,
            products,
        });
    }
    catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: "Error WHile Filtering Products",
            error,
        });
    }
}

// product count
const productCountController = async (req, res) => {
    try {
        const total = await productModel.find({}).estimatedDocumentCount();
        res.status(200).send({
            success: true,
            total,
        });
    }
    catch (error) {
        console.log(error);
        res.status(400).send({
            message: "Error in product count",
            error,
            success: false,
        });
    }
}


const productListController = async (req, res) => {
    try {
        const perPage = 2;
        const page = req.params.page ? req.params.page : 1;
        const products = await productModel
            .find({})
            .select('-photo')
            .skip((page - 1) + perPage)
            .sort({ createdAt: -1 });

        res.status(200).send({
            success: true,
            products,
        });
    }
    catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: "error in per page ctrl",
            error,
        });
    }
}

export { createProductController, deleteProductController, getProductController, getSingleProductController, productPhotoController, updateProductController, productFiltersController, productCountController, productListController };