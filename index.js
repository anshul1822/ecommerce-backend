require('dotenv').config()
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
const { Order } = require('./model/Order');


const SECRET_KEY = process.env.JWT_SECRET_KEY;

// JWT options
var opts = {}
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = SECRET_KEY;     
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
const PORT = process.env.PORT;


// WebHook
// TODO : we will capture actual order after deplying out server on live url
// // This is your test secret API key.
// const stripe = require('stripe')('sk_test_51O22b1SFizkB7Go38kTMOmTaPXH2CqtdWPblGidAHOLRhTm0BbmfmmQdbPdvZxHSYv12u8lSVSON5fayWDBy2K9300dTopzIxW');
// Replace this endpoint secret with your endpoint's unique secret
// If you are testing with the CLI, find the secret by running 'stripe listen'
// If you are using an endpoint defined with the API or dashboard, look in your webhook settings
// at https://dashboard.stripe.com/webhooks
const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;

server.post('/webhook', express.raw({type: 'application/json'}), async (request, response) => {
  let event = request.body;
  // Only verify the event if you have an endpoint secret defined.
  // Otherwise use the basic event deserialized with JSON.parse
  if (endpointSecret) {
    // Get the signature sent by Stripe
    const signature = request.headers['stripe-signature'];
    try {
      event = stripe.webhooks.constructEvent(
        request.body,
        signature,
        endpointSecret
      );
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`, err.message);
      return response.sendStatus(400);
    }
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
      const order = await Order.findById(paymentIntentSucceeded.metadata.orderId);
      order.paymentStatus = 'received';
      await order.save();
      // Then define and call a method to handle the successful payment intent.
      // handlePaymentIntentSucceeded(paymentIntent);
      break;
    case 'payment_method.attached':
      const paymentMethod = event.data.object;
      // Then define and call a method to handle the successful attachment of a PaymentMethod.
      // handlePaymentMethodAttached(paymentMethod);
      break;
    default:
      // Unexpected event type
      console.log(`Unhandled event type ${event.type}.`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
});



//middlewares


server.use(express.static(path.resolve(__dirname, 'build')));

server.use(session({
    secret: process.env.SESSION_KEY,
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    // store: new SQLiteStore({ db: 'sessions.db', dir: './var/db' })
  }));
 
// server.use(  express.raw({type: 'application/json'}));  //Stripe payment
server.use(express.json()); // to parse req.body
server.use(cors({
    exposedHeaders:['X-Total-Count']
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
              // console.log('msg', 'No user found');
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
                    // console.log('msg', 'Invalid Credentials' );
                     done(null, false, {message : 'Invalid Credentials'});
                }else{
                    const token = jwt.sign(sanitizeUser(user), SECRET_KEY);
                    // console.log("Local strategy token", {id : user.id, role: user.role});
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
    // console.log('jwt payload', jwt_payload);
    // console.log('jwt payload', jwt_payload.id);

    try {
      // jwt_payload.sub -> jwt_payload.id
        const user = await User.findById({_id : jwt_payload.id}).exec();
        // console.log('jwt user', user);
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


  //Payment

// This is your test secret API key.
const stripe = require("stripe")(process.env.STRIPE_SERVER_ENDPOINT);

// const calculateOrderAmount = (items) => {
//   // Replace this constant with a calculation of the order's amount
//   // Calculate the order total on the server to prevent
//   // people from directly manipulating the amount on the client
//   return 1400;
// };

server.post("/create-payment-intent", async (req, res) => {
  const { totalAmount } = req.body;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalAmount*100,
    currency: "inr",
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});







  
  server.use('/auth', authRouter.router);
  server.use('/products', isAuth , productRouter.router);
          // BASE PATH
  server.use('/categories', isAuth, categoryRouter.router); //we can also use JWT token for client-only auth
  server.use('/brands', isAuth, brandRouter.router);
  server.use('/users', isAuth, usersRouter.router);
 
  server.use('/cart', isAuth, cartRouter.router);
  server.use('/orders', isAuth, orderRouter.router);

 server.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
  


async function main(){
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('mongo db connected...');  
}
main().catch((err) => console.log(err));


server.get('/', (req,res) => {
    res.json({status : 'success'});
})



server.listen(PORT, ()=>{
    console.log('server started');
})

