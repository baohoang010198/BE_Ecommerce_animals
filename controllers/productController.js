const Products = require('../models/productModel');
//Fillter Sort Pagination
const productController = {
    getProducts: async(req,res)=>{
        try {
            const { title, category_Id, page, limit} = req.body;
            const products = await Products
                .find({
                    title: {$regex: title, $options: 'i'},
                    category_Id:{$regex: category_Id, $options: 'i'},
                })
            const productsPaggination = await Products
                .find({
                    title: {$regex: title, $options: 'i'},
                    category_Id:{$regex: category_Id, $options: 'i'},
                })
                .skip(((page*1||1)-1)*(limit*1 || 10))
                .limit(limit);
            res.status(200).json({
                data:productsPaggination,
                success:true,
                message:'',
                total:products.length,
            });
        } catch (error) {
            return res.status(500).json({
                data:[],
                success:false,
                message:'Lỗi hệ thống',
                total:0,
            });
        }
    },
    createProduct: async(req,res)=>{
        try {
            const { product_Id, title, price, description,inventory, content, images, category_Id } =req.body;
            if(!images) return res.status(200).json({
                data:[],
                success:false,
                message:'Không có hình ảnh đăng tải',
                total:0,
            });

            const productId = await Products.findOne({product_Id})
            if(productId) return res.status(200).json({
                data:[],
                success:false,
                message:'Sản phẩm đã tồn tại',
                total:0,
            });
            const producTitle = await Products.findOne({title})
            if(producTitle) return res.status(200).json({
                data:[],
                success:false,
                message:'Tên sản phẩm đã tồn tại',
                total:0,
            });
            const newProduct =  new Products({
                product_Id, title:title.toLowerCase(), price, description,inventory, content, images, category_Id
            });
            await newProduct.save();
            res.status(200).json({
                data:[],
                success:true,
                message:'Tạo sản phẩm thành công',
                total:0,
            });
        } catch (error) {
            res.status(500).json({
                data:[],
                success:false,
                message:'Tạo sản phẩm thất bại do lỗi hệ thống',
                total:0,
            });
        }
    },
    deleteProduct: async(req,res)=>{
        try {
            await Products.findByIdAndDelete(req.params.id);
            res.status(200).json({
                data:[],
                success:true,
                message:'Xoá sản phẩm thành công',
                total:0,
            });
        } catch (error) {
            res.status(500).json({
                data:[],
                success:false,
                message:'Xoá sản phẩm thất bại do lỗi hệ thống',
                total:0,
            });
        }
    },
    getProduct: async(req,res)=>{
        try {
            const product = await Products.findById(req.params.id);
            if(!product) return res.status(400).json({
                data:[],
                success:false,
                message:'Sản phẩm không tồn tại',
                total:0,
            });
            res.status(200).json({
                data:product,
                success:true,
                message:'',
                total:0,
            });
        } catch (error) {
            res.status(500).json({
                data:[],
                success:false,
                message:'Xoá sản phẩm thất bại do lỗi hệ thống',
                total:0,
            });
        }
    },
    updateProduct: async(req,res)=>{
        try {
            const { title, price, description,inventory, content, images, category_Id } =req.body;
            if(!images) return res.status(200).json({
                data:[],
                success:false,
                message:'Không có hình ảnh đăng tải',
                total:0,
            });
            const producTitle = await Products.findOne({title})
            if(producTitle && producTitle._id != req.params.id) return res.status(200).json({
                data:[],
                success:false,
                message:'Tên sản phẩm đã tồn tại',
                total:0,
            });
            const product = await Products.findById(req.params.id);
            if(!product) return res.status(200).json({
                data:[],
                success:false,
                message:'Sản phẩm không tồn tại',
                total:0,
            });
            await Products.findOneAndUpdate({_id:req.params.id},{
                title:title.toLowerCase(), price, description,inventory, content, images, category_Id 
            });
            res.status(200).json({
                data:[],
                success:true,
                message:'Cập nhật sản phẩm thành công',
                total:0,
            });
        } catch (error) {
            res.status(500).json({
                data:[],
                success:false,
                message:'Cập nhật thất bại do lỗi hệ thống',
                total:0,
            });
        }
    },
    getProductsCategory: async(req,res)=>{
        try {
            const products = await Products.find({category_Id: req.params.id}).limit(4);
            res.status(200).json({
                data:products,
                success:true,
                message:'',
                total:0,
            });
        } catch (error) {
            res.status(500).json({
                data:[],
                success:false,
                message:'Lỗi hệ thống',
                total:0,
            });
        }
    },
    getProductsFeatured : async(req,res)=>{
        try {
            const products = await Products.find({}).sort("-inventory").limit(4);
            res.status(200).json({
                data:products,
                success:true,
                message:'',
                total:0,
            });
        } catch (error) {
            res.status(500).json({
                data:[],
                success:false,
                message:'Lỗi hệ thống',
                total:0,
            });
        }
    },
    getProductsLatest: async(req,res)=>{
        try {
            const products = await Products.find().sort({ _id: -1 }).limit(4);
            res.status(200).json({
                data:products,
                success:true,
                message:'',
                total:0,
            });
        } catch (error) {
            res.status(500).json({
                data:[],
                success:false,
                message:'Lỗi hệ thống',
                total:0,
            });
        }
    },
}

module.exports=productController;