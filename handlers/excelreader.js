'use strict';

var XLSX = require('xlsx');

exports.readExcel = function (request, reply) {

    const fileName = '/Users/myyusuf/Documents/Projects/wika_rekon/dashboard/documents/fix/Template_HO.xlsx';

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

    result.totalKontrakDihadapi.total = getNetProfit(worksheet, 'E', 4);
    result.totalKontrakDihadapi.ekstern = getNetProfit(worksheet, 'E', 10);

    reply(result);
};
