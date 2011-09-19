var cradle = require('cradle');
var db = new (cradle.Connection)().database('users');
//var db = new (cradle.Connection)('http://luis.pallares.co', 80).database('users');
var utils = require('../utils');

module.exports = function(app) {

    app.get('/users', allUsers, function(req, res, next) {
        users = req.users;
        res.render('users', {
                    title: 'All profiles',
                    users: users
                })
    });

    app.all('/users/new', createUser, function(req, res) {
        res.render('users/new', {
                    title: 'New profile'
                })
    });

    app.post('/users/:id/delete', deleteUser, function(req, res) {});

    app.all('/users/:id', updateUser, loadUser, function(req, res) {
        console.log(req.method);
        res.render('users/detail', {
                    title: 'Profile details',
                    user: req.user
                })
    });

    app.get('/users/tag/:tag', getUsersByTag, function(req, res) {
        res.render('users', {
                    title: 'Profile by tag ' + req.params.tag,
                    users: req.users,
                    action:"users_by_tag"
                })
    });

}

// Middleware Queries
function loadUser(req, res, next) {
    db.get(req.params.id, function(err, doc) {
        if (err) {
            next(new Error("User not found"));
        }
        req.user = doc;
        next();
    });
}

function updateUser(req, res, next) {
    if (req.method == 'POST') {
        var name = req.body.name;
        var email = req.body.email;
        var tags = req.body.tags.split(",");
        var user_id = req.params.id;

        positions = req.body.position;
        years = req.body.years;

        var experience = [];
        for(i in positions){
            pos = utils.trim(positions[i]);
            if(pos.length>0){
                experience.push( {position: pos, years: parseInt(years[i]) } );
            }
        }

        var tagged = [];
        for(j in tags){
            tag = utils.trim(tags[j]);
            if(tag.length>0){
                tagged.push(tag);
            }
        }

        console.log(experience);

        db.get(user_id, function(err, doc) {
            if (doc) {
                db.merge(doc._id,
                        {name:name, email:email, tags:tagged, experience:experience},
                        function(err, res) {
                            if (res) {
                                next();
                            } else {
                                next(new Error("Update error " + err));
                            }
                        });
            } else {
                next(new Error("Get user error: " + err));
            }
        });
    } else {
        next();
    }
}

function getUsersByTag(req, res, next) {
    db.view('users/by_tag', {key:req.params.tag}, function(err, doc) {
        req.users = doc;
        next();
    });
}

function allUsers(req, res, next) {
    db.view('users/all', function(err, res) {
        req.users = res;
        next();
    })
}

function createUser(req, res, next) {
    if (req.method == 'POST') {
        var name = req.body.name;
        var email = req.body.email;
        var tags = req.body.tags.split(",");
        db.save({name:name, email:email, tags:tags, type:"person"}, function(err, doc) {
            if (doc) {
                url = '/users/' + doc.id;
                res.redirect(url);
            } else {
                next(new Error("Error while saving: " + err));
            }
        });
    } else {
        next();
    }
}

function deleteUser(req, res, next){
    if(req.method == 'POST'){
        id = req.params.id;
        db.get(id, function(err, doc){
           if(doc){
               db.remove(doc.id, doc.rev, function(err, doc){
                    if(doc){
                        res.redirect('/users');
                    }else{
                        next(new Error(err));
                    }
               });
           }
        });

    }else{
        next(new Error());
    }
}