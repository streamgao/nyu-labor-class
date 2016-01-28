var express = require('express');
var handlebars = require('express-handlebars');
var app = express();

app.engine('handlebars', handlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.get('/', function (req, res) {
	console.log("Hello: " + req.query.name);
    res.render('home', { name: req.query.name });
});

app.get('/hello', function (req, res) {
  res.send('Hello World!');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
