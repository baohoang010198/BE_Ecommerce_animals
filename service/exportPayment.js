const excel = require('exceljs');
const formatService = require('./formatService');
const exportPayment= (arrData,sale,dateExport)=>{
    let workbook = new excel.Workbook();
    let worksheet = workbook.addWorksheet('Bảng doanh thu');
    worksheet.mergeCells('A1', 'I2');
    worksheet.getCell('A1','I2').value = `Doanh thu`;
    worksheet.mergeCells('A3', 'I3');
    worksheet.getCell('A3','I3').value = dateExport.startDate?
    ` Từ:( ${formatService.formatDateV1(dateExport.startDate)} ) - Đến:( ${formatService.formatDateV1(dateExport.endDate)} )`
    :``;
    worksheet.mergeCells('A4', 'I4');
    worksheet.getCell('A4','I4').value = `Tổng doanh thu: ${formatService.formatVndMoney(sale)}`;
    worksheet.getRow(5).values = [
        'Mã giao dịch',
        'Mã khách hàng',
        'Họ và tên',
        'Email',
        'Địa chỉ',
        'Số điện thoại',
        'Trạng thái',
        'Ngày đặt',
        'Thanh toán'
    ];
    worksheet.getRow(5).font = {
        name: 'Segoe UI Black',
        color: 'black',
        family: 1,
        size: 10,
        italic: true
        };
    worksheet.columns = [
        { key: '_id',width: 30},
        { key: 'user_id',width: 30},
        { key: 'name',width: 30},
        { key: 'email',width: 20},
        { key: 'address',width: 40},
        { key: 'phoneNumber',width: 15},
        { key: 'status',width: 15},
        { key: 'createdAt',width: 15},
        { key: 'total',width: 15}
    ]
    worksheet.eachRow(function (row, rowNumber) {

        row.eachCell((cell, colNumber) => {
            if(rowNumber<3){
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: '4F81BD' }
                }
                cell.font = {
                    name: 'Segoe UI Black',
                    color: 'black',
                    family: 2,
                    size: 14,
                    italic: true
                };
            }
        if(rowNumber==3){
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: '4F81BD' }
                }
                cell.font = {
                    name: 'Segoe UI Black',
                    color: 'black',
                    family: 2,
                    size: 10,
                    italic: true
                };
            }
        if(rowNumber==4){
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FC3210' }
                }
                cell.font = {
                    name: 'Segoe UI Black',
                    color: 'black',
                    family: 1,
                    size: 10,
                    italic: true
                };
            }
            if (rowNumber == 5) {
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'f5b914' }
                }
            }
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        })
        row.commit();
    });
    worksheet.addRows(arrData);
    const path =`C:\\\Users\\Admin\\Downloads\\DoanhThu_${Date.now()}.xlsx`;
    workbook.xlsx.writeFile(path);
}
module.exports = exportPayment;