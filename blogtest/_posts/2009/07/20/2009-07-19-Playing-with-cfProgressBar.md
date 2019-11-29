---
layout: post
title: "Playing with cfProgressBar"
date: "2009-07-20T10:07:00+06:00"
categories: [coldfusion,jquery]
tags: []
banner_image: 
permalink: /2009/07/20/Playing-with-cfProgressBar
guid: 3452
---

I haven't played much with ColdFusion 9's new Ajax UI tags, mainly because I'm kind of a jQuery UI fan boy now, but this morning I took a look at cfProgressBar. It's a nice little utility and has some interesting uses. Here are a few examples to help you learn the tag. (And hopefully avoid some of the documentation issues I ran into!)
<!--more-->
First, let's look at an incredibly simple progress bar - one that has absolutely no tie to a real process.

<code>
&lt;html&gt;

&lt;head&gt;
&lt;script&gt;
function init() {
	ColdFusion.ProgressBar.start("mycfb")
}
&lt;/script&gt;
&lt;/head&gt;

&lt;body&gt;
&lt;h2&gt;Processing your stuff...&lt;/h2&gt;

&lt;cfprogressbar name="mycfb" duration="5000" interval="300" width="300" /&gt;

&lt;cfset ajaxOnLoad("init")&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>

Right off the bat, let me point some documentation bugs that may snare you. First, the cfprogressbar tag must have an end tag. That's kind of silly and I'm sure it will be corrected for the final release. 

Secondly, both the width and interval attributes are marked as optional with defaults. As far as I can see, this is not the case. Width for me defaulted to 100%, and when I didn't supply an interval, the progress bar never did anything.

Moving on - the last thing to note is that a progress bar will not start running until you tell it to. In this case, I have a 'static' progress bar that uses a duration attribute. This progress bar will simply update it's status of 5000 ms, or 5 seconds. I start the progress bar using ColdFusion.ProgrsssBar.start(name), and, well, that's it. 

You can view a demo of this here: <a href="http://www.raymondcamden.com/demos/cfprogressbar/test.cfm">http://www.raymondcamden.com/demos/cfprogressbar/test.cfm</a>

A static progress bar may not make much sense, but, I do think folks might have a use for it. You may have a slow process that has no direct API to check it's status. If you can roughly estimate how long the process normally takes, then this type of progress bar could at least give your user a reasonable idea of its progress. That being said, I think most folks will want to tie a progress bar to a real status. Let's look at an example of that now.

<code>
&lt;cfset session.cfpbtest = 0&gt;

&lt;html&gt;

&lt;head&gt;
&lt;script&gt;
function init() {
	ColdFusion.ProgressBar.start("mycfb")
}
&lt;/script&gt;
&lt;/head&gt;

&lt;body&gt;
&lt;h2&gt;Processing your stuff...&lt;/h2&gt;

&lt;cfprogressbar name="mycfb" bind="cfc:process.getStatus()" interval="600" width="300" /&gt;

&lt;cfset ajaxOnLoad("init")&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>

This example is much like the other, but note I've removed the duration and replaced it with a bind to a CFC. (Binds to JavaScript functions are also allowed.) My template initializes a session variable, cfpbtest, to 0. This is then used within my CFC:

<code>
component {

remote struct function getStatus() {
	var result = {};
	
	if(not structKeyExists(session, "cfpbtest")) session.cfpbtest = 0;
	session.cfpbtest+=0.1;
	if(session.cfpbtest &gt; 1) session.cfpbtest = 1;
	result.status = session.cfpbtest;

	if(result.status == 1) result.message = "Woot! Done.";
	if(result.status &lt; 0.8) result.message = "Getting closer...";
	if(result.status &lt; 0.6) result.message = "More than halfway done...";
	if(result.status &lt; 0.4) result.message = "Still working, ways to go...";
	if(result.status &lt; 0.2) result.message = "Just begun...";

	return result;

}

}
</code>

The API for progress bar bindings is pretty simple. The CFC method (or JavaScript function) does not take an attribute. It must return a structure with two keys, status and message. Status must be a number between 0 and 1. Message can be whatever you want, or blank even. <b>WARNING:</b> If you return a number higher than 1, the progress bar will correctly display it (i.e., it doesn't draw the progress past the end), but it will continue to peg your server. Notice my little check there to see if the value is over 1? I did that because I noticed floating point errors and an infinite loop of network calls. I've already logged a bug for this. Oh, and by the way, notice the interval value? If you set that too low, and you have an error in your CFC, you will get an infinite number of JavaScript alerts. I filed a bug report on that as well.

You can view this demo here: <a href="http://www.raymondcamden.com/demos/cfprogressbar/test2.cfm">http://www.raymondcamden.com/demos/cfprogressbar/test2.cfm</a>

Here is another example that demonstrates the onComplete functionality. In this example, I've specified that the progress bar should hide itself when done:

<code>
&lt;cfset session.cfpbtest = 0&gt;

&lt;html&gt;

&lt;head&gt;
&lt;script&gt;
function init() {
	ColdFusion.ProgressBar.start("mycfb")
}

function hideme() {
	ColdFusion.ProgressBar.hide("mycfb")
}
&lt;/script&gt;
&lt;/head&gt;

&lt;body&gt;
&lt;h2&gt;Processing your stuff...&lt;/h2&gt;

&lt;cfprogressbar name="mycfb" bind="cfc:process.getStatus()" interval="600" width="300" oncomplete="hideme" /&gt;

&lt;cfset ajaxOnLoad("init")&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>

The hideme function simply uses the hide function to make the progress bar disappear. You can view this demo here: <a href="http://www.raymondcamden.com/demos/cfprogressbar/test3.cfm">http://www.raymondcamden.com/demos/cfprogressbar/test3.cfm</a>

Ok, so obviously this can be used to monitor the progress of some long running process. But you can also use it to provide feedback of a more manual process. Check out this example:

<code>
&lt;html&gt;

&lt;head&gt;
&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script&gt;

function init() {
	ColdFusion.ProgressBar.updateStatus('mycfb', 0, 'Form Status')
}

$(document).ready(function() {


	$("input").change(function() {
		var complete = 0
		if($("#name").val() != '') complete+=0.25
		if($("#age").val() != '') complete+=0.25
		if($("#email").val() != '') complete+=0.25
		if($("#cheese").val() != '') complete+=0.25
		if(complete == 1) {
			msg = 'Form Complete!'
			$("#save").attr("disabled",false)
		} else msg = 'Form Status'
	
		ColdFusion.ProgressBar.updateStatus('mycfb',complete,msg)
	})
})
&lt;/script&gt;
&lt;/head&gt;

&lt;body&gt;

&lt;cfprogressbar name="mycfb" width="300" /&gt;

&lt;p&gt;
&lt;form&gt;
	Name: &lt;input type="text" name="name" id="name"&gt;&lt;br/&gt;
	Age: &lt;input type="text" name="age" id="age"&gt;&lt;br/&gt;
	Email: &lt;input type="text" name="email" id="email"&gt;&lt;br/&gt;
	Favorite Cheese: &lt;input type="text" name="cheese" id="cheese"&gt;&lt;br/&gt;
	&lt;input type="submit" name="Save" id="save" disabled="true"&gt;
&lt;/form&gt;
&lt;/p&gt;

&lt;/body&gt;
&lt;/html&gt;

&lt;cfset ajaxOnLoad("init")&gt;
</code>

I've created a simple form with 4 fields in it. I use jQuery to bind to all the inputs on the page, specifically their change event handler. Whenever you change the values of one of the form fields, I check all 4 fields and create a 'completed' value that represents how much of the form you have done. If you have all four done, I update the status and re-enable the submit button. You can view this demo here: <a href="http://www.raymondcamden.com/demos/cfprogressbar/test4.cfm">http://www.raymondcamden.com/demos/cfprogressbar/test4.cfm</a> I think it's interesting as it provides the user feedback on how far they are in the process of finishing the form. It's overkill for just 4 fields, but you get the idea.