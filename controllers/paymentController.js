const Payments = require('../models/paymentModel');
const Users = require('../models/userModel');
const exportPayment = require('../service/exportPayment');
const formatService = require('../service/formatService');
const paymentController = {
    searchPayments: async (req,res)=>{
        try {
            const { startDate, endDate, name, page, limit } = req.body;
            if(new Date(startDate)>new Date(endDate)) return res.status(200).json({
                data:[],
                success:false,
                message:'Ngày bắt đầu phải nhỏ hơn ngày kết thúc',
                total:0,
            });
            if(startDate){
                const filters = {
                    createdAt: {
                      $gte: new Date(startDate) ,
                      $lte: endDate? new Date(`${endDate} 23:59`): Date.now(),
                    },
                  };
                const payments = await Payments
                    .find({
                        name: {$regex: name, $options: 'i'}
                    })
                    .where(filters)
                    .sort('status')
                    .exec();
                const paymentsPaggination = await Payments
                    .find({
                        name: {$regex: name, $options: 'i'}
                    })
                    .where(filters)
                    .skip(((page*1||1)-1)*(limit*1 || 10))
                    .limit(limit)
                    .sort('status')
                    .exec();
                const sale = payments.reduce(function (a,b) { return a + b.total},0);
                res.status(200).json({
                    data:paymentsPaggination,
                    success:true,
                    message:'',
                    sale:sale,
                    total:payments.length,
                });
            }else{
                const payments = await Payments
                    .find({
                        name: {$regex: name, $options: 'i'}
                    })
                    .sort('status')
                    .exec();
                const paymentsPaggination = await Payments
                    .find({
                        name: {$regex: name, $options: 'i'}
                    })
                    .skip(((page*1||1)-1)*(limit*1 || 10))
                    .limit(limit||10)
                    .sort('status')
                    .exec();
                const sale = payments.reduce(function (a,b) { return a + b.total},0);
                res.status(200).json({
                    data:paymentsPaggination,
                    success:true,
                    message:'',
                    sale:sale,
                    total:payments.length,
                });
            }
        } catch (error) {
            return res.status(500).json({
                data:[],
                success:false,
                message:'Lỗi hệ thống',
                total:0,
            });;
        }
    },
    createPayment: async (req,res)=>{
        try {
            if(req.user.id.length !== 24) return res.status(200).json({
                data:[],
                success:true,
                message:'Người dùng không tồn tại!',
                total:0,
            });
            const user = await Users.findById(req.user.id).select('name email phoneNumber');
            if(!user) return res.status(200).json({
                data:[],
                success:true,
                message:'Người dùng không tồn tại!',
                total:0,
            });

            const { cart, address, total } = req.body
            const { _id, email} = user;
            const phoneNumber = req.body.phoneNumber? req.body.phoneNumber : user.phoneNumber;
            const name = req.body.name? req.body.name: user.name
            if(cart.length===0) return res.status(200).json({
                data:[],
                success:true,
                message:'Vui lòng chọn sản phẩm!',
                total:0,
            });
            const newPayment = new Payments({
                user_id:_id, name, email, cart, address, total, phoneNumber
            });

            await newPayment.save(); 

            res.status(200).json({
                data:[],
                success:true,
                message:'Thanh toán thành công',
                total:0,
            });
        } catch (error) {
            return res.status(500).json({
                data:[],
                success:false,
                message:'Thanh toán thất bại',
                total:0,
            });;
        }
    },
    updatePayment: async (req,res)=>{
        try {
            const {status, address, name, phoneNumber } =req.body;

            await Payments.findOneAndUpdate({_id:req.params.id},{
                status, address, name, phoneNumber
            });
            res.status(200).json({
                data:[],
                success:true,
                message:'Cập nhật thành công',
                total:0,
            });;
        } catch (error) {
           return res.status(500).json({
            data:[],
            success:false,
            message:'Cập nhật thất bại',
            total:0,
        });;
        }
    },
    getPayment: async(req,res)=>{
        try {
            const payment = await Payments.findById(req.params.id);
            if(!payment) return res.status(400).json({
                data:[],
                success:true,
                message:'Đơn hàng không tồn tại',
                total:0,
            });
            res.status(200).json({
                data:payment,
                success:true,
                message:'',
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
    deletePayment: async(req,res)=>{
        try {
            await Payments.findByIdAndDelete(req.params.id);
            res.status(200).json({
                data:[],
                success:true,
                message:'Xoá đơn hàng thành công',
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
    exportPayment: async (req,res)=>{
        try {
            const { startDate, endDate } = req.body;
            if(!startDate) return res.status(200).json({
                data:[],
                success:false,
                message:'Vui lòng chọn ngày bắt đầu ở mục tìm kiếm!',
                total:0,
            });
            if(new Date(startDate)>new Date(endDate)) return res.status(200).json({
                data:[],
                success:false,
                message:'Ngày bắt đầu phải nhỏ hơn ngày kết thúc',
                total:0,
            });
            const filters = startDate?{
                createdAt: {
                    $gte: new Date(startDate) ,
                    $lte: endDate? new Date(`${endDate} 23:59`): Date.now(),
                },
            }:{};
            const payments = await Payments
                    .find({})
                    .where(filters)         
                    .sort('status')
                    .exec();
            const paymentData= payments.map((item)=>{
                return {
                    status: item.status?(item.status==1?"Giao hàng":"Thành Công"):"Chờ duyệt",
                    total: formatService.formatVndMoney(item.total),
                    _id: item._id,
                    user_id: item.user_id,
                    name: item.name,
                    email: item.email,
                    address: item.address,
                    phoneNumber: item.phoneNumber,
                    createdAt: new Date(item.createdAt),
                }
            });

            const sale = payments.reduce(function (a,b) { return a + b.total},0); 
            const dateExport =startDate?{
                startDate: new Date(startDate) ,
                endDate: endDate? new Date(endDate): new Date (Date.now()),
            }:{
                startDate: "" ,
                endDate: "",
            }
            exportPayment(paymentData,sale,dateExport);
            res.status(200).json({
                data:[],
                success:true,
                message:"Export thành công! Vui lòng kiểm tra thư mục download",
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

module.exports = paymentController;