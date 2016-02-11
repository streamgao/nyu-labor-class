var express = require('express');
var handlebars = require('express-handlebars');
var bodyParser = require('body-parser');
var fancyhands = require('fancyhands-node').fancyhands;
var app = express();

// Configuration
fancyhands.config('abcdefghijklmno', 'pqrstuvwxyznwsw', 'http://localhost:8080');
//fancyhands.config('9ALLnTW3stkFrnL', 'LupLe86P5GSU7HP');

// use the body parser middlewear so we can accept post requests
app.use(bodyParser.urlencoded({ extended: true })); 
app.engine('handlebars', handlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.get('/', function (req, res) {
    res.render('home', { pageTitle: "Home" } );
});

// Display a new form (located in the file views/new.handlebars)
app.get('/new', function (req, res) {
    res.render('new', { pageTitle: "Image Identifier" } );
});

// Accept a POST request and display it (template in the file views/new.handlebars)
app.post('/new', function (req, res) {

	// build a friendly description
	var description = "Looking at this image: <br />" +
		req.body.image + "<br /> " +
		"Tell me: " + req.body.question;

	// the data
	var request =  {
		bid: 0.75,
		title: "Easy: " + req.body.question,
		description: description,
		custom_fields: [
			{
				"type": "radio",
				"required": true,
				"label": "Options",
				"description": req.body.question,
				"options": req.body.options.split(","),
				"order": 0,
				"field_name": "options"			
			}
		]
	};
	
	var created_count = 0;
	for(var i = 0; i < 3; ++i) {
		// ok, we want to submit this 3 times.
		fancyhands.custom_request_create(request)
			.then(function(data) {
				created_count++;
				console.log("submitted request: " + created_count);
				if(created_count == 3) {
					res.render('new', { pageTitle: "Submitted the tasks!" } );
				}
			});
	}

});

// This displays the list of standard requests that we've sent in to fancy hands
// template located (views/list.handlebars)
app.get('/list', function (req, res) {
	
	fancyhands.custom_request_get()
		.then(function(data) {
			
			var requests = {};

			for(var i = 0; i < data.requests.length; ++i) {
				var request = data.requests[i];
				var title = request.title;

				if(!(title in requests)) {
					requests[title] = [];
				}

				requests[title].append(request);
				
				console.log("---- START REQUEST --");
				console.log(JSON.stringify(request, null, 4)); // formatted nicely.
				console.log("---- END REQUEST ----");
				
			}
			
			var titles = [];
			
			// console.log("OK, here I am....");
			// console.log(data.requests);
			// console.log("OK OK OK OK ");
			res.render('list', { requests: data.requests, pageTitle: "My Requests" } );
	});
});


// This displays the list of standard requests that we've sent in to fancy hands
// template located (views/list.handlebars)
app.get('/request', function (req, res) {

	fancyhands.custom_request_get({ key: req.query.key })
		.then(function(request) {
			console.log(request);
			res.render('request', { request: request, pageTitle: request.title } );
		});
});


app.listen(3000, function () {
  console.log('Marketplace app listening on port 3000!');
});
