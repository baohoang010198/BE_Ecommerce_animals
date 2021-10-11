const Category = require('../models/categoryModel');
const Products = require('../models/productModel');
const categoryController = {
    searchCategories: async (req,res) =>{  
        try {
            const { name, page, limit} = req.body;
            const category = await Category
                .find(name ? {name: {$regex: name, $options: 'i'}} : {})
            const categoryPaggination = await Category
                .find(name ? {name: {$regex: name, $options: 'i'}} : {})
                .skip(((page*1||1)-1)*(limit*1 || 10))
                .limit(limit);
            res.status(200).json({
                data:categoryPaggination,
                success:true,
                message:'',
                total:category.length,
            });
        } catch (error) {
            return res.status(500).json({
                data:[],
                success:true,
                message:'Lỗi hệ thống',
                total:0,
            });
        }
    },
    getCategories: async (req,res) =>{  
        try {
            const category = await Category.find({}).select('name')

            res.status(200).json({
                data:category,
                success:true,
                message:'',
                total:category.length,
            });
        } catch (error) {
            return res.status(500).json({
                data:[],
                success:true,
                message:'Lỗi hệ thống',
                total:0,
            });
        }
    },
    createCategory: async(req,res)=>{
        try {
            //only admin can create update delete category
            const { name } = req.body;
            const category = await Category.findOne({name:name});
            if(category) return res.status(200).json({
                data:[],
                success:false,
                message:'Danh mục đã tồn tại',
                total:0,
            });
            const newCategory = new Category({name});
            await newCategory.save();
            res.status(200).json({
                data:[],
                success:true,
                message:'Tạo danh mục thành công',
                total:0,
            });
        } catch (error) {
            return res.status(500).json({
                data:[],
                success:true,
                message:'Tạo danh mục thất bại lỗi hệ thống',
                total:0,
            });
        }
    },
    updateCategory: async(req,res)=>{
        try {
            const { name } = req.body;
            const categoryName = await Category.findOne({name:name});
            if(categoryName && categoryName._id!= req.params.id) return res.status(200).json({
                data:[],
                success:false,
                message:'Danh mục đã tồn tại',
                total:0,
            });
            const category = await Category.findById(req.params.id);
            if(!category) return res.status(500).json({
                data:[],
                success:true,
                message:'Danh mục không tồn tại',
                total:0,
            }); 
            await Category.findByIdAndUpdate({_id:req.params.id},{name});
            res.status(200).json({
                data:[],
                success:true,
                message:'Cập nhật danh mục thành công',
                total:0,
            });
        } catch (error) {
            return res.status(500).json({
                data:[],
                success:true,
                message:'Cập nhật thất bại lỗi hệ thống',
                total:0,
            });
        }
    },
    getCategory: async(req,res)=>{
        try {
            const category = await Category.findById(req.params.id).select('name');
            if(!category) return res.status(500).json({
                data:[],
                success:true,
                message:'Danh mục không tồn tại',
                total:0,
            }); 
            res.status(200).json({
                data:category,
                success:true,
                message:'',
                total:0,
            });
        } catch (error) {
            return res.status(500).json({
                data:[],
                success:true,
                message:'Cập nhật thất bại lỗi hệ thống',
                total:0,
            });
        }
    },
    deleteCategory: async(req,res)=>{
        try {
            const products = await Products.findOne({category_Id:req.params.id});
            if(products) return res.status(200).json({
                data:[],
                success:false,
                message:'Hãy xoá tất cả sản phẩm thuộc danh mục',
                total:0,
            });
            await Category.findByIdAndDelete(req.params.id);
            res.status(200).json({
                data:[],
                success:true,
                message:'Xoá danh mục thành công',
                total:0,
            });
        } catch (error) {
            return res.status(500).json({
                data:[],
                success:true,
                message:'Xoá thất bại lỗi hệ thống',
                total:0,
            });
        }
    },
}

module.exports = categoryController;