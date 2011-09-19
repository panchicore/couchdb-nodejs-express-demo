var cradle = require('cradle');
var db = new (cradle.Connection)().database('users');
//var db = new (cradle.Connection)('http://luis.pallares.co', 80).database('users');

module.exports = function(app) {
    app.get('/track', function(req, res, next) {
        query = req.query;
        query["type"] = "track";
        query["client"] = {"ip":req.client.remoteAddress, algo:'mas'};
        
        var now = new Date();
        query["date"] = now.toJSON();
        db.save(query,function(err, doc){});
        
        res.send("{result:true}");
    });
}