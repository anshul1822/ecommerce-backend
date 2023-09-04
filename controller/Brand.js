const { Brand } = require("../model/Brand");

exports.fetchAllBrands = async (req,res) => {
    //here we need all query string
    try{
        const brands = await Brand.find({}).exec();
        res.status(200).json(brands);
    }catch(err){
        res.status(400).json(err);
    }
}

exports.createBrand = async (req,res) => {
    //here we need all query string
    const brand = new Brand(req.body);
    try{        
        const doc = await brand.save();
        res.status(201).json(doc);
    }catch(err){
        res.status(400).json(err);
    }
}