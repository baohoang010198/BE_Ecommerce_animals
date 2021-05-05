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
router.post('/upload', auth, authAdmin, (req,res)=>{
    try {
        if(!req.files || Object.keys(req.files).length===0)
            return res.status(400).json({msg:'Không có tệp nào được tải!'});

        const file = req.files.file;
        if(file.size>1024*1024){
            removeTmp(file.tempFilePath);
            return res.status(400).json({msg: 'Ảnh quá lớn !'});
        }
        if(file.mimetype !=='image/jpeg' && file.mimetype !=='image/png'){
            removeTmp(file.tempFilePath);
            return res.status(400).json({msg: 'Sai định dạng!'});
        }
        
        cloudinary.v2.uploader.upload(file.tempFilePath,{folder:"test"}, async(error,result)=>{
            if(error) throw error;
            removeTmp(file.tempFilePath);
            res.json({public_id:result.public_id,url:result.secure_url});
        })
    } catch (error) {
       return res.status(500).json({msg:error.message});
    }
});

//Delete image
router.post('/destroy', auth, authAdmin, (req,res)=>{
    const { public_id } = req.body;
    try {
        if(!public_id) return res.status(400).json({msg:'Chưa chọn hình xoá'});
        cloudinary.v2.uploader.destroy(public_id, async(error,result)=>{
            if(error) throw error;

            res.json({msg:'Xoá thành công'});
        })
    } catch (error) {
        return res.status(500).json({msg:error.message});
    }
});

const removeTmp = (path)=>{
    fs.unlink(path,error=>{
        if(error) throw error;
    })
}

module.exports = router;