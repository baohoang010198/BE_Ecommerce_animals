const Advise = require('../models/adviseModel');
const adviseController = {
    searchAdvises: async (req,res) =>{  
        try {
            const { name,phoneNumber, page, limit} = req.body;
            const advise = await Advise
                .find({
                    name: {$regex: name, $options: 'i'},
                    phoneNumber: {$regex: phoneNumber, $options: 'i'}
                })
            const advisePaggination = await Advise
                .find({
                    name: {$regex: name, $options: 'i'},
                    phoneNumber: {$regex: phoneNumber, $options: 'i'}
                })
                .sort('status')
                .skip(((page*1||1)-1)*(limit*1 || 10))
                .limit(limit);
            res.status(200).json({
                data:advisePaggination,
                success:true,
                message:'',
                total:advise.length,
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
    createAdvise: async(req,res)=>{
        try {
            //only admin can create update delete category
            const { name, phoneNumber } = req.body;
            const newAdvise = new Advise({
                name,
                phoneNumber,
                status:0,
            });
            await newAdvise.save();
            res.status(200).json({
                data:[],
                success:true,
                message:'Gửi tư vấn thành công',
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
    updateAdvise: async(req,res)=>{
        try {
            const { status } = req.body;
            await Advise.findByIdAndUpdate({_id:req.params.id},{status});
            res.status(200).json({
                data:[],
                success:true,
                message:'Cập nhật trạng thái thành công',
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
    getAdvise: async(req,res)=>{
        try {
            const advise = await Advise.findById(req.params.id);
            if(!advise) return res.status(500).json({
                data:[],
                success:true,
                message:'Tư vấn không tồn tại',
                total:0,
            }); 
            res.status(200).json({
                data:advise,
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
}

module.exports = adviseController;