'use strict';

var XLSX = require('xlsx');

exports.readExcelHO = function (fileName, db, user, reply){

    var workbook = XLSX.readFile(fileName);

    var first_sheet_name = workbook.SheetNames[0];
    var worksheet = workbook.Sheets[first_sheet_name];

    var getNetProfit = function(theWorksheet, col, startRow){

      var netProfit = {};
      var rkap = worksheet[col + startRow].v
      var raSdSaatIni = worksheet[col + (startRow + 1)].v;
      var riSaatIni = worksheet[col + (startRow + 2)].v;
      var prognosa = worksheet[col + (startRow + 3)].v;

      var persenRiThdRa = (raSdSaatIni / riSaatIni) * 100;
      var persenPrognosa = 100;

      netProfit['rkap'] = rkap;
      netProfit['raSdSaatIni'] = raSdSaatIni;
      netProfit['riSaatIni'] = riSaatIni;
      netProfit['persenRiThdRa'] = rkap;
      netProfit['prognosa'] = prognosa;
      netProfit['persenPrognosa'] = persenPrognosa;

      return netProfit;
    }

    var result = {
      "totalKontrakDihadapi": {
        "total": {
          "rkap": 0,
          "raSdSaatIni": 0,
          "riSaatIni": 0,
          "persenRiThdRa": 0,
          "prognosa": 0,
          "persenPrognosa": 0
        },
        "ekstern": {
          "rkap": 0,
          "raSdSaatIni": 0,
          "riSaatIni": 0,
          "persenRiThdRa": 0,
          "prognosa": 0,
          "persenPrognosa": 0
        },
        "joKso": {
          "rkap": 0,
          "raSdSaatIni": 0,
          "riSaatIni": 0,
          "persenRiThdRa": 0,
          "prognosa": 0,
          "persenPrognosa": 0
        },
        "intern": {
          "rkap": 0,
          "raSdSaatIni": 0,
          "riSaatIni": 0,
          "persenRiThdRa": 0,
          "prognosa": 0,
          "persenPrognosa": 0
        }
      }
    };

    const month = worksheet['B2'].v
    const year = worksheet['C2'].v

    result.totalKontrakDihadapi.total = getNetProfit(worksheet, 'E', 4);
    result.totalKontrakDihadapi.ekstern = getNetProfit(worksheet, 'E', 10);

    console.log(JSON.stringify(result));

    var projectProgress = {
      year: year,
      month: month,
      username: user.username,
      key: user.scope[0],
      created_time: new Date()
    };

    db.query('INSERT INTO project_progress SET ?', projectProgress, function(err, result){
      if(err){
        console.log(err);
        reply('Error while doing operation, Ex. non unique value').code(500);
      }else{
        reply({ status: 'ok' });
      }
    });

};
