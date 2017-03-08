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
              insertProjectInfoKonsFab(workbook, db, year, month, callback);
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

  result.infoProyek.idProyek = idProyek;

  var data = JSON.stringify(result);

  // console.log(data);

  var db_mobile_info_proyek = {
    id_proyek: idProyek,
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
