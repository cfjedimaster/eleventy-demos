---
layout: post
title: "An Introduction to jQuery and Form Validation (3)"
date: "2009-02-12T09:02:00+06:00"
categories: [coldfusion,jquery]
tags: []
banner_image: 
permalink: /2009/02/12/An-Introduction-to-jQuery-and-Form-Validation-3
guid: 3235
---

For my final (well, for now) post on jQuery and forms validation, I thought I'd actually create a real form with actual back end processing. I'm going to demonstrate with a form that makes use of both client-side and server-side validation, and also demonstrate one of the cooler features of the jQuery <a href="http://docs.jquery.com/Plugins/Validation">Validation</a> library - remote validation.
<!--more-->
Let's get started by describing our form and building it for entirely server-side validation. Imagine that I run a blog aggregator (oh wait, I <a href="http://www.coldfusionbloggers.org">do</a>) and I want to make it easy for folks to send me information on their blogs so I can add it to the database. I'd need a form that asks for their blog name, URL, and RSS URL. (To be anal, I also use a description field at CFBloggers, but I'll keep it simple for now.) When not working within a framework like Model-Glue, I'll typically build a self-posting form (pseudo-code):

<code>
default form value

notice a form submission:
  create a list of errors
  if no errors, email, save to db, etc, and push to thank you page

display form:
  optionally display errors 
</code>

Here is the initial version of the form with ColdFusion performing the validation server side. I assume none of this is unusual and since and the focus here is on jQuery I won't go over the code.

<code>
&lt;cfparam name="form.blogname" default=""&gt;
&lt;cfparam name="form.blogurl" default=""&gt;
&lt;cfparam name="form.rssurl" default=""&gt;

&lt;cfif structKeyExists(form, "save")&gt;
	&lt;cfset errors = []&gt;
	&lt;cfif not len(trim(form.blogname))&gt;
		&lt;cfset arrayAppend(errors, "You must include a blog name.")&gt;
	&lt;/cfif&gt;
	&lt;cfif not len(trim(form.blogurl)) or not isValid("url", form.blogurl)&gt;
		&lt;cfset arrayAppend(errors, "You must include a blog url.")&gt;
	&lt;/cfif&gt;
	&lt;cfif not len(trim(form.rssurl)) or not isValid("url", form.rssurl)&gt;
		&lt;cfset arrayAppend(errors, "You must include a rss url.")&gt;
	&lt;/cfif&gt;
	&lt;cfif arrayLen(errors) is 0&gt;
		&lt;cfmail to="ray@camdenfamily.com" from="ray@camdenfamily.com" subject="RSS Submission"&gt;
Blog Name:	#form.blogname#
Blog URL:	#form.blogurl#
RSS URL:	#form.rssurl#
		&lt;/cfmail&gt;
		&lt;cflocation url="rssaddthanks.cfm" addToken="false" /&gt;
	&lt;/cfif&gt;
&lt;/cfif&gt;

&lt;!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"&gt;
&lt;html xmlns="http://www.w3.org/1999/xhtml"&gt;
&lt;head&gt;
&lt;meta http-equiv="Content-Type" content="text/html; charset=UTF-8" /&gt;
&lt;title&gt;Untitled Document&lt;/title&gt;
&lt;/head&gt;

&lt;body&gt;

&lt;h2&gt;Add RSS Feed&lt;/h2&gt;
&lt;form id="mainform" action="rssadd.cfm" method="post"&gt;
&lt;fieldset&gt;

&lt;cfif structKeyExists(variables,"errors")&gt;
	&lt;b&gt;Please correct the following error(s):&lt;/b&gt;&lt;br/&gt;
	&lt;ul&gt;
	&lt;cfloop index="e" array="#errors#"&gt;
	&lt;li&gt;&lt;cfoutput&gt;#e#&lt;/cfoutput&gt;&lt;/li&gt;
	&lt;/cfloop&gt;
	&lt;/ul&gt;
&lt;/cfif&gt;	

&lt;legend&gt;Fill out the details of you blow below.&lt;/legend&gt;
&lt;cfoutput&gt;
&lt;p&gt;
&lt;label for="blogname"&gt;Blog Name&lt;/label&gt;
&lt;em&gt;*&lt;/em&gt;&lt;input id="blogname" name="blogname" size="25" value="#form.blogname#" /&gt;
&lt;/p&gt;
&lt;p&gt;
&lt;label for="blogurl"&gt;Blog URL&lt;/label&gt;
&lt;em&gt;*&lt;/em&gt;&lt;input id="blogurl" name="blogurl" size="25" value="#form.blogurl#" /&gt;
&lt;/p&gt;
&lt;p&gt;
&lt;label for="rssurl"&gt;RSS URL&lt;/label&gt;
&lt;em&gt;*&lt;/em&gt;&lt;input id="rssurl" name="rssurl" size="25" value="#form.rssurl#" /&gt;
&lt;/p&gt;
&lt;/cfoutput&gt;
&lt;p&gt;
&lt;input class="submit" type="submit" name="save" value="Submit"/&gt;
&lt;/p&gt;
&lt;/fieldset&gt;
&lt;/form&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>

Alright, so nothing too scary in there, right? You can demo this online <a href="http://www.raymondcamden.com/demos/jqueryvalidation/rssadd.cfm">here</a>. 

Let's add some jQuery love to the page. I'll begin by including my libraries of course:

<code>
&lt;script src="/jquery/jquery.js"&gt;&lt;/script&gt;
&lt;script src="/jquery/jquery.validate.js"&gt;&lt;/script&gt;
</code>

Next I'll set up my validation and rules:

<code>
$(document).ready(function(){
    $("#mainform").validate({
    rules: {
    	blogname: "required"
	   ,blogurl: "required url"
       ,rssurl: "required url"
    }
	
    });
});
</code>

The details of how this works are described in my <a href="http://www.coldfusionjedi.com/index.cfm/2009/2/10/An-Introduction-to-jQuery-and-Form-Validation-2">last entry</a>, but basically I'm saying that all 3 fields are required and blogurl and rssurl also need url validation. (Hey IE folks, did I do my commas right?)

Again, this just plain works. You can demo this <a href="http://www.coldfusionjedi.com/demos/jqueryvalidation/rssadd2.cfm">here</a>. If you disable JavaScript, you still get the server side validation. It took me about 30 seconds to add in the JS validation though so I don't mind writing it twice. 

Alright, but now it's time to get sexy. jQuery's validation plugin comes in with a number of default rules you can use. I also demonstrated how you can write your own rules. Sometimes though there are things you want to do that are impossible with JavaScript. jQuery Validation supports a style of validation simply called 'remote'. By specifying a URL for a validation rule, the plugin will automatically run your URL (passing the field name and field value). Your server-side code does what it needs to and outputs either true or false. Let me demonstrate. First, I'll modify my rules declaration:

<code>
rules: {
  blogname: "required"
  ,blogurl: {
    required:true
    ,url:true
    ,remote:"rssprocess.cfm"
  }
  ,rssurl: {
    required:true
    ,url:true
    ,remote:"rssprocess.cfm"
  }
}
</code>

So, in English, this means that:

The name value will be required.<br/>
The blogurl value will be required, must be a URL, and the value will be passed to rssprocess.cfm and it must return true.<br/>
The rssurl value will be required, must be a URL, and the value will be passed to rssprocess.cfm and it must return true.<br/>

I'm using the same file to process both requests. I can do this because the plugin will send the name of the field as well. I could have used two different CFMs, or even two different CFC methods. Let's look at rssprocess.cfm:

<code>
&lt;cfsetting enablecfoutputonly="true"&gt;

&lt;cfif structKeyExists(url, "blogurl")&gt;

	&lt;!--- if blogurl, just do a check for status code 200 ---&gt;
	&lt;cfhttp url="#url.blogurl#" result="result"&gt;
	&lt;cfif structKeyExists(result.responseheader,"status_code") and result.responseheader.status_code is 200&gt;
		&lt;cfoutput&gt;true&lt;/cfoutput&gt;
	&lt;cfelse&gt;
		&lt;cfoutput&gt;false&lt;/cfoutput&gt;
	&lt;/cfif&gt;

&lt;cfelseif structKeyExists(url, "rssurl")&gt;

	&lt;!--- if blogurl, just do a check for status code 200 ---&gt;
	&lt;cftry&gt;
		&lt;cffeed source="#url.rssurl#" query="foo"&gt;
		&lt;cfoutput&gt;true&lt;/cfoutput&gt;
		&lt;cfcatch&gt;
			&lt;cfoutput&gt;false&lt;/cfoutput&gt;
		&lt;/cfcatch&gt;
	&lt;/cftry&gt;
&lt;cfelse&gt;
	&lt;cfoutput&gt;false&lt;/cfoutput&gt;
&lt;/cfif&gt;
</code>

I begin by turning on cfoutputonly. I'm not sure how well the plugin will handle values with whitespace around so it so I'm going to be anal about my output. I then check my URL scope. If blogurl was sent, I just do a HTTP check to ensure the URL exists. If rssurl was sent, I try to read it with cffeed and return true if the RSS feed can be parsed by CF. Notice that I return false in all error conditions, and if no value was passed at all. (Because people like me will run your site with Firebug, notice the Ajax requests, and try to run the file manually.) 

You can demo this <a href="http://www.coldfusionjedi.com/demos/jqueryvalidation/rssadd3.cfm">here</a>. I also added custom messages. You can view source on the demo to see that. That's it. I don't think I'll write another form without jQuery validation in it!

<b>Edit at 9:36AM CST</b> Epic fail on my part. Thank you to Esmeralda for reminding me. I forgot to htmlEditFormat the form data to help prevent XSS type attacks. I normally do something like this in all my form checks:

<code>
&lt;cfif not len(trim(form.blogname))&gt;
	&lt;cfset arrayAppend(errors, "You must include a blog name.")&gt;
&lt;cfelse&gt;
	&lt;cfset form.blogname = htmlEditFormat(trim(form.blogname))&gt;
&lt;/cfif&gt;
</code>

Note the use of both trim and htmlEditFormat. Anyway, I've added it to all 3 dems, and thank you again Esmeralda for the reminder!