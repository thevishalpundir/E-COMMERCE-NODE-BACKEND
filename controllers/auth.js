const User = require("../models/user");
const { check, validationResult } = require("express-validator");
var jwt = require("jsonwebtoken");
var expressJwt = require("express-jwt");

exports.signup = (req, res) => {


  const user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        err: "NOT able to save user in DB"
      });
    }
    res.json({
      name: user.name,
      email: user.email,
      id: user._id,
      userCreated: user
    });
  });
};
exports.isEmailPresent = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg
    });
  }

  const user = new User(req.body);
  User.findOne({ email: user.email }, (err, user) => {
    if (err) {
      return res.status(422).json({
        error: "OOPS some error occured!"
      })
    }
    if (user) {
      return res.status(422).json({
        error: "user is already registered with this email Id.Please try with differnt one or login!"
      })
    }
    next();
  })

}
exports.signin = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors
    });
  }
  const { email, password } = req.body;
  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "USER email does not exists"
      });
    }

    if (!user.autheticate(password)) {
      return res.status(401).json({
        error: "Email and password do not match"
      });
    }

    //create token
    const token = jwt.sign({ _id: user._id, _name: user.name, _email : user.email }, process.env.SECRET);
    //put token in cookie
    res.cookie("token", token, { expire: new Date() + 9999 });

    //send response to front end
    user.email = undefined;
    const { _id, name, email, role } = user;
    return res.json({ token, user: { _id, name, role }, userRequested: user });
  });
};

exports.signout = (req, res) => {
  res.clearCookie(token);
  res.json({
    message: "signed out sucessfully"
  });
};

exports.isSignedIN = expressJwt({
  secret: process.env.SECRET,
  userProperty: "storedJWTdecodedPayloadinCookie"
});
exports.isAuthenticated = (req, res, next) => {
  let checker = req.profile && req.storedJWTdecodedPayloadinCookie && req.profile.id == req.storedJWTdecodedPayloadinCookie._id
  if (!checker) {
    return res.status(403).json({
      error: "ACCESS DENIED"
    })
  }
  next();
}
exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    return res.status(403).json({
      error: "YOU ARE NOT ADMIN, ACCESS DENIED.........!!!"
    })

  }
  next();
}