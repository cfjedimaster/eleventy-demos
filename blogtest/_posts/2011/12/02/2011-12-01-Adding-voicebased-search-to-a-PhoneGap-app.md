---
layout: post
title: "Adding voice-based search to a PhoneGap app"
date: "2011-12-02T10:12:00+06:00"
categories: [javascript,jquery,mobile]
tags: []
banner_image: 
permalink: /2011/12/02/Adding-voicebased-search-to-a-PhoneGap-app
guid: 4453
---

A few weeks back I <a href="http://www.raymondcamden.com/index.cfm/2011/10/12/First-test-of-PhoneGap-Plugins">blogged</a> about plugins under PhoneGap. If you haven't read that blog entry, take a quick look at it. For the most part, plugins in PhoneGap are pretty simple. Download a Java file. Download a JavaScript file. Make one tweak to an XML file and you're good to go. In that entry I made use of the <a href="https://github.com/phonegap/phonegap-plugins/tree/master/Android/SpeechRecognizer">SpeechRecognizer</a> plugin for Android. Since that blog entry was kind of a joke (ok, <i>most</i> of my blog entries contain code that is a kind of a joke - but let's forget about that for a moment), I thought it might be nice to demonstrate a more real world use for the plugin. With that in mind here's a simple application built without and with speech recognition.
<!--more-->
<p>

I began with a simple idea - an application that would allow you to quickly search for images. Turns out the Google Image API is deprecated, but <a href="http://www.bing.com/toolbox/bingdeveloper/">Bing</a> still has a valid API. Not only that, it works really well! About the only weird thing i had with the API was Microsoft's... unusual... capitalization of stuff. That being said, it didn't take long to build up a simple form and tie it to their API. Here is the HTML for the page.

<p>

<pre><code class="language-markup">&lt;!DOCTYPE HTML&gt;
&lt;html&gt;
&lt;head&gt;

&lt;meta name="viewport" content="width=320; user-scalable=no" /&gt;
&lt;meta http-equiv="Content-type" content="text/html; charset=utf-8"&gt;
&lt;title&gt;PhoneGap&lt;/title&gt;
&lt;script type="text/javascript" charset="utf-8" src="js/phonegap-1.2.0.js"&gt;&lt;/script&gt;
&lt;script type="text/javascript" charset="utf=8" src="js/jquery-1.7.min.js"&gt;&lt;/script&gt;
&lt;script type="text/javascript" charset="utf=8" src="js/main.js"&gt;&lt;/script&gt;
&lt;style&gt;
input {
	width:100%;
	padding: 10px;
}

img {
	display:block;
	margin-left:auto;
	margin-right:auto;
}
p {
	display:block;
	margin-left:auto;
	margin-right:auto;
	width: 80%;
}
&lt;/style&gt;
&lt;/head&gt;

&lt;body onload="init()"&gt;

&lt;input type="search" id="searchField" value="star wars"&gt;
&lt;input type="button" id="searchButton" value="Search"&gt;

&lt;div id="results"&gt;&lt;/div&gt;

&lt;/body&gt;
&lt;/html&gt;
</code></pre>

<p>

Nothing special there - just a form field and a button. Btw - Pro Tip here - when working on web applications do not be shy about defaulting form fields as I've done above. You get <i>real</i> sick and tired of re-entering text input after you've run your application a few hundred times. Obviously the default value there would be removed before release. Here's a quick shot of how it looks.

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/device-2011-12-02-083521.png" />

<p>

Now let's look at the code....

<p>

<pre><code class="language-javascript">var appid = "5252D701A7CE4B4F3C190F1403D2181F2C330F2E";

function init() {
	document.addEventListener("deviceready", deviceready, true);
}

function deviceready() {
	console.log('loaded');
	
	$("#searchButton").bind("touchstart",function() {
		var s = $.trim($("#searchField").val());
		console.log("going to search for "+s);

		$.getJSON("http://api.search.live.net/json.aspx?Appid="+appid+"&query="+escape(s)+"&sources=image&image.count=20", {}, function(res) {
			var results = res.SearchResponse.Image.Results;
			if(results.length == 0) {
				$("#results").html("No results!");
				return;
			}
			var s = "";
			for(var i=0; i&lt;results.length; i++) {
				s+= "&lt;p&gt;&lt;img src='"+results[i].Thumbnail.Url+"'&gt;&lt;br/&gt;&lt;a href='"+results[i].Url+"'&gt;"+results[i].DisplayUrl+"&lt;/a&gt;&lt;/p&gt;";				
			}
			$("#results").html(s);
		});

	});
}
</code></pre>

<p>

Again - nothing terribly complex here. Bind to the button - check the value - and hit Bing. Here's an example of the result.

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/device-2011-12-02-083540.png" />

<p>

Ok, so far so good. So let's add speech recognition! As I said above, there is a process that plugins follow. It involves getting a Java file, a JavaScript file, and editing your plugins.xml file. The <a href="https://github.com/phonegap/phonegap-plugins/tree/master/Android/SpeechRecognizer">SpeechRecognizer</a> page actually documents this well. Before I go into the code though I ran into a brick wall.

<p>

How do I handle the UI?

<p>

That's a pretty important question, and I won't pretend to know the best answer to this. I decided to add a button to the left of the text field. This way the user could click the button or the text field if they didn't want to use the recognizer. I'm not saying this is the best answer but it seemed to work ok. Here's the updated HTML:

<p>

<pre><code class="language-markup">&lt;!DOCTYPE HTML&gt;
&lt;html&gt;
&lt;head&gt;

&lt;meta name="viewport" content="width=320; user-scalable=no" /&gt;
&lt;meta http-equiv="Content-type" content="text/html; charset=utf-8"&gt;
&lt;title&gt;PhoneGap&lt;/title&gt;
&lt;script type="text/javascript" charset="utf-8" src="js/phonegap-1.2.0.js"&gt;&lt;/script&gt;
&lt;script type="text/javascript" charset="utf=8" src="js/jquery-1.7.min.js"&gt;&lt;/script&gt;
&lt;script type="text/javascript" charset="utf-8" src="js/SpeechRecognizer.js"&gt;&lt;/script&gt;
&lt;script type="text/javascript" charset="utf=8" src="js/main.js"&gt;&lt;/script&gt;
&lt;style&gt;
#micButton, #searchField {
	padding: 10px;
}

input[type=button] {
	width: 100%;
}

img {
	display:block;
	margin-left:auto;
	margin-right:auto;
}
p {
	display:block;
	margin-left:auto;
	margin-right:auto;
	width: 80%;
}
&lt;/style&gt;
&lt;/head&gt;

&lt;body onload="init()"&gt;

&lt;button id="micButton" disabled="disabled"&gt;SPEAK!&lt;/button&gt; &lt;input type="search" id="searchField" value=""&gt;

&lt;input type="button" id="searchButton" value="Search"&gt;

&lt;div id="results"&gt;&lt;/div&gt;

&lt;/body&gt;
&lt;/html&gt;
</code></pre>

<p>

And the new UI....

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/device-2011-12-02-092309.png" />

<p>

Ok, now let's take a look at the code.

<p>

<pre><code class="language-javascript">var appid = "5252D701A7CE4B4F3C190F1403D2181F2C330F2E";

function init() {
	document.addEventListener("deviceready", deviceready, true);
}

function deviceready() {
	console.log('loaded');
	
	window.plugins.speechrecognizer.init(speechInitOk, speechInitFail);
	
	function speechInitOk() {
		$("#micButton").removeAttr("disabled");
	}
	
	function speechInitFail(e) {
		//Since this isn't critical, we don't care...
	}
	
	$("#micButton").bind("touchstart", function() {		
		var requestCode = 4815162342;
		var maxMatches = 1;
		var promptString = "What do you want?";
		window.plugins.speechrecognizer.startRecognize(speechOk, speechFail, requestCode, maxMatches, promptString);
	});

	function speechOk(result) {
		var match, respObj;
		if (result) {
			respObj = JSON.parse(result);
			if (respObj) {
				var response = respObj.speechMatches.speechMatch[0];
				$("#searchField").val(response);
				$("#searchButton").trigger("touchstart");
			}        
		}
	}

	function speechFail(m) {
		navigator.notification.alert("Sorry, I couldn't recognize you.", function() {}, "Speech Fail");
	}

	$("#searchButton").bind("touchstart",function() {
		var s = $.trim($("#searchField").val());
		console.log("going to search for "+s);

		$.getJSON("http://api.search.live.net/json.aspx?Appid="+appid+"&query="+escape(s)+"&sources=image&image.count=20", {}, function(res) {
			var results = res.SearchResponse.Image.Results;
			if(results.length == 0) {
				$("#results").html("No results!");
				return;
			}
			var s = "";
			for(var i=0; i&lt;results.length; i++) {
				s+= "&lt;p&gt;&lt;img src='"+results[i].Thumbnail.Url+"'&gt;&lt;br/&gt;&lt;a href='"+results[i].Url+"'&gt;"+results[i].DisplayUrl+"&lt;/a&gt;&lt;/p&gt;";				
			}
			$("#results").html(s);
		});

	});
}
</code></pre>

<p>

So first off, we have to see if we can even do recognition. Therefore I've got a call to init it in my device ready block. If it works, we remove the disabled attribute from the button. The button has an event handler that will fire off the request to the device. The request code is random so don't worry about it too much. Once clicked, the device will prompt you to speak:

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/device-2011-12-02-092332.png" />

<p>

In the result handler, we can simply then grab the response object and assume the first result is what we want. Notice I automatically trigger the search. That may or may not be a good idea. You may want the user to have a chance to confirm the recognition first. I thought it was kind of cool to have it automatically search though. Here's an example - and yes - I did say "red banana":

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/device-2011-12-02-092341.png" />

<p>

That's it. If you want to play with this, I've included a zip of the Eclipse project. You will find the first draft in the assets folder as "www - Copy". You will also find an APK you can install. Note - I had JDK issues with the SpeechRecognizer Java file. So the version in my zip is slightly edited to get around that.

<p>
<a href="https://static.raymondcamden.com/enclosures/VoiceSearch%2Ezip">Download attached file.</a>
</p>