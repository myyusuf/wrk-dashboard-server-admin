'use strict';

var Flow = require('nimble');
var XLSX = require('xlsx');

var NetProfitResult = require('./netprofit_result');

var getNumericExcelValue = function(ws, cellName){
  return ws[cellName] ? ws[cellName].v : 0;
}

var getStringExcelValue = function(ws, cellName){
  return ws[cellName] ? ws[cellName].v : "";
}

var getNetProfit = function(theWorksheet, col, startRow){

  var netProfit = {};
  var rkap = theWorksheet[col + startRow].v
  var raSdSaatIni = theWorksheet[col + (startRow + 1)].v;
  var riSaatIni = theWorksheet[col + (startRow + 2)].v;
  var prognosa = theWorksheet[col + (startRow + 3)].v;

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

var netProfitSubstract = function(a, b) {
  return {
    "rkap": a.rkap - b.rkap,
    "raSdSaatIni": a.raSdSaatIni - b.raSdSaatIni,
    "riSaatIni": a.riSaatIni - b.riSaatIni,
    "persenRiThdRa": a.persenRiThdRa - b.persenRiThdRa,
    "prognosa": a.prognosa - b.prognosa,
    "persenPrognosa": 0
  };
};

const idProyekHO = 'WGPUS001';

var result = {};

exports.readExcel = function (fileName, db, user, reply){

    var workbook = XLSX.readFile(fileName);

    var first_sheet_name = workbook.SheetNames[0];
    var worksheet = workbook.Sheets[first_sheet_name];

    const month = worksheet['B2'].v;
    const year = worksheet['C2'].v;

    result = NetProfitResult.netProfitResult;

    db.beginTransaction(function(err) {
      if (err) { throw err; };

        Flow.series([
            function (callback) {
              insertTotalKontrakDihadapi(workbook, db, year, month, callback);
            },
            function (callback) {
              insertTotalPenjualan(workbook, db, year, month, callback);
            },
            function (callback) {
              insertLabaKotor(workbook, db, year, month, callback);
            },
            function (callback) {
              insertPphFinal(workbook, db, year, month, callback);
            },
            function (callback) {
              insertLkPphFinal(workbook, db, year, month, callback);
            },
            function (callback) {
              insertHasilUsaha(workbook, db, year, month, callback);
            },
            function (callback) {
              insertLabaUsaha(workbook, db, year, month, callback);
            },
            function (callback) {
              insertNetProfit(db, year, month, callback);
            },
            function (callback) {
              insertSummaryNetProfit(db, year, month, callback);
            },
            function (callback) {
              insertPiutang(workbook, db, year, month, callback);
            },
            function (callback) {
              insertProjectProgress(user, db, year, month, callback);
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

  db.query('INSERT INTO project_progress SET ? ' +
  'ON DUPLICATE KEY ' +
  'UPDATE ? ', [projectProgress, projectProgress], function(err, result){
    if(err){
      callback(err);
    }else{
      callback();
    }
  });
}

var insertNetProfit = function(db, year, month, callback){

  var tb_net_profit = {
    id_proyek: idProyekHO,
    bulan: month,
    tahun: year,
    data: JSON.stringify(result)
  };

  db.query('INSERT INTO tb_net_profit SET ? ' +
  'ON DUPLICATE KEY ' +
  'UPDATE ? ',
  [tb_net_profit, tb_net_profit], function(err, result){
    if(err){
      console.log(err);
      callback(err);
    }else{
      callback();
    }
  });
}

var insertSumaryNetProfit = function(db, year, month, callback){

  var tb_net_profit = {
    id_proyek: idProyekHO,
    bulan: month,
    tahun: year,
    data: JSON.stringify(result)
  };

  db.query('INSERT INTO tb_net_profit SET ? ' +
  'ON DUPLICATE KEY ' +
  'UPDATE ? ',
  [tb_net_profit, tb_net_profit], function(err, result){
    if(err){
      console.log(err);
      callback(err);
    }else{
      callback();
    }
  });
}

var insertPiutang = function(workbook, db, year, month, callback){
  var first_sheet_name = workbook.SheetNames[1];
  var worksheet = workbook.Sheets[first_sheet_name];

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

var insertTotalKontrakDihadapi = function(workbook, db, year, month, callback){

  var first_sheet_name = workbook.SheetNames[0];
  var worksheet = workbook.Sheets[first_sheet_name];

  var eksternLalu = getNetProfit(worksheet, 'E', 10);
  var joLalu = getNetProfit(worksheet, 'E', 15);
  var internLalu = getNetProfit(worksheet, 'E', 20);

  var eksternBaru = getNetProfit(worksheet, 'E', 26);
  var joBaru = getNetProfit(worksheet, 'E', 31);
  var internBaru = getNetProfit(worksheet, 'E', 36);

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

  result.totalKontrakDihadapi['total'] = total;
  result.totalKontrakDihadapi['ekstern'] = ekstern;
  result.totalKontrakDihadapi['joKso'] = jo;
  result.totalKontrakDihadapi['intern'] = intern;

  result.sisaKontrakDihadapi['sisaKontrakPesananTahunLalu'] = totalLalu;
  result.sisaKontrakDihadapi['ekstern'] = eksternLalu;
  result.sisaKontrakDihadapi['joKso'] = joLalu;
  result.sisaKontrakDihadapi['intern'] = internLalu;

  result.pesananBaruKontrakDihadapi['kontrakPesananBaru'] = totalBaru;
  result.pesananBaruKontrakDihadapi['ekstern'] = eksternBaru;
  result.pesananBaruKontrakDihadapi['joKso'] = joBaru;
  result.pesananBaruKontrakDihadapi['intern'] = internBaru;

  callback();
}

var insertTotalPenjualan = function(workbook, db, year, month, callback){

  var first_sheet_name = workbook.SheetNames[0];
  var worksheet = workbook.Sheets[first_sheet_name];

  var eksternLalu = getNetProfit(worksheet, 'H', 10);
  var joLalu = getNetProfit(worksheet, 'H', 15);
  var internLalu = getNetProfit(worksheet, 'H', 20);

  var eksternBaru = getNetProfit(worksheet, 'H', 26);
  var joBaru = getNetProfit(worksheet, 'H', 31);
  var internBaru = getNetProfit(worksheet, 'H', 36);

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

  result.totalPenjualan['total'] = total;
  result.totalPenjualan['ekstern'] = ekstern;
  result.totalPenjualan['joKso'] = jo;
  result.totalPenjualan['intern'] = intern;

  result.penjualanLama['lama'] = totalLalu;
  result.penjualanLama['ekstern'] = eksternLalu;
  result.penjualanLama['joKso'] = joLalu;
  result.penjualanLama['intern'] = internLalu;

  result.penjualanBaru['baru'] = totalBaru;
  result.penjualanBaru['ekstern'] = eksternBaru;
  result.penjualanBaru['joKso'] = joBaru;
  result.penjualanBaru['intern'] = internBaru;

  callback();
}

var insertLabaKotor = function(workbook, db, year, month, callback){

  var first_sheet_name = workbook.SheetNames[0];
  var worksheet = workbook.Sheets[first_sheet_name];

  var eksternLalu = getNetProfit(worksheet, 'K', 10);
  var joLalu = getNetProfit(worksheet, 'K', 15);
  var internLalu = getNetProfit(worksheet, 'K', 20);

  var eksternBaru = getNetProfit(worksheet, 'K', 26);
  var joBaru = getNetProfit(worksheet, 'K', 31);
  var internBaru = getNetProfit(worksheet, 'K', 36);

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

  result.totalLabaKotor['total'] = total;
  result.totalLabaKotor['ekstern'] = ekstern;
  result.totalLabaKotor['joKso'] = jo;
  result.totalLabaKotor['intern'] = intern;

  result.labaKotorLama['lama'] = totalLalu;
  result.labaKotorLama['eksternIntern'] = eksternLalu;
  result.labaKotorLama['joKso'] = joLalu;
  result.labaKotorLama['intern'] = internLalu; //???

  result.labaKotorBaru['baru'] = totalBaru;
  result.labaKotorBaru['eksternIntern'] = eksternBaru;
  result.labaKotorBaru['joKso'] = joBaru;
  result.labaKotorBaru['intern'] = internBaru;

  callback();
}

var insertPphFinal = function(workbook, db, year, month, callback){

  var first_sheet_name = workbook.SheetNames[0];
  var worksheet = workbook.Sheets[first_sheet_name];

  var getPphFinal = function(obj){
    return {
      "rkap": obj.rkap * 0.03,
      "raSdSaatIni": obj.raSdSaatIni * 0.03,
      "riSaatIni": obj.riSaatIni * 0.03,
      "persenRiThdRa": obj.persenRiThdRa * 0.03,
      "prognosa": obj.prognosa * 0.03,
      "persenPrognosa": 0
    };
  }

  var eksternLalu = getPphFinal(result.penjualanLama.ekstern);
  var joLalu = getPphFinal(result.penjualanLama.joKso);
  var internLalu = getPphFinal(result.penjualanLama.intern);

  var eksternBaru = getPphFinal(result.penjualanBaru.ekstern);
  var joBaru = getPphFinal(result.penjualanBaru.joKso);
  var internBaru = getPphFinal(result.penjualanBaru.intern);

  var totalLaluArray = [eksternLalu, joLalu, internLalu];
  var totalLalu = totalLaluArray.reduce(netProfitAdder);

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

  result.totalPphFinal['total'] = total;
  result.totalPphFinal['ekstern'] = ekstern;
  result.totalPphFinal['joKso'] = jo;
  result.totalPphFinal['intern'] = intern;

  result.pphFinalLama['lama'] = totalLalu;
  result.pphFinalLama['eksternIntern'] = eksternLalu;
  result.pphFinalLama['joKso'] = joLalu;
  result.pphFinalLama['intern'] = internLalu;

  result.pphFinalBaru['baru'] = totalBaru;
  result.pphFinalBaru['eksternIntern'] = eksternBaru;
  result.pphFinalBaru['joKso'] = joBaru;
  result.pphFinalBaru['intern'] = internBaru;

  callback();
}

var insertLkPphFinal = function(workbook, db, year, month, callback){

  var first_sheet_name = workbook.SheetNames[0];
  var worksheet = workbook.Sheets[first_sheet_name];

  var eksternLalu = [result.penjualanLama.ekstern, result.pphFinalLama.eksternIntern].reduce(netProfitSubstract);
  var joLalu = [result.penjualanLama.joKso, result.pphFinalLama.joKso].reduce(netProfitSubstract);
  var internLalu = [result.penjualanLama.intern, result.pphFinalLama.intern].reduce(netProfitSubstract);

  var eksternBaru = [result.penjualanBaru.ekstern, result.pphFinalBaru.eksternIntern].reduce(netProfitSubstract);
  var joBaru = [result.penjualanBaru.joKso, result.pphFinalBaru.joKso].reduce(netProfitSubstract);
  var internBaru = [result.penjualanBaru.intern, result.pphFinalBaru.intern].reduce(netProfitSubstract);

  var totalLaluArray = [eksternLalu, joLalu, internLalu];
  var totalLalu = totalLaluArray.reduce(netProfitAdder);

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

  result.totalLabaKotorStlhPphFinal['total'] = total;
  result.totalLabaKotorStlhPphFinal['nonJoIntegratedEkstern'] = ekstern;
  result.totalLabaKotorStlhPphFinal['joKso'] = jo;
  result.totalLabaKotorStlhPphFinal['intern'] = intern;

  result.labaKotorStlhPphFinalLama['lama'] = totalLalu;
  result.labaKotorStlhPphFinalLama['eksternIntern'] = eksternLalu;
  result.labaKotorStlhPphFinalLama['joKso'] = joLalu;
  result.labaKotorStlhPphFinalLama['intern'] = internLalu;

  result.labaKotorStlhPphFinalBaru['baru'] = totalBaru;
  result.labaKotorStlhPphFinalBaru['eksternIntern'] = eksternBaru;
  result.labaKotorStlhPphFinalBaru['joKso'] = joBaru;
  result.labaKotorStlhPphFinalBaru['intern'] = internBaru;

  callback();
}

var insertHasilUsaha = function(workbook, db, year, month, callback){

  var first_sheet_name = workbook.SheetNames[0];
  var worksheet = workbook.Sheets[first_sheet_name];

  var biayaUsaha = getNetProfit(worksheet, 'T', 3);

  // netProfit['rkap'] = rkap;
  // netProfit['raSdSaatIni'] = raSdSaatIni;
  // netProfit['riSaatIni'] = riSaatIni;
  // netProfit['persenRiThdRa'] = rkap;
  // netProfit['prognosa'] = prognosa;
  // netProfit['persenPrognosa'] = persenPrognosa;

  // "rkap": 0,
  // "persenRkap": 0,
  // "raSdSaatIni": 0,
  // "persenRaSdSaatIni": 0,
  // "riSaatIni": 0,
  // "persenRiThdRa": 0,
  // "persenRiSaatIni": 0,
  // "prognosa": 0,
  // "persenPrognosa": 0,
  // "persentasePrognosa": 0

  result.biayaUsaha['biayaUsaha']['rkap'] = biayaUsaha.rkap;
  result.biayaUsaha['biayaUsaha']['raSdSaatIni'] = biayaUsaha.raSdSaatIni;
  result.biayaUsaha['biayaUsaha']['riSaatIni'] = biayaUsaha.riSaatIni;
  result.biayaUsaha['biayaUsaha']['persenRiThdRa'] = biayaUsaha.persenRiThdRa;
  result.biayaUsaha['biayaUsaha']['prognosa'] = biayaUsaha.prognosa;
  result.biayaUsaha['biayaUsaha']['persenPrognosa'] = biayaUsaha.persenPrognosa;

  callback();
}

var insertLabaUsaha = function(workbook, db, year, month, callback){

  var first_sheet_name = workbook.SheetNames[0];
  var worksheet = workbook.Sheets[first_sheet_name];

  var labaUsaha = [result.totalLabaKotorStlhPphFinal.total, result.biayaUsaha.biayaUsaha].reduce(netProfitAdder);

  var bunga = getNetProfit(worksheet, 'W', 9);
  var labaRugiLain = getNetProfit(worksheet, 'W', 15);

  var lsp = [labaUsaha, bunga, labaRugiLain].reduce(netProfitAdder);

  result.labaUsaha['labaUsaha']['rkap'] = labaUsaha.rkap;
  result.labaUsaha['labaUsaha']['raSdSaatIni'] = labaUsaha.raSdSaatIni;
  result.labaUsaha['labaUsaha']['riSaatIni'] = labaUsaha.riSaatIni;
  result.labaUsaha['labaUsaha']['persenRiThdRa'] = labaUsaha.persenRiThdRa;
  result.labaUsaha['labaUsaha']['prognosa'] = labaUsaha.prognosa;
  result.labaUsaha['labaUsaha']['persenPrognosa'] = labaUsaha.persenPrognosa;

  result.labaUsahaLspLabaRugiLain['labaRugiLain'] = labaRugiLain;
  result.labaUsahaLspLabaRugiLain['bunga'] = bunga;
  result.labaUsahaLspLabaRugiLain['lainLain'] = lsp;

  callback();
}
