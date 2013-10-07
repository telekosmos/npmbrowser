var MongoClient = require('mongodb').MongoClient;
var fs = require('fs');
var rest = require('restler');
var _ = require('underscore');
var Utils = require('./util.js');
var request = require('request');

var registryURL = 'http://registry.npmjs.org/';

// fs.readFile('npm-package-list.json', function(err, data) {
fs.readFile('url.txt', {encoding: 'utf-8'}, function(err, data) {
  console.log(data);
	var urls = data.split('\n');

	console.log('Packages read: ' + urls.length);

	var utils = new Utils();
	MongoClient.connect("mongodb://localhost:27017/npm-github", function(err, db) {
		if (err) throw err;

		// Read the npm list packages file and parse the json with JSON.parse
		// Walk along the package names by doing listPackages.each ( rest.get (registry/packageName))
		// Parser the json string returned
		// Build the mongo object and insert into the database
    var count = 0;
		_.each(urls, function(elem, index, list) {
			var restURL = elem; // registryURL + elem;
			console.log(restURL);

      request(restURL, function (error, response, body) {
				// if (data instanceof Error)
        if (error || response.statusCode != 200) {
          console.log("request error: "+response.statusCode);
          return false;
        }

        var data = JSON.parse(body);
        count++;
				console.log("Request "+count+" completed for " + data.name +" ("+restURL+")");
				
				var packageObj = utils.buildObj(data, false);

				db.collection("packages").insert(packageObj, {w: 1}, function(err, doc) {
					if (err) {
						console.log("Insert error: " + err.message);
						throw err;
					}

					console.log("Insertion ok for " + packageObj.name);
				});
			}); // EO REST operation


		}); // EO loop over the packages list... 

		/*		// Write concern of one
		db.collection("repl").insert({'x': 1}, function(err, doc) {
			if (err) throw err;
			console.log(doc);

			// Write concern of two
			db.collection("repl").insert({'x': 2}, {'w': 2}, function(err, doc) {
				if (err) throw err;
				console.log(doc);
				db.close();
			});
		});
*/
		//		return db.close();
		return;
	}); // EO MongoClient

})