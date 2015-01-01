'use strict';

var _        = require('lodash');
var User     = require('../user/user.model');
var config   = require('../../config/environment');
var auth     = require('../../auth/auth.service');
var bnet = require('battlenet-api')();
/**
bnet.wow.guild.profile({ origin: 'us', realm: 'sargeras', name: 'top shelf' },
  { apikey: config.bnet.clientID }, function(err, guildProfile) {

  console.log(guildProfile);

    if(err) {
      return handleError(res, err);
    }
    return res.status(200).json(guildProfile);
})

}

 */
exports.show = function(req, res) {
bnet.wow.guild.profile({origin: 'us', realm: 'sargeras', name: 'top shelf'},
  {apikey: config.bnet.clientID}, function(err, realmStat) {

  console.log(realmStat);

    if(err) {
      return res.status(500);
    }
    return res.status(200).json(realmStat);
})

}