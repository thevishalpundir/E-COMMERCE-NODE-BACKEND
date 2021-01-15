const {check} = require("express-validator")
var express = require("express");
var router = express.Router();
const {signout, signup, signin, isSignedIN, isEmailPresent} = require("../controllers/auth")
router.get("/signout", signout);
router.post("/signup",[
    check('name').isLength({min:5}).withMessage("The length of the name should be at least 5 characters!"),
    check('password', "The length of the password should be at least 5 characters!").isLength({min:5}),
    check('email').isEmail().withMessage("Please enter corrcet email-id!")
], isEmailPresent, signup);
router.post("/signin",[
    check('email').isEmail().withMessage("Email id is required!"),
    check('password', "Password field is required!").isLength({min:5})
],  signin);
router.get("/testRoute", isSignedIN, (req, res) => {
    res.json({userSignedIn :req.auth});
});
module.exports = router;