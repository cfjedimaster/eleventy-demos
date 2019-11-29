---
layout: post
title: "jQuery Progress Bar (with ColdFusion)"
date: "2009-02-26T12:02:00+06:00"
categories: [coldfusion,jquery]
tags: []
banner_image: 
permalink: /2009/02/26/jQuery-Progress-Bar-with-ColdFusion
guid: 3254
---

I mentioned in yesterday's <a href="http://www.raymondcamden.com/index.cfm/2009/2/25/jQuery-Sortable-with-ColdFusion">blog posting</a> on the Sortable plugin that I was taking a closer look at jQuery UI and how I could integrate it with ColdFusion. I've taken a closer look at another of the widgets and thought I'd share my findings. (Also please note a personal request at the end.)
<!--more-->
The jQuery <a href="http://jqueryui.com/demos/progressbar/">Progress Bar</a> is pretty much what you would expect it to be. A bar. That shows progress. Yes, not rocket science, I know. Here is an example using the Swanky Purse theme (still my favorite theme):

<img src="https://static.raymondcamden.com/images/cfjedi//Picture 222.png">

The code behind this is ridiculously simple:

<code>
&lt;html&gt;

&lt;head&gt;
&lt;link type="text/css" rel="stylesheet" href="theme/ui.all.css" /&gt;
&lt;script src="jquery-1.3.1.js"&gt;&lt;/script&gt;
&lt;script src="jquery-ui-personalized-1.6rc6.js"&gt;&lt;/script&gt;
&lt;script&gt;
$(document).ready(function() {
	$("#progressbar").progressbar({% raw %}{value:69}{% endraw %})
});
&lt;/script&gt;
&lt;/head&gt;

&lt;body&gt;

&lt;div id="progressbar"&gt;&lt;/div&gt;
&lt;/body&gt;
&lt;/html&gt;
</code>

Like other widgets, I have to remember to include my CSS along with the JavaScript. Once I've done that, I simply tell the plugin to turn a particular ID into a progress bar. The code above uses a hard coded value of 69. Progress bars uses a value system based on a percentage from 0 to 100. You can see this in action <a href="http://www.coldfusionjedi.com/demos/jquerypb/test.html">here</a>.

Obviously a static progress bar isn't too exciting, and when I was mentally preparing this blog post in my head this is the part where I was going to immediately jump into creating a dynamic progress bar. However - it occurred to me that a static bar isn't exactly useless either. Imagine a case where you want to mark the progress of something that takes place over a few days, or weeks. For example, a donation drive. You may get one donation per day. It would be kind of silly to build an auto-updating Ajax-driven progress bar for something that won't likely change for a web site visitor. At the same time, you don't want to have to build a new graphic as the donation drive goes on. A static progress bar would be a great - and simple - way to handle this. Consider:

<code>
&lt;!--- Imagine a cfquery here to get total donation ---&gt;
&lt;cfset donations = 99&gt;
&lt;cfset perc = int(donations/399*100)&gt;

&lt;html&gt;

&lt;head&gt;
&lt;link type="text/css" rel="stylesheet" href="theme/ui.all.css" /&gt;
&lt;script src="jquery-1.3.1.js"&gt;&lt;/script&gt;
&lt;script src="jquery-ui-personalized-1.6rc6.js"&gt;&lt;/script&gt;
&lt;script&gt;
$(document).ready(function() {
	&lt;cfoutput&gt;
	$("##progressbar").progressbar({% raw %}{value:#perc#}{% endraw %})
	&lt;/cfoutput&gt;
});
&lt;/script&gt;
&lt;/head&gt;

&lt;body&gt;

&lt;h1&gt;Buy Ray a PS3 Support Fund!&lt;/h1&gt;

&lt;div id="progressbar"&gt;&lt;/div&gt;
&lt;/body&gt;
&lt;/html&gt;
</code>

This is pretty much the exact same code as above but now I have a bit of code to determine the current percentage. My JavaScript code makes use of this value and I added a label over the progress bar so it was a bit more obvious. You can see this in action <a href="http://www.coldfusionjedi.com/demos/jquerypb/static.cfm">here</a>.

So what if you <i>do</i> want a dynamic progress bar? As you can imagine the <a href="http://docs.jquery.com/UI/Progressbar">docs</a> go into detail about what events and methods you can use with the progress bar. Getting the current value is as easy as:

<code>
var currentValue = $("#pb").progressbar('option','value');
</code>

and setting then is:

<code>
$("#pb").progressbar('option','value',currentValue);
</code>

I quickly created a new demo that would let me increase and decrease the values:

<code>
&lt;html&gt;

&lt;head&gt;
&lt;link type="text/css" rel="stylesheet" href="theme/ui.all.css" /&gt;
&lt;script src="jquery-1.3.1.js"&gt;&lt;/script&gt;
&lt;script src="jquery-ui-personalized-1.6rc6.js"&gt;&lt;/script&gt;
&lt;script&gt;

function less() {
	var currentValue = $("#pb").progressbar('option','value');
	currentValue--;
	if(currentValue &gt;= 0) $("#pb").progressbar('option','value',currentValue);
}

function more() {
	var currentValue = $("#pb").progressbar('option','value');
	currentValue++;
	if(currentValue &lt;= 100) $("#pb").progressbar('option','value',currentValue);
}

$(document).ready(function() {
	$("#pb").progressbar({% raw %}{value:69}{% endraw %})
	$("#lessBtn").click(less);
	$("#moreBtn").click(more);
});
&lt;/script&gt;
&lt;/head&gt;

&lt;body&gt;

&lt;div id="pb"&gt;&lt;/div&gt;
&lt;input type="button" id="lessBtn" value="Less"&gt;
&lt;input type="button" id="moreBtn" value="More"&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>

I've added two buttons, Less and More, each of which will run a simple function to either increase or decrease the progress bar value. I added a bit of logic to ensure I don't go below 0 or above 100. You can see this demo <a href="http://www.coldfusionjedi.com/demos/jquerypb/test2.html">here</a>.

Ok, so time to get sexy. A progress bar is really useful for monitoring a slow process. You can imagine something like image resizing. Shrinking a large directory of images could take a while and it would be nice to present a UI to the user so they can see the progress of the slow process. I designed a simple ColdFusion demo that will hopefully demonstrate how you could do this.

First, I added an Application.cfc just to enable Application variable support:

<code>
&lt;cfcomponent output="false"&gt;
	
	&lt;cfset this.name = "jqpb"&gt;

	&lt;cffunction name="onApplicationStart" returnType="boolean" output="false"&gt;
		&lt;cfreturn true&gt;
	&lt;/cffunction&gt;

	&lt;cffunction name="onRequestStart" returnType="boolean" output="false"&gt;
		&lt;cfargument name="thePage" type="string" required="true"&gt;
		
		&lt;cfif structKeyExists(url, "reinit")&gt;
			&lt;cfset onApplicationStart()&gt;
		&lt;/cfif&gt;
		
		&lt;cfreturn true&gt;
	&lt;/cffunction&gt;

	&lt;cffunction name="onError" returnType="void" output="false"&gt;
		&lt;cfargument name="exception" required="true"&gt;
		&lt;cfargument name="eventname" type="string" required="true"&gt;
		&lt;cfdump var="#arguments#"&gt;&lt;cfabort&gt;
	&lt;/cffunction&gt;

&lt;/cfcomponent&gt;
</code>

Next, I created my CFM page that would handle running the slow process. I decides to use a simple timer system:

<code>
&lt;cfsetting enablecfoutputonly="true"&gt;

&lt;!--- start a process that takes 60 seconds. ---&gt;
&lt;cfif not structKeyExists(application, "process")&gt;
	&lt;cfset application.process = now()&gt;
&lt;/cfif&gt;

&lt;!--- app.process is a timestamp, determine how much of the 60 seconds we have finished. if 60 or more, report 100 and kill the process ---&gt;
&lt;cfset diff = dateDiff("s",application.process, now())&gt;

&lt;cfif diff gte 60&gt;
	&lt;cfset structDelete(application, "process")&gt;
	&lt;cfoutput&gt;100&lt;/cfoutput&gt;
&lt;cfelse&gt;
	&lt;cfset perc = diff/60*100&gt;
	&lt;cfoutput&gt;#int(perc)#&lt;/cfoutput&gt;
&lt;/cfif&gt;
</code>

This code will look for an Application variable named process. If it doesn't exist, it will be created and set to the current time.

I then check the difference in seconds from the variable. If less then 60, I output the the percentage value of the time passed. If greater than 60, I output 100 and remove the variable. (<b>Note - this code would need to have locking added to be properly single threaded!</b>) I tested this by hitting it in my browser and reloading. I watched the value go slowly from 0 to 100 and then back again. Once I was sure it worked ok I then moved on to the front end.

I began by adding a button beneath my progress bar:

<code>
&lt;div id="pb"&gt;&lt;/div&gt;
&lt;input type="button" id="startBtn" value="Start"&gt;
</code>

I then modified my document.ready to initialize the progress bar to 0 and listen for the button's click event:

<code>
$(document).ready(function() {
	$("#pb").progressbar({% raw %}{value:0}{% endraw %})
	$("#startBtn").click(startProcess);
});
</code>

startProcess will now handle creating a timer:

<code>
var timer;

function startProcess() {
	$("#startBtn").attr("disabled","disabled")
	$("#startBtn").attr("value","Working...")
	checkProcess()
	timer = setInterval(checkProcess,1000)	
}
</code>

I do a few things here besides just starting the timer. I disable and change the value of the start button. I run checkProcess immediately, and then set an interval for the function.

checkProcess handles doing an Ajax call to my CFM above:

<code>
function checkProcess() {
	$.get('process.cfm',{},function (data,textStatus) {
		$("#pb").progressbar('option','value',$.trim(data))
		if(data == 100) {
			clearInterval(timer)
			$("#startBtn").removeAttr("disabled")
			$("#startBtn").attr("value","Start")
		}	
	})
}
</code>

I run a simple get and then examine the result. I set the progress bar to the number returned, and if the value was 100, I handle killing the timer and resetting the button.

You can see this in action <a href="http://www.coldfusionjedi.com/demos/jquerypb/test3.cfm">here</a>. Note - the file you run is a CFM file but I don't actually use ColdFusion in the view at all. It should have been an HTML file. (I hope I can be forgiven for defaulting all my files to ColdFusion files out of habit!)

p.s. I've been doing a lot of jQuery posts lately. I hope my readers are enjoying them. I'm trying my best to tie each post to something ColdFusion related as well. If anyone has feedback on this, let me know via email. I'm hoping these articles are helpful to those new to jQuery, or perhaps looking for ways to integrate jQuery more with ColdFusion.