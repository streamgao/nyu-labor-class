var express = require('express');
var handlebars = require('express-handlebars');
var bodyParser = require('body-parser');
var fancyhands = require('fancyhands-node').fancyhands;
var cloudinary = require('cloudinary');
var multer = require('multer');
var upload = multer({ dest: 'uploads/' })


var app = express();

// Configuration
var FANCY_HANDS_API_KEY = "";
var FANCY_HANDS_API_SECRET = "";

var CLOUDINARY_CLOUD_NAME = "";
var CLOUDINARY_API_KEY = "";
var CLOUDINARY_API_SECRET = "";


fancyhands.config(FANCY_HANDS_API_KEY, FANCY_HANDS_API_SECRET);

cloudinary.config({ 
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET
});

// use the body parser middlewear so we can accept post requests
app.use(bodyParser.urlencoded({ extended: true }));

app.engine('handlebars', handlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.get('/', function (req, res) {
    res.render('home', { pageTitle: "Home" } );
});

// Display a new form (located in the file views/new.handlebars)
app.get('/new',

        function (req, res) {
    res.render('new', { pageTitle: "Image Identifier" } );
});

// Accept a POST request and display it (template in the file views/new.handlebars)
app.post('/new', upload.fields([{ name: 'image-file', maxCount: 1 }]), function (req, res) {
    

    // ok, we uploaded the file to this server
    var file = req.files['image-file'][0];
    console.log(file);
    // the file objects has the following fields (with different values, obviously):
    //  fieldname: 'image-file',
    //  originalname: 'IMG_20160228_150545-2.jpg',
    //  encoding: '7bit',
    //  mimetype: 'image/jpeg',
    //  destination: 'uploads/',
    //  filename: 'fb17aad4d38e30ec028c26097eecba0a',
    //  path: 'uploads/fb17aad4d38e30ec028c26097eecba0a',
    //  size: 2718222 }

    // let's move it to cloudinary so the assistants can access it.
    // `file.path` is the location of the file
    cloudinary.uploader.upload(file.path, function(upload_result) {
        // we have the `upload_result` which has a field called `url`
        console.log(upload_result);
        var image_url = upload_result.url;

	    // Build a friendly description for the worker to read
	    var description = "Looking at this image: \n" +
		    image_url + " \n" +
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
				    "type": "text",
				    // this is a required field
				    "required": true,
				    // The "label" of the field (that the assistant sees)
				    "label": "Question",
				    // The description of the field (that the assistant sees)
				    "description": req.body.question,
				    // the fieldname that we can use to refer to it later
				    "field_name": "question",
				    // What order should we display these fields in?
				    "order": 0,
				    // set the image url so we can use it later.
				    "image_url": image_url,
                    "cloudinary_public_id": upload_result.public_id
			    }
		    ]
	    };


	    // OK, we want to submit this 3 times.
	    fancyhands.custom_request_create(request)
	    .then(function(data) {
            res.redirect('/image?key=' + request.key);

	    });

        console.log(upload_result) 
    });

});

// This displays the list of standard requests that we've sent in to fancy hands
// template located (views/list.handlebars)
app.get('/list', function (req, res) {
	
	fancyhands.custom_request_get()
		.then(function(data) {
		res.render('list', { requests: data.requests } );
	});
});


// This displays the list of standard requests that we've sent in to fancy hands
// template located (views/list.handlebars)
app.get('/image', function (req, res) {
	
	fancyhands.custom_request_get({ key: req.query.key })
		.then(function(request) {
        //console.log(data);

        // the custom fields are the saem ones we provided above
        var custom_fields = request.custom_fields;

        // we only asked one question, so we know where the answer will be...
        var answer = request.custom_fields[0].answer;


        /////////////////////////////
        // OK, let's make a few images
        // /////

        // we also saved the image url 
        // this is the full sized image url. probably big.
        var image_url = request.custom_fields[0].image_url;

        // and the cloudinary id
        var cloudinary_public_id = request.custom_fields[0].cloudinary_public_id;

        // let's resize the image
        var resized_image_url = cloudinary.url(cloudinary_public_id, { width: 100, height: 100 });

        // we need to define a style on cloudinary for the text (we probably only need tod o this one)
        cloudinary.uploader.text("Sample Name", function(result) { console.log(result) },
                                 {
                                     public_id: "dark_name",
                                     font_family: "Arial",
                                     font_size: 20,
                                     font_color: "white",
                                     opacity: 90
                                 });

        // let's add some text:
        var text_image_url = cloudinary.image(cloudinary_public_id,
                                              {
                                                  transformation: [
                                                      {
                                                          width: 250,
                                                          radius: 20
                                                      },
                                                      {
                                                          overlay: "text:dark_name:" + encodeURIComponent("Hello World!"), 
                                                          gravity: 'south',
                                                          y: 25
                                                      }
                                                  ]
                                              }
                                              );


        var faded_image_url = cloudinary.image(cloudinary_public_id,
                                              {
                                                  transformation: [
                                                      { width: 450 },
                                                      {effect: "green:-50"}, 
                                                      {effect: "brightness:50"}, 
                                                      {effect: "gradient_fade"}
                                                  ]
                                              }
                                              );

		res.render('image', { request: request,
                              text_image_url: text_image_url,
                              faded_image_url: faded_image_url,
                              resized_image_url: resized_image_url } );
	});
});


app.listen(3000, function () {
  console.log('Marketplace app listening on port 3000!');
});
