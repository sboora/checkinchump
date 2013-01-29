var url = require('url'),
    https  = require('https'),
    qs = require('querystring')


var authorization_code =  "authorization_code";
var client_id = "NDON5OK1I2UGPQ1NHZZIW2HWE1WDVLU30U5F32LAC4YKS5P2";
var client_secret = "E3OZXOD54WIL5Q15ZF4VNN5QGNQO0EGWN3EA41H1ZDUUY4W1";
var authorize_url = "https://foursquare.com/oauth2/access_token";
var redirect_uri = "http://web1.tunnlr.com:12101/auth";
var checkins_uri = "https://api.foursquare.com/v2/users/self/checkins";


//Satya Access token - GNFIVCLTZPKIVCJMA4JZ0WBVD2J1IBVOHKTUN4TGFMGI1SRT
//Sid Access token - 51WSRRBY4IYD2P4MCF5FY5BCUAKAIQBJLCDIXFCH5JF2ILFR


exports.getAccessToken = function(code, callback) {
	var params = {};
	params.code = code;
	params.grant_type = authorization_code;
    params.client_id = client_id;
    params.client_secret = client_secret;
    params.redirect_uri = redirect_uri;

    var requestUri = authorize_url + "?" + qs.stringify(params);
    getData(requestUri, function (result) {
    	var access_token = JSON.parse(result).access_token;
    	console.log(access_token);
    	callback(access_token);
    	//TODO: Save access_token to database
    });
};

exports.getCheckins = function(accessToken, callback) {
	//https://api.foursquare.com/v2/users/self/checkins?oauth_token=4H1XQLJFHQN2BJ3O0FU5I1LU2DBZRXEOUVT4LXFJQWSQW4C1&v=20111219
	
	var params = {};
	params.oauth_token = accessToken;
	params.v = 20111219;
	
	 var requestUri = checkins_uri + "?" + qs.stringify(params);
	    getData(requestUri, function (result) {
	    	//var response = JSON.parse(result);
	    	console.log(result);
	    	//TODO: Save access_token to database
		    callback(result);    
	    });
}


/* Make a http request to fetch data */

function getData(requestUri, callback) {
	console.log("Sending request TO :" + requestUri);
    var parsedUrl = url.parse(requestUri, true);
    options = {
	"host": parsedUrl.hostname, //"foursquare.com"                                                                                                                                                                                                                      
	"port": 443,
	"path": requestUri,
	"method": "GET",
	"headers": {
	    "Content-Length":0
		}
    };
    console.log("Making Request to get Access Token");

    try {
    	var myReq = https.request(options, function(fourSqaureRes) {
		fourSqaureRes.on("data", function(chunk) {
			result += chunk;
			});

		fourSqaureRes.on("end", function(){
			console.log(fourSqaureRes.statusCode);
			callback(result);
		    });
	    });

	myReq.on("error", function(error) {
		console.log("ERROR calling remote host: " + error);
	    });


	myReq.end();
	
    } catch(e) {
    	console.log(e);
    }
}
