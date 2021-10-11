const Attendances = require('../models/attendanceModel');
const Employe = require('../models/employeModel');
const excel = require('exceljs');
const  exportSalary  = require('../service/exportSalary');
const formatService = require('../service/formatService');
const salaryController = {
    getSalarys: async (req,res) =>{
        try {
            const { startDate, endDate } = req.body;
            const filters = startDate?{
                createdAt: {
                    $gte: new Date(startDate) ,
                    $lte: endDate? new Date(`${endDate} 23:59`): Date.now(),
                },
            }:{};
            const employes = await Employe.find().select('name wage phoneNumber email adress');
            const attendances = await Attendances.find({}).where(filters);
            const salary= employes.map((employe)=>{
                const attendancesOfEmploye = attendances.filter(attendance => attendance.employe_Id==employe._id);
                return {
                    employe_Id:employe._id,
                    name:employe.name,
                    adress:employe.adress,
                    phoneNumber:employe.phoneNumber,
                    email:employe.email,
                    wage:employe.wage,
                    work_day: attendancesOfEmploye.length,
                    salary: employe.wage*attendancesOfEmploye.length,
                }
            });             
            res.status(200).json({
                data: salary,
                success:true,
                message:'',
                total: employes.length,
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
    exportSalary: async(req,res)=>{
        try {
            const { startDate, endDate } = req.body;
            if(!startDate) return res.status(200).json({
                data:[],
                success:false,
                message:'Vui lòng chọn ngày bắt đầu ',
                total:0,
            });
            const filters = startDate?{
                createdAt: {
                    $gte: new Date(startDate) ,
                    $lte: endDate? new Date(`${endDate} 23:59`): Date.now() ,
                },
            }:{};
            if(new Date(startDate)>new Date(endDate)) return res.status(200).json({
                data:[],
                success:false,
                message:'Ngày bắt đầu phải nhỏ hơn ngày kết thúc',
                total:0,
            });
            if(new Date(startDate)>Date.now()) return res.status(200).json({
                data:[],
                success:false,
                message:'Ngày bắt đầu phải nhỏ hơn ngày hiện tại',
                total:0,
            });
            const employes = await Employe.find().select('name wage phoneNumber email adress');
            const attendances = await Attendances.find({}).where(filters);
            const salary= employes.map((employe)=>{
                const attendancesOfEmploye = attendances.filter(attendance => attendance.employe_Id==employe._id);
                return {
                    employe_Id:employe._id,
                    name:employe.name,
                    adress:employe.adress,
                    phoneNumber:employe.phoneNumber,
                    email:employe.email,
                    wage:employe.wage,
                    work_day: attendancesOfEmploye.length,
                    salary: employe.wage*attendancesOfEmploye.length,
                }
            });
            const salaryData= salary.map((item)=>{
                return {
                    ...item,
                    wage: formatService.formatVndMoney(item.wage),
                    salary: formatService.formatVndMoney(item.salary)
                }
            });

            const totalSalary = salary.reduce(function (a,b) { return a + b.salary},0); 
            const dateExport =startDate?{
                startDate: new Date(startDate) ,
                endDate: endDate? new Date(endDate): new Date (Date.now()),
            }:{
                startDate: "" ,
                endDate: "",
            }
            exportSalary(salaryData,totalSalary,dateExport);
            res.status(200).json({
                data:[],
                success:true,
                message:"Export thành công thư mục download",
                total:0,
            });
        } catch (error) {
            res.status(500).json({
                data:[],
                success:false,
                message:'Lỗi hệ thống',
                total:0,
            });
        }
    },
}

module.exports = salaryController;