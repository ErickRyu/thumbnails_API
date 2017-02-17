var express = require('express');
var app = express();
var fs = require('fs')
var async = require('async');

var defaultTimeout = 8000;

app.get('/thumbnails', function(req, res) {
	
	var url = req.query.url;
	var mod = 0;
	if(req.query.mod){
		mod = req.query.mod;
	}
	encodedURI = encodeURIComponent(url);
	pathAndFile =  __dirname + '/' + encodedURI + '.png';
	
	// Have to make it syncronously
	save(url, pathAndFile);


	setTimeout(function(){
		if(mod == 0){
			res.sendFile(pathAndFile);
		}else if(mod == 1){
			fs.readFile(pathAndFile, function(err, original_data){
			// fs.writeFile('image_orig.jpg', original_data, function(err) {});
			var base64Image = original_data.toString('base64');
			// var decodedImage = new Buffer(base64Image, 'base64');
			// fs.writeFile('image_decoded.jpg', decodedImage, function(err) {});
			res.send(base64Image);
		});
		}		
	}, 9000);
	
	
	
});

var save = function(url, pathAndFile){
	var phantom = require('phantom');
	phantom.create().then(function(ph) {
		ph.createPage().then(function(page) {
			page.open(url).then(function(status) {
				console.log(status);
				page.property('content').then(function(content) {
					page.property('viewportSize',{ width: 1024, height: 740 });
					page.property('clipRect',{ top: 0, left: 0, width: 700, height: 400 });
					page.render(pathAndFile);
					page.close();
					ph.exit();

				});
			});
		});
	});
}
var server = app.listen(8081, function () {
	var host = server.address().address
	var port = server.address().port

	console.log("Example app listening at http://%s:%s", host, port)
})

