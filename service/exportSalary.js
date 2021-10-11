const excel = require('exceljs');
const formatService = require('./formatService');
const exportSalary= (arrData,total,dateExport)=>{
    let workbook = new excel.Workbook();
    let worksheet = workbook.addWorksheet('Bảng Lương Nhân Viên');
    worksheet.mergeCells('A1', 'H2');
    worksheet.getCell('A1','H2').value = `Bảng Lương`;
    worksheet.mergeCells('A3', 'H3');
    worksheet.getCell('A3','H3').value = dateExport.startDate?
    ` Từ:( ${formatService.formatDateV1(dateExport.startDate)} ) - Đến:( ${formatService.formatDateV1(dateExport.endDate)} )`
    :``;
    worksheet.mergeCells('A4', 'H4');
    worksheet.getCell('A4','H4').value = `Tổng lương nhân viên: ${formatService.formatVndMoney(total)}`;
    worksheet.getRow(5).values = [
        'Mã nhân viên',
        'Họ và tên',
        'Địa chỉ',
        'Số điện thoại',
        'Email',
        'Mức lương theo ngày',
        'Số ngày làm',
        'Tổng Lương'];
    worksheet.getRow(5).font = {
        name: 'Segoe UI Black',
        color: 'black',
        family: 1,
        size: 10,
        italic: true
        };
    worksheet.columns = [
        { key: 'employe_Id',width: 30},
        { key: 'name',width: 30},
        { key: 'adress',width: 50},
        { key: 'phoneNumber',width: 20},
        { key: 'email',width: 20},
        { key: 'wage',width: 20},
        { key: 'work_day',width: 20},
        { key: 'salary',width: 20}
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
    const path =`C:\\\Users\\Admin\\Downloads\\BangLuong_${Date.now()}.xlsx`;
    workbook.xlsx.writeFile(path);
}
module.exports = exportSalary;