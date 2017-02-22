const screenshot = require('screenshot-stream');
var express = require('express');
var app = express();
var width = 1024;
var height = 468;


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

	const stream = screenshot(url, width + 'x' + height, {crop: true});
	
	stream.on('error', function(err){
		console.log('somthing wrong');
		res.status(400).send(err);
	})

	if(mod == 'png'){
		stream.on('data', function(data){
			res.write(data);
		})
	}else if(mod == 'base64'){
		stream.on('data', function(data){
			res.write(data.toString('base64'));
		})
	}else {
		res.status(400);
		res.send('wrong mod');
	}
	
	stream.on('end', function(){
		var end = (new Date).getTime();
		console.log((end-start)/1000. + " Elapsed");
		res.end();
	})
	stream.on('error', function(exc) {
		console.error("ignoring exception " + exc);
	});
});

var server = app.listen(8081, function () {
	var host = server.address().address
	var port = server.address().port

	console.log("Thumbnails app listening at http://%s:%s", host, port)
})

