'use strict';

exports.create = function (request, reply) {

  var project = {
    code: request.payload.code,
    name: request.payload.name,
    description: request.payload.description,
    // project_type: request.payload.project_type
  };

  this.db.query('INSERT INTO project SET ?', project, function(err, result){
    if(err){
      console.log(err);
      reply('Error while doing operation, Ex. non unique value').code(500);
    }else{
      reply({ status: 'ok' });
    }
  });
};

exports.find = function(request, reply) {

  var db = this.db;

  var query = "SELECT * FROM project WHERE (code LIKE ? or name LIKE ?) " +
  "ORDER BY code LIMIT ?,? ";
  var pagesize = parseInt(request.query.pagesize);
  var pagenum = parseInt(request.query.pagenum);
  var code = request.query.searchTxt + '%';
  var name = '%' + request.query.searchTxt + '%';

  db.query(
    query, [code, name, pagenum * pagesize, pagesize],
    function(err, rows) {
      if (err) throw err;

      var query = "SELECT count(1) as totalRecords FROM project WHERE (code LIKE ? or name LIKE ?) ";
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

exports.update = function (request, reply) {

  var project = request.payload;
  var code = request.params.code;

  this.db.query(
  'UPDATE project SET name = ?, '+
  'description = ? ' +
  // 'project_type = ? ' +
  'WHERE code = ?',
  [
    project.name,
    project.description,
    // project.project_type,
    code
  ],
  function (err, result) {
    if(err){
      console.log(err);
      reply('Error while doing operation.').code(500);
    }else{
      reply({ status: 'ok' });
    }
  });
};

exports.delete = function(request, reply) {

  var code = request.params.code;

  this.db.query(
  'DELETE FROM project WHERE code = ? ',
  [code],
  function (err, result) {
    if(err){
      console.log(err);
      reply('Error while doing operation.').code(500);
    }else{
      reply({ status: 'ok' });
    }
  });
};
