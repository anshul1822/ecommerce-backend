const {Cart} = require('../model/Cart');

exports.fetchCartByUser = async(req,res) => {
    const {user} = req.query;

    try{
        const cartItems = await Cart.find({user : user}).populate('user').populate('product');
        res.status(200).json(cartItems);
    }catch(err){
        res.status(400).json(err);
    }
}

exports.addToCart = async (req,res) => {

    const cart = new Cart(req.body);
    try{
        const doc = await cart.save();
        const result = doc.populate('product');
        res.status(201).json(result);
    }catch(err){
        res.status(400).json(err);
    }
}

exports.deleteFromCart = async (req,res) => {

    const {id, userId} = req.params;
    // console.log(req.params);
    try{
        // console.log("product id to be deleted", id, userId);
        Cart.deleteOne({product : id, user : userId}).then((deletedDocument) => {
            // if(deletedDocument) console.log("Deleted the doucment", deletedDocument);
            // else console.log("doucment not found", deletedDocument);
        }).catch((err) => {
            console.log("Error occured while deleting", err);
        });
        res.status(200).json({msg : 'Successfully Deleted'});
    }catch(err){
        res.status(400).json(err);
    }
}

exports.updateCart = async (req,res) => {

    const {id} = req.params;
    try{
        const cart = await Cart.findByIdAndUpdate({_id : id}, {quantity : req.body.quantity}, {new:true}).populate('user').populate('product');
        // const cartItem = await Cart.find({_id : id}).populate('user').populate('product');
        res.status(200).json(cart);
    }catch(err){
        console.log()
        res.status(400).json(err);
    }
}