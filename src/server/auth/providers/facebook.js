var express = require('express');
var router = express.Router();
var jwt = require('jwt-simple');
var request = require('request');
var config = require('../../config/environment');
var auth = require('../auth.service');
var User = require('../../api/user/user.model');

function validationError(res, err) {
  res.status(422).json(err);
}

/*
 * Login with Facebook
 * */

router.post('/', function(req, res) {
  var accessTokenUrl = 'https://graph.facebook.com/v2.3/oauth/access_token';
  var graphApiUrl = 'https://graph.facebook.com/v2.3/me';
  var params = {
    code: req.body.code, //jscs:disable
    client_id: req.body.clientId,  //jshint ignore:line
    client_secret: config.facebook.clientSecret, //jshint ignore:line
    redirect_uri: req.body.redirectUri //jshint ignore:line
  }; //jscs:enable

  // Step 1. Exchange authorization code for access token.
  request.get({
    url: accessTokenUrl,
    qs: params,
    json: true
  }, function(err, response, accessToken) {
    if (response.statusCode !== 200) {
      return res.status(500).send({
        message: accessToken.error.message
      });
    }

    // Step 2. Retrieve profile information about the current user.
    request.get({
      url: graphApiUrl,
      qs: accessToken,
      json: true
    }, function(err, response, profile) {
      if (response.statusCode !== 200) {
        return res.status(500).send({
          message: profile.error.message
        });
      }
      if (req.headers.authorization) {
        User.findOne({
          facebook: profile.id
        }, function(err, existingUser) {
          if (existingUser) {
            return res.status(409).send({
              message:
              'This Facebook account is already linked to another account.'
            });
          }
          var token = req.headers.authorization.split(' ')[1];
          var payload = jwt.decode(token, config.secrets.session);
          User.findById(payload.sub, function(err, user) {
            if (!user) {
              return res.status(400).send({
                message: 'User not found'
              });
            }
            user.facebook = profile.id;
            user.picture = user.picture || 'https://graph.facebook.com/v2.3/' +
              profile.id + '/picture?type=large';
            user.displayName = user.displayName || profile.name;
            user.email = user.email || profile.email;
            if (user.providers.indexOf('facebook') === -1) {
              user.providers.push('facebook');
            }
            user.save(function(err) {
              if (err) {
                return validationError(res, err);
              }
              var token = auth.createToken(user);
              res.send({
                token: token
              });
            });
          });
        });
      } else {
        // Step 3b. Create a new user account or return an existing one.
        User.findOne({
          facebook: profile.id
        }, function(err, existingUser) {
          if (existingUser) {
            var token = auth.createToken(existingUser);
            return res.send({
              token: token
            });
          }
          var user = new User();
          user.facebook = profile.id;
          user.picture = 'https://graph.facebook.com/' + profile.id +
            '/picture?type=large';
          user.displayName = profile.name;
          user.email = profile.email;
          user.providers = ['facebook'];
          user.save(function(err) {
            if (err) {
              // could not save the user, maybe email is already taken.
              return validationError(res, err);
            }
            var token = auth.createToken(user);
            res.send({
              token: token
            });
          });
        });
      }
    });
  });
});

module.exports = router;
