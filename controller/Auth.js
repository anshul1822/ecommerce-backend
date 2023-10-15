const { User } = require("../model/User");
const {sanitizeUser} = require('../common/common');
const crypto = require("crypto");
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'SECRET_KEY';

exports.createUser = async (req, res) => {
  //this Product we ahve to get from API Body

  try {
    const salt = crypto.randomBytes(16);
    crypto.pbkdf2(
      req.body.password,
      salt,
      310000,
      32,
      "sha256",
      async function (err, hashedPassword) {
        const user = new User({ ...req.body, password: hashedPassword, salt });
        const doc = await user.save();

        //To create a session during sign up, as sign does not create a session upon logging in
        req.login(sanitizeUser(doc), (err) => { //this will also call serailiser
            if(err) res.status(400).json(err);
            else{
                const token = jwt.sign(sanitizeUser(doc) , SECRET_KEY);
                res.cookie('jwt', token , {expires: new Date(Date.now() + 3600000), httpOnly : true }).status(201).json(token);
            } 
        })

      }
    );
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.loginUser = async (req, res) => {
  // console.log("loginUser", req.user);
//   res.json(req.user);
  // console.log('loginUser', req.body);
  // console.log('login user', req.user);
  // console.log('login user', req.user.token);
//   const token = jwt.sign(req.body , SECRET_KEY);
  res.cookie('jwt', req.user.token , {expires: new Date(Date.now() + 36000000), httpOnly : true }).json(req.user.token);
  // res.json({status : 'success'});;

  // try{/
  //     const user = await User.findOne({email : req.body.email}).exec();

  //     if(!user) {
  //         res.status(401).json({message : 'No user found'});
  //     }
  //     else if(user.password === req.body.password){ //later we will show encrypted password
  //         res.status(201).json({id : user.id, email : user.email, name : user.name, addresses : user.addresses, role : user.role });
  //     }else{
  //         res.status(401).json({message : 'Invalid Credentials'});
  //     }

  // }catch(err){
  //     res.status(400).json(err);
  // }
};

// exports.checkUser = (req, res) => {
//   res.json(req.user);
// };
exports.checkAuth = async (req, res) => {
  if(req.user){
    res.json(req.user);
  } else{
    res.sendStatus(401);
  }
}