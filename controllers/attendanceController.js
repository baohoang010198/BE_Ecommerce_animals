const Attendances = require('../models/attendanceModel');
const Employe = require('../models/employeModel');
const excel = require('exceljs');
const attendanceController = {
    getAttendances: async (req,res) =>{
        try {
            const { startDate, endDate, phoneNumber,page,limit } = req.body;
            const filters =startDate? {
              createdAt: {
                $gte: new Date(startDate) ,
                $lte: endDate? new Date(`${endDate} 23:59`): Date.now(),
              },
            }:{};
            const attendances = await Attendances
                .find({phoneNumber: {$regex: phoneNumber, $options: 'i'}})
                .where(filters);
                
            const attendancesPaggination = await Attendances
                .find({phoneNumber: {$regex: phoneNumber, $options: 'i'}})
                .where(filters)
                .skip(((page*1||1)-1)*(limit*1 || 10))
                .limit(limit||10);
            res.status(200).json({
                data: attendancesPaggination,
                success:true,
                message:'',
                total: attendances.length,
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
    createAttendance: async(req,res)=>{
        try {
            //only admin can create update delete category
            const { employe_Id } = req.body;
            if(employe_Id.length !== 24) return res.status(200).json({
                data:[],
                success:false,
                message:'Nhân viên không tồn tại',
                total:0,
            });;
            const employe = await Employe.findOne({_id:employe_Id});

            if(!employe) return res.status(200).json({
                data:[],
                success:false,
                message:'Nhân viên không tồn tại',
                total:0,
            });;
            const attendanceOfEmploye = await Attendances.find({employe_Id:employe_Id});
            if(attendanceOfEmploye.length===0){
                const { name, phoneNumber, wage }= employe;
                const newAttendance = new Attendances({ name, employe_Id, phoneNumber, wage });
                await newAttendance.save();
                return res.status(200).json({
                    data:[],
                    success:true,
                    message:'Điểm danh thành công',
                    total:0,
                });
            }
            const lastAttendanceOfEmploye = attendanceOfEmploye[attendanceOfEmploye.length -1];
            if(
                new Date(lastAttendanceOfEmploye.createdAt).getDate()=== new Date(Date.now()).getDate() &&
                new Date(lastAttendanceOfEmploye.createdAt).getMonth()=== new Date(Date.now()).getMonth() &&
                new Date(lastAttendanceOfEmploye.createdAt).getFullYear()=== new Date(Date.now()).getFullYear()
            ) return res.status(200).json({
                data:[],
                success: false,
                message:'Đã điểm danh',
                total:0,
            });
            const { name, phoneNumber, wage }= employe;
            const newAttendance = new Attendances({ name, employe_Id, phoneNumber, wage });
            await newAttendance.save();
            res.status(200).json({
                data:[],
                success:true,
                message:'Điểm danh thành công',
                total:0,
            });
        } catch (error) {
            return res.status(500).json({
                data:[],
                success:false,
                message:'Điểm danh thất bại do lỗi hệ thống',
                total:0,
            });
        }
    },

    deleteAttendance: async(req,res)=>{
        try {
            await Attendances.findByIdAndDelete(req.params.id);
            res.status(200).json({
                data:[],
                success:true,
                message:'Xoá điểm danh thành công',
                total:0,
            });
        } catch (error) {
            res.status(500).json({
                data:[],
                success:false,
                message:'Xoá điểm danh thất bại do lỗi hệ thống',
                total:0,
            });
        }
    },
}

module.exports = attendanceController;