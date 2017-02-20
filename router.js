var express = require('express');
var app = express();
var fs = require('fs')
const screenshot = require('screenshot-stream');

width = 1024;
height = 468;


app.get('/thumbnails', function(req, res) {
	var start = (new Date).getTime();


	var url = req.query.url;
	var mod = 'png';
	if(req.query.mod)
		mod = req.query.mod;
	if(req.query.width)
		width = req.query.width;
	if(req.query.height)
		height = req.query.height;

	encodedURI = encodeURIComponent(url);
	pathAndFile =  __dirname + '/' + encodedURI + '.png';

	const stream = screenshot(url, width + 'x' + height, {crop: true});
	
	stream.on('error', function(err){
		console.log('somthing wrong');
		res.status(400).send("400");
	})

	stream.on('data', function(data) {
		if(mod == 'png'){
			res.write(data);

		}else if(mod == 'base64'){
			res.write(data.toString('base64'));
		}			
	});

	stream.on('end', function(){
		var end = (new Date).getTime();
		console.log((end-start)/1000. + " Elapsed");
		res.end();
	})
});

var server = app.listen(8081, function () {
	var host = server.address().address
	var port = server.address().port

	console.log("Example app listening at http://%s:%s", host, port)
})

