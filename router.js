var express = require('express');
var app = express();
var path = require('path')
var childProcess = require('child_process')
var phantomjs = require('phantomjs')
var binPath = phantomjs.path
var fs = require('fs')


app.get('/thumbnails', function(req, res){
	url = req.query.url;
	res.send(url + " is saved as " + encodeURIComponent(url) + ".png");
	var childArgs = [
	path.join(__dirname, 'capture.js'),
	url
	]
	childProcess.execFile(binPath, childArgs, function(err, stdout, stderr) {
		// handle results
		console.log(stdout);
	})
})
app.get('/thumbnails/images', function(req, res){
	var url = req.query.url;
	var mod = 0;
	if(req.query.mod){
		mod = req.query.mod;
	}
	encodedURI = encodeURIComponent(url);
	pathAndFile =  __dirname + '/' + encodedURI + '.png';
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
})


var server = app.listen(8081, function () {
	var host = server.address().address
	var port = server.address().port

	console.log("Example app listening at http://%s:%s", host, port)
})

