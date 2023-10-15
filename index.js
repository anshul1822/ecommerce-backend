const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const crypto = require('crypto');

var session = require('express-session');
var passport = require('passport');
const { User }= require('./model/User');
const LocalStrategy = require('passport-local').Strategy;
const {isAuth, cookieExtractor, sanitizeUser} = require('./common/common');
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt;
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');


const SECRET_KEY = 'SECRET_KEY';

// JWT options
var opts = {}
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = SECRET_KEY;        //TODO : This should not be in code
// opts.issuer = 'accounts.examplesoft.com';
// opts.audience = 'yoursite.net';    


const productRouter = require('./routes/Products');
const brandRouter = require('./routes/Brands');
const categoryRouter = require('./routes/Categories');
const usersRouter = require('./routes/User');
const authRouter = require('./routes/Auth');
const cartRouter = require('./routes/Cart');
const orderRouter = require('./routes/Order');

const server = express();
const PORT = 8080;

//middlewares

server.use(express.static('build'));

server.use(session({
    secret: 'keyboard cat',
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    // store: new SQLiteStore({ db: 'sessions.db', dir: './var/db' })
  }));
  
server.use(cookieParser());
server.use(passport.authenticate('session'));

//Passport Strategies -> How to check login
passport.use( 'local', new LocalStrategy(
    // by default passport uses username
    {usernameField : 'email'},
    async function(email, password, done) {
        try{
            // console.log("local strategy", username, password);
            const user = await User.findOne({email : email}).exec();

            // console.log({user});

            if(!user) {
              console.log('msg', 'No user found');
                done(null, false, {message : 'No user found'});
                // res.status(401).json();
            }

            crypto.pbkdf2(
              password,
              user.salt,
              310000,
              32,
              "sha256",
              async function (err, hashedPassword) {
                if(!crypto.timingSafeEqual(user.password, hashedPassword)){ //later we will show encrypted password 
                    // this line is calling serialize
                    console.log('msg', 'Invalid Credentials' );
                     done(null, false, {message : 'Invalid Credentials'});
                }else{
                    const token = jwt.sign(sanitizeUser(user), SECRET_KEY);
                    console.log("Local strategy token", {id : user.id, role: user.role});
                    // done(null, {id : user.id, role: user.role});  //this lines send to serialiser
                   done(null, {id : user.id, token});
                    // res.status(401).json({message : 'Invalid Credentials'});
                }     
              }
            );            

        }catch(err){
            console.log('Local', err);
           return done(err);
        }
        // console.log("local strategy", username, password);
    }
  ));

  passport.use('jwt', new JwtStrategy(opts, async function(jwt_payload, done) {
    console.log('jwt payload', jwt_payload);
    console.log('jwt payload', jwt_payload.id);

    try {
      // jwt_payload.sub -> jwt_payload.id
        const user = await User.findById({_id : jwt_payload.id}).exec();
        console.log('jwt user', user);
        if (!user) {
          return done(null, false); // User not found
        }
    
        // console.log('JWT', { user });
        return done(null, user); // User found this calls serialiser
      } catch (err) {
        console.error('JWT Error:', err);
        return done(err, false); // Error occurred
      }
}));  
//this creates session variable req.user on being called from callbacks
  passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
    //   console.log("serialise", user);
      return cb(null, user);
    });
  });
  
//this changes session variable req.user when called from authorized request  
  passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
    //   console.log("de-serialise", user);
      return cb(null, user);
    });
  });


  server.use(express.json()); // to parse req.body
  server.use(cors({
      exposedHeaders:['X-Total-Count']
  }));
  
  server.use('/auth', authRouter.router);
  server.use('/products', isAuth , productRouter.router);
          // BASE PATH
  server.use('/categories', isAuth, categoryRouter.router); //we can also use JWT token for client-only auth
  server.use('/brands', isAuth, brandRouter.router);
  server.use('/users', isAuth, usersRouter.router);
 
  server.use('/cart', isAuth, cartRouter.router);
  server.use('/orders', isAuth, orderRouter.router);
  


async function main(){
        await mongoose.connect('mongodb://127.0.0.1:27017/ecommerce');
        console.log('mongo db connected...');  
}
main().catch((err) => console.log(err));


server.get('/', (req,res) => {
    res.json({status : 'success'});
})

server.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });

server.listen(PORT, ()=>{
    console.log('server started');
})

