var cradle = require('cradle');
var db = new (cradle.Connection)().database('users');
//var db = new (cradle.Connection)('http://luis.pallares.co').database('users');

module.exports = function(app) {
    app.get('/', getAllTags, getAllExperiences, getPopularProfiles, function(req, res) {
        res.render('index',
                {'title':'Express',
                    tags:req.tags,
                    experiences:req.experiences,
                    popular:req.popular
                });
    });
}

function getAllTags(req, res, next){
    db.view('tags/all',{group:true}, function(err, tags){
        req.tags = tags;
        next();
    });
}

function getAllExperiences(req, res, next){
    db.view('experience/all',{group:true}, function(err, experiences){
        req.experiences = experiences;
        next();
    });
}

function getPopularProfiles(req, res, next){
    db.view('visits/by_user_uid',{group:true}, function(err, popular){
        req.popular = popular;
        next();
    });
}