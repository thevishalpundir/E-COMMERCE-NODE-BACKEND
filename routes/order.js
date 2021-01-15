const express = require("express");
const router = express.Router();


const {isSignedIN, isAuthenticated, isAdmin} = require("../controllers/auth")
const {getUserById, putOrderInPurchaseList} = require("../controllers/user")

const {updateStock} = require("../controllers/product");

const {getOrderById, getOrderStatus, updateStatus, createOrder, getAllOrders} = require("../controllers/order")


//param


router.param("userId", getUserById);
router.param("orderId", getOrderById);




//Actual routes

router.post("/order/create/:userId", isSignedIN, isAuthenticated, isAdmin, putOrderInPurchaseList, updateStock, createOrder)

router.get("/order/all/:userId", isSignedIN, isAuthenticated, isAdmin, getAllOrders)


//ROUTER STATUS
router.get("/order/status/:userId", isSignedIN, isAuthenticated, isAdmin, getOrderStatus)
router.put("/order/:orderId/status/:userId", isSignedIN, isAuthenticated, isAdmin, updateStatus)




module.exports = router;