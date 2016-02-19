var express = require('express');
var handlebars = require('express-handlebars');
var bodyParser = require('body-parser');
var storage = require('node-persist'); 
var app = express();

app.use(bodyParser.urlencoded({ extended: true })); 
app.engine('handlebars', handlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// setup the storage...
storage.initSync();
app.set('storage', storage);

app.get('/', function (req, res) {
    res.render('home', { pageTitle: "Home", name: req.query.name } );
});

// Display a new form (located in the file views/new.handlebars)
app.get('/new', function (req, res) {
	// laod the message from storage
	var message = storage.getItem('message');
    res.render('new', { pageTitle: "Submit a new task", message: message } );
});

// Accept a POST request and display it (template in the file views/new.handlebars)
app.post('/new', function (req, res) {
	// set the latest message
	var message = req.body.message;
	storage.setItem("message", message);

	// load the existing messages
	var existing_messages = storage.getItem("message-list");

	// no existing items? create an empty list
	if(!existing_messages) {
		existing_messages = [];
	}

	// save the message to the list of existing messages
	existing_messages.push(req.body.message);
	storage.setItem("message-list", existing_messages);

	// redirect back to the main page
	res.redirect("/new");
});

// This creates a list of `foods` and displays it in a new template
// template located (views/list.handlebars)
app.get('/list', function (req, res) {
	var messages = storage.getItem("message-list");
    res.render('list', { messages: messages, pageTitle: "Existing messages" } );
});

app.listen(3000, function () {
  console.log('Marketplace app listening on port 3000!');
});
