var express = require('express');
var handlebars = require('express-handlebars');
var bodyParser = require('body-parser');
var app = express();


app.use(bodyParser.urlencoded({ extended: true })); 
app.engine('handlebars', handlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.get('/', function (req, res) {
    res.render('home', { pageTitle: "Home" } );
});


app.get('/new', function (req, res) {
    res.render('new', { pageTitle: "Submit a new task" } );
});

app.post('/new', function (req, res) {
	var data =  { message: req.body.message };
	console.log(data);
    res.render('new', { pageTitle: "Submit a new task", data: data } );
});


app.get('/list', function (req, res) {
	var foods = [ "Beans", "Rice", "Pickles", "PB&J", "Nachos" ];
	console.log(req.body.title);
    res.render('list', { foods: foods, pageTitle: "My Favorite Foods" } );
});

app.listen(3000, function () {
  console.log('Marketplace app listening on port 3000!');
});
