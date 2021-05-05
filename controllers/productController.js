const Products = require('../models/productModel');
//Fillter Sort Pagination
class APIfeatures{
    constructor(query,queryString) {
        this.query=query;
        this.queryString = queryString;
    }
    filltering(){
        const queryObj = {...this.queryString};
        const excludedFields= ['sort','page','limit'];
        excludedFields.forEach(element=>delete(queryObj[element]));
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lt|lte|regex)\b/g, match => '$' + match);
        
        //gte = lớn hơn hoặc bằng
        //lte = nhỏ hơn hoặc bằng
        //gt = lớn hơn
        //lt = nhỏ hơn
        this.query.find(JSON.parse(queryStr));
        return this;

    };
    sorting(){
        if(this.queryString.sort){
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        }
        else{
            this.query = this.query.sort("-createdAt");
        }
        return this;
    };
    paginating(){
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 9;
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit);
        return this;
    };
}

const productController = {
    getProducts: async(req,res)=>{
        try {
            const features = new APIfeatures(Products.find(),req.query)
                .filltering()
                .sorting()
                .paginating();
            const products = await features.query;

            res.status(200).json({result:products.length,products:products});
        } catch (error) {
            return res.status(500).json({msg:error.message});
        }
    },
    createProduct: async(req,res)=>{
        try {
            const { product_Id, title, price, description, content, images, category } =req.body;
            if(!images) return res.status(400).json({msg:"Không có hình ảnh đăng tải"});

            const product = await Products.findOne({product_Id})
            if(product) return res.status(400).json({msg:"Sản phẩm đã tồn tại!"});

            const newProduct =  new Products({
                product_Id, title:title.toLowerCase(), price, description, content, images, category 
            });
            await newProduct.save();
            res.status(200).json({msg:"Thêm sản phẩm thành công!"});
        } catch (error) {
            return res.status(500).json({msg:error.message});
        }
    },
    deleteProduct: async(req,res)=>{
        try {
            await Products.findByIdAndDelete(req.params.id);
            res.status(200).json({msg:"Xoá sản phẩm thành công!"});
        } catch (error) {
            return res.status(500).json({msg:error.message});
        }
    },
    updateProduct: async(req,res)=>{
        try {
            const { title, price, description, content, images, category } =req.body;
            if(!images) return res.status(400).json({msg:"Không có hình ảnh đăng tải"});

            await Products.findOneAndUpdate({_id:req.params.id},{
                title:title.toLowerCase(), price, description, content, images, category 
            });
            res.status(200).json({msg:"Cập nhật thành công!"});
        } catch (error) {
           return res.status(500).json({msg:error.message});
        }
    },
}

module.exports=productController;