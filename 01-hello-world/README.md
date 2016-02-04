# Hello World!

Install node:
 - node - https://nodejs.org/en/

Create the directory:

    mkdir myapp
    cd myapp

Create the package.json file:

    npm init


Change `entry point` to `app.js`. If you forget to do that, you can just update `package.json`. The `package.json` file should look like this:

```javascript
{
  "name": "exp",
  "version": "1.0.0",
  "description": "",
  "main": "app.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "Ted Roden",
  "license": "ISC"
}
```

Now install express: `npm install express --save`

Then create `app.js` file:

```javascript
var express = require('express');
var app = express();

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
```

Now *run* the server:

    node app.js

Then point your browser to [http://localhost:3000](http://localhost:3000)

- Logging
	- `console.log("Hello, console!");`
- Params
	- console.log("Hello: " + req.query.name);
- Add a new URL.


Pro tip: http://www.hacksparrow.com/node-js-restart-on-file-change.html



Now we can add our own handler.


====

More about express
 - https://github.com/strongloop/express/wiki

We'll want some templates:

http://handlebarsjs.com/

    npm install express-handlebars --save

Create a new file:

	mkdir -p views/layouts/

 

Create a file `home.handlebars`


Update app.js: 

```diff
var express = require('express');
+var handlebars = require('express-handlebars');
var app = express();

+app.engine('handlebars', handlebars({defaultLayout: 'main'}));
+app.set('view engine', 'handlebars');
```

## Homework
1. Get comfortable with express and templates.
1. Create a page that lists items via templates (using a for loop)
1. Create a form and a page that accepts a POST request and displays it
1. Sign up for an API key at https://www.fancyhands.com/developer/apps/new


