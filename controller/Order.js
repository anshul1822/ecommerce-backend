const {Order} = require('../model/Order');

exports.fetchOrderByUser = async(req,res) => {
    // console.log(req.params);
    const {user} = req.params;
    
    try{
        const items = await Order.find({user : user}).populate('user');
        // console.log(items);
        res.status(200).json(items);
    }catch(err){
        console.log(err);
        res.status(400).json(err);
    }
}

exports.createOrder = async (req,res) => {
    // console.log("create Order",req.body);
    const order = new Order(req.body);
    // console.log("create Order", order);
    try{
        const doc = await order.save();
        // const result = doc.populate('user');
        // console.log("create order", doc);
        res.status(201).json(doc);
    }catch(err){
        console.log("error at create order", err);
        res.status(400).json(err);
    }
}

exports.fetchAllOrders = async (req,res) => {

    // try{
    //     const docs = await Order.find({}).populate({
    //         path: 'user',   // The field you want to populate
    //         select: 'name', // Specify the field you want to populate
    //       });
        
    //     res.set('X-Total-Count', docs.length);
    //     res.status(200).json(docs);
    // }catch(err){
    //     console.log("error at fetchAllOrders", err);
    //     res.status(400).json(err);
    // }

    let query = Order.find({});
    let totalProductsQuery = Order.find({});

    if(req.query._sort && req.query._order){
        query = query.sort({[req.query._sort] : req.query._order});
        totalProductsQuery = totalProductsQuery.sort({[req.query._sort] : req.query._order});
    }

    const totalDocs = await totalProductsQuery.count().exec();
    // console.log({totalDocs});

    if(req.query._page && req.query._limit){
        const pageSize = req.query._limit;
        const page = req.query._page;
        query = query.skip(pageSize *(page-1)).limit(pageSize);
    }

    try{
        const docs = await query.exec();
        res.set('X-Total-Count', totalDocs);
        res.status(200).json(docs);
    }catch(err){
        res.status(400).json(err);
    }
    

    // const {id, userId} = req.params;
    // // console.log(req.params);
    // try{
    //     console.log("product id to be deleted", id, userId);
    //     Cart.deleteOne({product : id, user : userId}).then((deletedDocument) => {
    //         if(deletedDocument) console.log("Deleted the doucment", deletedDocument);
    //         else console.log("doucment not found", deletedDocument);
    //     }).catch((err) => {
    //         console.log("Error occured while deleting", err);
    //     });
    //     res.status(200).json({msg : 'Successfully Deleted'});
    // }catch(err){
    //     res.status(400).json(err);
    // }
}

exports.updateCart = async (req,res) => {

    // const {id} = req.params;
    // try{
    //     const cart = await Cart.findByIdAndUpdate({_id : id}, {quantity : req.body.quantity}, {new:true}).populate('user').populate('product');
    //     // const cartItem = await Cart.find({_id : id}).populate('user').populate('product');
    //     res.status(200).json(cart);
    // }catch(err){
    //     console.log()
    //     res.status(400).json(err);
    // }
}