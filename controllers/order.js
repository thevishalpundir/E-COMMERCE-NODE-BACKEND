const { json } = require("body-parser");
const { Order, Product} = require("../models/order")


exports.getOrderById = (req, res, next, id) => {
    Order.findById(id).populate("products.product", "name price").exec((err, order) => {
        if(err) {
            return res.status(400).json({
                error : "NO order found in DB....!!!!"
            })
        }
        req.order = order;
        next()
    })
}



exports.createOrder  = (req, res) => {
    req.body.order.user = req.profile;
    const order = new Order(req.body.order)
    order.save((err, order) => {
        if(err) {
            return res.status(400).json({
                error : "Failed to save in DB.....!!!!!"
            })
        }
    })
}


exports.getAllOrders = (req, res) => {
    Order.find().populate("user", "_id name").exec((err, order) => {
        if(err) {
            return res.status(400).json({
                error : "No order found in DB....!!!"
            })
        }
        res.json(order);
    })
}


exports.getOrderStatus = (req, res) => {

    res.json({

        
        name : "VISHAL THAKUR"
    })
}

exports.updateStatus = (req, res) => {
    res.json()
}