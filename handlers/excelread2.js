'use strict';

var Excel = require('exceljs');

exports.readExcel = function (request, reply) {

    const fileName = '/Users/myyusuf/Documents/Projects/wika_rekon/dashboard/documents/fix/Template_HO.xlsx';

    console.log('Converting', fileName);

    var workbook = new Excel.Workbook();
    workbook.xlsx.readFile(fileName).then(function() {
        console.log('test : ', test);

        var worksheet = workbook.getWorksheet('Hasil Usaha');
        var value = row.getCell('B1').value;
        console.log('value : ', value);
    });

    reply('Convert');
};
