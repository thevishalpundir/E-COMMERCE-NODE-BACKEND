const Product = require("../models/product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const product = require("../models/product");
const Category = require("../models/category");
const { isBuffer } = require("lodash");
const User = require("../models/user");
const { listIndexes, findById } = require("../models/product");



exports.getProductById = (req, res, next, id) => {
    Product.findById(id).populate("category").exec((err, product) => {
        if (err) {
            return res.status(400).json({
                error: "Product not found .....!!!!"
            })
        }
        req.product = product;
        next();
    });
};


exports.createProduct = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;


    form.parse(req, (err, fields, file) => {
        if (err) {
            return res.status(400).json({
                error: "problem with image....!!!"
            })
        }
        //destructor the field
        const { name, description, price, category, stock } = fields;

        if (
            !name ||
            !description ||
            !price ||
            !category ||
            !stock
        ) {
            return res.status(400).json({
                error: "Please inclue all fields....!!!!"
            })
        }


        let product = new Product(fields)
        //handle file here
        if (file.photo) {
            if (file.photo.size > 3000000) {
                return res.status(400).json({
                    error: "File size is too big..!!!"
                })
            }
            product.photo.data = fs.readFileSync(file.photo.path)
            product.photo.contentType = file.photo.type
        }
        console.log(product);
        product.save((err, product) => {
            if (err) {
                res.status(400).json({
                    error: "Saving tshirt in db failed...!!!"
                })
            }
            res.json(product);
        })
    })



}
exports.getProduct = (req, res) => {
    req.product.photo = undefined;


    return res.json(req.product)
}


//MIDDLEWARE
exports.photo = (req, res, next) => {
    if (req.product.photo.data) {
        res.set("Content-Type", req.product.photo.contentType);
        return res.send(req.product.photo.data)
    }
    next();
}


exports.deleteProduct = (req, res) => {
    let product = req.product;
    product.remove((err, deletedProduct) => {
        if (err) {
            return res.status(400).json({
                error: "Failed to delete the product.......!!!!"
            })
        }
        res.json({
            message: "Deletion was a success...!!!".
                deletedProduct
        })
    })

}

exports.updateProduct = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;


    form.parse(req, (err, fields, file) => {
        if (err) {
            return res.status(400).json({
                error: "problem with image....!!!"
            })
        }
        //destructor the field
        const { name, description, price, category, stock } = fields;

        if (
            !name ||
            !description ||
            !price ||
            !category ||
            !stock
        ) {
            return res.status(400).json({
                error: "Please inclue all fields....!!!!"
            })
        }

        //UPDATION CODE 
        let product = req.product;
        product = _.extend(product, fields)
        //handle file here
        if (file.photo) {
            if (file.photo.size > 3000000) {
                return res.status(400).json({
                    error: "File size is too big..!!!"
                })
            }
            product.photo.data = fs.readFileSync(file.photo.path)
            product.photo.contentType = file.photo.type
        }
        console.log(product);
        product.save((err, product) => {
            if (err) {
                res.status(400).json({
                    error: " PRODUCT UPDATION in db failed...!!!"
                })
            }
            res.json(product);
        })
    })
}


exports.getAllProducts = async (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 8
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";

    Product.find().select("-photo").populate("category").sort([[sortBy, "asc"]]).limit(limit).exec((err, products) => {
        if (err) {
            return res.status(400).json({
                error: "NO product Found....!!!"
            })
        }
        res.json(products)
    })



};


exports.updateStock = (req, res, next) => {
    let myOperations = req.body.order.products.map(prod => {
        return {
            updateOne: {
                filter: {
                    _id: prod._id
                },
                update: { $inc: { stock: -prod.count, sold: +prod.count } }
            }
        }
    })
    Product.bulkWrite(myOperations, {}, (err, products) => {
        if (err) {
            return res.status(400).json({
                error: "bulk operationd failed...!!!"
            })
        }
        next();
    })
}


exports.getAllUniqueCategories = (req, res, next) => {
    Product.distinct("category", {}, (err, categories) => {
        if (err) {
            return res.status(400).json({
                error: "NO category found....!!!!"
            })
        }
        categoryList = [];

        categories.forEach(async x => {
            try {
                await Category.findById(x, 'name').exec((err, category) => {
                    if (err || !category) {
                        res.status(404).json({
                            error: "no user was found in db!"
                        })
                    }
                    console.log(category)
                    categoryList.push(category);
                    console.log("::::" + categoryList);
                    return category;
                })
            }
            catch (err) {
                return 'error occured';
            }
            console.log(categoryList);

            Category.findOne({ _id: x }, 'name').exec((err, category) => {
                if (err || !category) {
                    res.status(404).json({
                        error: "no user was found in db!"
                    })
                }

            });

        })

        req.uniqueCategoriesId = categories;
        next();
    })


}

exports.getUniqueCategories = (req, res) => {
    Ids = req.uniqueCategoriesId;
    list = []
    Ids.forEach(async x => {
        await Category.findOne({ _id: x }, 'name').exec((err, category) => {
            if (err || !category) {
                res.status(404).json({
                    error: "no user was found in db!"
                })
            }
            list.push(category)
            console.log(category);
            console.log(list)

        });
    })
    return res.json(req.uniqueCategoriesId)
}