const Wreck = require('wreck');

exports.login = function (request, reply) {

  const apiUrl = this.apiBaseUrl + '/login';

  Wreck.post(apiUrl, {
      payload: JSON.stringify(request.payload),
      json: true
  }, (err, res, payload) => {

      if (err) {
          throw err;
      }

      // console.log('Payload : ' + JSON.stringify(payload));

      if (res.statusCode !== 200) {
          return reply.redirect(this.webBaseUrl + '/login');
      }

      request.cookieAuth.set({
          token: payload.token,
          username: payload.username,
          scope: ['adminweb']
      });
      reply.redirect(this.webBaseUrl);
  });
};

exports.logout = function (request, reply) {
  request.cookieAuth.clear();
  reply.redirect(this.webBaseUrl + '/login');
};
