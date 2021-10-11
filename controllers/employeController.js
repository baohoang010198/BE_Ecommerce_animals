const Employe = require('../models/employeModel');
const employeController = {
    getEmployes: async (req,res) =>{
        try {
            const { name, phoneNumber, page, limit} = req.body;
            const employes = await Employe
                .find({
                    name: {$regex: name, $options: 'i'},
                    phoneNumber:{$regex: phoneNumber, $options: 'i'},
                })
            const employesPaggination = await Employe
                .find({
                    name: {$regex: name, $options: 'i'},
                    phoneNumber:{$regex: phoneNumber, $options: 'i'},
                })
                .skip(((page*1||1)-1)*(limit*1 || 10))
                .limit(limit);
            res.status(200).json({
                data:employesPaggination,
                success:true,
                message:'',
                total:employes.length,
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
    getEmploye: async (req,res) =>{
        try {
            const employe = await Employe
                .findById({_id:req.params.id});
            if(!employe) return res.status(200).json({
                data:[],
                success:false,
                message:'Nhân viên không tồn tại',
                total:0,
            }); 
            res.status(200).json({
                data:employe,
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
    createEmploye: async(req,res)=>{
        try {
            //only admin can create update delete category
            const { name, adress, phoneNumber, email, wage} = req.body;
            const employeEmail = await Employe.findOne({email:email});
            const employePhoneNumber = await Employe.findOne({phoneNumber:phoneNumber});
            if(employeEmail) return res.status(200).json({
                data:[],
                success:false,
                message:'Email đã tổn tại',
                total:0,
            });
            if(employePhoneNumber) return res.status(200).json({
                data:[],
                success:false,
                message:'Số điện thoại đã tồn tại',
                total:0,
            });
            const newEmploy = new Employe({name, adress, phoneNumber, email, wage});
            await newEmploy.save();
            res.status(200).json({
                data:[],
                success:true,
                message:'Tạo nhân viên thành công',
                total:0,
            });
        } catch (error) {
            return res.status(500).json({
                data:[],
                success:false,
                message:'Tạo nhân viên thất bại lỗi hệ thống',
                total:0,
            });
        }
    },
    updateEmploye: async(req,res)=>{
        try {
            const { name, adress, phoneNumber, email, wage } = req.body;
            const employeEmail = await Employe.findOne({email:email});
            const employePhoneNumber = await Employe.findOne({phoneNumber:phoneNumber});
            if(employeEmail && employeEmail._id!= req.params.id) return res.status(200).json({
                data:[],
                success:false,
                message:'Email đã tổn tại',
                total:0,
            });
            if(employePhoneNumber && employePhoneNumber._id!= req.params.id) return res.status(200).json({
                data:[],
                success:false,
                message:'Số điện thoại đã tồn tại',
                total:0,
            });
            await Employe.findByIdAndUpdate({_id:req.params.id},{name, adress, phoneNumber, email, wage});
            res.status(200).json({
                data:[],
                success:true,
                message:'Cập nhật nhân viên thành công',
                total:0,
            });
        } catch (error) {
            return res.status(500).json({
                data:[],
                success:false,
                message:'Cập nhật thất bại lỗi hệ thống',
                total:0,
            });
        }
    },
    deleteEmploye: async(req,res)=>{
        try {
            await Employe.findByIdAndDelete(req.params.id);
            res.status(200).json({
                data:[],
                success:true,
                message:'Xoá nhân viên thành công',
                total:0,
            });
        } catch (error) {
            return res.status(500).json({
                data:[],
                success:false,
                message:'Xoá thất bại lỗi hệ thống',
                total:0,
            });
        }
    },
}

module.exports = employeController;