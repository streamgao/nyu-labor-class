# Hello World Homework Example

This is an example solution to the homework. I've also added some basic CSS styling to make it look a bit nicer. 

*Note:* Don't worry if your homework is different (or not functional). We'll go over this in class as well.


All of the code lives in `app.js` and in the handlebar in the `views` directory.

--- 
This is the code that creates a list of things and displays it in the template when the user goes to `localhost:3000/list`

First the javascript from `app.js`:

```javascript
// This creates a list of `foods` and displays it in a new template
// template located (views/list.handlebars)
app.get('/list', function (req, res) {
	var foods = [ "Beans", "Rice", "Pickles", "PB&J", "Nachos" ];
    res.render('list', { foods: foods, pageTitle: "My Favorite Foods" } );
});
```

In the template file `views/list.handlebars`, we render the list:

```handlebars
<ul>
   {{#each foods}}
     <li>{{ this }}
   {{/each }}
</ul>
```

---

The following code creates a form when the user goes to `localhost:3000/new` that submits a POST request:

```javascript
// Display a new form (located in the file views/new.handlebars)
app.get('/new', function (req, res) {
    res.render('new', { pageTitle: "Submit a new task" } );
});
```

And the view in `views/new.handlebars` displays the form:

```handlebars
<form method="POST">

  {{#if data}} <!-- if there is data, display it below -->
    <div class="alert alert-success">
      <span>Message: <strong>{{ data.message }}</strong></span>
    </div>
  {{/if }}
  
  <div class="input-group">
    <span class="input-group-addon" >Message</span>  
    <input class="form-control" type="text" name="message" placeholder="Message you'd like to display...">
  </div>

  <input type="submit" class="form-control" value="Send the message!"> 
  
</form>
```

The following code accepts the POST request and renders teh data.

```javascript
// Accept a POST request and display it (template in the file views/new.handlebars)
app.post('/new', function (req, res) {
	var data =  { message: req.body.message };
	console.log(data);
    res.render('new', { pageTitle: "Submit a new task", data: data } );
});
```



