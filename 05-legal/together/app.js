var express = require('express');
var handlebars = require('express-handlebars');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var storage = require('node-persist');
var flash = require('express-flash');
var session = require('express-session');
var User = require("./user.js");
var app = express();

app.use(bodyParser.urlencoded({ extended: true })); 
app.engine('handlebars', handlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// where do we store the list of questions?
var QUESTION_LIST_TABLE = "question-list";

app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser('something secret'));
app.use(session());
app.use(flash());

var loadUser = function(req) {
  req.user = new User().loadByKey(req.cookies.user);
  return(req.user != null);
};

var userSupported = function(req, res, next) {
  loadUser(req);
  next();
};

var userRequired = function(req, res, next) {
  if(loadUser(req)) {
    next();
  }
  else {
    res.redirect("/login");
  }
};




// setup the storage...
storage.initSync();
app.set('storage', storage);

app.get('/', userSupported, function (req, res) {
  res.redirect('/list');
  // res.render('home', { pageTitle: "Home"} );
});


// This creates a list of `foods` and displays it in a new template
// template located (views/list.handlebars)
app.get('/question', userRequired, function (req, res) {
  var questions = storage.getItem(QUESTION_LIST_TABLE);
  var question = questions[req.query.id];
  var asker = new User().loadByKey(question.user);
  var answer_list = storage.getItem("answer-" + req.query.id);
  res.render('question', { question: question,
                           asker: asker,
                           answers: answer_list } );
});





// Display a new form (located in the file views/new.handlebars)
app.get('/new', userRequired, function (req, res) {
  // laod the message from storage
  var message = storage.getItem('message');
  var tags = ['human-nature', 'evolution', 'food', 'nyc', 'cooking',
              'programming', 'python', 'javascript',
              'actors', 'sports', 'music', 'new york city',
              'election-2016', 'fashion'];
  res.render('new', { pageTitle: "Ask a question...", tags: tags } );
});




// Accept a POST request and display it (template in the file views/new.handlebars)
app.post('/new', userRequired, function (req, res) {

  // OK, let's save our question.

  // first load the existing questions
  var question_list = storage.getItem(QUESTION_LIST_TABLE);
  // no existing items? create an empty list
  if(!question_list) {
	question_list = [];
  }
  
  // set the latest question
  var question = {
    'body': req.body.question,
    'tags': req.body.tags,
    'user': req.user,
    'date': new Date(),
    'id': question_list.length 
  };

  // save the message to the list of existing messages
  question_list.push(question);

  storage.setItem(QUESTION_LIST_TABLE, question_list);
           
  // redirect back to the main page
  res.redirect("/question?id=" + question.id);
});







// Accept a POST request and display it (template in the file views/new.handlebars)
app.post('/answer', userRequired, function (req, res) {

  // OK, let's save our question.
  var question_id = req.body.question;

  // first load the existing questions
  var answer_list = storage.getItem("answer-" + question_id);
  // no existing items? create an empty list
  if(!answer_list) {
	answer_list = [];
  }

  // set the latest question
  var answer = {
    'body': req.body.answer,
    'user': req.user,
    'date': new Date(),
    'id': answer_list.length 
  };

  // save the answer with the list of other answers
  answer_list.push(answer);

  storage.setItem("answer-" + question_id, answer_list);
           
  // redirect back to the main page
  res.redirect("/question?id=" + question_id);
});

// list all of the questions
app.get('/list', userSupported, function (req, res) {
  var questions = storage.getItem(QUESTION_LIST_TABLE);
  res.render('list', { questions: questions, pageTitle: "Questions" } );
});

/******************************************
 *  Start of the login and register routes
 */
// Display a new form (located in the file views/new.handlebars)
app.get('/login', function (req, res) {
  res.render('login', { pageTitle: "Sign in!"  } );
});

app.get('/logout', function (req, res) {
  res.cookie("user", null);
  req.flash("info", "Successfully logged you out");
  res.redirect('/');
});

app.post('/login',
         function (req, res) {
           var user = new User(req.body.username);
           res.cookie("user", user.getKey());
           req.flash("info", "Hi %s, thanks for logging in!" , req.body.username);
           res.redirect("/");
         });
/*
 *  end of the login and register routes
 *******************************************/


app.listen(3000, function () {
  console.log('Marketplace app listening on port 3000!');
});
