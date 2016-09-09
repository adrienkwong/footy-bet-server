var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var logger = require('morgan');
var cors = require('cors');
var SuperLogin = require('superlogin');
 
var app = express();
app.set('port', process.env.PORT || 3000);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
 
app.use(function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header('Access-Control-Allow-Methods', 'DELETE, PUT');
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   next();
});
 
var config = {
  dbServer: {
    protocol: 'https://',
    host: '79fd7df4-85f7-42f4-bce6-a57b9c11d6fb-bluemix.cloudant.com',
    user: '79fd7df4-85f7-42f4-bce6-a57b9c11d6fb-bluemix',
    password: '134e8ccde875d7af80f8a6d7759cecba7fd9a9af4abc41e4b530571734a734e8',
    cloudant: true,
    userDB: 'sl-users',
    couchAuthDB: '_users'
  },
  mailer: {
    fromEmail: 'gmail.user@gmail.com',
    options: {
      service: 'Gmail',
        auth: {
          user: 'gmail.user@gmail.com',
          pass: 'userpass'
        }
    }
  },
  security: {
    maxFailedLogins: 3,
    lockoutTime: 600,
    tokenLife: 86400,
    loginOnRegistration: true,
  },
  userDBs: {
    // These databases will be set up automatically for each new user
    defaultDBs: {
      // Private databases are personal to each user. They will be prefixed with your setting below and postfixed with $USERNAME.
      private: ['user'],
      // Shared databases that you want the user to be authorized to use. These will not be prefixed, so type the exact name.
      shared: ['betting','matches']
          },
    model: {
     // If your database is not listed below, these default settings will be applied
      _default: {
        // these permissions only work with the Cloudant API
        permissions: ['_reader', '_replicator'],
      },
      betting: {
        permissions: ['_reader', '_writer', '_replicator'],
        // 'private' or 'shared'
        type: 'shared',
        // Roles that will be automatically added to the db's _security object of this specific db
        adminRoles: [],
        memberRoles: []
      },
      matches: {
        permissions: ['_reader', '_writer', '_replicator'],
        // 'private' or 'shared'
        type: 'shared',
        // Roles that will be automatically added to the db's _security object of this specific db
        adminRoles: [],
        memberRoles: []
      }
    },
  },
  providers: { 
    local: true
  }
}
 
// Initialize SuperLogin 
var superlogin = new SuperLogin(config);
 
// Mount SuperLogin's routes to our app 
app.use('/auth', superlogin.router);
 
app.listen(app.get('port'));
console.log("App listening on " + app.get('port'));