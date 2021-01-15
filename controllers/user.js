const User = require("../models/user");
const Order = require("../models/order")
const { check, validationResult } = require("express-validator");
exports.getUserById = (req, res, next, id) => {
    User.findById(id).exec((err, user) => {
        if (err || !user) {
            res.status(404).json({
                error: "no user was found in db!"
            })
        }
        req.profile = user
        next();
    });
};


exports.getUser = (req, res) => {
    req.profile.salt = undefined;
    req.profile.encry_password = undefined
    return res.json(req.profile);
}


exports.getAllUsers = (req, res) => {
    let totalUsers = []
    User.find().exec((err, users) => {
        if (err || !users) {
            error: "no user is found!"
        }

        return res.json(
            {

                total_Users: users.length,
                users: users.map(x => {
                    return {
                        name: x.name,
                        email: x.email
                    }
                }



                )
            })
    });
}
exports.getUserByName = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: errors
        });
    }
    const { name } = req.body;
    if(req.profile.name === name){
        return res.json({
            user : req.profile
        })
    }
    return res.status(422).json({
        error: "The name you have entered is not matched with logged id...!!! "

    });
   /*  let userName;
    User.findById(req.profile.id).exec((err, user) => {
        if (err || !user) {
            res.status(404).json({
                error: "no user was found in db!"
            })
        }
        userName = user.name;
        console.log(user.name);


    });
    console.log(userName);
    if ({ name } == userName) {
        User.findOne({ name }, (err, user) => {
            if (err || !user) {
                return res.status(400).json({
                    error: "USER  does not exists"
                });
            }
            user.email = undefined;
            const { _id, name, email, role } = user;
            return res.json({ user: { _id, name, role }, userRequested: user });
        });
    } else {
        return res.status(422).json({
            error: "The name you have entered is not matched with logged id...!!! "

        });
    }
 */
};
exports.updateUser = (req, res) => {
    User.findByIdAndUpdate(
        { _id: req.profile._id },
        { $set: req.body },
        { new: true, useFindAndModify: false },
        (err, user) => {
            if (err) {
                return res.status(400).json({
                    error: "you are not authorized!!!"
                })
            }
            req.profile.salt = undefined;
            req.profile.encry_password = undefined
            res.json(user)
        })
}
exports.userPurchaseList = (req, res) => {
    Order.find({ user: req.profile._id })
        .populate("user", "_id name")
        .exec((err, order) => {
            if (err) {
                return res.status(400).json({
                    error: "some error occured!!!"
                })
            }
            return res.json(order)
        })
}
exports.putOrderInPurchaseList = (err, res, next) => {
    let purchases = [];
    req.body.order.products.forEach(product => {
        purchases.push({
            _id: product._id,
            name: product.name,
            description: product.description,
            category: product.category,
            quantity: product.quantity,
            amount: req.body.order.amount,
            transaction_id: req.body.order.transaction_id
        })
    })
    User.findOneAndUpdate({ _id: req.profile._id }, { $push: { purchases: purchases } }, { new: true }, (err, purchases) => {
        if (err) {
            return res.status(400).json({
                error: "unable to save purchase list!!!"
            })
        }
    })
    next();
}