var express = require('express');
var handlebars = require('express-handlebars');
var bodyParser = require('body-parser');
var storage = require('node-persist');
var cloudinary = require('cloudinary');
var app = express();

var CLOUDINARY_CLOUD_NAME = "";
var CLOUDINARY_API_KEY = "";
var CLOUDINARY_API_SECRET = "";

cloudinary.config({ 
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET
});


app.use(express.static('static'));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' })); 
app.engine('handlebars', handlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
storage.initSync();
app.set('storage', storage);

var IMAGE_LIST = "image-list";

app.get('/', function (req, res) {
    var savedImageList = storage.getItem(IMAGE_LIST);
    var images = [];
    if(savedImageList) {
        for(var i = 0; i < savedImageList.length; ++i) {
            var title = savedImageList[i].title;
            var id = savedImageList[i].cloudinary_public_id;
            images.push({ 'title': title,
                          'full': cloudinary.url(id),
                          'smaller': cloudinary.url(id, { width: 250 }),
                          'red_border': cloudinary.url(id, {width: 250, border: "5px_solid_green" }),
                          'corners': cloudinary.url(id, {width: 250, radius: 150 }),
                          'grey': cloudinary.url(id, {width: 250, effect: "grayscale" }),
                          'oil': cloudinary.url(id, {width: 250, effect: "oil_paint:75" }),
                          'insta': cloudinary.url(id, {width: 250, effect: "brightness:200"})
                        });
        }
    }
    console.log(savedImageList);
    res.render('home', {  images: images } );
});

// save the image
app.post('/', function (req, res) {
    var image_url = req.body.image_url;
    cloudinary.uploader.upload(image_url, function(upload_result) {
        var images = storage.getItem(IMAGE_LIST);
        if(!images) {
            images = [];
        }
        var savedImage =
            { 'title': req.body.image_title,
              'cloudinary_public_id': upload_result.public_id };
        images.push(savedImage);
        storage.setItem(IMAGE_LIST, images);
        res.redirect("/");
    });

});



app.listen(3000, function () {
  console.log('Marketplace app listening on port 3000!');
});
