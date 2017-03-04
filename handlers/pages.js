'use strict';

const Wreck = require('wreck');

exports.home = function (request, reply) {

  if (request.auth.isAuthenticated) {
    reply.view('index', {
        user: request.auth.credentials.username
    });
  }else{
    return reply.redirect(this.webBaseUrl + '/login');
  }

};

exports.login = function (request, reply) {
    reply.view('login', {}, {layout: 'login_layout'});
};

exports.projects = function (request, reply) {

    const apiUrl = this.apiBaseUrl + '/projects';
    const token = request.auth.credentials.token;

    var params = '?pagenum=' + request.query.pagenum + "&pagesize=" + request.query.pagesize +
    "&searchTxt=" + request.query.searchTxt;

    var url = apiUrl + params;

    Wreck.get(url, {
      json: true,
      headers: {
          'Authorization': 'Bearer ' + token
      }
    }, (err, res, payload) => {

        if (err) {
            throw err;
        }
        console.log('projects : ' + JSON.stringify(payload));
        reply(payload);
    });
};
