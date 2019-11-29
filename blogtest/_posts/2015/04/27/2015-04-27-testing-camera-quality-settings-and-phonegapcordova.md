---
layout: post
title: "Testing Camera Quality Settings and PhoneGap/Cordova"
date: "2015-04-27T13:03:31+06:00"
categories: [development,javascript,mobile]
tags: [ionic]
banner_image: 
permalink: /2015/04/27/testing-camera-quality-settings-and-phonegapcordova
guid: 6064
---

As you know, when using the <a href="http://plugins.cordova.io/#/package/org.apache.cordova.camera">Camera plugin</a> with PhoneGap/Cordova, you have an optional quality setting. It accepts values from 0 to 100 with 50 being the default. I was curious as to how much of an impact this setting had on the final result. Obviously quality can be subjective, but I thought it would be interesting to build a simple tool that would let me test the settings and compare the results.

<!--more-->

I began by building a simple Node.js application. Its sole purpose was to simply listen for a form POST and save attached files to a time stamped directory. While not really important to the discussion, I wanted to share the code because this is the first time I've done uploads in Node and <a href="https://github.com/felixge/node-formidable">Formidable</a> made it freaking easy as heck. Like, I went from thinking I'd need 3-4 hours to figure it out to having the entire server done in about 30 minutes. Anyway, here's the code:

<pre><code class="language-javascript">var express = require(&#x27;express&#x27;);
var app = express();

var fs = require(&#x27;fs&#x27;);

app.use(require(&#x27;body-parser&#x27;)());
app.set(&#x27;port&#x27;, process.env.PORT || 3000);

var formidable = require(&#x27;formidable&#x27;);

app.post(&#x27;&#x2F;process&#x27;, function(req, res) {

	console.log(&#x27;Attempting process.&#x27;);
	
	&#x2F;&#x2F;data directory
	var time = new Date();

	var dir = __dirname + &#x27;&#x2F;output_&#x27;+time.getFullYear()+&quot;_&quot;+(time.getMonth()+1)+&quot;_&quot;+time.getDate() + &quot;_&quot;+time.getHours() + &quot;_&quot; + time.getMinutes()+&quot;_&quot;+time.getSeconds();
	fs.existsSync(dir) || fs.mkdirSync(dir);
	console.log(&quot;Dir to save is &quot;+dir);
	
	var updir = __dirname + &#x27;&#x2F;uploads&#x27;;
	fs.existsSync(updir) || fs.mkdirSync(updir);

	var form = new formidable.IncomingForm();
	form.uploadDir = updir;

	form.parse(req, function(err, fields, files) {
		if(err) {
			console.log(&quot;error&quot;,err);
			res.send(&quot;i shit my pants&quot;);
		}
		console.log(&quot;fields&quot;, fields);
		console.log(&quot;files&quot;, files);
		for(var file in files) {
			if(files[file].name.length) {
				var source = files[file].path;
				var dest = dir + &#x27;&#x2F;&#x27; + files[file].name;
				console.log(source, fs.existsSync(source));
				console.log(dest);
				fs.renameSync(source,dest);
				&#x2F;&#x2F;fs.createReadStream(source).pipe(fs.createWriteStream(dest));
				console.log(&#x27;copied &#x27;+files[file].name);
			}
		}
		res.send(&#x27;thanks&#x27;);

	});
});

app.listen(app.get(&#x27;port&#x27;), function() {
	console.log(&#x27;App started on port &#x27;+app.get(&#x27;port&#x27;));
});</code></pre>

Again - don't spend too much time looking this over. It really isn't the important part. Now let's discuss the app. I created a quick Ionic app with one button. The idea would be that you would click the button, and the Camera API will take over. Each iteration of clicking would change to a new quality setting. I decided 20{% raw %}%, 40%{% endraw %}, 60{% raw %}%, 80%{% endraw %}, and 100% would be good testing points. I <i>also</i> decided to do the same tests for pictures selected from the device. My gut told me that the quality setting would have no impact there, but I wasn't sure. When I tested, I confirmed that quality does <strong>not</strong> impact existing pictures, so in the code below you will see some parts that are no longer applicable. (And I should stress, this code is an absolute mess. I was going for quick and dirty here, nothing more.)

Another interesting aspect of the code is that I decided to use XHR2 instead of Cordova's <a href="http://plugins.cordova.io/#/package/org.apache.cordova.file-transfer">File-Transfer</a> plugin. Why? Because the plugin doesn't support multiple uploads at once. With XHR2, I could create a FormData structure with all my file data and send them in one request.

So - the code - and again - this is a <strong>mess</strong> so don't consider this suitable production code. I'm only including the JavaScript as the HTML is a header and a button.

<pre><code class="language-javascript">angular.module(&#x27;starter&#x27;, [&#x27;ionic&#x27;])

.controller(&quot;mainController&quot;, function($scope) {
	var images = [];
	var idx = 0;
	$scope.currentLabel = {% raw %}{value:&quot;&quot;}{% endraw %};
	$scope.doingUpload = {% raw %}{value:false}{% endraw %};
	
	var doLabel = function() {
		var label = &quot;&quot;;
		switch(idx) {
				case 0: label=&quot;Camera 20%&quot;; break;
				case 1: label=&quot;Camera 40%&quot;; break;
				case 2: label=&quot;Camera 60%&quot;; break;
				case 3: label=&quot;Camera 80%&quot;; break;
				case 4: label=&quot;Camera 100%&quot;; break;
        &#x2F;*
				case 5: label=&quot;Gallery 20%&quot;; break;
				case 6: label=&quot;Gallery 40%&quot;; break;
				case 7: label=&quot;Gallery 60%&quot;; break;
				case 8: label=&quot;Gallery 80%&quot;; break;
				case 9: label=&quot;Gallery 100%&quot;; break;
				case 10: label=&quot;Upload&quot;; break;
        *&#x2F;
        case 5: label=&quot;Upload&quot;; break;
		}
		$scope.currentLabel.value = label;
		if(!$scope.$$phase) {
			$scope.$apply();
		}
	};
	
	&#x2F;&#x2F;Technically I do pics *and* uploads
	$scope.doPic = function() {
		if(idx &lt;= 4) {
			var options = {% raw %}{destinationType:Camera.DestinationType.NATIVE_URI}{% endraw %};
			options.sourceType = (idx&lt;=4)?Camera.PictureSourceType.CAMERA:Camera.PictureSourceType.PHOTOLIBRARY;

			if(idx === 0 || idx === 5) options.quality = 20;
			if(idx === 1 || idx === 6) options.quality = 40;
			if(idx === 2 || idx === 7) options.quality = 60;
			if(idx === 3 || idx === 8) options.quality = 80;
			if(idx === 4 || idx === 9) options.quality = 100;

			navigator.camera.getPicture(function(u) {
				var result = {% raw %}{index:idx, uri:u}{% endraw %};
				images.push(result);
				idx++;
				doLabel();
			}, function(e) {
				&#x2F;&#x2F;if we get an error, might as well die now
				alert(e);
			}, options);
		} else {
			$scope.doingUpload.value = true;
			if(!$scope.$$phase) {
				$scope.$apply();
			}
			console.log(&#x27;ok, do upload&#x27;);
      var complete = 0;
			var formData = new FormData();
			images.forEach(function(i) {
				console.log(&quot;processing image &quot;+JSON.stringify(i));
				&#x2F;&#x2F;console.log(&quot;test &quot;+decodeURI(i.uri));
				window.resolveLocalFileSystemURL(i.uri, function(fileEntry) {
					fileEntry.file(function(file) {
						var reader = new FileReader();
						reader.onloadend = function(frResult) {
							var data = new Uint8Array(frResult.target.result);
              &#x2F;&#x2F;using a hard coded name since gallery pics were &#x27;content&#x27;
              var fileName = i.index + &quot;.jpg&quot;;
							formData.append(&quot;index&quot;+i.index, new Blob([data], {% raw %}{type:file.type}{% endraw %}), fileName);	
              complete++;
              if(complete === images.length) doUpload(formData);
						};
						reader.readAsArrayBuffer(file);
				   },function(e) {
						console.log(&quot;failed to get a file ob&quot;);
						console.log(JSON.stringify(e));
					});
				}, function(e) {
					console.log(&quot;something went wrong w&#x2F; resolveLocalFileSystemURL&quot;);	
					console.log(JSON.stringify(e));
				});
			});
      
		}
	};
	
  var doUpload = function(data) {
    console.log(&#x27;doUpload&#x27;, data);
    var xhr = new XMLHttpRequest();
    xhr.open(&#x27;POST&#x27;, &#x27;http:&#x2F;&#x2F;192.168.1.13:3000&#x2F;process&#x27;, true);
    xhr.onload = function(e) {
      $scope.doingUpload.value = true;
      if(!$scope.$$phase) {
        $scope.$apply();
      }
      
    }
    xhr.onerror = function(e) {
      console.log(&#x27;onerror fire&#x27;);
      console.dir(e);
    }

    xhr.send(data);
  }
  
	doLabel();
})
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    &#x2F;&#x2F; Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    &#x2F;&#x2F; for form inputs)
    if(window.cordova &amp;&amp; window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})</pre></code>

Ok - so what were the results like? In the following screen shot, 0.jpg represents the first image, which is at 20{% raw %}%, whereas 4.jpg represents the last one, at 100%{% endraw %}. Note the file size differences:

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/04/shot14.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/04/shot14.png" alt="shot1" width="864" height="258" class="alignnone size-full wp-image-6065" /></a>

How about the quality? I'll include all the images as an attachment to this blog post, but let's focus on the 20{% raw %}% and 100%{% endraw %}. I'm resizing these too of course. First, the 20%:

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/04/0.jpg"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/04/0.jpg" alt="0" width="850" height="481" class="alignnone size-full wp-image-6066" /></a>

And now the 100%:

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/04/4.jpg"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/04/4.jpg" alt="4" width="850" height="481" class="alignnone size-full wp-image-6067" /></a>

There seems to be a huge difference in the details of the wallpaper and the colors in the flowers. 

Interestingly enough - the 80{% raw %}% is over one meg smaller despite being just 20%{% endraw %} less quality. Obviously theres a lot of loss going on - but I think if you look at the 80% - it looks really good:

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/04/3.jpg"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/04/3.jpg" alt="3" width="850" height="481" class="alignnone size-full wp-image-6068" /></a>

Certainly this isn't an incredibly scientific test. I left my default camera settings on and each click was a new picture. Many things could have impacted the result - how I held the camera - small changes in light - ghosts, etc. For folks curious, I tested this with an HTC M8. If folks want, I can give the iPhone a try as well.

I've uploaded the zip of images here: <a href="https://dl.dropboxusercontent.com/u/88185/output_2015_4_27_12_26_22.zip">https://dl.dropboxusercontent.com/u/88185/output_2015_4_27_12_26_22.zip</a>.