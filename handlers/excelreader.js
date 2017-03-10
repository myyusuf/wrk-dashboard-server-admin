'use strict';

var Flow = require('nimble');
var XLSX = require('xlsx');

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

var penjualan = {};
var pphFinal = {};
var labaKotor = {};

const idProyekHO = 'WGPUS001';

exports.readExcel = function (fileName, db, user, reply){

    var workbook = XLSX.readFile(fileName);

    var first_sheet_name = workbook.SheetNames[0];
    var worksheet = workbook.Sheets[first_sheet_name];

    const month = worksheet['B2'].v;
    const year = worksheet['C2'].v;

    penjualan = {};

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
      id_proyek: idProyekHO,
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
      id_proyek: idProyekHO,
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
      id_proyek: idProyekHO,
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

  var result1 = {
    "totalPenjualan": {}
  };

  var result2 = {
    "penjualanLama": {}
  };

  var result3 = {
    "penjualanBaru": {}
  };

  result1.totalPenjualan['total'] = total;
  result1.totalPenjualan['ekstern'] = ekstern;
  result1.totalPenjualan['joKso'] = jo;
  result1.totalPenjualan['intern'] = intern;

  result2.penjualanLama['lama'] = totalLalu;
  result2.penjualanLama['ekstern'] = eksternLalu;
  result2.penjualanLama['joKso'] = joLalu;
  result2.penjualanLama['intern'] = internLalu;

  result3.penjualanBaru['baru'] = totalBaru;
  result3.penjualanBaru['ekstern'] = eksternBaru;
  result3.penjualanBaru['joKso'] = joBaru;
  result3.penjualanBaru['intern'] = internBaru;

  var data1 = JSON.stringify(result1);
  var data2 = JSON.stringify(result2);
  var data3 = JSON.stringify(result3);

  penjualan = {
    totalPenjualan: result1.totalPenjualan,
    penjualanLama: result2.penjualanLama,
    penjualanBaru: result3.penjualanBaru
  }

  var parallelFunctionList = [];

  var parallelFunction = function(parallelCallback){
    var db_mobile_total_penjualan = {
      id_proyek: idProyekHO,
      bulan: month,
      tahun: year,
      data: data1
    };

    db.query('INSERT INTO db_mobile_total_penjualan SET ? ' +
    'ON DUPLICATE KEY ' +
    'UPDATE ? ',
    [db_mobile_total_penjualan, db_mobile_total_penjualan], function(err, result){
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
    var db_mobile_penjualan_lama = {
      id_proyek: idProyekHO,
      bulan: month,
      tahun: year,
      data: data2
    };

    db.query('INSERT INTO db_mobile_penjualan_lama SET ? ' +
    'ON DUPLICATE KEY ' +
    'UPDATE ? ',
    [db_mobile_penjualan_lama, db_mobile_penjualan_lama], function(err, result){
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
    var db_mobile_penjualan_baru = {
      id_proyek: idProyekHO,
      bulan: month,
      tahun: year,
      data: data3
    };

    db.query('INSERT INTO db_mobile_penjualan_baru SET ? ' +
    'ON DUPLICATE KEY ' +
    'UPDATE ? ',
    [db_mobile_penjualan_baru, db_mobile_penjualan_baru], function(err, result){
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

  var result1 = {
    "totalLabaKotor": {}
  };

  var result2 = {
    "labaKotorLama": {}
  };

  var result3 = {
    "labaKotorBaru": {}
  };

  result1.totalLabaKotor['total'] = total;
  result1.totalLabaKotor['ekstern'] = ekstern;
  result1.totalLabaKotor['joKso'] = jo;
  result1.totalLabaKotor['intern'] = intern;

  result2.labaKotorLama['lama'] = totalLalu;
  result2.labaKotorLama['eksternIntern'] = eksternLalu;
  result2.labaKotorLama['joKso'] = joLalu;
  result2.labaKotorLama['intern'] = internLalu; //???

  result3.labaKotorBaru['baru'] = totalBaru;
  result3.labaKotorBaru['eksternIntern'] = eksternBaru;
  result3.labaKotorBaru['joKso'] = joBaru;
  result3.labaKotorBaru['intern'] = internBaru;

  var data1 = JSON.stringify(result1);
  var data2 = JSON.stringify(result2);
  var data3 = JSON.stringify(result3);

  labaKotor = {
    totalLabaKotor: result1.totalLabaKotor,
    labaKotorLama: result2.labaKotorLama,
    labaKotorBaru: result3.labaKotorBaru
  }

  var parallelFunctionList = [];

  var parallelFunction = function(parallelCallback){
    var db_mobile_total_laba_kotor = {
      id_proyek: idProyekHO,
      bulan: month,
      tahun: year,
      data: data1
    };

    db.query('INSERT INTO db_mobile_total_laba_kotor SET ? ' +
    'ON DUPLICATE KEY ' +
    'UPDATE ? ',
    [db_mobile_total_laba_kotor, db_mobile_total_laba_kotor], function(err, result){
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
    var db_mobile_laba_kotor_lama = {
      id_proyek: idProyekHO,
      bulan: month,
      tahun: year,
      data: data2
    };

    db.query('INSERT INTO db_mobile_laba_kotor_lama SET ? ' +
    'ON DUPLICATE KEY ' +
    'UPDATE ? ',
    [db_mobile_laba_kotor_lama, db_mobile_laba_kotor_lama], function(err, result){
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
    var db_mobile_laba_kotor_baru = {
      id_proyek: idProyekHO,
      bulan: month,
      tahun: year,
      data: data3
    };

    db.query('INSERT INTO db_mobile_laba_kotor_baru SET ? ' +
    'ON DUPLICATE KEY ' +
    'UPDATE ? ',
    [db_mobile_laba_kotor_baru, db_mobile_laba_kotor_baru], function(err, result){
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

  var eksternLalu = getPphFinal(penjualan.penjualanLama.ekstern);
  var joLalu = getPphFinal(penjualan.penjualanLama.joKso);
  var internLalu = getPphFinal(penjualan.penjualanLama.intern);

  var eksternBaru = getPphFinal(penjualan.penjualanBaru.ekstern);
  var joBaru = getPphFinal(penjualan.penjualanBaru.joKso);
  var internBaru = getPphFinal(penjualan.penjualanBaru.intern);

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

  var result1 = {
    "totalPphFinal": {}
  };

  var result2 = {
    "pphFinalLama": {}
  };

  var result3 = {
    "pphFinalBaru": {}
  };

  result1.totalPphFinal['total'] = total;
  result1.totalPphFinal['ekstern'] = ekstern;
  result1.totalPphFinal['joKso'] = jo;
  result1.totalPphFinal['intern'] = intern;

  result2.pphFinalLama['lama'] = totalLalu;
  result2.pphFinalLama['eksternIntern'] = eksternLalu;
  result2.pphFinalLama['joKso'] = joLalu;
  result2.pphFinalLama['intern'] = internLalu;

  result3.pphFinalBaru['baru'] = totalBaru;
  result3.pphFinalBaru['eksternIntern'] = eksternBaru;
  result3.pphFinalBaru['joKso'] = joBaru;
  result3.pphFinalBaru['intern'] = internBaru;

  var data1 = JSON.stringify(result1);
  var data2 = JSON.stringify(result2);
  var data3 = JSON.stringify(result3);

  pphFinal = {
    totalPphFinal: result1.totalPphFinal,
    pphFinalLama: result2.pphFinalLama,
    pphFinalBaru: result3.pphFinalBaru
  }

  var parallelFunctionList = [];

  var parallelFunction = function(parallelCallback){
    var db_mobile_total_pph_final = {
      id_proyek: idProyekHO,
      bulan: month,
      tahun: year,
      data: data1
    };

    db.query('INSERT INTO db_mobile_total_pph_final SET ? ' +
    'ON DUPLICATE KEY ' +
    'UPDATE ? ',
    [db_mobile_total_pph_final, db_mobile_total_pph_final], function(err, result){
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
    var db_mobile_pph_final_lama = {
      id_proyek: idProyekHO,
      bulan: month,
      tahun: year,
      data: data2
    };

    db.query('INSERT INTO db_mobile_pph_final_lama SET ? ' +
    'ON DUPLICATE KEY ' +
    'UPDATE ? ',
    [db_mobile_pph_final_lama, db_mobile_pph_final_lama], function(err, result){
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
    var db_mobile_pph_final_baru = {
      id_proyek: idProyekHO,
      bulan: month,
      tahun: year,
      data: data3
    };

    db.query('INSERT INTO db_mobile_pph_final_baru SET ? ' +
    'ON DUPLICATE KEY ' +
    'UPDATE ? ',
    [db_mobile_pph_final_baru, db_mobile_pph_final_baru], function(err, result){
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

var insertLkPphFinal = function(workbook, db, year, month, callback){

  var first_sheet_name = workbook.SheetNames[0];
  var worksheet = workbook.Sheets[first_sheet_name];

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

  var eksternLalu = [penjualan.penjualanLama.ekstern, pphFinal.pphFinalLama.eksternIntern].reduce(netProfitSubstract);
  var joLalu = [penjualan.penjualanLama.joKso, pphFinal.pphFinalLama.joKso].reduce(netProfitSubstract);
  var internLalu = [penjualan.penjualanLama.intern, pphFinal.pphFinalLama.joKso.intern].reduce(netProfitSubstract);

  var eksternBaru = [penjualan.penjualanBaru.ekstern, pphFinal.pphFinalBaru.eksternIntern].reduce(netProfitSubstract);
  var joBaru = [penjualan.penjualanBaru.joKso, pphFinal.pphFinalBaru.joKso].reduce(netProfitSubstract);
  var internBaru = [penjualan.penjualanBaru.intern, pphFinal.pphFinalBaru.intern].reduce(netProfitSubstract);

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

  var result1 = {
    "totalLabaKotorStlhPphFinal": {}
  };

  var result2 = {
    "labaKotorStlhPphFinalLama": {}
  };

  var result3 = {
    "labaKotorStlhPphFinalBaru": {}
  };

  result1.totalLabaKotorStlhPphFinal['total'] = total;
  result1.totalLabaKotorStlhPphFinal['nonJoIntegratedEkstern'] = ekstern;
  result1.totalLabaKotorStlhPphFinal['joKso'] = jo;
  result1.totalLabaKotorStlhPphFinal['intern'] = intern;

  result2.labaKotorStlhPphFinalLama['lama'] = totalLalu;
  result2.labaKotorStlhPphFinalLama['eksternIntern'] = eksternLalu;
  result2.labaKotorStlhPphFinalLama['joKso'] = joLalu;
  result2.labaKotorStlhPphFinalLama['intern'] = internLalu;

  result3.labaKotorStlhPphFinalBaru['baru'] = totalBaru;
  result3.labaKotorStlhPphFinalBaru['eksternIntern'] = eksternBaru;
  result3.labaKotorStlhPphFinalBaru['joKso'] = joBaru;
  result3.labaKotorStlhPphFinalBaru['intern'] = internBaru;

  var data1 = JSON.stringify(result1);
  var data2 = JSON.stringify(result2);
  var data3 = JSON.stringify(result3);

  var parallelFunctionList = [];

  var parallelFunction = function(parallelCallback){
    var db_mobile_total_laba_kotor_stlh_pph_final = {
      id_proyek: idProyekHO,
      bulan: month,
      tahun: year,
      data: data1
    };

    db.query('INSERT INTO db_mobile_total_laba_kotor_stlh_pph_final SET ? ' +
    'ON DUPLICATE KEY ' +
    'UPDATE ? ',
    [db_mobile_total_laba_kotor_stlh_pph_final, db_mobile_total_laba_kotor_stlh_pph_final], function(err, result){
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
    var db_mobile_laba_kotor_stlh_pph_final_lama = {
      id_proyek: idProyekHO,
      bulan: month,
      tahun: year,
      data: data2
    };

    db.query('INSERT INTO db_mobile_laba_kotor_stlh_pph_final_lama SET ? ' +
    'ON DUPLICATE KEY ' +
    'UPDATE ? ',
    [db_mobile_laba_kotor_stlh_pph_final_lama, db_mobile_laba_kotor_stlh_pph_final_lama], function(err, result){
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
    var db_mobile_laba_kotor_stlh_pph_final_baru = {
      id_proyek: idProyekHO,
      bulan: month,
      tahun: year,
      data: data3
    };

    db.query('INSERT INTO db_mobile_laba_kotor_stlh_pph_final_baru SET ? ' +
    'ON DUPLICATE KEY ' +
    'UPDATE ? ',
    [db_mobile_laba_kotor_stlh_pph_final_baru, db_mobile_laba_kotor_stlh_pph_final_baru], function(err, result){
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
