---
layout: post
title: "Demo of a multi-step form in jQuery Mobile"
date: "2011-11-18T12:11:00+06:00"
categories: [coldfusion,jquery,mobile]
tags: []
banner_image: 
permalink: /2011/11/18/Demo-of-a-multistep-form-in-jQuery-Mobile
guid: 4439
---

While perusing questions over on <a href="http://www.stackoverflow.com">Stack Overflow</a> I came across a <a href="http://stackoverflow.com/questions/8036588/jquery-mobile-multipage-submit">question</a> concerning jQuery Mobile and multi-step forms. I thought I'd take a stab and building one. This is - of course - just one way to do it. At the end of the blog entry I'll discuss some alternatives to consider, and as always, I'd love to hear from my readers about how <i>they</i> would do it.
<!--more-->
<p>

One quick note. For my solution I'll be making use of ColdFusion. The technique though is what it is important. What I do here with my server side language could also be done in PHP, Ruby, etc. Let's begin with my application's home page. I made the assumption that the form would not be the first thing users see. So I created a simple page with a menu of links.

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
&lt;/head&gt; 
&lt;body&gt; 

&lt;div data-role="page"&gt;

	&lt;div data-role="header"&gt;
		&lt;h1&gt;Page Title&lt;/h1&gt;
	&lt;/div&gt;

	&lt;div data-role="content"&gt;	

		&lt;ul data-role="listview" data-inset="true"&gt;
			&lt;li&gt;&lt;a href="notreal.html"&gt;Something&lt;/a&gt;&lt;/li&gt;
			&lt;li&gt;&lt;a href="someform.cfm"&gt;The Form&lt;/a&gt;&lt;/li&gt;
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

I didn't bother building out notreal.html since the important part is the form. Please remember that if you download the zip of the code. Here's how it looks:

<p>

<img src="https://static.raymondcamden.com/images/ScreenClip231.png" />

<p>

The real meat of the logic is going to take place in someform.cfm. I decided to take the approach of a self-posting form. As you complete each step of the form, I'll take in your input, store it (in my case I'm using ColdFusion session variables, but this could be any persistence system), and increment a "step" variable that notes where you in the process. My registration form will have four steps. The first three involve actual form fields while the fourth is the final page. (This is normally where you would also store the data in the database, email it, or do whatever.) Here's the core file.

<p>

<code>
&lt;cfif not structKeyExists(session, "regform")&gt;
	&lt;cfset session.regform = {% raw %}{step=1}{% endraw %}&gt;
&lt;/cfif&gt;

&lt;cfif structKeyExists(form, "submit1")&gt;
	&lt;!--- normally we would validate the fields, for now, just store ---&gt;
	&lt;cfset session.regform.name = form.name&gt;
	&lt;cfset session.regform.email = form.email&gt;
	&lt;cfset session.regform.step = 2&gt;
&lt;/cfif&gt;
&lt;cfif structKeyExists(form, "submit2")&gt;
	&lt;cfset session.regform.gender = form.gender&gt;
	&lt;cfset session.regform.coolness = form.coolness&gt;
	&lt;cfset session.regform.step = 3&gt;
&lt;/cfif&gt;
&lt;cfif structKeyExists(form, "submit3")&gt;
	&lt;cfparam name="form.stuffilike" default=""&gt;
	&lt;cfset session.regform.stuffilike = form.stuffilike&gt;
	&lt;cfset session.regform.step = 4&gt;
&lt;/cfif&gt;

&lt;!DOCTYPE html&gt; 
&lt;html&gt; 
	&lt;head&gt; 
	&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;	
	&lt;title&gt;Page Title&lt;/title&gt; 
	&lt;link rel="stylesheet" href="http://code.jquery.com/mobile/latest/jquery.mobile.min.css" /&gt;
	&lt;script src="http://code.jquery.com/jquery-1.6.4.min.js"&gt;&lt;/script&gt;
	&lt;script src="http://code.jquery.com/mobile/latest/jquery.mobile.min.js"&gt;&lt;/script&gt;
&lt;/head&gt; 
&lt;body&gt; 

&lt;div data-role="page"&gt;

	&lt;div data-role="header"&gt;
		&lt;a href="index.html" data-icon="home"&gt;Home&lt;/a&gt;
		&lt;h1&gt;Reg Form&lt;/h1&gt;
	&lt;/div&gt;

	&lt;div data-role="content"&gt;	
	
		&lt;cfswitch expression="#session.regform.step#"&gt;
			
			&lt;cfcase value="1"&gt;
				&lt;cfinclude template="step1.cfm"&gt;
			&lt;/cfcase&gt;

			&lt;cfcase value="2"&gt;
				&lt;cfinclude template="step2.cfm"&gt;
			&lt;/cfcase&gt;

			&lt;cfcase value="3"&gt;
				&lt;cfinclude template="step3.cfm"&gt;
			&lt;/cfcase&gt;

			&lt;cfcase value="4"&gt;
				&lt;cfinclude template="step4.cfm"&gt;
				&lt;cfset structDelete(session,"regform")&gt;
			&lt;/cfcase&gt;
		&lt;/cfswitch&gt;

	&lt;/div&gt;

	&lt;div data-role="footer"&gt;
		&lt;h4&gt;Page Footer&lt;/h4&gt;
	&lt;/div&gt;

&lt;/div&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>

<p>

Starting at the top, I begin by initializing my session variable to store the form data. I'm creating a structure to keep all the values. I also default the step to 1. Skip over the validation logic a bit and go down to the main page. You can see I make use of a simple switch statement. Now - my forms are not that big. I could included the code within each of my case blocks, but I wanted to make the file a bit easier to read. If you go back to the top then, you can see where I handle the form submissions. Right now I'm not doing validation, but that would be trivial to add. The basic concept is - store the values, increment the step.

<p>

Here's the code for step 1:

<p>

<code>
&lt;form method="post"&gt;

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
</code>

<p>

And the result:

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip232.png" />

<p>

Carrying on - here is step 2. It's just more form fields and since it's pretty arbitrary, I won't bother explaining why I picked them.

<p>

<code>

&lt;form method="post"&gt;

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
</code>

<p>

Which gives us....

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip233.png" />

<p>

And then step 3....

<p>

<code>

&lt;form method="post"&gt;

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
</code>

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip234.png" />

<p>

And finally, here is step 4. Note that back in the original file, after we include this we clear out the session data. That way in case they come to the form again it should start from scratch.

<p>

<code>

&lt;p&gt;
	Thank you for completing the form.
&lt;/p&gt;

&lt;cfoutput&gt;
&lt;p&gt;
Your name is #session.regform.name# and your email address is #session.regform.email#.
&lt;/p&gt;

&lt;p&gt;
You are a #session.regform.gender# and your coolness level is #session.regform.coolness#.
&lt;/p&gt;

&lt;p&gt;
And you like #session.regform.stuffilike#.
&lt;/p&gt;
&lt;/cfoutput&gt;
</code>

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip235.png" />

<p>

And that's it. I've attached the code below. You can demo the code here: <a href="http://coldfusionjedi.com/demos/2011/nov/18/">http://coldfusionjedi.com/demos/2011/nov/18/</a>. So I mentioned alternatives - what are some?

<p>

<ul>
<li>One possibility would be to make use of 'accordion' controls. I've seen that before on multi-step forms, but not on mobile. You can see an example of the control <a href="http://jquerymobile.com/demos/1.0/docs/content/content-collapsible-set.html">here</a>. 
<li>JavaScript can be used to show and hide items - so instead of hitting the server we could simply hide a block of fields and show the next step.
</ul><p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2009%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fdraft3%{% endraw %}2Ezip'>Download attached file.</a></p>