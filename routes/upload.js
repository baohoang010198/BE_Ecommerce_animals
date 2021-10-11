const router = require('express').Router();
const cloudinary = require('cloudinary');
const auth = require('../middleware/auth');
const authAdmin = require('../middleware/authAdmin');
const fs = require('fs');


// config
cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET,
})
//Upload image
// router.post('/upload', auth, authAdmin, (req,res)=>{
router.post('/upload',(req,res)=>{
    try {
        if(!req.files || Object.keys(req.files).length===0)
            return res.status(200).json({
                data:[],
                success:false,
                message:'Không có tệp nào được tải',
                total:0,
            });

        const file = req.files.file;

        if(file.size>1024*1024){
            removeTmp(file.tempFilePath);
                return res.status(200).json({
                    data:[],
                    success:false,
                    message:'Ảnh quá lớn',
                    total:0,
                });
        }
        if(file.mimetype !=='image/jpeg' && file.mimetype !=='image/png'){
            removeTmp(file.tempFilePath);
                return res.status(200).json({
                    data:[],
                    success:false,
                    message:'Sai định dạng',
                    total:0,
                });
        }

        cloudinary.v2.uploader.upload(file.tempFilePath,{folder:"test"}, async(error,result)=>{
            if(error) throw error;
            removeTmp(file.tempFilePath);
            return res.status(200).json({
                data:{public_id:result.public_id,url:result.secure_url},
                success:true,
                message:'',
                total:0,
            });
        })
    } catch (error) {
        return res.status(500).json({
            data:[],
            success:false,
            message:'Lỗi hệ thống',
            total:0,
        });
    }
});

//Delete image
// router.post('/destroy', auth, authAdmin, (req,res)=>{
router.post('/destroy', (req,res)=>{
    const { public_id } = req.body;
    try {
        if(!public_id) return res.status(200).json({
            data:[],
            success:false,
            message:'Chưa chọn hình xoá',
            total:0,
        });
        cloudinary.v2.uploader.destroy(public_id, async(error,result)=>{
            if(error) throw error;
            return res.status(200).json({
                data:{public_id:"",url:""},
                success:true,
                message:'',
                total:0,
            });
        })
    } catch (error) {
        return res.status(500).json({
            data:[],
            success:false,
            message:'Lỗi hệ thống',
            total:0,
        });
    }
});

const removeTmp = (path)=>{
    fs.unlink(path,error=>{
        if(error) throw error;
    })
}

module.exports = router;