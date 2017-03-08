const Path = require('path');
const Fs = require('fs');

var WRKConstant = require('../../config/wrk_constant.js');

var ExcelReaderHO = require('../excelreader.js');
var ExcelReaderPRJ = require('../excelreader_project.js');

exports.upload = function(request, reply){
  // console.log(JSON.stringify(request.payload));

  var fileData = request.payload.progress;
  const targetPath = WRKConstant.FILE_UPLOAD_DIR + fileData.filename;
  const tempPath = fileData.path;

  Fs.rename(tempPath, targetPath, (err) => {
      if (err) {
          throw err;
      }
      const user = request.auth.credentials;
      const role = user.scope[0];

      if(role == 'HO'){
        ExcelReaderHO.readExcel(targetPath, this.db, user, reply);
      }else if(role == 'PRJ'){
        ExcelReaderPRJ.readExcel(targetPath, this.db, user, reply);
      }
  });
}

exports.find = function(request, reply) {

  var db = this.db;

  var query = "SELECT * FROM project_progress " +
  "WHERE username LIKE ? " +
  "ORDER BY year, month LIMIT ?,? ";
  var pagesize = parseInt(request.query.pagesize);
  var pagenum = parseInt(request.query.pagenum);
  var username = '%' + request.query.searchTxt + '%';

  db.query(
    query, [username, pagenum * pagesize, pagesize],
    function(err, rows) {
      if (err) throw err;

      var query = "SELECT count(1) as totalRecords FROM project_progress " +
      "WHERE username LIKE ? ";
      db.query(
        query, [username],
        function(err, rows2) {
          if (err) throw err;

          var totalRecords = rows2[0].totalRecords;
          reply({data: rows, totalRecords: totalRecords});
        }
      );
    }
  );
};
