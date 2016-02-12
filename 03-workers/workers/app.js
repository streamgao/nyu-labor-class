var express = require('express');
var handlebars = require('express-handlebars');
var bodyParser = require('body-parser');
var fancyhands = require('fancyhands-node').fancyhands;
var app = express();

// Configuration
fancyhands.config('abcdefghijklmno', 'pqrstuvwxyznwsw', 'http://localhost:8080');

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

	// Build a friendly description for the worker to read
	var description = "Looking at this image: <br />" +
		req.body.image + "<br /> " +
		"Tell me: " + req.body.question;

	// the request data to send to Fancy Hands
	var request =  {
		// set the price
		bid: 0.75,
		// Set the title and description
		title: "Easy: " + req.body.question,
		description: description,
		// Build the 'form' that the assistant will fill out.
		// We can have as many fields as we want, 
		// but in this case we're only asking one question.
		custom_fields: [
			{
				// what type of HTML field is it? In this case a group of radio buttons
				"type": "radio",
				// this is a required field
				"required": true,
				// The "label" of the field (that the assistant sees)
				"label": "Options",
				// The description of the field (that the assistant sees)
				"description": req.body.question,
				// Since we're using a group of radio buttons, we need to provide the options 
				"options": req.body.options.split(","),
				// the fieldname that we can use to refer to it later
				"field_name": "options",
				// What order should we display these fields in?
				"order": 0,
				// set the image url so we can use it later.
				"image_url": req.body.image,
			}
		]
	};

	// set a limit for how many we can create
	var LIMIT = 3;	
	// keep track of how many we've created
	var created_count = 0;
	for(var i = 0; i < LIMIT; ++i) {
		// OK, we want to submit this 3 times.
		fancyhands.custom_request_create(request)
			.then(function(data) {
				created_count++;
				// we can only render once, so let's do it when we've created all the tasks
				if(created_count == LIMIT) {
					res.render('new', { pageTitle: "Submitted the tasks!", success: true } );
				}
			});
	}
});

// This displays the list of standard requests that we've sent in to fancy hands
// template located (views/list.handlebars)
app.get('/list', function (req, res) {
	
	fancyhands.custom_request_get()
		.then(function(data) {

			// create a dictionary to hold the images
			var images = {};

			// loop through all the requests
			for(var i = 0; i < data.requests.length; ++i) {
				// set the request itself as a variable for easier access
				var request = data.requests[i];
				// set the title
				var title = request.title;
				// each request has an answer (if it's been closed by Fancy Hands)
				var answer = request.custom_fields[0].answer;
				// Set the image url
				var image_url = request.custom_fields[0].image_url;

				// We want to group the images together by title, 
				// so we create a place to store the data for each unique `title`
				if(!(title in images)) {
					images[title] = {
						question: request.description,
						image_url: image_url,
						// an array of the answers
						answers: [], 
					};
				}
				
				// put it into the array so we can show it on the pag
				images[title].answers.push(answer);
			}
			
			res.render('list', { images: images, pageTitle: "Images" } );
	});
});



app.listen(3000, function () {
  console.log('Marketplace app listening on port 3000!');
});
