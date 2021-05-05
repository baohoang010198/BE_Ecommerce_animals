const Category = require('../models/categoryModel');
const Products = require('../models/productModel');
const categoryController = {
    getCategories: async (req,res) =>{
        try {
            const category = await Category.find();
            if(category.length<1) return res.status(400).json({msg:"Không có danh mục"});
            res.status(200).json(category);
        } catch (error) {
            return res.status(500).json({msg:error.message});
        }
    },
    createCategory: async(req,res)=>{
        try {
            //only admin can create update delete category
            const { name } = req.body;
            const category = await Category.findOne({name:name});
            if(category) return res.status(400).json({msg:"Danh mục đã tồn tại"});
            const newCategory = new Category({name});
            await newCategory.save();
            res.status(200).json({msg:"Tạo danh mục thành công!"});
        } catch (error) {
            return res.status(500).json({msg:error.message});
        }
    },
    updateCategory: async(req,res)=>{
        try {
            const { name } = req.body;
            await Category.findByIdAndUpdate({_id:req.params.id},{name});
            res.status(200).json({msg:"Cập nhật thành công!"});
        } catch (error) {
            return res.status(500).json({msg:error.message});
        }
    },
    deleteCategory: async(req,res)=>{
        try {
            const products = await Products.findOne({category:req.params.id});
            if(products) return res.status(400).json({
                msg:'Xoá tất cả sản phẩm thuộc danh mục',
            })
            await Category.findByIdAndDelete(req.params.id);
            res.status(200).json({msg:"Đã xoá thành công danh mục"});
        } catch (error) {
            return res.status(500).json({msg:error.message});
        }
    },
}

module.exports = categoryController;