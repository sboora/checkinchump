var url = require('url'),
	https = require('https'),
	qs = require('querystring'),
	foursquare = require('../lib/foursquare-api/foursqaure');


function redirect(req, res, path, title) {
    res.render(path, { title: title });
}

exports.index = function(req, res){
   console.log("In Index");
   var url_parts = url.parse(req.url,true);
   console.log(url_parts.query);
   var clientCode = url_parts.query["code"];
   redirect(req, res, "index", "Home");
};


exports.authorize = function(req, res){
    console.log("In Authorize");
    var clientCode = req.query.code;
    if(clientCode) {
		result = "";
		foursquare.getAccessToken(clientCode, function (access_token) {
			foursquare.getCheckins(access_token, function(result){
				redirect(req, res, "index", "Home"); 
			    });
		    });
	}
};

exports.badges = function(req, res) {

    redirect(req, res, "badges", "Badges");
}
