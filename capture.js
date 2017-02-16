var page = require('webpage').create();
var system = require('system');

//viewportSize being the actual size of the headless browser
page.viewportSize = { width: 1024, height: 768 };
//the clipRect is the portion of the page you are taking a screenshot of
page.clipRect = { top: 0, left: 0, width: 1024, height: 768 };
//the rest of the code is the same as the previous example

args = system.args;
var url = system.args[1];
var encodedURI = encodeURIComponent(url);
var size = '1024px*768px';

if(args.size > 2)
	size = system.args[2];


page.open(url, function() {
  page.render(encodedURI + '.png');
  phantom.exit();
});

// console.log('saved ' + encodedUri + '.png');