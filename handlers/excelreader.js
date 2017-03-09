'use strict';

var Flow = require('nimble');
var XLSX = require('xlsx');

var getNumericExcelValue = function(ws, cellName){
  return ws[cellName] ? ws[cellName].v : 0;
}

var getStringExcelValue = function(ws, cellName){
  return ws[cellName] ? ws[cellName].v : "";
}

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
              insertPiutang(workbook, db, year, month, callback);
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

  var eksternLalu = getNetProfit(worksheet, 'E', 10);
  var joLalu = getNetProfit(worksheet, 'E', 15);
  var internLalu = getNetProfit(worksheet, 'E', 20);

  var eksternBaru = getNetProfit(worksheet, 'E', 26);
  var joBaru = getNetProfit(worksheet, 'E', 31);
  var internBaru = getNetProfit(worksheet, 'E', 36);

  var netProfitAdder = function(a, b) {
    return {
      "rkap": a.rkap + b.rkap,
      "raSdSaatIni": a.raSdSaatIni + b.raSdSaatIni,
      "riSaatIni": a.riSaatIni + b.riSaatIni,
      "persenRiThdRa": a.persenRiThdRa + b.persenRiThdRa,
      "prognosa": a.prognosa + b.prognosa,
      "persenPrognosa": 0
    };
  };

  var totalLaluArray = [eksternLalu, joLalu, internLalu];
  var totalLalu= totalLaluArray.reduce(netProfitAdder);

  var totalBaruArray = [eksternBaru, joBaru, internBaru];
  var totalBaru = totalBaruArray.reduce(netProfitAdder);

  var totalArray = [totalLalu, totalBaru];
  var total = totalArray.reduce(netProfitAdder);

  var eksternArray = [eksternLalu, eksternBaru];
  var ekstern = eksternArray.reduce(netProfitAdder);

  var joArray = [joLalu, joBaru];
  var jo = joArray.reduce(netProfitAdder);

  var internArray = [internLalu, internBaru];
  var intern = internArray.reduce(netProfitAdder);

  var result1 = {
    "totalKontrakDihadapi": {}
  };

  var result2 = {
    "sisaKontrakDihadapi": {}
  };

  var result3 = {
    "pesananBaruKontrakDihadapi": {}
  };

  result1.totalKontrakDihadapi['total'] = total;
  result1.totalKontrakDihadapi['ekstern'] = ekstern;
  result1.totalKontrakDihadapi['joKso'] = jo;
  result1.totalKontrakDihadapi['intern'] = intern;

  result2.sisaKontrakDihadapi['sisaKontrakPesananTahunLalu'] = totalLalu;
  result2.sisaKontrakDihadapi['ekstern'] = eksternLalu;
  result2.sisaKontrakDihadapi['joKso'] = joLalu;
  result2.sisaKontrakDihadapi['intern'] = internLalu;

  result3.pesananBaruKontrakDihadapi['kontrakPesananBaru'] = totalBaru;
  result3.pesananBaruKontrakDihadapi['ekstern'] = eksternBaru;
  result3.pesananBaruKontrakDihadapi['joKso'] = joBaru;
  result3.pesananBaruKontrakDihadapi['intern'] = internBaru;

  var data1 = JSON.stringify(result1);
  var data2 = JSON.stringify(result2);
  var data3 = JSON.stringify(result3);

  var parallelFunctionList = [];

  var parallelFunction = function(parallelCallback){
    var db_mobile_total_kontrak_dihadapi = {
      id_proyek: 'WGPUS001',
      bulan: month,
      tahun: year,
      data: data1
    };

    db.query('INSERT INTO db_mobile_total_kontrak_dihadapi SET ? ' +
    'ON DUPLICATE KEY ' +
    'UPDATE ? ',
    [db_mobile_total_kontrak_dihadapi, db_mobile_total_kontrak_dihadapi], function(err, result){
      if(err){
        console.log(err);
        parallelCallback(err);
      }else{
        parallelCallback();
      }
    });
  }
  parallelFunctionList.push(parallelFunction);

  parallelFunction = function(parallelCallback){
    var db_mobile_sisa_kontrak_dihadapi = {
      id_proyek: 'WGPUS001',
      bulan: month,
      tahun: year,
      data: data2
    };

    db.query('INSERT INTO db_mobile_sisa_kontrak_dihadapi SET ? ' +
    'ON DUPLICATE KEY ' +
    'UPDATE ? ',
    [db_mobile_sisa_kontrak_dihadapi, db_mobile_sisa_kontrak_dihadapi], function(err, result){
      if(err){
        console.log(err);
        parallelCallback(err);
      }else{
        parallelCallback();
      }
    });
  }
  parallelFunctionList.push(parallelFunction);

  parallelFunction = function(parallelCallback){
    var db_mobile_pesanan_baru_kontrak_dihadapi = {
      id_proyek: 'WGPUS001',
      bulan: month,
      tahun: year,
      data: data3
    };

    db.query('INSERT INTO db_mobile_pesanan_baru_kontrak_dihadapi SET ? ' +
    'ON DUPLICATE KEY ' +
    'UPDATE ? ',
    [db_mobile_pesanan_baru_kontrak_dihadapi, db_mobile_pesanan_baru_kontrak_dihadapi], function(err, result){
      if(err){
        console.log(err);
        parallelCallback(err);
      }else{
        parallelCallback();
      }
    });
  }
  parallelFunctionList.push(parallelFunction);

  Flow.parallel(parallelFunctionList, function(){
      callback();
    },
    function(error){
      return db.rollback(function() {
        callback(error);
      });
    }
  );

}

var insertPiutang = function(workbook, db, year, month, callback){
  var first_sheet_name = workbook.SheetNames[1];
  var worksheet = workbook.Sheets[first_sheet_name];

  // laporan_keuangan

  var piutangList = [];

  for(var i=2; i<=13; i++){
    var valueCellName1 = "B" + i;
    var valueCellName2 = "C" + i;

    var obj = {
      bulan: i-1,
      tahun: year,
      piutang_usaha: getNumericExcelValue(worksheet, valueCellName1),
      tagihan_brutto: getNumericExcelValue(worksheet, valueCellName2)
    };

    piutangList.push(obj);
  }

  var parallelFunctionList = [];

  for(var j=0; j<piutangList.length; j++){

    //---Closure
    (function f() {

      var laporan_keuangan = piutangList[j];

      var parallelFunction = function(parallelCallback){

        db.query('INSERT INTO laporan_keuangan SET ? ' +
        'ON DUPLICATE KEY ' +
        'UPDATE ? ',
        [laporan_keuangan, laporan_keuangan], function(err, result){
          if(err){
            console.log(err);
            parallelCallback(err);
          }else{
            parallelCallback();
          }
        });

      }
      parallelFunctionList.push(parallelFunction);
    })();
    //----------
  }

  Flow.parallel(parallelFunctionList, function(){
      callback();
    },
    function(error){
      return db.rollback(function() {
        callback(error);
      });
    }
  );
}
