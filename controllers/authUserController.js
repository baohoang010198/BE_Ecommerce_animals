const Users = require('../models/userModel');
const Payments = require('../models/paymentModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userController={
    register: async (req,res) =>{
        try {
            const { name, email, password, phoneNumber } = req.body;

            const userEmail = await Users.findOne({email:email})
            if(userEmail) return res.status(400).json({
                data:[],
                success:false,
                message:'Email đã tồn tại',
                total:0,
            });

            const userPhoneNumber = await Users.findOne({phoneNumber:phoneNumber})
            if(userPhoneNumber) return res.status(400).json({
                data:[],
                success:false,
                message:'Số điện thoại đã tồn tại',
                total:0,
            });

            if(phoneNumber.length > 11 && phoneNumber.length <10) return res.status(400).json({
                data:[],
                success:false,
                message:'Số điện thoại sai định dạng ',
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
            const newUser = new Users({
                name, email, password:passwordHash, phoneNumber
            });

            //SAVE
            await newUser.save();
            const user = await Users.findOne({email}).select('name cart email phoneNumber');
            //THEN CREATE JSONWEBTOKEN TO AUTHENTICATION
            const accesstoken = createAccessToken({id:newUser._id});
            const refreshtoken = createRefreshToken({id:newUser._id});
            
            res.cookie('refreshtoken',refreshtoken,{
                httpOnly: true,
                path:'/user/refresh_token',
                maxAge:7*24*60*60*1000,
            });

            res.status(200).json({
                data:{
                    ...user._doc,
                    token:accesstoken
                },
                success:true,
                message:'Đăng ký thành công',
                total:0,
            });;

        } catch (error) {
            return res.status(500).json({
                data:[],
                success:false,
                message:'Lỗi hệ thống',
                total:0,
            });
        }
    },

    login: async (req,res)=>{
        try {
            const { email, password } = req.body;

            const hasUser = await Users.findOne({email}).select('name cart email password role phoneNumber');
            if(!hasUser) return res.status(200).json({
                data:[],
                success:false,
                message:'Tài khoản không tồn tại',
                total:0,
            });

            const isMatch = await bcrypt.compare(password, hasUser.password);
            if(!isMatch) return res.status(200).json({
                data:[],
                success:false,
                message:'Sai mật khẩu',
                total:0,
            });
            const user = await Users.findOne({email}).select('name cart email phoneNumber');
            //if login success create access token and refresh token
            const accesstoken = createAccessToken({id:user._id});
            const refreshtoken = createRefreshToken({id:user._id});
            
            res.cookie('refreshtoken',refreshtoken,{
                httpOnly: true,
                path:'/user/refresh_token',
                maxAge:7*24*60*60*1000,
            });
            res.status(200).json({
                data:{
                    ...user._doc,
                    token:accesstoken
                },
                success:true,
                message:'Đăng nhập thành công',
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
    changPassword: async (req,res)=>{
        try {
            const { oldPassword, newPassword } = req.body;

            const hasUser = await Users.findById(req.user.id);
            if(!hasUser) return res.status(200).json({
                data:[],
                success:false,
                message:'Tài khoản không tồn tại',
                total:0,
            });

            const isMatch = await bcrypt.compare(oldPassword, hasUser.password);
            if(!isMatch) return res.status(200).json({
                data:[],
                success:false,
                message:'Mật khẩu hiện tại sai!',
                total:0,
            });
            const passwordHash = await bcrypt.hash(newPassword, 10);
            await Users.findOneAndUpdate({_id:req.user.id},{password:passwordHash});
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

    logout: async (req,res)=>{
        try {
            res.clearCookie('refreshtoken',{path:'/user/refresh_token'});
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
                if(error) return res.status(400).json({
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

    getUser: async(req,res)=>{
        try {
            const user = await Users.findById(req.user.id).select('name cart email role phoneNumber');
            if(!user) return res.status(200).json({
                data:null,
                success:false,
                message:'Người dùng không tồn tại',
                total:0,
            });;
            res.status(200).json({
                data:{
                    ...user._doc,
                },
                success:true,
                message:'',
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

    addCart : async(req,res)=>{
        try {
            const User = await Users.findById(req.user.id);
            if(!User) return res.status(500).json({
                data:[],
                success:false,
                message:'Người dùng không tồn tại',
                total:0,
            });
            await Users.findOneAndUpdate({_id:req.user.id},{
                cart: req.body.cart,
            })

            return res.status(200).json({
                data:[],
                success:true,
                message:'Thêm vào giỏ hàng thành công',
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
    history: async(req,res)=>{
        try {
            const history = await Payments.find({user_id:req.user.id}).sort("status");
            return res.status(200).json({
                data:history,
                success:true,
                message:'',
                total:0,
            });
        } catch (error) {
            return res.status(500).json({
                data:[],
                success:false,
                message:'Lỗi hệ thông',
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

module.exports = userController;