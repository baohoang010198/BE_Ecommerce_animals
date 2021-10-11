const Admins = require('../models/adminModel')
const Payments = require('../models/paymentModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authAdminController={
    //Admin resource
    create: async (req,res) =>{
        try {
            const { name, email, password, role } = req.body;

            const admin = await Admins.findOne({email:email})
            if(admin) return res.status(400).json({
                data:[],
                success:false,
                message:'Email đã tồn tại',
                total:0,
            });

            if(password.length < 6)
            return res.status(400).json({
                data:[],
                success:false,
                message:'Mật khẩu phải hơn 6 ký tự',
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


    
    //Auth admin
    login: async (req,res)=>{
        try {
            const { email, password } = req.body;
            
            const adminCheck = await Admins.findOne({email});
            if(!adminCheck) return res.status(200).json({
                data:[],
                success:false,
                message:'Tài khoản không tồn tại',
                total:0,
            });
            const isMatch = await bcrypt.compare(password, adminCheck.password);
            if(!isMatch) return res.status(200).json({
                data:[],
                success:false,
                message:'Sai mật khẩu',
                total:0,
            });
            const admin = await Admins.findOne({email}).select('name email role phoneNumber');
            //if login success create access token and refresh token
            const accesstoken = createAccessToken({id:admin._id});
            const refreshtoken = createRefreshToken({id:admin._id});
            
            res.cookie('refreshtoken',refreshtoken,{
                httpOnly: true,
                path:'/admin/refresh_token',
                maxAge:7*24*60*60*1000,
            });
            res.status(200).json({
                data:{
                    ...admin._doc,
                    token:accesstoken
                },
                success:true,
                message:'Đăng nhập thành công',
                total:0,
            });;

        } catch (error) {
            return res.status(500).json({
                data:[],
                success:false,
                message:error.message,
                total:0,
            });
        }
    },

    logout: async (req,res)=>{
        try {
            res.clearCookie('refreshtoken',{path:'/admin/refresh_token'});
            return res.status(200).json({
                data:[],
                success:true,
                message:'Đăng xuất thành công',
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

    refreshToken: (req,res)=>{
        try {
            const rf_token = req.cookies.refreshtoken;
            if(!rf_token) return res.status(400).json({
                data:[],
                success:false,
                message:'Vui lòng đăng nhập để tiếp tục',
                total:0,
            });
            jwt.verify(rf_token,process.env.REFRESH_TOKEN_SECRET,(error,user)=>{
                if(error) return res.status(500).json({
                    data:[],
                    success:false,
                    message:'Vui lòng đăng nhập để tiếp tục',
                    total:0,
                });
                const accesstoken = createAccessToken({id:user.id}); 
                res.json({accesstoken});
            })
        } catch (error) {
            return res.status(500).json({
                data:[],
                success:false,
                message:'Lỗi hệ thống',
                total:0,
            });
        }
    },
}


const createAccessToken = (user) =>{
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
}
const createRefreshToken = (user) =>{
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {expiresIn:'7d'})
}

module.exports = authAdminController;