const Admins = require('../models/adminModel');
const bcrypt = require('bcrypt');
const adminController = {
    searchAdmins: async (req,res) =>{  
        try {
            const { email,role, page, limit} = req.body;
            const admin = await Admins
                .find({
                    email: {$regex: email, $options: 'i'},
                })
                .select('role name email')
                .sort('-role')
                .exec();
            const adminPaggination = await Admins
                .find({
                    email: {$regex: email, $options: 'i'},
                })
                .select('role name email')
                .skip(((page*1||1)-1)*(limit*1 || 10))
                .limit(limit)
                .sort('-role')
                .exec();
            res.status(200).json({
                data:adminPaggination,
                success:true,
                message:'',
                total:admin.length,
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
    getAdmin: async (req,res) =>{  
        try {
            const admin = await Admins.findById(req.params.id).select('role name email');
            if(!admin) return res.status(200).json({
                data:[],
                success:true,
                message:'Tài khoản không tồn tại',
                total:0,
            });
            res.status(200).json({
                data:admin,
                success:true,
                message:'',
                total:0,
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
    createAdmin: async(req,res)=>{
        try {
            const { name, email, password, role } = req.body;

            const admin = await Admins.findOne({email:email})
            if(admin) return res.status(200).json({
                data:[],
                success:true,
                message:'Email đã tồn tại',
                total:0,
            });

            if(password.length < 6)
                return res.status(200).json({
                    data:[],
                    success:true,
                    message:'Mật khẩu trên 6 ký tự',
                    total:0,
                });
            //password Encryption
            const passwordHash = await bcrypt.hash(password, 10);
            
            const newAdmin = new Admins({
                name, email, password:passwordHash, role
            });
            //SAVE
            await newAdmin.save();
            return res.status(200).json({
                data:[],
                success:true,
                message:'Tạo admin thành công',
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
    updateAdmin: async(req,res)=>{
        try {
            const { name, email, role } = req.body;
            if(req.user.id == req.params.id && role==0){
                return res.status(200).json({
                    data:[],
                    success:true,
                    message:'Không được phép thay đổi quyền của chính mình',
                    total:0,
                });
            }
            await Admins.findByIdAndUpdate({_id:req.params.id},{name, email, role});
            res.status(200).json({
                data:[],
                success:true,
                message:'Cập nhật admin thành công',
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
    changeAdmin: async(req,res)=>{
        try {
            const { password } = req.body;
            if(password.length < 6)
            return res.status(200).json({
                data:[],
                success:true,
                message:'Mật khẩu trên 6 ký tự',
                total:0,
                });
            //password Encryption
            const passwordHash = await bcrypt.hash(password, 10);
            await Admins.findByIdAndUpdate({_id:req.params.id},{password:passwordHash});
            res.status(200).json({
                data:[],
                success:true,
                message:'Thay đổi mật khẩu thành công',
                total:0,
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
    deleteAdmin: async(req,res)=>{
        try {
            if(req.user.id == req.params.id){
                return res.status(200).json({
                    data:[],
                    success:false,
                    message:'Không được phép xoá account chính mình',
                    total:0,
                });
            }
            await Admins.findByIdAndDelete(req.params.id);
            res.status(200).json({
                data:[],
                success:true,
                message:'Xoá admin thành công',
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

module.exports = adminController;