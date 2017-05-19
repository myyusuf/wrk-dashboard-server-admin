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

    var idProyek = worksheet["A2"].v;

    db.beginTransaction(function(err) {
      if (err) { throw err; };

        Flow.series([
            function (callback) {
              insertProjectProgress(user, db, year, month, idProyek, callback);
            },
            function (callback) {
              insertProjectInfo(workbook, db, year, month, idProyek, callback);
            },
            function (callback) {
              insertQmsl(workbook, db, year, month, idProyek, callback);
            },
            function (callback) {
              insertSheLevel(workbook, db, year, month, idProyek, callback);
            },
            function (callback) {
              insertLimaR(workbook, db, year, month, idProyek, callback);
            }
        ], function(error){

          if(error){
            console.log(error);
            return db.rollback(function() {
              reply({status: 'error', message: error}).code(500);
            });
          }else{
            db.commit(function(err) {
              if (err) {
                return db.rollback(function() {
                  reply({status: 'error', message: error}).code(500);
                });
              }
              reply({status: 'ok'});
            });
          }
        });

    });
}

var insertProjectProgress = function(user, db, year, month, idProyek, callback){

  var key = user.scope[0] + idProyek;

  var projectProgress = {
    year: year,
    month: month,
    username: user.username,
    key: key,
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

var insertProjectInfo = function(workbook, db, year, month, idProyek, callback){

  var sheet_name = workbook.SheetNames[1];
  var worksheet = workbook.Sheets[sheet_name];

  var result = {
  	"infoProyek" : {
  		"alamatProyek" : "",
  		"pemberiKerja" : "",
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
        "rpPiutangUsaha": 0,
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

  var namaProyek = worksheet["J3"].v;
  var projectType = worksheet["C2"].v;
  var status = worksheet["L29"].v;

  var persenRaProgress = worksheet["E2"] ? worksheet["E2"].v : 0;
  var persenRiProgress = worksheet["F2"] ? worksheet["F2"].v : 0;

  result.infoProyek.idProyek = idProyek;
  result.infoProyek.namaProyek = namaProyek;
  result.infoProyek.rpRaProgress = getNumericExcelValue(worksheet, "E2");
  result.infoProyek.rpRiProgress = getNumericExcelValue(worksheet, "G2");
  result.infoProyek.labaKotor.ra = getNumericExcelValue(worksheet, "E4");
  result.infoProyek.labaKotor.ri = getNumericExcelValue(worksheet, "G4");
  result.infoProyek.rpDeviasi = getNumericExcelValue(worksheet, "E5");
  result.infoProyek.pdp = getNumericExcelValue(worksheet, "G5");
  result.infoProyek.bad = getNumericExcelValue(worksheet, "E6");
  result.infoProyek.rpOk = getNumericExcelValue(worksheet, "G6");
  result.infoProyek.piutangUsaha.rpPiutangUsaha = getNumericExcelValue(worksheet, "E7");
  result.infoProyek.piutangRetensi = getNumericExcelValue(worksheet, "G7");
  result.infoProyek.tagihanBrutto = getNumericExcelValue(worksheet, "E8");
  result.infoProyek.persediaan = getNumericExcelValue(worksheet, "G8");
  result.infoProyek.cashFlow = getNumericExcelValue(worksheet, "E9");

  result.infoProyek.alamatProyek = getStringExcelValue(worksheet, "J4");
  result.infoProyek.pemberiKerja = getStringExcelValue(worksheet, "J5");
  result.infoProyek.rpOk = getNumericExcelValue(worksheet, "J8");
  result.infoProyek.tglMulaiProyek = getStringExcelValue(worksheet, "J9");
  result.infoProyek.tglSelesaiProyek = getStringExcelValue(worksheet, "L9");

  result.infoProyek.timProyek = {
    kasieEnjinering: getStringExcelValue(worksheet, "L14"),
    kasieKeuangan: getStringExcelValue(worksheet, "J13"),
    kasieKomersial: getStringExcelValue(worksheet, "L13"),
    manajerProyek: getStringExcelValue(worksheet, "J12"),
    pelut: getStringExcelValue(worksheet, "J14"),
  }

  var bastArray = [];
  const MAX_BAST = 10;
  const BAST_ROW_START = 2;

  for(var i=BAST_ROW_START; i<=(BAST_ROW_START + MAX_BAST); i++){
    var bastName = getStringExcelValue(worksheet, "N" + i);
    if(bastName != ""){
      var bastDate = getStringExcelValue(worksheet, "O" + i);
      var bast = {
        nama: bastName,
        tgl: bastDate
      }

      bastArray.push(bast);
    }
  }

  result.infoProyek.bast = bastArray;

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

var insertQmsl = function(workbook, db, year, month, idProyek, callback){

  var sheet_name = workbook.SheetNames[2];
  var worksheet = workbook.Sheets[sheet_name];

  var result = {
    "qmsl": []
  };

  var captionIdexes = [10, 11, 17, 18, 28, 29, 31, 32, 39, 40, 45, 46, 51, 52];
  for(var i=6; i<=58; i++){

    if(captionIdexes.indexOf(i) == -1){
      var captionCellName = "B" + i;
      var bobotCellName = "C" + i;
      var nilaiCellName = "D" + i;

      var uraian = getStringExcelValue(worksheet, captionCellName).substring(3);
      var bobot = getNumericExcelValue(worksheet, bobotCellName);
      var nilai = getNumericExcelValue(worksheet, nilaiCellName);

      var qmslObj = {
        "uraian": uraian,
        "bobot": bobot,
        "nilai": nilai,
        "score": bobot * nilai
      }

      result.qmsl.push(qmslObj);
    }

  }

  var data = JSON.stringify(result);

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

var insertSheLevel = function(workbook, db, year, month, idProyek, callback){

  var sheet_name = workbook.SheetNames[3];
  var worksheet = workbook.Sheets[sheet_name];

  var result = {
    "sheLevel": []
  };

  var captionIdexes = [7, 8, 14, 15, 19, 26, 30, 41, 42, 45, 55, 56, 58, 59, 61, 62, 63, 70, 77, 82];

  for(var i=6; i<=87; i++){

    if(captionIdexes.indexOf(i) == -1){
      var captionCellName = "B" + i;
      var bobotCellName = "C" + i;
      var nilaiCellName = "D" + i;

      var uraian = getStringExcelValue(worksheet, captionCellName).trim().substring(3);
      var bobot = getNumericExcelValue(worksheet, bobotCellName);
      var nilai = getNumericExcelValue(worksheet, nilaiCellName);

      var sheObj = {
        "uraian": uraian,
        "bobot": bobot,
        "nilai": nilai,
        "score": bobot * nilai
      }

      result.sheLevel.push(sheObj);
    }

  }

  var data = JSON.stringify(result);

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

var insertLimaR = function(workbook, db, year, month, idProyek, callback){

  var sheet_name = workbook.SheetNames[4];
  var worksheet = workbook.Sheets[sheet_name];

  var result = {
    "limaR": []
  };

  var captionIdexes = [8, 14, 21];

  for(var i=6; i<=142; i++){

    if(captionIdexes.indexOf(i) == -1){
      var captionCellName = "B" + i;
      var bobotCellName = "C" + i;
      var nilaiCellName = "D" + i;

      var uraian = getStringExcelValue(worksheet, captionCellName).trim().substring(3);
      var bobot = getNumericExcelValue(worksheet, bobotCellName);
      var nilai = getNumericExcelValue(worksheet, nilaiCellName);

      var limaRObj = {
        "uraian": uraian,
        "bobot": bobot,
        "nilai": nilai,
        "score": bobot * nilai
      }

      result.limaR.push(limaRObj);
    }

  }

  var data = JSON.stringify(result);

  var db_mobile_lima_r = {
    id_proyek: idProyek,
    bulan: month,
    tahun: year,
    data: data
  };

  db.query('INSERT INTO db_mobile_lima_r SET ? ' +
  'ON DUPLICATE KEY ' +
  'UPDATE ? ',
  [db_mobile_lima_r, db_mobile_lima_r], function(err, result){
    if(err){
      console.log(err);
      callback(err);
    }else{
      callback();
    }
  });

}
