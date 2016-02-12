# Workers Example

To run this code, download the whole `workers` directory. Then inside that directory run:

```shell
npm install 
```

And then run

```shell
node app.js
```

Once it's running, you should be able to view the running example at `localhost:3000`

---

This code is built from the code in during the previous weeks, so parts of it will look familiar.

Comparing this code to [last week's](https://github.com/tedroden/nyu-labor-class/tree/master/02-marketplaces/marketplaces), `/new` is where things get a little different. In the template file `new.handlebars`, we removed the `bid` field. We'll be handling that in JavaScript this time. We also added a few other form elements.

When we post that form to `app.js`, we build a form that the Fancy Hands assistant will complete:

```javascript
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
				"field_name": "options"
				// What order should we display these fields in?
				"order": 0,
				// set the image url so we can use it later.
				"image_url": req.body.image,
			}
		]
	};
    // (continued...)
```

We want to ensure that we get the right answer, so we're going to submit the same request three times and check the results. Here's how we create it three times:

```javascript
    // (continued...)
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
```

---

When it comes time to display the results, things get a litle trickier. Let's start with the display itself in `views/list.handlebars`:

In the template file `views/list.handlebars`, we render the list:

```handlebars
<!-- Loop through the images.
     In this case, the `images` is an array of
     dictionary objects that contains an image_url
     and the list of answers.
 -->
{{#each images}}
  <div class="row">
    <div class="col-md-3">
      <!-- Show the image on the left (at a reasonable size) -->      
      <img src="{{ this.image_url }}"
      style="max-width: 250px; max-height: 250px; float: left;"/>
    </div>
    <div class="col-md-4">
      <ol>
        <!-- Show the question -->
        {{{ @key }}}
        <!-- And loop through the answers -->
        {{#each this.answers }}
          <!-- And there an answer show it, otherwise just show a dash -->          
          <li>{{#if this}}{{ this }}{{else}} &mdash; {{/if }}
        {{/each }}
      </ol>
    </div>
  </div>
  <hr >
{{/each }}
```

Now, we just need to write our JavaScript to load the data from Fancy Hands and render this form. There is one problem: the data doesn't come back from Fancy Hands like this. Our app groups several requests together to try and solve one question. So we've got to take the list we get back from Fancy Hands and sort it out.

```javascript
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

```

