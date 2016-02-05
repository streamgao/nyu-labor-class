var express = require('express');
var handlebars = require('express-handlebars');
var bodyParser = require('body-parser');
var fancyhands = require('fancyhands-node').fancyhands;
var app = express();

// Configuration
fancyhands.config('9ALLnTW3stkFrnL', 'LupLe86P5GSU7HP'); // , 'http://localhost:8080');
// fancyhands.config('gd43Q8D5HNiJwlp', '9cn99NJ4kbaezPR', 'http://localhost:8080') //


// use the body parser middlewear so we can accept post requests
app.use(bodyParser.urlencoded({ extended: true })); 
app.engine('handlebars', handlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.get('/', function (req, res) {
    res.render('home', { pageTitle: "Home" } );
});

// Display a new form (located in the file views/new.handlebars)
app.get('/new', function (req, res) {
    res.render('new', { pageTitle: "Submit a new task" } );
});

// Accept a POST request and display it (template in the file views/new.handlebars)
app.post('/new', function (req, res) {
	
	var request =  {
		bid: req.body.bid,
		title: req.body.title,
		description: req.body.description
	};

	fancyhands.standard_request_create(request)
		.then(function(data) {
			// console.log(data);
			res.render('new', { pageTitle: "Submitted a new task!", data: data } );
	});
});

// This displays the list of standard requests that we've sent in to fancy hands
// template located (views/list.handlebars)
app.get('/list', function (req, res) {
	fancyhands.standard_request_get()
		.then(function(data) {
			res.render('list', { requests: data.requests, pageTitle: "My Requests" } );
	});
});


// This displays the list of standard requests that we've sent in to fancy hands
// template located (views/list.handlebars)
app.get('/request', function (req, res) {

	fancyhands.standard_request_get({ key: req.query.key })
		.then(function(request) {
			console.log(request);
			res.render('request', { request: request, pageTitle: request.title } );
		});
});


// This allows us to send a new message to the assistant
// template located (views/list.handlebars)
app.post('/request', function (req, res) {

	fancyhands.message_send({ key: req.body.key, message: req.body.message })
		.then(function(data) {
			res.redirect('/request?key=' + req.body.key);
		});
});



app.listen(3000, function () {
  console.log('Marketplace app listening on port 3000!');
});
