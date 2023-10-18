//CRUD operation
const {Product} = require('../model/Product');

exports.createProduct = async (req,res) => {
    //this Product we ahve to get from API Body

    const product = new Product(req.body);
    try{
        const doc = await product.save();
        res.status(201).json(doc);
    }catch(err){
        // console.log(err);
        res.status(400).json(err);
    }
}

exports.fetchAllProducts = async (req,res) => {
    //here we need all query string
  
    //filter = {"category" : ["smartphone", "laptops"]}
    //sort = {_sort : "price", _order : "desc"}
    //pagination = {_page:1, _limit=10} // _page=1&_limit=10

    //TODO : We have to support multiple categories and brands

    let query = Product.find({});
    let totalProductsQuery = Product.find({});

    // TODO : How to get sorting from discounted price not on Actual Price
    if(req.query._sort && req.query._order){
        query = query.sort({[req.query._sort] : req.query._order});
        totalProductsQuery = totalProductsQuery.sort({[req.query._sort] : req.query._order});
    }

    if(req.query.category){
        query = query.find({ category : req.query.category});
        totalProductsQuery = totalProductsQuery.find({ category : req.query.category});
    }

    if(req.query.brands){
        query = query.find({ brand : req.query.brands });
        totalProductsQuery = totalProductsQuery.find({ brand : req.query.brands });
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
        // console.log('All Products', docs);
        res.set('X-Total-Count', totalDocs);
        res.status(200).json(docs);
    }catch(err){
        res.status(400).json(err);
    }
}

exports.fetchProductById = async (req,res) => {

    const {id} = req.params;

    try{
        const docs = await Product.findById(id);
        res.status(200).json(docs);
    }catch(err){
        res.status(400).json(err);
    }
}

exports.updateProduct = async (req,res) => {

    const {id} = req.params;

    try{
        const docs = await Product.findByIdAndUpdate(id, req.body, {new:true});
        res.status(200).json(docs);
    }catch(err){
        res.status(400).json(err);
    }
}