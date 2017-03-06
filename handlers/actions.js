const Wreck = require('wreck');

exports.login = function (request, reply) {

  const sql = 'SELECT * FROM tb_admin_user WHERE username = ?';

  this.db.query(sql, [request.payload.username], (err, result) => {

      if (err) {
          throw err;
      }

      var user = null;
      if(result.length > 0){
        user = result[0];
      }

      if (!user) {
          return reply.redirect(this.webBaseUrl + '/login');
      }

      // Bcrypt.compare(request.payload.password, user.password, (err, res) => {
      //
      //     if (err) {
      //         throw err;
      //     }
      //
      //     if (!res) {
      //         return reply('Not authorized').code(401);
      //     }
      //
      //     reply({
      //         token: user.token,
      //         username: user.username
      //     });
      // });

      request.cookieAuth.set({
              username: user.username,
              scope: [user.role]
          });

      reply.redirect(this.webBaseUrl);
  });

  // const apiUrl = this.apiBaseUrl + '/login';
  //
  // Wreck.post(apiUrl, {
  //     payload: JSON.stringify(request.payload),
  //     json: true
  // }, (err, res, payload) => {
  //
  //     if (err) {
  //         throw err;
  //     }
  //
  //     if (res.statusCode !== 200) {
  //         return reply.redirect(this.webBaseUrl + '/login');
  //     }
  //
  //     request.cookieAuth.set({
  //         token: payload.token,
  //         username: payload.username,
  //         scope: ['adminweb']
  //     });
  //     reply.redirect(this.webBaseUrl);
  // });
};

exports.logout = function (request, reply) {
  request.cookieAuth.clear();
  reply.redirect(this.webBaseUrl + '/login');
};
