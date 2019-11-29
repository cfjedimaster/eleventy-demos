---
layout: post
title: "Simple example of a Form post to ColdFusion with jQuery"
date: "2009-03-20T08:03:00+06:00"
categories: [coldfusion,javascript,jquery]
tags: []
banner_image: 
permalink: /2009/03/20/Simple-example-of-a-Form-post-to-ColdFusion-with-jQuery
guid: 3283
---

Following up on my earlier <a href="http://www.raymondcamden.com/index.cfm/2009/3/17/Simple-example-of-loading-a-ColdFusion-query-with-jQuery">post</a> demonstrating loading ColdFusion query data via jQuery, I've decided to do a few more simple jQuery+ColdFusion examples to give folks a taste of how easy it is to work with them both at the same time. For today's entry I'm going to show a very simple form post. This is as about as trivial as you can get, but I'm going to follow it up the next few days with a few more examples that will build upon it. So with that in mind, let's take a quick look at the code.
<!--more-->
First I'll show the form. Notice that for this example I will <b>not</b> be doing any form validation. I want to keep things as nice and simple as possible.

<code>
&lt;form id="testForm"&gt;
	Name: &lt;input type="text" name="name"&gt;&lt;br/&gt;
	Email: &lt;input type="text" name="email"&gt;&lt;br/&gt;
	Gender: 
	&lt;select name="gender"&gt;
	&lt;option value="M"&gt;Male&lt;/option&gt;	
	&lt;option value="F"&gt;Female&lt;/option&gt;
	&lt;/select&gt;&lt;br/&gt; 	
	&lt;input type="submit" value="Save" /&gt;
&lt;/form&gt;
</code>

The form contains 3 fields: name, email, and gender. Notice I did not supply an action for the form. I'm going to let jQuery do everything. Now for the JavaScript.

<code>
&lt;script src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script&gt;
$(document).ready(function() {
	$("#testForm").submit(sendForm)
});

function sendForm() {
	$.post('post.cfm',$("#testForm").serialize(),function(data,status){
		$("#result").html(data)
	});
	return false
}

&lt;/script&gt;
</code>

The first block of code simply says: When the page loads, I want you to bind the submit action of the form caleld testForm to a function called sendForm. This basically takes over the submit action. sendForm is a grand total of two lines. jQuery provides multiple ways to do Ajax calls. I'm using post for this example. The post function lets me specify a URL, some data, and a callback function. If callback functions confuse you (they were for me at first), just think of it as me telling jQuery: "Hey pal, when you are done sending the data, please run this function with the result."

How do I get the data? In the old days I might have used document.getElementById() on all the form fields. Luckily jQuery provides not one but two functions to handle this task for me. I can use serializeAray() to turn a form into a javaScript object. It will go throughout all the fields and create a name/value pair. It will be smart enough to know what to do for textfields, checkboxes, drop downs, you name it. An alternative to this is the serialize() function. This creates a string (think query string) version of the form data. The post() function will use either of these. 

My callback function simply takes the result, trims it (don't forget how much ColdFusion likes whitespace!), and displays it within a div. 

The ColdFusion side isn't doing much here. Let's take a look:

<code>
&lt;cfparam name="form.name" default=""&gt;
&lt;cfparam name="form.email" default=""&gt;
&lt;cfparam name="form.gender" default=""&gt;

&lt;cfoutput&gt;
Thanks for writing, 
&lt;cfif form.gender is "m"&gt;Mr&lt;cfelse&gt;Ms&lt;/cfif&gt; #form.name#. 
I've sent a subscription email to #form.email#.
&lt;/cfoutput&gt;
</code>

I do some basic validation on top and then simply output the result. I mention sending a subscription email, but don't really do it. (How many people think quite a few web apps lie like this?) 

You can demo this here: <a href="http://www.coldfusionjedi.com/demos/jqform/test2.html">http://www.coldfusionjedi.com/demos/jqform/test2.html</a>

Ok, so pretty simple, but there are some things to think about it.

First, if I just wanted to load the result of posting the form into the div, I could have used the jQuery load function instead. I wanted to show a bit more... control over the process, so I used post() instead. I've said this before, but please remember - like ColdFusion, jQuery almost always provides more than one way to do somrthing. 

Second, my form does zero error handling. Since I'm just dumping the result in a div, I could have done error handling in ColdFusion. What about errors in general? You can see I have access to a status variable. But as the docs say, this always returns true. This seems like a bug in jQuery, and it seems like it should be something simple to fix, so I'm assuming the issue is a bit more complex. In my testing, when I forced an error in the ColdFusion side, I still got 'success' for a status. 

Third, just showing a message as the result is the simplest way to handle the result of the post. I could have also hidden the form. I could have done anything number of things really. What's nice though is how jQuery makes it easy to package up and wrap the logic all within a few lines. jQuery FTW!

Lastly, I mentioned I was going to skip client side validation in this post. I skipped it not because it was difficult, but because I wanted to create a simple example. I wrote a few blog entries on the topic and you should definitely check it out. (<a href="http://www.coldfusionjedi.com/index.cfm/2009/2/9/An-introduction-to-jQuery-and-Form-Validation">An introduction to jQuery and Form Validation</a>)

As always, comments from the jQuery experts are welcome (well, <i>any</i> comments are welcome). My general plan for followups to this entry include: jQuery and a Login Form demo. jQuery and a Search Form demo. jQuery and a CAPTCHA demo where you can reload the CAPTCHA.