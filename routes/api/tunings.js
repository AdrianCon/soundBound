var router = require('express').Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Tuning = mongoose.model('Tuning');
var auth = require('../auth');

//Middleware to get username
router.param('tuning', function(req, res, next, tuning){
  Tuning.findOne({title: tuning}).then(function(tune){
    if (!tune) { return res.sendStatus(404); }

    req.profile = user;

    return next();
  }).catch(next);
});

//Create tuning
router.post('/tunings', auth.required, function(req, res, next) {
  User.findById(req.payload.id).then(function(user){
    if(!user){ return res.sendStatus(401); }

    console.log(23);
    var tuning = new Tuning(req.body.tuning);
    tuning.author = user;

    return tuning.save().then(function(){
        res.json({tuning: tuning.toJSONFor(user)});
    });
  }).catch(next);
});