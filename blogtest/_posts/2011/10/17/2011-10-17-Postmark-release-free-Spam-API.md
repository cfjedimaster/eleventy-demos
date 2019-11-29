---
layout: post
title: "Postmark release free Spam API"
date: "2011-10-17T17:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/10/17/Postmark-release-free-Spam-API
guid: 4395
---

Earlier today Postmark released a free (*) API to perform SpamAssasin checks. This means you can now integrate a free spam check into your application. The API, documented <a href="http://spamcheck.postmarkapp.com/doc">here</a>, is very easy to use. You simply pass in your email and get either a score back or a score and a full report on how the score was generated. The only real difficult part fo the API is that you are intended to send a full email document. By that I mean the text file that represents what an email looks like "raw". Here's how I built a checker in ColdFusion. I did this all in about twenty minutes so please feel free to do this better/faster/quicker.
<!--more-->
<p>

First, I did a "typical" self-posting form with basic error checking. The idea is that the form would allow an admin to send out a newsletter to his or her users. The code just handles form and validation. An actual newsletter implementation would take about five more minutes. (cfquery to cfmail is about as simple as you can make it!)

<p/>

<code>
&lt;cfparam name="form.title" default=""&gt;
&lt;cfparam name="form.body" default=""&gt;

&lt;!--- used for fake email ---&gt;
&lt;cfset fromaddress = "raymondcamden@gmail.com"&gt;

&lt;cfif structKeyExists(form, "send")&gt;
	&lt;!--- auto trim ---&gt;
	&lt;cfset form.title = trim(form.title)&gt;
	&lt;cfset form.bod = trim(form.body)&gt;
	
	&lt;cfset errors = ""&gt;
	
	&lt;cfif not len(form.title)&gt;
		&lt;cfset errors &= "You must include a title.&lt;br/&gt;"&gt;
	&lt;/cfif&gt;	

	&lt;cfif not len(form.body)&gt;
		&lt;cfset errors &= "You must include a body.&lt;br/&gt;"&gt;
	&lt;/cfif&gt;	

	&lt;cfif not len(errors)&gt;
		&lt;!--- send the message out ---&gt;
		&lt;cfoutput&gt;
		Your message, #form.title#, has been sent to your subscribers.
		&lt;/cfoutput&gt;
		&lt;cfabort&gt;
	&lt;/cfif&gt;

&lt;/cfif&gt;

&lt;form method="post"&gt;
	
	&lt;h2&gt;Newsletter&lt;/h2&gt;

	&lt;cfoutput&gt;
	&lt;cfif structKeyExists(variables, "errors")&gt;
		&lt;p&gt;
		&lt;b&gt;Please correct the following:&lt;br/&gt;#errors#&lt;/b&gt;
		&lt;/p&gt;
	&lt;/cfif&gt;
		
	&lt;p&gt;
	Title: &lt;input type="text" name="title" value="#form.title#"&gt;
	&lt;/p&gt;
	
	&lt;p&gt;
	Body:&lt;br/&gt;
	&lt;textarea name="body" cols="60" rows="20"&gt;#form.body#&lt;/textarea&gt;
	&lt;/p&gt;
	&lt;/cfoutput&gt;
	
	&lt;p&gt;
		&lt;input type="submit" name="send" value="Send"&gt;
	&lt;/p&gt;

&lt;/form&gt;	
</code>

<p>

Next I added the spam check. As I said above, you are expected to mimic a "real" email. If you send just the text (in my case, form.body), you will get dinged badly for missing email headers. I went to Gmail, picked a random message, and viewed the original version. I took those headers and stripped it down as much as possible. In my report I get a few minor dings compared to the original version, but I felt like this was an acceptable compromise.

<p>

<code>
&lt;cfsavecontent variable="fakemsg"&gt;&lt;cfoutput&gt;
Date: Mon, 17 Oct 2011 14:14:13 -0400 (EDT)
From: #fromaddress#
To: #fromaddress#
Subject: #form.title#

#form.body#
&lt;/cfoutput&gt;
&lt;/cfsavecontent&gt;
		
&lt;cfhttp url="http://spamcheck.postmarkapp.com/filter" method="post"&gt;
	&lt;cfhttpparam type="formfield" name="email" value="#trim(fakemsg)#"&gt;
	&lt;cfhttpparam type="formfield" name="options" value="long"&gt;			
&lt;/cfhttp&gt;
&lt;cfset respRaw = cfhttp.filecontent.toString()&gt;
&lt;cfset response = deserializeJSON(respRaw)&gt;
&lt;cfif response.score gt 5&gt;
	&lt;cfset errors &= "Your report scored too high on the SpamAssasin check (#response.score#).&lt;br/&gt;"&gt;
	&lt;!--- possibly show response.report for more detail ---&gt;
&lt;/cfif&gt;
</code>

<p>

The report key in the result is a plain text list of how your score was generated. You can display that in a PRE block or - conversely - parse it up and do what you will with it. You can test this below. Note - this will <i>never</i> send any emails, so feel free to test as many times as you would like. I've included the full code below.

<p>

<a href="http://www.raymondcamden.com/demos/2011/oct/17/test.cfm"><img src="https://static.raymondcamden.com/images/cfjedi/icon_128.png" title="Demo, Baby" border="0"></a>

<p>

* Note that while this service is free, Postmark said they do not guarantee it will remain free, available, useful, etc for the rest of time. 

<p>

<code>
&lt;cfparam name="form.title" default=""&gt;
&lt;cfparam name="form.body" default=""&gt;

&lt;!--- used for fake email ---&gt;
&lt;cfset fromaddress = "raymondcamden@gmail.com"&gt;

&lt;cfif structKeyExists(form, "send")&gt;
	&lt;!--- auto trim ---&gt;
	&lt;cfset form.title = trim(form.title)&gt;
	&lt;cfset form.bod = trim(form.body)&gt;
	
	&lt;cfset errors = ""&gt;
	
	&lt;cfif not len(form.title)&gt;
		&lt;cfset errors &= "You must include a title.&lt;br/&gt;"&gt;
	&lt;/cfif&gt;	

	&lt;cfif not len(form.body)&gt;
		&lt;cfset errors &= "You must include a body.&lt;br/&gt;"&gt;
	&lt;cfelse&gt;
		&lt;!--- check for spammyness ---&gt;
			
		&lt;cfsavecontent variable="fakemsg"&gt;&lt;cfoutput&gt;
Date: Mon, 17 Oct 2011 14:14:13 -0400 (EDT)
From: #fromaddress#
To: #fromaddress#
Subject: #form.title#

#form.body#
&lt;/cfoutput&gt;
&lt;/cfsavecontent&gt;
		
		&lt;cfhttp url="http://spamcheck.postmarkapp.com/filter" method="post"&gt;
			&lt;cfhttpparam type="formfield" name="email" value="#trim(fakemsg)#"&gt;
			&lt;cfhttpparam type="formfield" name="options" value="long"&gt;			
		&lt;/cfhttp&gt;
		&lt;cfset respRaw = cfhttp.filecontent.toString()&gt;
		&lt;cfset response = deserializeJSON(respRaw)&gt;
		&lt;cfif response.score gt 5&gt;
			&lt;cfset errors &= "Your report scored too high on the SpamAssasin check (#response.score#).&lt;br/&gt;"&gt;
			&lt;!--- possibly show response.report for more detail ---&gt;
		&lt;/cfif&gt;
	&lt;/cfif&gt;	

	&lt;cfif not len(errors)&gt;
		&lt;!--- send the message out ---&gt;
		&lt;cfoutput&gt;
		Your message, #form.title#, has been sent to your subscribers.
		&lt;/cfoutput&gt;
		&lt;cfabort&gt;
	&lt;/cfif&gt;

&lt;/cfif&gt;

&lt;form method="post"&gt;
	
	&lt;h2&gt;Newsletter&lt;/h2&gt;

	&lt;cfoutput&gt;
	&lt;cfif structKeyExists(variables, "errors")&gt;
		&lt;p&gt;
		&lt;b&gt;Please correct the following:&lt;br/&gt;#errors#&lt;/b&gt;
		&lt;/p&gt;
	&lt;/cfif&gt;
		
	&lt;p&gt;
	Title: &lt;input type="text" name="title" value="#form.title#"&gt;
	&lt;/p&gt;
	
	&lt;p&gt;
	Body:&lt;br/&gt;
	&lt;textarea name="body" cols="60" rows="20"&gt;#form.body#&lt;/textarea&gt;
	&lt;/p&gt;
	&lt;/cfoutput&gt;
	
	&lt;p&gt;
		&lt;input type="submit" name="send" value="Send"&gt;
	&lt;/p&gt;

&lt;/form&gt;	
</code>