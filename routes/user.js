const express = require("express");
const {check} = require("express-validator")
const router = express.Router();


const {getUserById, getUser, getAllUsers, updateUser, userPurchaseList, getUserByName} = require("../controllers/user");
const {isSignedIN, isAuthenticated, isAdmin, isEmailPresent} = require("../controllers/auth");

router.param("userId", getUserById);
router.get("/user/:userId",  getUser);
router.put("/user/:userId", isSignedIN,  isAuthenticated, updateUser);
router.get("/orders/user/:userId", isSignedIN,  isAuthenticated, userPurchaseList);
router.get("/users",   getAllUsers);
router.post("/getUserByName/:userId", isSignedIN, isAuthenticated, [check('name').isLength({min:5}).withMessage("name is not entered properly.....!!!!")], getUserByName);
module.exports = router;

