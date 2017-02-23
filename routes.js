'use strict';

const ExcelReader = require('./handlers/excelreader');

module.exports = [{
    method: 'GET',
    path: '/convert',
    handler: ExcelReader.readExcel
}];
