
const { Category } = require("../model/Category");

exports.fetchAllCategories = async (req,res) => {
    //here we need all query string
    try{
        const categories = await Category.find({}).exec();
        // console.log('All Categories', categories);

        res.status(200).json(categories);
    }catch(err){
        res.status(400).json(err);
    }
}

exports.createCategory = async (req,res) => {
    //here we need all query string
    const category = new Category(req.body);
    try{        
        const doc = await category.save();
        res.status(201).json(doc);
    }catch(err){
        res.status(400).json(err);
    }
}