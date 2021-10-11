const jwt = require('jsonwebtoken');
const auth = (req,res,next)=>{
    try {
        const token = req.header("Authorization");
        if(!token)
            return res.status(200).json({
                data:[],
                success:false,
                message:'Invalid Authentication',
                total:0,
            });
        jwt.verify(token,process.env.ACCESS_TOKEN_SECRET, (error,user)=>{
        if(error)
            return res.status(200).json({
                data:[],
                success:false,
                message:'Invalid Authentication',
                total:0,
            });
        req.user = user;
        next();
        })
    } catch (error) {
        return res.status(500).json({
            data:[],
            success:false,
            message:'Lỗi hệ thống',
            total:0,
        });
    }
}

module.exports = auth;