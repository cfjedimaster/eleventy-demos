---
layout: post
title: "Adobe AIR and Microphone Support"
date: "2010-09-03T16:09:00+06:00"
categories: [jquery]
tags: []
banner_image: 
permalink: /2010/09/03/Adobe-AIR-and-Microphone-Support
guid: 3932
---

So one of the cooler features of Adobe AIR is it's ability to work with the user's microphone. I whipped up a quick sample of this feature today that demonstrates this. In this first entry we are simply going to <i>monitor</i> the user's audio and in the next entry I'll discuss how you can actually save the recording.

<p/>
<!--more-->
So - as I mentioned above, Adobe AIR has native microphone support. You can see the full API here: <a href="http://help.adobe.com/en_US/air/reference/html/flash/media/Microphone.html">http://help.adobe.com/en_US/air/reference/html/flash/media/Microphone.html</a>. If it looks pretty slim - well, it is. You get the ability to enumerate the microphones on the client's system, get access to one, and listen for events. Obviously the more intense operations (working with the audio data) take more code, and that's going to be covered in the next entry. For now though, let's look at a super simple example of just how easy this is. 

<p>

<code>

&lt;html&gt;
    &lt;head&gt;
        &lt;title&gt;MicTest&lt;/title&gt;
        &lt;script type="text/javascript" src="lib/air/AIRAliases.js"&gt;&lt;/script&gt;
		&lt;script type="text/javascript" src="lib/jquery/jquery-1.4.2.js"&gt;&lt;/script&gt;
        &lt;script&gt;
		var mic;
		
		function updateActivity(e) {
			air.trace('updateActivity called');
		}
		
		function sampleEvent(e) {
			$("#txtActivity").val(e.target.activityLevel);
		}

		function statusEvent(e) {
			air.trace('statusEvent called');		
			air.trace(e);
		}
		
		$(document).ready(function() {
		
			$("#btnRecord").toggle(function() {
			
				//get the mic!
				air.trace("All mics: "+air.Microphone.names);
				mic = air.Microphone.getMicrophone();
				mic.rate = 44;
				mic.addEventListener(air.ActivityEvent.ACTIVITY, updateActivity);
				mic.addEventListener(air.SampleDataEvent.SAMPLE_DATA, sampleEvent);
				mic.addEventListener(air.StatusEvent.STATUS, statusEvent);
				air.trace('Got my mic on! '+mic.name);
				
				$(this).val("Click me to stop")
				
			}, function() {

				$(this).val("Click me to record")
				mic.removeEventListener(air.SampleDataEvent.SAMPLE_DATA, sampleEvent);
				$("#txtActivity").val("");

			});
		
		});
		
		&lt;/script&gt;
		
    &lt;/head&gt;
    &lt;body&gt;
	
	&lt;input type="button" id="btnRecord" value="Click me to record"&gt;
	
	&lt;br/&gt;Activity: &lt;input type="text" id="txtActivity"&gt;
    &lt;/body&gt;
&lt;/html&gt;
</code>

<p>

This application has a grand total of 2 UI items (which is pretty much the minimum I can do before creating something really ugly). I've got one button and a simple text field. Let's look at the click event for the button.

<p>

It begins by simply tracing (again, think of air.trace as console.log) all the mics on your system. A good application would display this list to their user and let them select the right mic. Mine simply grabs the default. I set a sample rate, and then add event listeners.

<p>

Now this part really confused me. I kept looking for a method called 'startRecord' or some such. There is no method. Instead, when you begin to listen for the right events, the application will start noticing the data. So of the three events I have there, the only real critical one is SAMPLE_DATA. This will be called whenever there is no audio data for the application to process. In this code I simply log out the activityLevel. This is a number that ranges from 0 to 100 and shows the relative amount of sound being recorded. In other words - the volume. I gave this a quick run and it worked nice, but then I decided to kick it up a notch and change it to a progress meter via jQuery UI: (By the way - if you hate trance music - turn down your speakers.)

<p>

<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,40,0" width="452" height="213" id="mymoviename"> 
<param name="movie" value="http://www.raymondcamden.com/downloads/airmic.swf" />  
<param name="quality" value="high" /> 
<param name="bgcolor" value="#ffffff" /> 
<embed src="http://www.coldfusionjedi.com/downloads/airmic.swf" quality="high" bgcolor="#ffffff" width="452" height="213" name="mymoviename" align="" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer"> 
</embed> 
</object>

<p>

Notice that the range sticks pretty much to around 30-40, but when I snap my fingers right next to the mic it spikes up. So that's the entire application really. The source code the jQuery UI version is below. If anyone wants the complete application, let me know. 

<p>

<code>
&lt;html&gt;
    &lt;head&gt;
        &lt;title&gt;MicTest&lt;/title&gt;
		&lt;link type="text/css" href="css/vader/jquery-ui-1.8.4.custom.css" rel="stylesheet" /&gt;	
        &lt;script type="text/javascript" src="lib/air/AIRAliases.js"&gt;&lt;/script&gt;
		&lt;script type="text/javascript" src="lib/jquery/jquery-1.4.2.js"&gt;&lt;/script&gt;
		&lt;script type="text/javascript" src="js/jquery-ui-1.8.4.custom.min.js"&gt;&lt;/script&gt;
		
        &lt;script&gt;
		var mic;
		
		function updateActivity(e) {
			air.trace('updateActivity called');
		}
		
		function sampleEvent(e) {
			$("#volume").progressbar("value", e.target.activityLevel);
		}

		function statusEvent(e) {
			air.trace('statusEvent called');		
			air.trace(e);
		}
		
		$(document).ready(function() {
		
			$("#volume").progressbar({% raw %}{ value:0 }{% endraw %});

			$("#btnRecord").toggle(function() {
			
				//get the mic!
				air.trace("All mics: "+air.Microphone.names);
				mic = air.Microphone.getMicrophone();
				mic.rate = 44;
				mic.addEventListener(air.ActivityEvent.ACTIVITY, updateActivity);
				mic.addEventListener(air.SampleDataEvent.SAMPLE_DATA, sampleEvent);
				mic.addEventListener(air.StatusEvent.STATUS, statusEvent);
				air.trace('Got my mic on! '+mic.name);
				
				$(this).val("Click me to stop")
				
			}, function() {

				$(this).val("Click me to record")
				mic.removeEventListener(air.SampleDataEvent.SAMPLE_DATA, sampleEvent);
				$("#volume").progressbar("value", 0);
				
			});
		
		});
		
		&lt;/script&gt;
		
    &lt;/head&gt;
    &lt;body&gt;
	
	&lt;input type="button" id="btnRecord" value="Click me to record"&gt;
	&lt;div id="volume"&gt;&lt;/div&gt;	
    &lt;/body&gt;
&lt;/html&gt;
</code>