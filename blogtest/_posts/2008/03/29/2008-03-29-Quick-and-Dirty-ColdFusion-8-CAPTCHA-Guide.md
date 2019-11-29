---
layout: post
title: "Quick and Dirty ColdFusion 8 CAPTCHA Guide"
date: "2008-03-29T22:03:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/03/29/Quick-and-Dirty-ColdFusion-8-CAPTCHA-Guide
guid: 2738
---

Many moons ago I wrote a blog entry on doing CAPTCHA's in ColdFusion (<a href="http://www.raymondcamden.com/index.cfm/2006/11/14/Quick-and-dirty-CAPTCHA-Guide#cFD0E4FC7-19B9-E658-9D538572D8F9CABF">Quick and dirty CAPTCHA Guide</a>). This guide discussed how to add CAPTCHA images to your forms using third party tools in ColdFusion 7. One of the new features in ColdFusion 8 is built-in CAPTCHA support, so I thought it would be nice to upgrade the guide.
<!--more-->
As in the <a href="http://www.coldfusionjedi.com/index.cfm/2006/11/14/Quick-and-dirty-CAPTCHA-Guide#cFD0E4FC7-19B9-E658-9D538572D8F9CABF">previous</a> version, we will begin with a simple form. This is a contact form with fields for name, email, and comments. Validation is built in for all three fields. The complete, initial form is below:

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
   &lt;form action="#cgi.script_name#" method="post"&gt;
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

Hopefully nothing there was new to you. (But I bet there are still a few of you who have not yet used <a href="http://www.cfquickdocs.com/cf8/?getDoc=IsValid">isValid</a>!). Now that the basic form is done - it won't take long for spammers to begin abusing it. How can we add a CAPTCHA to the form?

ColdFusion 8 makes it incredibly easy with the CFIMAGE tag. One of the many actions it contains is a CAPTCHA action. As you can imagine, this generates a CAPTCHA image. Here is a basic example:

<code>
&lt;cfimage action="captcha" width="300" height="75" text="Hello" fonts="verdana,arial"&gt;
</code>

And this generates:

<img src="https://static.raymondcamden.com/images/cfjedi//Picture 19.png">

You have many options to customize the CAPTCHA. Please see the ColdFusion documentation for a complete list, but in general, the attributes you care about are:

<ul>
<li>difficulty: This can be low, medium, and high. Low is the default. I find medium to be too strong. You will have to decide for yourself though.
<li>width/height: I normally use what you see above, 300x75. What's important here though is to ensure your image is big enough to fit the CAPTCHA text. What's cool though is that if you don't use a size big enough for the text, you will get an error telling you exactly how big it does need to be. (Although oddly they tell you one less then the minimum size. So they may say you need width of 100, but what they really mean is 101.)
<li>fonts: Specifies the fonts for the CAPTCHA. You want to specify this since most servers have a 'ding bats' or other fruity font that will be impossible for folks to decipher.
<li>text: This is the text of the CAPTHA and will be our focus next.
</ul>

So in the example above, I used a hard coded text of "hello". While this was easy, it won't take long for spammers to notice that the CAPTCHA text doesn't change. You could always pick a random word from a list. What I do instead, though is use a simple UDF. This UDF will pick random letters and numbers, but will specifically avoid things like "I" (capital 'eye'), "l" (lower case 'el'), and 1. You could modify this UDF to allow for the min and max text strings to be arguments. For me - I thought 4-6 characters was enough. (For an insane CAPTCHA, try the <a href="http://www.blingo.com/friends?ref=b2e3vX853JyHUJuneayprdFK800">Blingo</a> service. Blingo (that's an affiliate link by the way) is a search engine provider that enters you in a contest for every search you do. When you win (I've won a few times), the CAPTCHA is - I kid you not - something like 20-30 characters. It's the Klingon of CAPTCHAs.)

<code>
&lt;cffunction name="makeRandomString" returnType="string" output="false"&gt;
	&lt;cfset var chars = "23456789ABCDEFGHJKMNPQRS"&gt;
	&lt;cfset var length = randRange(4,6)&gt;
	&lt;cfset var result = ""&gt;
	&lt;cfset var i = ""&gt;
	&lt;cfset var char = ""&gt;
	
	&lt;cfscript&gt;
	for(i=1; i &lt;= length; i++) {
		char = mid(chars, randRange(1, len(chars)),1);
		result&=char;
	}
	&lt;/cfscript&gt;
		
	&lt;cfreturn result&gt;
&lt;/cffunction&gt;
</code>

Nothing special going on here in the UDF. As you can see it just loops and randomly picks characters. So in order to use this, we could now do this:

<code>
&lt;cfimage action="captcha" width="300" height="75" text="#makeRandomString()#"  fonts="verdana,arial"&gt;
</code>

While this works, it leads to our final problem. How do we validate the CAPTCHA text? We could save the text and put it in a hidden form field:

<code>
&lt;cfset captcha = makeRandomString()&gt;
&lt;input type="hidden" name="captchatext" vale="#captcha#"&gt;
&lt;cfimage action="captcha" width="300" height="75" text="#captcha#"  fonts="verdana,arial"&gt;
</code>

But don't forget that hidden form fields aren't really hidden. It won't take long for spammers to find this either. (Just imagine if these jerks actually spent their time helping the poor?) 

So we have a few options here. For this guide (and what I've demonstrated before in presentations) I'm going to use a Hash() of the CAPTCHA text. I could store the value in the Session, but I wanted something that folks could use even if they had session management turned off. 

Just take that CAPTCHA string and store a hash of it, like so:

<code>
&lt;cfset captcha = makeRandomString()&gt;
&lt;cfset captchaHash = hash(captcha)&gt;
&lt;input type="hidden" name="captchaHash" value="#captchaHash#"&gt;

&lt;cfimage action="captcha" width="300" height="75" text="#captcha#"  fonts="verdana,arial"&gt;
</code>

We now have the CAPTHA stored in a hash. On form submission, all we have to do is compare the hash of what you wrote to the hash in the hidden field:

<code>
&lt;cfif hash(form.captcha) neq form.captchaHash&gt;
  &lt;cfset error = error & "You did not enter the right text. Are you a spammer?&lt;br /&gt;"&gt;
&lt;/cfif&gt;
</code>

All in all - not very hard at all. I'm a bit surprised Adobe didn't include a simple 'makeRandomText' function as you really need it for CAPTCHAs. They could also have included it as an attribute to cfimage. But since they added 50 functions and an uber-tag, I can't complain too much. (Ok, I can, but I won't. Today.) Let me know if this guide is helpful. I've included the complete document for our form below. Enjoy.

<code>
&lt;cffunction name="makeRandomString" returnType="string" output="false"&gt;
	&lt;cfset var chars = "23456789ABCDEFGHJKMNPQRS"&gt;
	&lt;cfset var length = randRange(4,6)&gt;
	&lt;cfset var result = ""&gt;
	&lt;cfset var i = ""&gt;
	&lt;cfset var char = ""&gt;
	
	&lt;cfscript&gt;
	for(i=1; i &lt;= length; i++) {
		char = mid(chars, randRange(1, len(chars)),1);
		result&=char;
	}
	&lt;/cfscript&gt;
		
	&lt;cfreturn result&gt;
&lt;/cffunction&gt;

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
   &lt;cfif hash(form.captcha) neq form.captchaHash&gt;
      &lt;cfset error = error & "You did not enter the right text. Are you a spammer?&lt;br /&gt;"&gt;
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
   &lt;form action="#cgi.script_name#" method="post"&gt;
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
	  	 &lt;td&gt;Enter Text Below:&lt;/td&gt;
	  	 &lt;td&gt;&lt;input type="text" name="captcha"&gt;&lt;/td&gt;
	  &lt;/tr&gt;

	  &lt;cfset captcha = makeRandomString()&gt;
	  &lt;cfset captchaHash = hash(captcha)&gt;
	  &lt;input type="hidden" name="captchaHash" value="#captchaHash#"&gt;
	  
	  &lt;tr&gt;
	  	 &lt;td colspan="2"&gt;&lt;cfimage action="captcha" width="300" height="75" text="#captcha#"  fonts="verdana,arial"&gt;&lt;/td&gt;
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