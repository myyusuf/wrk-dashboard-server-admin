// config/passport.js

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;

// load up the user model
// var User       		= require('../app/models/user');

// expose this function to our app using module.exports
module.exports = function(passport, db) {

	// =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.username);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        /*User.findById(id, function(err, user) {
            done(err, user);
        });*/

        // var user = {id: 1, username: 'marliyanti', email: 'dr_marliyanti@yahoo.com', password: 'admin'};
        // return done(null, user);

        var _user = {};

        var _query = "SELECT * FROM tb_user WHERE username=? ";

        db.query(
          _query, [id],
          function(err, rows) {
            if (err) throw err;

            if (rows.length > 0) {
              var _row = rows[0];
              _user['username'] = _row.username;
              _user['password'] = _row.password;
              _user['name'] = _row.name;
              _user['email'] = _row.email;

              return done(null, _user);
            }else{
              return done(null, false);
            }
          }
        );
    });

 	// =========================================================================
  // LOCAL SIGNUP ============================================================
  // =========================================================================
  // we are using named strategies since we have one for login and one for signup
	// by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {

      var newUser = {id: 1, username: 'dea', email: 'dearamadhan@wikarekon.co.id', password: 'deaadmin!'};

      return done(null, newUser);

		// find a user whose email is the same as the forms email
		// we are checking to see if the user trying to login already exists
        /*User.findOne({ 'local.email' :  email }, function(err, user) {
            // if there are any errors, return the error
            if (err)
                return done(err);

            // check to see if theres already a user with that email
            if (user) {
                return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
            } else {

				// if there is no user with that email
                // create the user
                var newUser            = new User();

                // set the user's local credentials
                newUser.local.email    = email;
                newUser.local.password = newUser.generateHash(password); // use the generateHash function in our user model

				// save the user
                newUser.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, newUser);
                });
            }

        }); */

    }));

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, username, password, done) { // callback with email and password from our form

      // var user = {id: 1, username: 'marliyanti', email: 'dr_marliyanti@yahoo.com', password: 'admin'};
      // return done(null, user);

      // find a user whose email is the same as the forms email
      // we are checking to see if the user trying to login already exists
      /* User.findOne({ 'local.email' :  email }, function(err, user) {
          // if there are any errors, return the error before anything else
          if (err)
              return done(err);

          // if no user is found, return the message
          if (!user)
              return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

          // if the user is found but the password is wrong
          if (!user.validPassword(password))
              return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

          // all is well, return successful user
          return done(null, user);
      });*/

      var _user = {};

      var _query = "SELECT * FROM tb_user WHERE username=? ";

      db.query(
        _query, [username],
        function(err, rows) {
          if (err) throw err;

          if (rows.length > 0) {
            var _row = rows[0];
            _user['username'] = _row.username;
            _user['password'] = _row.password;
            _user['name'] = _row.name;
            _user['email'] = _row.email;

            if(password == _row.password){
              return done(null, _user);
            }else{
              return done(null, false);
            }
          }else{
            return done(null, false);
          }
        }
      );

    }));

};
