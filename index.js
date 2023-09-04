const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');




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
server.use(express.json()); // to parse req.body
server.use(cors({
    exposedHeaders:['X-Total-Count']
}));

server.use('/products', productRouter.router);
        // BASE PATH
server.use('/categories', categoryRouter.router);
server.use('/brands', brandRouter.router);
server.use('/users', usersRouter.router);
server.use('/auth', authRouter.router);
server.use('/cart', cartRouter.router);
server.use('/orders', orderRouter.router);

async function main(){
        await mongoose.connect('mongodb://127.0.0.1:27017/ecommerce');
        console.log('mongo db connected...');  
}
main().catch((err) => console.log(err));


server.get('/', (req,res) => {
    res.json({status : 'success'});
})



server.listen(PORT, ()=>{
    console.log('server started');
})