const express = require("express");
const router = express.Router();

const {isSignedIN, isAuthenticated, isAdmin} = require("../controllers/auth")
const {getUserById} = require("../controllers/user")
const {getProductById, getUniqueCategories, getAllUniqueCategories, getAllProducts, createProduct, updateProduct, getProduct, deleteProduct, photo} = require("../controllers/product");
const { Router } = require("express");

router.param("userId", getUserById);
router.param("productId", getProductById);

// WRITE ROUTES
router.post("/product/create/:userId",  isSignedIN, isAuthenticated, isAdmin, createProduct)


// READ ROUTES
router.get("/product/:productId", getProduct);
router.get("/product/photo/:productId", photo);

// DELETE ROUTES
router.delete("/product/:productId/:userId", isSignedIN, isAuthenticated, isAdmin, updateProduct)

// UPDATE ROUTES
router.put("/product/:productId/:userId", isSignedIN, isAuthenticated, isAdmin, deleteProduct)




// LISTING ROUTES
router.get("/getAllProducts", getAllProducts)

router.get("/products/categories", isSignedIN, getAllUniqueCategories, getUniqueCategories)



module.exports = router;