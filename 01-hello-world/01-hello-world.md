# Hello World!

Follow along here:
http://expressjs.com/en/starter/installing.html

Install:
 - node - https://nodejs.org/en/

TL;DR
Create the directory:

    mkdir myapp
    cd myapp

Create the package.json file:

    npm init


Change `entry point` to `app.js`. If you forget to do that, you can just update `package.json`. The `package.json` file should look like this:

```json
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
    }```

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
    });```


Now *run* the server:

    node app.js

Then point your browser to [http://localhost:3000](http://localhost:3000)

Now we can add our own handler.


====

More about express
 - https://github.com/strongloop/express/wiki

We'll want some templates:

http://handlebarsjs.com/

    npm install express-handlebars --save

Create a new file:

	mkdir views

Create a file `home.handlebars`


Update app.js

```diff
    +var handlebars = require('express-handlebars');
    var app = express();
    +
    +app.engine('handlebars', handlebars({defaultLayout: 'main'}));
    +app.set('view engine', 'handlebars');```
