

// Put event listeners into place
window.addEventListener("DOMContentLoaded", function() {
	// Grab elements, create settings, etc.
	var canvas = document.getElementById("canvas"),
		context = canvas.getContext("2d"),
		video = document.getElementById("video"),
		videoObj = { "video": true },
		errBack = function(error) {
			console.log("Video capture error: ", error.code); 
		};

	// Put video listeners into place
	if(navigator.getUserMedia) { // Standard
		navigator.getUserMedia(videoObj, function(stream) {
			video.src = stream;
			video.play();
		}, errBack);
	} else if(navigator.webkitGetUserMedia) { // WebKit-prefixed
		navigator.webkitGetUserMedia(videoObj, function(stream){
			video.src = window.URL.createObjectURL(stream);
			video.play();
		}, errBack);
	}
	else if(navigator.mozGetUserMedia) { // Firefox-prefixed
		navigator.mozGetUserMedia(videoObj, function(stream){
			video.src = window.URL.createObjectURL(stream);
			video.play();
		}, errBack);
	}

    // Trigger photo take
    document.getElementById("snap").addEventListener("click", function() {

        // capture the image and show it
	    context.drawImage(video, 0, 0, 640, 480);
        $("#camera-controls").css("display", "none");
        $("#camera-results").css("display", "block");

        // convert it to an image and set it on the form
        var image = new Image();
	    image.src = canvas.toDataURL("image/png");
        $("#image_url").val(image.src);

    });

    document.getElementById("redo").addEventListener("click", function() {
        $("#camera-controls").css("display", "block");
        $("#camera-results").css("display", "none");
    });

    
}, false);

