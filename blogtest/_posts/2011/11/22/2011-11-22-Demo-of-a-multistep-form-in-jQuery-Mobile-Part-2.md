---
layout: post
title: "Demo of a multi-step form in jQuery Mobile (Part 2)"
date: "2011-11-22T14:11:00+06:00"
categories: [html5,javascript,jquery,mobile]
tags: []
banner_image: 
permalink: /2011/11/22/Demo-of-a-multistep-form-in-jQuery-Mobile-Part-2
guid: 4443
---

A few days ago I wrote a <a href="http://www.raymondcamden.com/index.cfm/2011/11/18/Demo-of-a-multistep-form-in-jQuery-Mobile">blog entry</a> demonstrating how one could do a multi-step form in a jQuery Mobile application. This worked by simply breaking up the forms into multiple files and having a 'controller' file load in the right one via an include as you progressed through the process. I got some feedback that it would be interesting (and perhaps better) if the process was done completely client-side. Today I worked up a small demo of this as an alternative.
<!--more-->
<p>

While working on this demo I discovered two things about jQuery Mobile:

<p>

<ol>
<li>I knew that jQuery Mobile "took over" forms and when you submitted them it converted the action into an Ajax-based post. I thought, however, if you wrote your own code to handle the form submit, and used e.preventDefault(), it would, well, prevent that. Nope. And this is what weirded me out. My form handler <b>was</b> called when I submitted the form. But I couldn't prevent jQuery Mobile from submitting the data anyway. This to me feels like a bug. You have to <i>completely</i> disable jQuery Mobile's form handling by adding data-ajax="false" to the form tag. Not a big deal - just not expected. 
<li>You can include more than one "page" inside an HTML page. This is useful for times when you may have a few simple static pages you want immediately available. I thought it would be a good way to handle my multistep form. But - here's the rub. You cannot have a "multipage" page loaded via jQuery Mobile's Ajax page loads. I don't think that's clear, so let me back up. Normally when you link to a page, like foo.html, jQuery Mobile hijacks the link and will load the contents of foo.html via Ajax. jQuery Mobile will look for a "page" div and render just that. If you do this, and link to a file with N pages inside it, jQuery Mobile will destroy the other pages. You can't use them. So if you want to use a multipage html, you have to either ensure it is the first page loaded, or ensure the link <b>to</b> to the page does not use ajax - again using data-ajax="false". This is documented <a href="http://jquerymobile.com/demos/1.0/docs/pages/page-links.html">here</a>, and I want to thank Robert Bak for helping me find that detail.
</ol>

<p>

So given the above, let's take a look. First I have my index page. This is merely meant to reflect the fact that our demo is part of a "real" site. So the first link is just some random other page and the second link is the form we want to actually demo.

<p>

<code>
&lt;!DOCTYPE html&gt; 
&lt;html&gt; 
	&lt;head&gt; 
	&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;	
	&lt;title&gt;Page Title&lt;/title&gt; 
	&lt;link rel="stylesheet" href="http://code.jquery.com/mobile/latest/jquery.mobile.min.css" /&gt;
	&lt;script src="http://code.jquery.com/jquery-1.6.4.min.js"&gt;&lt;/script&gt;
	&lt;script src="http://code.jquery.com/mobile/latest/jquery.mobile.min.js"&gt;&lt;/script&gt;
	&lt;script src="main.js"&gt;&lt;/script&gt;
&lt;/head&gt; 
&lt;body&gt; 

&lt;div data-role="page"&gt;

	&lt;div data-role="header"&gt;
		&lt;h1&gt;Page Title&lt;/h1&gt;
	&lt;/div&gt;

	&lt;div data-role="content"&gt;	

		&lt;ul data-role="listview" data-inset="true"&gt;
			&lt;li&gt;&lt;a href="foo.html" data-ajax="false"&gt;Something&lt;/a&gt;&lt;/li&gt;
			&lt;li&gt;&lt;a href="someform.html" data-ajax="false"&gt;The Form&lt;/a&gt;&lt;/li&gt;
		&lt;/ul&gt;

	&lt;/div&gt;

	&lt;div data-role="footer"&gt;
		&lt;h4&gt;Page Footer&lt;/h4&gt;
	&lt;/div&gt;

&lt;/div&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>

<p>

Note the use of data-ajax="false" in the link to my form. <b>This is critical since someform.html is a multipage file.</b> Ok, now let's look at someform.html. This one is a bit big.

<p>

<code>
&lt;!DOCTYPE html&gt; 
&lt;html&gt; 
	&lt;head&gt; 
	&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;	
	&lt;title&gt;Some Form&lt;/title&gt; 
	&lt;link rel="stylesheet" href="http://code.jquery.com/mobile/latest/jquery.mobile.min.css" /&gt;
	&lt;script src="http://code.jquery.com/jquery-1.6.4.min.js"&gt;&lt;/script&gt;
	&lt;script src="http://code.jquery.com/mobile/latest/jquery.mobile.min.js"&gt;&lt;/script&gt;
	&lt;script src="main.js"&gt;&lt;/script&gt;
&lt;/head&gt; 
&lt;body&gt; 

&lt;!-- Step One --&gt;
&lt;div data-role="page" id="step1"&gt;

	&lt;div data-role="header"&gt;
		&lt;a href="index.html" data-icon="home"&gt;Home&lt;/a&gt;
		&lt;h1&gt;Reg Form&lt;/h1&gt;
	&lt;/div&gt;

	&lt;div data-role="content"&gt;	
	
		&lt;form method="post" class="msform" data-ajax="false"&gt;
			&lt;input type="hidden" name="nextStep" value="step2"&gt;
			&lt;div data-role="fieldcontain"&gt;        
			    &lt;label for="name"&gt;Name:&lt;/label&gt;        
		    	&lt;input type="text" name="name" id="name" value=""  /&gt;        
			&lt;/div&gt;	
			&lt;div data-role="fieldcontain"&gt;        
			    &lt;label for="email"&gt;Email:&lt;/label&gt;        
			    &lt;input type="email" name="email" id="email" value=""  /&gt;        
			&lt;/div&gt;	
		
			&lt;div data-role="fieldcontain"&gt;        
			    &lt;input type="submit" name="submit1" value="Send"  /&gt;        
			&lt;/div&gt;	
		&lt;/form&gt;

	&lt;/div&gt;

	&lt;div data-role="footer"&gt;
		&lt;h4&gt;Page Footer&lt;/h4&gt;
	&lt;/div&gt;

&lt;/div&gt;

&lt;!-- Step Two --&gt;
&lt;div data-role="page" id="step2"&gt;

	&lt;div data-role="header"&gt;
		&lt;a href="index.html" data-icon="home"&gt;Home&lt;/a&gt;
		&lt;h1&gt;Reg Form&lt;/h1&gt;
	&lt;/div&gt;

	&lt;div data-role="content"&gt;	
	
		&lt;form method="post" class="msform" data-ajax="false"&gt;
			&lt;input type="hidden" name="nextStep" value="step3"&gt;
		
			&lt;div data-role="fieldcontain"&gt;
				&lt;fieldset data-role="controlgroup"&gt;
					&lt;legend&gt;Gender:&lt;/legend&gt;
				     	&lt;input type="radio" name="gender" id="male" value="male" checked="checked" /&gt;
				     	&lt;label for="male"&gt;Male&lt;/label&gt;
				
				     	&lt;input type="radio" name="gender" id="female" value="female"  /&gt;
				     	&lt;label for="female"&gt;Female&lt;/label&gt;		
				&lt;/fieldset&gt;
			&lt;/div&gt;
			
			&lt;div data-role="fieldcontain"&gt;
			   &lt;label for="coolness"&gt;Coolness:&lt;/label&gt;
			   &lt;input type="range" name="coolness" id="coolness" value="25" min="0" max="100"  /&gt;
			&lt;/div&gt;
		
			&lt;div data-role="fieldcontain"&gt;        
		        &lt;input type="submit" name="submit2" value="Send"  /&gt;        
		    &lt;/div&gt;	
		&lt;/form&gt;
		
	&lt;/div&gt;

	&lt;div data-role="footer"&gt;
		&lt;h4&gt;Page Footer&lt;/h4&gt;
	&lt;/div&gt;

&lt;/div&gt;

&lt;!-- Step Three --&gt;
&lt;div data-role="page" id="step3"&gt;

	&lt;div data-role="header"&gt;
		&lt;a href="index.html" data-icon="home"&gt;Home&lt;/a&gt;
		&lt;h1&gt;Reg Form&lt;/h1&gt;
	&lt;/div&gt;

	&lt;div data-role="content"&gt;	
	
		&lt;form method="post" class="msform" data-ajax="false"&gt;
		&lt;input type="hidden" name="nextStep" value="echo.cfm"&gt;
	
			&lt;div data-role="fieldcontain"&gt;
			    &lt;fieldset data-role="controlgroup"&gt;
		
				   &lt;legend&gt;Stuff I like:&lt;/legend&gt;
		
				   &lt;input type="checkbox" name="stuffilike" id="checkbox-1" value="Star Wars"  /&gt;
				   &lt;label for="checkbox-1"&gt;Star Wars&lt;/label&gt;
		
				   &lt;input type="checkbox" name="stuffilike" id="checkbox-2" value="BSG" /&gt;
				   &lt;label for="checkbox-2"&gt;BSG&lt;/label&gt;
		
				   &lt;input type="checkbox" name="stuffilike" id="checkbox-3" value="Beer"  /&gt;
				   &lt;label for="checkbox-3"&gt;Beer&lt;/label&gt;
		
			    &lt;/fieldset&gt;
			&lt;/div&gt;
		
			&lt;div data-role="fieldcontain"&gt;        
		        &lt;input type="submit" name="submit3" value="Send"  /&gt;        
		    &lt;/div&gt;	
	
	
		&lt;/form&gt;
		
	&lt;/div&gt;

	&lt;div data-role="footer"&gt;
		&lt;h4&gt;Page Footer&lt;/h4&gt;
	&lt;/div&gt;

&lt;/div&gt;

&lt;script&gt;
$("#step1").live("pageinit", function() {
	$("form.msform").live("submit", handleMSForm);	
});
&lt;/script&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>

<p>

Holy smokes - that's a big template. Basically what I've done here is put every form into it's own "Page" object. The actual form fields aren't really that important. Do note though the use of hidden form fields. That's going to come into play real soon now. Finally, note at the end I've registered a pageinit handler. I'm asking it to notice the submit of <i>any</i> form using the class "msform". handleMSForm is defined in main.js:

<p>

<code>
var formData = {};

function handleMSForm(e) {
		var next = "";
		
		//gather the fields
		var data = $(this).serializeArray();

		//store them - assumes unique names
		for(var i=0; i&lt;data.length; i++) {
			//If nextStep, it's our metadata, don't store it in formdata
			if(data[i].name=="nextStep") {% raw %}{ next=data[i].value;  continue; }{% endraw %}
			//if we have it, add it to a list. This is not "comma" safe.
			if(formData.hasOwnProperty(data[i].name)) formData[data[i].name] += ","+data[i].value;
			else formData[data[i].name] = data[i].value;
		}

		//now - we need to go the next page...
		//if next step isn't a full url, we assume internal link
		//logic will be, if something.something, do a post
		if(next.indexOf(".") == -1) {
			var nextPage = "#" + next;
			$.mobile.changePage(nextPage);
		} else {
			$.mobile.changePage(next, {% raw %}{type:"post",data:formData}{% endraw %});
		}
		e.preventDefault();
	
};
</code>

<p>

So - what's going on here? My basic idea here is that on every form submit, I want to gather, and store, the form data. When done I can send the entire thing at once to the server. I begin with an object, formData. That's going to store name/value pairs of form information. Next is handleMSForm. It begins by calling serializeArray() on the form. This is a jQuery utility that will gather up all the form fields and return them as an array. I then just have to loop over them. Remember I said those hidden form fields would come into play? I'm using them for a bit of logic, so if I encounter them, I store the value separately and then continue looping over the data. I do a bit of logic to see if a value already exists, and if so, I append it. (This is important for checkboxes.) 

<p>

After storing the data, I then look at the "next" variable. Remember this stored the value from the hidden form field. I decided that any simple value, like "foo", implied the ID of a page to load. Therefore, if the value does not have a dot in it, I simply load the next page. If it <i>does</i> have a dot, I'm assuming something.cfm, or .php, you get the idea, and I switch to a post operation. 

<p>

All in all - it works ok. You can see my note about commas and values, but for the most part, you can probably not worry about that. (And if it does concern you, just store it as an array and JSON-encode the value.) You can try this code yourself via the link below.

<p>

<a href="http://coldfusionjedi.com/demos/2011/nov/22/draft5/"><img src="https://static.raymondcamden.com/images/cfjedi/icon_128.png" title="Demo, Baby" border="0"></a>