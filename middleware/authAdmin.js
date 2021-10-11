const Admins = require('../models/adminModel');
const authAdmin = async (req,res,next)=>{
    try {
        //get user info by id
        const admin = await Admins.findOne({
            _id:req.user.id
        });
        if(!admin) return res.status(400).json({
            data:[],
            success:false,
            message:'Truy cập bị từ chối',
            total:0,
        });
        next();
    } catch (error) {
        return res.status(500).json({
            data:[],
            success:false,
            message:'Lỗi hệ thống',
            total:0,
        });
    }
}

module.exports = authAdmin;