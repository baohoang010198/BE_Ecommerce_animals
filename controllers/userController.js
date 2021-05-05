const Users = require('../models/userModel');
const Payments = require('../models/paymentModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userController={
    register: async (req,res) =>{
        try {
            const { name, email, password } = req.body;

            const user = await Users.findOne({email:email})
            if(user) return res.status(400).json({msg: "Email tồn tại. "});

            if(password.length < 6)
                return res.status(400).json({msg: "Mật khẩu phải hơn 6 ký tự"});

            //password Encryption
            const passwordHash = await bcrypt.hash(password, 10);
            const newUser = new Users({
                name, email, password:passwordHash,
            });
            //SAVE
            await newUser.save();

            //THEN CREATE JSONWEBTOKEN TO AUTHENTICATION
            const accesstoken = createAccessToken({id:newUser._id});
            const refreshtoken = createRefreshToken({id:newUser._id});
            
            res.cookie('refreshtoken',refreshtoken,{
                httpOnly: true,
                path:'/user/refresh_token',
                maxAge:7*24*60*60*1000,
            });

            res.json({accesstoken});

        } catch (error) {
            return res.status(500).json({msg: error.message});
        }
    },

    login: async (req,res)=>{
        try {
            const { email, password } = req.body;

            const user = await Users.findOne({email});
            if(!user) return res.status(400).json({msg: "Tài khoản không tồn tại!"});

            const isMatch = await bcrypt.compare(password, user.password);
            if(!isMatch) return res.status(400).json({msg: "Sai mật khẩu"});

            //if login success create access token and refresh token
            const accesstoken = createAccessToken({id:user._id});
            const refreshtoken = createRefreshToken({id:user._id});
            
            res.cookie('refreshtoken',refreshtoken,{
                httpOnly: true,
                path:'/user/refresh_token',
                maxAge:7*24*60*60*1000,
            });
            res.json({accesstoken});

        } catch (error) {
            return res.status(500).json({msg: error.message});
        }
    },

    logout: async (req,res)=>{
        try {
            res.clearCookie('refreshtoken',{path:'/user/refresh_token'});
            return res.json({ msg:"Đăng xuất thành công"})

        } catch (error) {
            return res.status(500).json({msg: error.message});
        }
    },

    refreshToken: (req,res)=>{
        try {
            const rf_token = req.cookies.refreshtoken;
            if(!rf_token) return res.status(400).json({msg: "Vui lòng đăng nhập để tiếp tục!"});
            jwt.verify(rf_token,process.env.REFRESH_TOKEN_SECRET,(error,user)=>{
                if(error) return res.status(400).json({msg: "Vui lòng đăng nhập để tiếp tục!"});
                const accesstoken = createAccessToken({id:user.id}); 
                res.json({accesstoken});
            })
        } catch (error) {
            return res.status(500).json({msg: error.message});
        }
    },

    getUser: async(req,res)=>{
        try {
            const user = await Users.findById(req.user.id).select('-password');
            if(!user) return res.status(400).json({msg: "Người dùng không tồn tại"});
            res.json(user);

        } catch (error) {
            return res.status(500).json({msg: error.message});
        }
    },

    addCart : async(req,res)=>{
        try {
            const User = await Users.findById(req.user.id);
            if(!User) return res.status(400).json({msg:"Người dùng không tồn tại!"});

            await Users.findOneAndUpdate({_id:req.user.id},{
                cart: req.body.cart,
            })

            return res.status(200).json({msg:"Thêm vào giỏ hàng thành công! "})
        } catch (error) {
            return res.status(500).json({msg: error.message});
        }
    },
    history: async(req,res)=>{
        try {
            const history = await Payments.find({user_id:req.user.id});
            res.json(history);
        } catch (error) {
            return res.status(500).json({msg: error.message});
        }
    },

}


const createAccessToken = (user) =>{
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn:'11m'})
}
const createRefreshToken = (user) =>{
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {expiresIn:'7d'})
}

module.exports = userController;