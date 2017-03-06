const Path = require('path');
const Fs = require('fs');

var WRKConstant = require('../../config/wrk_constant.js');

var ExcelReader = require('../excelreader.js');

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
        ExcelReader.readExcelHO(targetPath, this.db, user, reply);
      }
  });
}

exports.find = function(request, reply) {

  var db = this.db;

  var query = "SELECT pp.*, p.code AS project_code FROM project_progress pp " +
  "LEFT JOIN project p ON pp.project_id = p.id "
  "WHERE (p.code LIKE ? or p.name LIKE ?) " +
  "ORDER BY p.code LIMIT ?,? ";
  var pagesize = parseInt(request.query.pagesize);
  var pagenum = parseInt(request.query.pagenum);
  var code = request.query.searchTxt + '%';
  var name = '%' + request.query.searchTxt + '%';

  db.query(
    query, [code, name, pagenum * pagesize, pagesize],
    function(err, rows) {
      if (err) throw err;

      var query = "SELECT count(1) as totalRecords FROM project_progress pp " +
      "LEFT JOIN project p ON pp.project_id = p.id "
      "WHERE (p.code LIKE ? or p.name LIKE ?) ";
      db.query(
        query, [code, name],
        function(err, rows2) {
          if (err) throw err;

          var totalRecords = rows2[0].totalRecords;
          reply({data: rows, totalRecords: totalRecords});
        }
      );
    }
  );
};
