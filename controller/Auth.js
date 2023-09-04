const {User} = require('../model/User');

exports.createUser = async (req,res) => {
    //this Product we ahve to get from API Body
    const user = new User(req.body);
    try{
        const doc = await user.save();
        res.status(201).json(doc);
    }catch(err){
        res.status(400).json(err);
    }
}

exports.loginUser = async (req,res) => {

    try{
        const user = await User.findOne({email : req.body.email}).exec();

        if(!user) {
            res.status(401).json({message : 'No user found'});
        }
        else if(user.password === req.body.password){ //later we will show encrypted password 
            res.status(201).json({id : user.id, email : user.email, name : user.name, addresses : user.addresses, role : user.role });
        }else{
            res.status(401).json({message : 'Invalid Credentials'});
        }
        
    }catch(err){
        res.status(400).json(err);
    }
}