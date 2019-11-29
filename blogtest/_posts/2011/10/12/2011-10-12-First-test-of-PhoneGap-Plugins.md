---
layout: post
title: "First test of PhoneGap Plugins"
date: "2011-10-12T12:10:00+06:00"
categories: [development,javascript,jquery,mobile]
tags: []
banner_image: 
permalink: /2011/10/12/First-test-of-PhoneGap-Plugins
guid: 4389
---

Much like the Adobe AIR framework, PhoneGap supports native extensions that enhance what you can do with the platform. In the PhoneGap world these are called plugins and a good number of them, for Android, iOS, Blackberry, and Palm, already exist. You can find all of the currently supported plugins at their Github repo: <a href="https://github.com/phonegap/phonegap-plugins">https://github.com/phonegap/phonegap-plugins</a>. I played with plugins this morning and here is what I found.
<!--more-->
<p>

Installing plugins, at least for Android, is relatively simple.

<p>

<ol>
<li>First you copy a JavaScript file to project. This is your interface to the lower level code.
<li>Then you copy a Java class. Remember to refresh your project. My code wasn't working at first and a refresh fixed it up right away.
<li>You edit one XML file to have the project recognize the plugin.
</ol>

<p/>

And that's it. Of course, you have to include the JavaScript wrapper and actually make use of the plugin. For my first experiment, I tried the TTS (Text To Speech) plugin, which worked great. Check out the code here.

<p/>

<code>

&lt;!DOCTYPE HTML&gt;
&lt;html&gt;
&lt;head&gt;
&lt;meta name="viewport" content="width=320; user-scalable=no" /&gt;
&lt;meta http-equiv="Content-type" content="text/html; charset=utf-8"&gt;
&lt;title&gt;TTS&lt;/title&gt;
&lt;script type="text/javascript" charset="utf-8" src="phonegap-1.1.0.js"&gt;&lt;/script&gt;
&lt;script type="text/javascript" charset="utf-8" src="tts.js"&gt;&lt;/script&gt;
&lt;script&gt;
	
function readySpeak(){
	window.plugins.tts.startup(doSpeak, errHandler);
}

function doSpeak() {
	window.plugins.tts.speak("The TTS service is ready", {} , errHandler);
}

function errHandler(result){
	alert('Error: ' + result);
}

function init(){
	document.addEventListener("deviceready", readySpeak, false);
}
&lt;/script&gt;
&lt;/head&gt;

&lt;body onload="init();"&gt;
&lt;/body&gt;
&lt;/html&gt;
</code>

<p/>

As you can see I have a few things I need to do before using the plugin. I listen for the deviceready event (that's a PhoneGap event), then start up the TTS service. Once it is ready it is trivial then to actually make the device speak. The <a href="https://github.com/phonegap/phonegap-plugins/tree/master/Android/TTS">TTS plugin</a> has a few interesting options and for the most part it should be easy to figure out. 

<p/>

Once I got this working, I decided to go a bit crazy. If I can do text to speech, I bet I can do speech to text. Turns out there is also a plugin for speech recognition. The API was a bit hard to grok (and the docs were minimal), but check out the result.

<p/>

<iframe width="420" height="315" src="http://www.youtube.com/embed/ghy1RYdJN9A" frameborder="0" allowfullscreen></iframe>

<p/>

The full source is below. This is a <b>big</b> hack and won't scroll properly if you run it too long, but... it was fun as hell to build!
<p/>

<code>

&lt;!DOCTYPE HTML&gt;
&lt;html&gt;
&lt;head&gt;
&lt;meta name="viewport" content="width=320; user-scalable=no" /&gt;
&lt;meta http-equiv="Content-type" content="text/html; charset=utf-8"&gt;
&lt;title&gt;TTS&lt;/title&gt;
&lt;script type="text/javascript" charset="utf-8" src="phonegap-1.1.0.js"&gt;&lt;/script&gt;
&lt;script type="text/javascript" charset="utf-8" src="tts.js"&gt;&lt;/script&gt;
&lt;script type="text/javascript" charset="utf-8" src="SpeechRecognizer.js"&gt;&lt;/script&gt;
&lt;script src="jquery.js"&gt;&lt;/script&gt;
&lt;script src="elizabot.js"&gt;&lt;/script&gt;
&lt;script src="elizadata.js"&gt;&lt;/script&gt;

&lt;script&gt;
var eliza = new ElizaBot();
	
//Start up stuff... should be chained...
function readySpeakService(){
	window.plugins.tts.startup(doLanguage, errHandler);
}

//See if we can British, cuz Brits sound smart.
function doLanguage(result) {
	if (result == TTS.STARTED) {
		window.plugins.tts.isLanguageAvailable("en_GB", makeBritish, errHandler);
	}
}

//Make me a brit. Cheerio!
function makeBritish(){
	window.plugins.tts.setLanguage("en_GB", startRecog, errHandler);
}

//Done with all TTS, switch to recog
function startRecog() {
	window.plugins.speechrecognizer.init(speechInitOk, errHandler)
}

function speechInitOk(){

	startEliza();

}

function startEliza(){
	var initial = eliza.getInitial();
	window.plugins.tts.speak(initial, {} , errHandler);
	addChat("Eliza: "+initial);
}

function addChat(str){
	$("#chatBox").append(str+"&lt;br/&gt;");
}

function listen(){
    var requestCode = 1234;
    var maxMatches = 5;
    var promptString = "Please say something...";
    window.plugins.speechrecognizer.startRecognize(speechOk, errHandler, requestCode, maxMatches, promptString);

}

function speechOk(result) {
    var match, respObj, requestCode;
    if (result) {
        respObj = JSON.parse(result);
        if (respObj) {
            // This is the code that was sent with the original request
            requestCode = respObj.speechMatches.requestCode;
			//assume one...
			var response = respObj.speechMatches.speechMatch[0];
			addChat("You said: "+response);
			var reply = eliza.transform(response);
			window.plugins.tts.speak(reply, {} , errHandler);
			addChat("Eliza: " + reply);
			
        }        
    }
}

function errHandler(err){
	alert('Error: ' + err);
}

function init(){
	document.addEventListener("deviceready", readySpeakService, false);
	$("#speakButton").click(function() {
		listen();
	});
	window.onerror = errHandler;
}


&lt;/script&gt;
&lt;style&gt;
	#chatBox {
		width: 100%;
		padding-left: 5px;	
		padding-right: 5px;
		padding-top:5px;
		height: 80%;
	}

	#speakButton {
		width: 100%;
		height: 20%;
	}
&lt;/style&gt;
&lt;/head&gt;

&lt;body onload="init();"&gt;

	&lt;div id="chatBox"&gt;&lt;/div&gt;	
	&lt;button id="speakButton"&gt;Speak&lt;/button&gt;
&lt;/body&gt;
&lt;/html&gt;
</code>