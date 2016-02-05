var express = require('express');
var handlebars = require('express-handlebars');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.urlencoded({ extended: true })); 
app.engine('handlebars', handlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.get('/', function (req, res) {
    res.render('home', { pageTitle: "Home", name: req.query.name } );
});

// Display a new form (located in the file views/new.handlebars)
app.get('/new', function (req, res) {
    res.render('new', { pageTitle: "Submit a new task" } );
});

// Accept a POST request and display it (template in the file views/new.handlebars)
app.post('/new', function (req, res) {
    res.render('new', { pageTitle: "Submit a new task", message: req.body.message } );
});

// This creates a list of `foods` and displays it in a new template
// template located (views/list.handlebars)
app.get('/list', function (req, res) {
	var foods = [ "Beans", "Rice", "Pickles", "PB&J", "Nachos" ];
	console.log(req.body.title);
    res.render('list', { foods: foods, pageTitle: "My Favorite Foods" } );
});

app.listen(3000, function () {
  console.log('Marketplace app listening on port 3000!');
});
