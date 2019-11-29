---
layout: post
title: "Quick and dirty CAPTCHA Guide"
date: "2006-11-14T09:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/11/14/Quick-and-dirty-CAPTCHA-Guide
guid: 1653
---

A reader recently sent me a note saying he was trying to add CAPTCHA to his site. He had been trying to see how I used it in BlogCFC, and was just confused by what he saw. I thought I'd write a quick and simple guide for getting CAPTCHA on a form.
<!--more-->
First - let's look at a simple form without CAPTCHA.
<code>
&lt;cfparam name="form.name" default=""&gt;
&lt;cfparam name="form.email" default=""&gt;
&lt;cfparam name="form.comments" default=""&gt;
&lt;cfset showForm = true&gt;

&lt;cfif structKeyExists(form, "sendcomments")&gt;
	&lt;cfset error = ""&gt;
	&lt;cfif not len(trim(form.name))&gt;
		&lt;cfset error = error & "You must include your name, bozo.&lt;br&gt;"&gt;
	&lt;/cfif&gt;
	&lt;cfif not len(trim(form.email)) or not isValid("email", form.email)&gt;
		&lt;cfset error = error & "Include a valid email address idiot!&lt;br&gt;"&gt;
	&lt;/cfif&gt;
	&lt;cfif not len(trim(form.comments))&gt;
		&lt;cfset error = error & "It's called a Comment Form, stupid.&lt;br&gt;"&gt;
	&lt;/cfif&gt;
	&lt;cfif error is ""&gt;
		&lt;cfmail to="foo@foo.com" from="#form.email#" subject="Pointless comments from the public" wraptext="75"&gt;
From: #form.name# (#form.email#)
Comments:
#form.comments#
		&lt;/cfmail&gt;
		&lt;cfset showForm = false&gt;
	&lt;/cfif&gt;
&lt;/cfif&gt;
	
&lt;cfif showForm&gt;
	&lt;cfif structKeyExists(variables, "error")&gt;
		&lt;cfoutput&gt;
		&lt;p&gt;
		&lt;b&gt;Please correct these errors:&lt;br&gt;
		#error#
		&lt;/b&gt;
		&lt;/p&gt;
		&lt;/cfoutput&gt;
	&lt;/cfif&gt;
	
	&lt;cfoutput&gt;
	&lt;form action="test.cfm" method="post"&gt;
	&lt;table&gt;
		&lt;tr&gt;
			&lt;td&gt;Your Name:&lt;/td&gt;
			&lt;td&gt;&lt;input type="text" name="name" value="#form.name#"&gt;&lt;/td&gt;
		&lt;/tr&gt;
		&lt;tr&gt;
			&lt;td&gt;Your Email:&lt;/td&gt;
			&lt;td&gt;&lt;input type="text" name="email" value="#form.email#"&gt;&lt;/td&gt;
		&lt;/tr&gt;
		&lt;tr&gt;
			&lt;td&gt;Your Comments:&lt;/td&gt;
			&lt;td&gt;&lt;textarea name="comments"&gt;#form.comments#&lt;/textarea&gt;&lt;/td&gt;
		&lt;/tr&gt;
		&lt;tr&gt;
			&lt;td&gt;&nbsp;&lt;/td&gt;
			&lt;td&gt;&lt;input type="submit" name="sendcomments" value="Send Comments"&gt;&lt;/td&gt;
		&lt;/tr&gt;
	&lt;/table&gt;
	&lt;/form&gt;
	&lt;/cfoutput&gt;
&lt;cfelse&gt;
	&lt;cfoutput&gt;
	&lt;p&gt;
	Thank you for sending your comments, #form.name#.
	&lt;/p&gt;
	&lt;/cfoutput&gt;
&lt;/cfif&gt;
</code>

I'm not going to say anything about this code as it's a fairly typical form. This will serve as a base form that we will be adding CAPTCHA too. 

There are multiple CAPTCHA solutions out there, including the built-in support in BlueDragon and <a href="http://www.alagad.com/index.cfm/name-captcha">Alagad's CAPTCHA component</a>. For this demo however I'm going to use the same product I used in BlogCFC, <a href="http://lyla.maestropublishing.com/">Lyla Captcha</a>. This is a free product and is pretty simple to get up and running quickly. Download the product and unzip it to a folder. Any folder will do. Just make sure your application can access it. 

The first thing we will do in our new form is to create an instance of the CFC:

<code>
&lt;cfif not structKeyExists(application, "captcha")&gt;
	&lt;cfset application.captcha = createObject("component", "captchaService").init(configFile="captcha.xml") /&gt;
	&lt;cfset application.captcha.setup()&gt;
&lt;/cfif&gt;
</code>

Lyla Captcha is configured via an XML file. You don't need to touch it immediately though. (Although I'll be pointing to a darn good blog entry about this XML file later on.)

Now we need to add the CAPTCHA to the form. I added a new row to my table with this code:

<code>
&lt;tr&gt;
	&lt;td&gt;Enter Text Shown in Picture:&lt;/td&gt;
	&lt;td&gt;
	&lt;input type="text" name="captcha"&gt;&lt;br&gt;
	&lt;!--- Captcha ---&gt;
	&lt;cfset captcha = application.captcha.createHashReference()&gt;
	&lt;img src="captcha.cfm?hash=#captcha.hash#"&gt;
	&lt;input name="hash" type="hidden" value="#captcha.hash#" /&gt;
	&lt;/td&gt;
&lt;/tr&gt;
</code>

There are a few things going on here. First off - I added a new text field so the user can type in the CAPTCHA text. I then ask Lyla to create a hash reference. This is a long, random string. I pass this to a CFM that will serve up an image. Lastly, I add the hash itself as a hidden form field.

Let's leave our form for a second and look at captcha.cfm:

<code>
&lt;cfif not structKeyExists(url, "hash")&gt;
	&lt;cfabort&gt;
&lt;/cfif&gt;

&lt;cfset variables.captcha = application.captcha.createCaptchaFromHashReference("stream",url.hash) /&gt;
&lt;cfcontent type="image/jpg"  variable="#variables.captcha.stream#" reset="false" /&gt;
</code>

I do a quick check to ensure the url variable exists, and then I simply use the Lyla Captcha built in functions to get the image data. (You can also store the CAPTCHA as a physical file.)

Now let's return back to the form. To validate the CAPTCHA, I simply call one more function in the CFC:

<code>
&lt;cfif not application.captcha.validateCaptcha(form.hash, form.captcha)&gt;
	&lt;cfset error = error & "You did not match the image text. Try again with half a brain.&lt;br&gt;"&gt;
&lt;/cfif&gt;
</code>

That's it! Lyla is pretty trivial to use and you can't beat the price. Charlie Arehart also has a blog article on how to simplify the CAPTCHA text a bit - and I definitely recommend following his suggestions:

<a href="http://carehart.org/blog/client/index.cfm/2006/8/17/simplifying_lyla_in_blogcfc">Simplifying the captcha graphic in Lyla Captcha (and BlogCFC)</a>

I've included all of my text files in the attachment to this blog entry. test.cfm is the original file and test2.cfm is the file with <strike>flare</strike>CAPTCHA.<p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Cwebsites{% raw %}%5Cdev%{% endraw %}2Ecamdenfamily{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Flyla%{% endraw %}2Ezip'>Download attached file.</a></p>