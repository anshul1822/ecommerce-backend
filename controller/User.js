//CRUD operation
const {User} = require('../model/User');

exports.fetchLoggedInUserDetails = async (req,res) => {

    const id = req.user.id;
    // console.log('req.user', req.user);
    try{
        const doc = await User.findById(id, 'name email role addresses orders').exec();
        //console.log("doc", doc);
        res.status(200).json(doc);
    }catch(err){
        res.status(400).json(err);
    }

}

exports.updateUser = async (req,res) => {

    const id = req.user.id;

    // console.log("update user", req.body);

    try{
        const docs = await User.findByIdAndUpdate(id, req.body, {new:true});
        res.status(200).json(docs);
    }catch(err){
        res.status(400).json(err);
    }
}