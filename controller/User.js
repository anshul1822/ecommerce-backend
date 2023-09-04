//CRUD operation
const {User} = require('../model/User');

exports.fetchLoggedInUser = async (req,res) => {

    const {id} = req.params;
    try{
        const doc = await User.findById(id, 'name email id role addresses orders').exec();
        //console.log("doc", doc);
        res.status(200).json(doc);
    }catch(err){
        res.status(400).json(err);
    }

}

exports.fetchLoggedInUserOrders = async (req,res) => {

    // const {id} = req.params;

    // try{
    //     const docs = await Product.findById(id);
    //     res.status(200).json(docs);
    // }catch(err){
    //     res.status(400).json(err);
    // }
}

exports.updateUser = async (req,res) => {

    const {id} = req.params;

    try{
        const docs = await User.findByIdAndUpdate(id, req.body, {new:true});
        res.status(200).json(docs);
    }catch(err){
        res.status(400).json(err);
    }
}