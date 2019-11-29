---
layout: post
title: "Quick and dirty CAPTCHA Guide - for ColdFusion 8"
date: "2008-02-28T12:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/02/28/Quick-and-dirty-CAPTCHA-Guide-for-ColdFusion-8
guid: 2680
---

A few months ago I posted a quick guide to walk folks through adding CAPTCHA's to forms:

<a href="http://www.raymondcamden.com/index.cfm/2006/11/14/Quick-and-dirty-CAPTCHA-Guide">Quick and dirty CAPTCHA Guide</a>

This guide made use of the excellent <a href="http://lyla.maestropublishing.com/">Lyla CAPTCHA</a> component. One of the new features of ColdFusion 8 is a built in CAPTCHA generator. So let's take a look at how we can do it the CF8 way...
<!--more-->
First off, let's start with a simple contact us style form. I won't go into details about this form. It's a basic self-posting form with validation for a name and comment box. 

<code>
&lt;cfset showForm = true&gt;
&lt;cfparam name="form.name" default=""&gt;
&lt;cfparam name="form.comments" default=""&gt;

&lt;cfif isDefined("form.send")&gt;
	&lt;cfset errors = ""&gt;
	
	&lt;cfif not len(trim(form.name))&gt;
		&lt;cfset errors = errors & "You must include your name.&lt;br /&gt;"&gt;
	&lt;/cfif&gt;

	&lt;cfif not len(trim(form.comments))&gt;
		&lt;cfset errors = errors & "You must include your comments.&lt;br /&gt;"&gt;
	&lt;/cfif&gt;
		
	&lt;cfif errors is ""&gt;
		&lt;!--- do something here ---&gt;
		&lt;cfset showForm = false&gt;
	&lt;/cfif&gt;
	
&lt;/cfif&gt;

&lt;cfif showForm&gt;

	&lt;cfoutput&gt;
	&lt;p&gt;
	Please fill the form below.
	&lt;/p&gt;
	
	&lt;cfif isDefined("errors")&gt;
	&lt;p&gt;
	&lt;b&gt;Correct these errors:&lt;br /&gt;#errors#&lt;/b&gt;
	&lt;/p&gt;
	&lt;/cfif&gt;
	
	&lt;form action="#cgi.script_name#" method="post" &gt;
	&lt;table&gt;
		&lt;tr&gt;
			&lt;td&gt;Name:&lt;/td&gt;
			&lt;td&gt;&lt;input name="name" type="text" value="#form.name#"&gt;&lt;/td&gt;
		&lt;/tr&gt;
		&lt;tr&gt;
			&lt;td&gt;Comments:&lt;/td&gt;
			&lt;td&gt;&lt;textarea name="comments"&gt;#form.comments#&lt;/textarea&gt;&lt;/td&gt;
		&lt;/tr&gt;
		&lt;tr&gt;
			&lt;td&gt;&nbsp;&lt;/td&gt;
			&lt;td&gt;&lt;input type="submit" name="send" value="Send Comments"&gt;&lt;/td&gt;
		&lt;/tr&gt;
	&lt;/table&gt;
	&lt;/form&gt;
	&lt;/cfoutput&gt;
	
&lt;cfelse&gt;

	&lt;cfoutput&gt;
	&lt;p&gt;
	Thank you for submitting your information, #form.name#. We really do care
	about your comments. Seriously. We care a lot.
	&lt;/p&gt;
	&lt;/cfoutput&gt;
	
&lt;/cfif&gt;
</code>

Hopefully nothing above is new to you. So lets start updating this with some CAPTCHA love. First off, creating a CAPTCHA in ColdFusion 8 is incredibly easy. It takes all of one tag:

<code>
&lt;cfimage action="captcha" width="300" height="75" text="paris"&gt;
</code>

The width and height determine the size of the image. The text determines what text will be displayed on the CAPTCHA. You can also determine what fonts to use - as well as the difficulty level. 

So that part is easy. Everything after that takes a little bit of work. The first thing you need to figure out is what text to use. In the example above I used a hard coded value, paris, but in the real world you wouldn't do that. If you do, spammers would get past your CAPTCHA rather quickly. 

You can create a list of random words - but unless your list is pretty big, you will again have the issue of spammers being able to guess the word. Instead, I recommend a random set of letters. I've built a UDF just for this purpose. Let's take a look:

<code>
&lt;cffunction name="makeRandomString" returnType="string" output="false"&gt;
	&lt;cfset var chars = "23456789ABCDEFGHJKMNPQRS"&gt;
	&lt;cfset var length = randRange(4,7)&gt;
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

This UDF simply creates a random string from 4 to 7 characters long. You can tweak that size all you want, but any more than 7 will probably tick off your visitors. Also note the range of characters. I removed things like 1 (number one), l (lower case 'el'), and I (upper case "eye') since they can be confusing. Thanks to the NYCFUG members for feedback on this. 

So once we have the UDF, we can now generate random text. But now we have another problem. When we submit the form, we are going to need to validate that the text you entered is the same as the text in the image. To do that, we need to store the text. Imagine if we did this:

<code>
&lt;cfset captcha = makeRandomString()&gt;
&lt;input type="hidden" name="captchatext" value="#captcha#"&gt;
</code>

As you can imagine, this is not very secure. A spammer would simply look for the hidden form field. So we need to encrypt the string somehow. ColdFusion offers multiple ways of doing this. For example though I'll just hash it:

<code>
&lt;cfset captcha = makeRandomString()&gt;
&lt;cfset captchaHash = hash(captcha)&gt;
</code>

Then I can add the CAPTCHA to my form like so:

<code>
&lt;tr&gt;
	&lt;td&gt;Enter Text Below:&lt;/td&gt;
	&lt;td&gt;&lt;input type="text" name="captcha"&gt;&lt;/td&gt;
&lt;/tr&gt;
&lt;tr&gt;
	&lt;td colspan="2"&gt;
	&lt;cfimage action="captcha" width="300" height="75" text="#captcha#"&gt;
	&lt;input type="hidden" name="captchaHash" value="#captchaHash#"&gt;
	&lt;/td&gt;
&lt;/tr&gt;		
</code>

Now the form has both the captcha and the text in hashed form. The last step is to just add the new validation. I do this by hashing the user's text against the hidden form field:

<code>
&lt;cfif hash(ucase(form.captcha)) neq form.captchaHash&gt;
	&lt;cfset errors = errors & "You did not enter the right text. Are you a spammer?&lt;br /&gt;"&gt;
&lt;/cfif&gt;
</code>

And that's it. I'm done. The complete template is below. Enjoy.

<code>
&lt;cffunction name="makeRandomString" returnType="string" output="false"&gt;
	&lt;cfset var chars = "23456789ABCDEFGHJKMNPQRS"&gt;
	&lt;cfset var length = randRange(4,7)&gt;
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

&lt;cfset showForm = true&gt;
&lt;cfparam name="form.name" default=""&gt;
&lt;cfparam name="form.comments" default=""&gt;
&lt;cfparam name="form.captcha" default=""&gt;
&lt;cfparam name="form.captchaHash" default=""&gt;

&lt;cfif isDefined("form.send")&gt;
	&lt;cfset errors = ""&gt;
	
	&lt;cfif not len(trim(form.name))&gt;
		&lt;cfset errors = errors & "You must include your name.&lt;br /&gt;"&gt;
	&lt;/cfif&gt;

	&lt;cfif not len(trim(form.comments))&gt;
		&lt;cfset errors = errors & "You must include your comments.&lt;br /&gt;"&gt;
	&lt;/cfif&gt;

	&lt;cfif hash(ucase(form.captcha)) neq form.captchaHash&gt;
		&lt;cfset errors = errors & "You did not enter the right text. Are you a spammer?&lt;br /&gt;"&gt;
	&lt;/cfif&gt;
		
	&lt;cfif errors is ""&gt;
		&lt;!--- do something here ---&gt;
		&lt;cfset showForm = false&gt;
	&lt;/cfif&gt;
	
&lt;/cfif&gt;

&lt;cfif showForm&gt;

	&lt;cfset captcha = makeRandomString()&gt;
	&lt;cfset captchaHash = hash(captcha)&gt;

	&lt;cfoutput&gt;
	&lt;p&gt;
	Please fill the form below.
	&lt;/p&gt;
	
	&lt;cfif isDefined("errors")&gt;
	&lt;p&gt;
	&lt;b&gt;Correct these errors:&lt;br /&gt;#errors#&lt;/b&gt;
	&lt;/p&gt;
	&lt;/cfif&gt;
	
	&lt;form action="#cgi.script_name#" method="post" &gt;
	&lt;table&gt;
		&lt;tr&gt;
			&lt;td&gt;Name:&lt;/td&gt;
			&lt;td&gt;&lt;input name="name" type="text" value="#form.name#"&gt;&lt;/td&gt;
		&lt;/tr&gt;
		&lt;tr&gt;
			&lt;td&gt;Comments:&lt;/td&gt;
			&lt;td&gt;&lt;textarea name="comments"&gt;#form.comments#&lt;/textarea&gt;&lt;/td&gt;
		&lt;/tr&gt;
		&lt;tr&gt;
			&lt;td&gt;Enter Text Below:&lt;/td&gt;
			&lt;td&gt;&lt;input type="text" name="captcha"&gt;&lt;/td&gt;
		&lt;/tr&gt;
		&lt;tr&gt;
			&lt;td colspan="2"&gt;
			&lt;cfimage action="captcha" width="300" height="75" text="#captcha#"&gt;
			&lt;input type="hidden" name="captchaHash" value="#captchaHash#"&gt;
			&lt;/td&gt;
		&lt;/tr&gt;		
		&lt;tr&gt;
			&lt;td&gt;&nbsp;&lt;/td&gt;
			&lt;td&gt;&lt;input type="submit" name="send" value="Send Comments"&gt;&lt;/td&gt;
		&lt;/tr&gt;
	&lt;/table&gt;
	&lt;/form&gt;
	&lt;/cfoutput&gt;
	
&lt;cfelse&gt;

	&lt;cfoutput&gt;
	&lt;p&gt;
	Thank you for submitting your information, #form.name#. We really do care
	about your comments. Seriously. We care a lot.
	&lt;/p&gt;
	&lt;/cfoutput&gt;
	
&lt;/cfif&gt;
</code>