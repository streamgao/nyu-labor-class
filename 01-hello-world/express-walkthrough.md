# Hello World!

## Initializing the project

For this project, we're going to use `node`, which is a simple and robust way to build applications using JavaScript. Node has a simple way to install packages (`npm`), making it super easy to build applications using open source libraries. 

Install `Node`:
 - node - https://nodejs.org/en/

Create the directory:

    mkdir myapp
    cd myapp

Create the package.json file:

    npm init

When you run that command, it's going to ask you a bunch of questions. It will also provide a default option (in parentheses). If you'd like to use the default value, just press "enter" for that question.

When I type `npm init`, this how it looks:

<pre>shell
> npm init 
This utility will walk you through creating a package.json file.
It only covers the most common items, and tries to guess sensible defaults.

See `npm help json` for definitive documentation on these fields
and exactly what they do.

Use `npm install <pkg> --save` afterwards to install a package and
save it as a dependency in the package.json file.

Press ^C at any time to quit.
name: (myapp) <strong>[press enter]</strong>
version: (1.0.0) <strong>[press enter]</strong>
description: <strong>[press enter]</strong>
entry point: (index.js) <strong>app.js</strong>
test command: <strong>[press enter]</strong>
git repository: <strong>[press enter]</strong>
keywords: <strong>[press enter]</strong>
author: <strong>[press enter]</strong>
license: (ISC) <strong>[press enter]</strong></pre>

Once you've done that, it will create a file called `package.json` in the same directory. Take a look at that file, it should look similar to this:

```javascript
{
  "name": "myapp",
  "version": "1.0.0",
  "description": "",
  "main": "app.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC"
}
```

If you'd changed any values, your file may look slightly different than this. Ensure that `main` is set to `app.js`. If it's not, please update it now.

----

## Installing Express

We've just created a `node` project, which create the `package.json` file. This file helps `npm` know about this application. It's useful if you want to push this app to a hosting service such as Heroku because it lists the libraries our application requires. In our case, `package.json` doesn't require any packages, yet. Let's install [express](http://expressjs.com/):

```shell
npm install express --save
```

Express is a great web framework that will help handle the nuts and bolts of our website. It handles the lower level HTTP interactions and let's us just focus on the code.

----

## Creating our app.js

However, node apps are built on `JavaScript` and we haven't written any `JavaScript` yet. 


Using the text editor of your choice, create a new file. Inside that file, add the following lines:

```javascript
var express = require("express");
var app = express();
app.listen(3000);
```


- Get to difference between GET and POST

