const screenshot = require('screenshot-stream');
var express = require('express');
var morgan = require('morgan');
var app = express();
module.exports = app;
morgan.token('date', function() {
    var p = new Date().toString().replace(/[A-Z]{3}\+/,'+').split(/ /);
    return( p[2]+'/'+p[1]+'/'+p[3]+':'+p[4]+' '+p[5] );
});
var fs = require('fs');
app.use(morgan('combined', {
	stream: fs.createWriteStream('app.log', {'flags' :'w'})
}));

app.get('/thumbnails', function(req, res) {
	var url = req.query.url;

	var mod = 'png';
	var width = 1024;
	var height = 720;

	// Query check
	if(req.query.mod){
		mod = req.query.mod;
	}
	if(req.query.width){
		width = req.query.width;
		if(isNaN(width)){
			res.status(400).send("Width must be the nubmer");
			res.end();
		}
	}
	if(req.query.height){
		height = req.query.height;		
		if(isNaN(height)){
			res.status(400).send("Height must be the nubmer");
			res.end();
		}
	}

	const stream = screenshot(url, width + 'x' + height, {crop: true});
	
	// stream error
	stream.on('error', function(err){
		console.log('=========================================')
		console.log('Stream error');
		console.log(err.stack);
		console.log('=========================================')
		res.status(400).send(err.message);
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
		res.send("Wrong mod!\nAvailable mod is 'base64' and 'png'");
	}
	
	stream.on('end', function(){
		res.end();
	})
});

// 404 Error Handling
app.use(function(req, res, next){
	res.status(404).send("Page Not found");
})

app.use(function(err, req, res, next) {
	console.log(err.stack);
	res.status(500).send(err.message);
});
	

var server = app.listen(8081, function () {
	var host = server.address().address
	var port = server.address().port

	console.log("Thumbnails app listening at http://%s:%s", host, port)
})

