const screenshot = require('screenshot-stream')
var createServer = require('auto-sni')
var express = require('express')
var morgan = require('morgan')
var fs = require('fs')
var multer = require('multer')
var cors = require('cors')
var lwip = require('lwip')
var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'my-uploads/')
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + file.originalname)
  }
})
var upload = multer({storage: storage})
var app = express()

const defaultWidth = 1024;
const defaultHeight = 720;

// morgan config
module.exports = app;
morgan.token('date', function() {
    var p = new Date().toString().replace(/[A-Z]{3}\+/,'+').split(/ /);
    return( p[2]+'/'+p[1]+'/'+p[3]+':'+p[4]+' '+p[5] );
});
app.use(morgan('combined', {
	stream: fs.createWriteStream(__dirname + '/logs/' + Date.now() +'.log', {'flags' :'w'})
}));

app.use(cors());

app.get('/resize', function(req, res){
	fs.readFile('upload.html', function(err, pgRes) {
		if(err) throw err;
		else{
			res.write(pgRes);
			res.end();
		}
	});
});
app.post('/resize', upload.single('image'), function(req,res,next){
	var body = req.body;
	var width = parseInt(body.width);
	var height = parseInt(body.height);
	var mod = body.mod;

	if(!isValidNumber(width))
		width = defaultWidth;
	if(!isValidNumber(height))
		height = defaultHeight;
	
	var filename = req.file.filename;
	var path = __dirname + "/my-uploads/" + filename;

  lwip.open(path, function(err, image){
		image.resize(width, height, function(err, image) {
			image.writeFile(path, function(err){
				if(mod === 'base64'){
					var file = fs.readFile(path, function(err, data){
						res.send(data.toString('base64'));
					});
				}else
					res.sendFile(path);
			});
		});
	});
});
app.get('/thumbnails', function(req, res) {
	var mod = 'png';
	var startTime = (new Date).getTime();
	var url = req.query.url;
	console.log(url);
	// Query check
	if(req.query.mod){
		mod = req.query.mod;
	}
	var width = req.query.width;
	var height = req.query.height;
	if(!isValidNumber(width))
		width = defaultWidth;
	if(!isValidNumber(height))
		height = defaultHeight;
	
	var size = width+'x'+height;
	const stream = screenshot(url, size, {crop: true});
	
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
		var endTime = (new Date).getTime();
		console.log((endTime-startTime)/1000. + " Elapsed");
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
	

var isValidNumber = function(num){
	if(isNaN(num)|| num == 0){
		return false;
	}else
		return true;
};
//var server = app.listen(process.env.PORT||8081, function () {
//	var port = server.address().port
//
//	console.log("Listening at localhost:%s", port)
//})

try{
	createServer(
		{
			email:'sol-stibee@slowalk.co.kr',
			agreeTos: true,
			domains:["thumbnail.stibee.com"],
			debug: false,
			forceSSL: true,
			ports: {
				http:8081,
				https:443
			}
		}, app);
}catch(exception){
	console.log(exception);
}

