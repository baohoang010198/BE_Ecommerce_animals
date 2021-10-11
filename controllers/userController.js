const Users = require('../models/userModel');
const bcrypt = require('bcrypt');
const userController = {
    searchUsers: async (req,res) =>{  
        try {
            const { email, page, limit} = req.body;
            const user = await Users
                .find(email ? {email: {$regex: email, $options: 'i'}} : {})
            const userPaggination = await Users
                .find(email ? {email: {$regex: email, $options: 'i'}} : {})
                .skip(((page*1||1)-1)*(limit*1 || 10))
                .limit(limit);
            res.status(200).json({
                data:userPaggination,
                success:true,
                message:'',
                total:user.length,
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
    changePasswordUser: async(req,res)=>{
        try {
            const { password } = req.body;
            if(password.length < 6)
            return res.status(200).json({
                data:[],
                success:true,
                message:'Mật khẩu trên 6 ký tự',
                total:0,
            });
            const passwordHash = await bcrypt.hash(password, 10);
            await Users.findByIdAndUpdate({_id:req.params.id},{password: passwordHash});
            res.status(200).json({
                data:[],
                success:true,
                message:'Đổi mật khẩu thành công',
                total:0,
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
    deleteUser: async(req,res)=>{
        try {
            await Users.findByIdAndDelete(req.params.id);
            res.status(200).json({
                data:[],
                success:true,
                message:'Xoá người dùng thành công',
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

module.exports = userController;