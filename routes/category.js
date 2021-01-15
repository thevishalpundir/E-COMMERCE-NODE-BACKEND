const express = require("express")
const router = express.Router()

const { getCategoryById, removeCategory, createCategory, updateCategory, getAllCategory, getCategory } = require("../controllers/category")
const { isAuthenticated, isSignedIN, isAdmin, } = require("../controllers/auth")
const { getUserById } = require("../controllers/user")

// params
router.param("userId", getUserById);
router.param("categoryId", getCategoryById);


// actual routers goes here
// WRITE ROUTES
router.post("/category/create/:userId", isSignedIN, isAuthenticated, isAdmin, createCategory)
// READ ROUTES
router.get("/categories/:categoryId", getCategory)
router.get("/categories", getAllCategory)

// UPDATE
router.put(
  "/category/:categoryId/:userId",
  isSignedIN,
  isAuthenticated,
  isAdmin,
  updateCategory
);



// DELETE
router.delete("/category/:categoryId/:userId", isSignedIN, isAuthenticated, isAdmin, removeCategory)


module.exports = router;