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
              insertProjectInfoKonsFab(workbook, db, year, month, callback);
            },
            function (callback) {
              insertQmsl(workbook, db, year, month, callback);
            },
            function (callback) {
              insertSheLevel(workbook, db, year, month, callback);
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
          console.log(error);
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

var insertProjectInfoKonsFab = function(workbook, db, year, month, callback){

  var sheet_name = workbook.SheetNames[4];
  var worksheet = workbook.Sheets[sheet_name];

  var result = {
  	"infoProyek" : {
  		"alamatProyek" : "",
  		"bad" : 0,
  		"bast" : [],
  		"cashFlow" : 0,
  		"divisi" : "",
  		"idProyek" : "",
  		"labaKotor" : {
  			"ra" : 0,
  			"ri" : 0,
  			"st" : 0
  		},
  		"limaR" : 0,
  		"lokasiFotoProyek" : [],
  		"namaProyek" : "",
  		"nilaiRisikoEkstrim" : 0,
  		"pdp" : 0,
  		"persediaan" : 0,
  		"persenRaProgress" : 0,
  		"persenRiProgress" : 0,
  		"persenRiThdRaProgress" : 0,
  		"piutangRetensi" : 0,
  		"piutangUsaha" : {
  			"rp31Sd90" : 0,
  			"rpKurangDari30" : 0,
  			"rpLebihDari90" : 0,
  			"rpPiutangUsaha" : 0,
  			"salahBuku" : 0
  		},
  		"qmsl" : 0,
  		"rpDeviasi" : 0,
  		"rpLabaBersih" : {
  			"ra" : 0,
  			"ri" : 0
  		},
  		"rpOk" : 0,
  		"rpRaProgress" : 0,
  		"rpRiProgress" : 0,
  		"sheLevel" : 0,
  		"tagihanBrutto" : 0,
  		"tglMulaiProyek" : "",
  		"tglSelesaiProyek" : "",
  		"timProyek" : {
  			"kasieEnjinering" : "",
  			"kasieKeuangan" : "",
  			"kasieKomersial" : "",
  			"manajerProyek" : "",
  			"pelut" : ""
  		}
  	}
  };

  var idProyek = worksheet["A2"].v;
  var projectType = 1; // Kons & Fab
  var status = worksheet["C2"].v;

  var persenRaProgress = worksheet["E2"] ? worksheet["E2"].v : 0;
  var persenRiProgress = worksheet["F2"] ? worksheet["F2"].v : 0;

  result.infoProyek.idProyek = idProyek;
  result.infoProyek.persenRaProgress = getNumericExcelValue(worksheet, "E2");
  result.infoProyek.persenRiProgress = getNumericExcelValue(worksheet, "G2");

  var data = JSON.stringify(result);

  // console.log(data);

  var db_mobile_info_proyek = {
    id_proyek: idProyek,
    project_type: projectType,
    status: status,
    bulan: month,
    tahun: year,
    data_proyek: data
  };

  db.query('INSERT INTO db_mobile_info_proyek SET ? ' +
  'ON DUPLICATE KEY ' +
  'UPDATE ? ',
  [db_mobile_info_proyek, db_mobile_info_proyek], function(err, result){
    if(err){
      console.log(err);
      callback(err);
    }else{
      callback();
    }
  });

}

var insertQmsl = function(workbook, db, year, month, callback){

  var sheet_name = workbook.SheetNames[1];
  var worksheet = workbook.Sheets[sheet_name];

  var result = {
    "qmsl": []
  };

  var captionIdexes = [10, 11, 17, 18, 28, 29, 31, 32, 39, 40, 45, 46, 51, 52];
  for(var i=6; i<=58; i++){

    if(captionIdexes.indexOf(i) == -1){
      var captionCellName = "B" + i;
      var valueCellName = "C" + i;

      var uraian = getStringExcelValue(worksheet, captionCellName).substring(3);
      var value = getNumericExcelValue(worksheet, valueCellName);

      var qmslObj = {
        "kriteria": uraian,
        "avgVal": value,
        "trend": "=",
        "avgRank": 0
      }

      result.qmsl.push(qmslObj);
    }

  }

  var data = JSON.stringify(result);

  var idProyek = worksheet["B1"].v;

  // console.log(data);

  var db_mobile_qmsl = {
    id_proyek: idProyek,
    bulan: month,
    tahun: year,
    data: data
  };

  db.query('INSERT INTO db_mobile_qmsl SET ? ' +
  'ON DUPLICATE KEY ' +
  'UPDATE ? ',
  [db_mobile_qmsl, db_mobile_qmsl], function(err, result){
    if(err){
      console.log(err);
      callback(err);
    }else{
      callback();
    }
  });

}

var insertSheLevel = function(workbook, db, year, month, callback){

  var sheet_name = workbook.SheetNames[2];
  var worksheet = workbook.Sheets[sheet_name];

  var result = {
    "sheLevel": []
  };

  var captionIdexes = [7, 8, 14, 15, 19, 26, 30, 41, 42, 45, 55, 56, 58, 59, 61, 62, 63, 70, 77, 82];

  for(var i=6; i<=87; i++){

    if(captionIdexes.indexOf(i) == -1){
      var captionCellName = "B" + i;
      var valueCellName = "C" + i;

      var uraian = getStringExcelValue(worksheet, captionCellName).trim().substring(3);
      var value = getNumericExcelValue(worksheet, valueCellName);

      var sheObj = {
        "kriteria": uraian,
        "avgVal": value,
        "trend": "=",
        "avgRank": 0
      }

      result.sheLevel.push(sheObj);
    }

  }

  var data = JSON.stringify(result);

  var idProyek = worksheet["B1"].v;

  var db_mobile_she_level = {
    id_proyek: idProyek,
    bulan: month,
    tahun: year,
    data: data
  };

  db.query('INSERT INTO db_mobile_she_level SET ? ' +
  'ON DUPLICATE KEY ' +
  'UPDATE ? ',
  [db_mobile_she_level, db_mobile_she_level], function(err, result){
    if(err){
      console.log(err);
      callback(err);
    }else{
      callback();
    }
  });

}
