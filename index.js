const screenshot = require('screenshot-stream');
var express = require('express');
var app = express();


app.get('/thumbnails', function(req, res) {
	var start = (new Date).getTime();

	var url = req.query.url;

	var mod = 'png';
	var width = 1024;
	var height = 468;

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
		var end = (new Date).getTime();
		console.log((end-start)/1000. + " Elapsed");
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

