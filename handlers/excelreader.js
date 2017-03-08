'use strict';

var Flow = require('nimble');
var XLSX = require('xlsx');

exports.readExcel = function (fileName, db, user, reply){

    var workbook = XLSX.readFile(fileName);

    var first_sheet_name = workbook.SheetNames[0];
    var worksheet = workbook.Sheets[first_sheet_name];

    const month = worksheet['B2'].v;
    const year = worksheet['C2'].v;

    db.beginTransaction(function(err) {
      if (err) { throw err; };

        Flow.series([
            function (callback) {
              insertProjectProgress(user, db, year, month, callback);
            },
            function (callback) {
              insertTotalKontrakDihadapi(workbook, db, year, month, callback);
            },
            function (callback) {

              db.commit(function(err) {
                if (err) {
                  return db.rollback(function() {
                    callback(err);
                  });
                }
                reply({status: 'ok'});
              });

            }
        ], function(error){

          return db.rollback(function() {
            reply({status: 'error', message: error}).code(500);
          });

        });

    });
}

var insertProjectProgress = function(user, db, year, month, callback){
  var projectProgress = {
    year: year,
    month: month,
    username: user.username,
    key: user.scope[0],
    created_time: new Date()
  };

  db.query('INSERT INTO project_progress SET ?', projectProgress, function(err, result){
    if(err){
      callback(err);
    }else{
      callback();
    }
  });
}

var insertTotalKontrakDihadapi = function(workbook, db, year, month, callback){

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

  var data = JSON.stringify(result);

  // console.log(data);

  var db_mobile_total_kontrak_dihadapi = {
    id_proyek: 'WGPUS001',
    bulan: month,
    tahun: year,
    data: data
  };

  db.query('INSERT INTO db_mobile_total_kontrak_dihadapi SET ? ' +
  'ON DUPLICATE KEY ' +
  'UPDATE ? ',
  [db_mobile_total_kontrak_dihadapi, db_mobile_total_kontrak_dihadapi], function(err, result){
    if(err){
      console.log(err);
      callback(err);
    }else{
      callback();
    }
  });

}
