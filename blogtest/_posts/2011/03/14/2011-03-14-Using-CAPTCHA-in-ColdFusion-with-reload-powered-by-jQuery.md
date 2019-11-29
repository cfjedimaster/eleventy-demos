---
layout: post
title: "Using CAPTCHA in ColdFusion with reload powered by jQuery"
date: "2011-03-15T00:03:00+06:00"
categories: [coldfusion,javascript,jquery]
tags: []
banner_image: 
permalink: /2011/03/14/Using-CAPTCHA-in-ColdFusion-with-reload-powered-by-jQuery
guid: 4157
---

A few years ago I wrote a quick blog entry on working with CAPTCHA and ColdFusion. (<a href="http://www.raymondcamden.com/index.cfm/2008/2/28/Quick-and-dirty-CAPTCHA-Guide--for-ColdFusion-8#c01654B7B-9AFD-A399-39E204E8CE692389">Quick and dirty CAPTCHA Guide - for ColdFusion 8</a>) A reader on that entry asked if it was possible to add a "reload if you can't read feature" to the CAPTCHA. We've all seen CAPTCHAs before that are impossible to read. For many of these forms you have no choice but to submit the form and hope the next one is better. But more and more forms are allowing you to reload <i>just</i> the CAPTCHA. Here is a quick example of how I modified the earlier blog entry to support this.
<!--more-->
<p>

To start off - I modified my code from the <a href="http://www.coldfusionjedi.com/index.cfm/2008/2/28/Quick-and-dirty-CAPTCHA-Guide--for-ColdFusion-8#c01654B7B-9AFD-A399-39E204E8CE692389">old entry</a> to avoid using a hash of the CAPTCHA for validation. Instead I stored the value in the session scope and verified it there. Here is the modified template. I'm not going to explain it since it's 95% the same as the old blog entry, but as you can see I now don't bother with a hash.

<p>

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

&lt;cfif isDefined("form.send")&gt;
	&lt;cfset errors = ""&gt;
	
	&lt;cfif not len(trim(form.name))&gt;
		&lt;cfset errors = errors & "You must include your name.&lt;br /&gt;"&gt;
	&lt;/cfif&gt;

	&lt;cfif not len(trim(form.comments))&gt;
		&lt;cfset errors = errors & "You must include your comments.&lt;br /&gt;"&gt;
	&lt;/cfif&gt;

	&lt;cfif form.captcha neq session.captcha&gt;
		&lt;cfset errors = errors & "You did not enter the right text. Are you a spammer?&lt;br /&gt;"&gt;
	&lt;/cfif&gt;
		
	&lt;cfif errors is ""&gt;
		&lt;!--- do something here ---&gt;
		&lt;cfset showForm = false&gt;
	&lt;/cfif&gt;
	
&lt;/cfif&gt;

&lt;cfif showForm&gt;

	&lt;cfset session.captcha = makeRandomString()&gt;

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
			&lt;cfimage action="captcha" width="300" height="75" text="#session.captcha#"&gt;
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

<p>

If you want to run this, you can do so <a href="http://www.coldfusionjedi.com/demos/march142011/index.cfm">here</a>. But that isn't the interesting one. Let's look at a nicer version.

<p>

In order to support reloading just the CAPTCHA, I moved the CAPTCHA display into a DIV I'll be loading via Ajax. So where before I had the cfimage tag, now I have just this:

<p>

<code>
&lt;div id="captchaDiv"&gt;&lt;/div&gt;
</code>

<p>

I used some jQuery to load it:

<p>

<code>
$("#captchaDiv").load("showcaptcha.cfm");
</code>

<p>

showcaptcha.cfm now includes the logic to generate a random CAPTCHA string and to store/render it.

<p>

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

&lt;cfset session.captcha = makeRandomString()&gt;
&lt;cfimage action="captcha" text="#session.captcha#" width="300" height="75"&gt;
</code>

<p>

Ok, so how do we handle reload? After my div, I added a quick link:

<p>

<code>
Can't read? &lt;a href="" id="reloadLink"&gt;Reload&lt;/a&gt;
</code>

<p>

And then wrote a lot of JavaScript to handle clicks there. (OK, maybe not a <i>lot</i> of code - but jQuery saves me such much time I've got to pretend I actually work!)

<p>

<code>
$("#reloadLink").click(function(e) {
	$("#captchaDiv").load("showcaptcha.cfm");			
	e.preventDefault();
});
</code>

<p>

And that's it. The form page has changed quite a bit so I'll display it completely below. Before that you can demo it here:

<p>

<a href="http://www.coldfusionjedi.com/demos/march142011/index2.cfm"><img src="https://static.raymondcamden.com/images/cfjedi/icon_128.png" title="Demo, Baby" border="0"></a>

<p>

<code>
&lt;cfset showForm = true&gt;
&lt;cfparam name="form.name" default=""&gt;
&lt;cfparam name="form.comments" default=""&gt;
&lt;cfparam name="form.captcha" default=""&gt;

&lt;cfif isDefined("form.send")&gt;
	&lt;cfset errors = ""&gt;
	
	&lt;cfif not len(trim(form.name))&gt;
		&lt;cfset errors = errors & "You must include your name.&lt;br /&gt;"&gt;
	&lt;/cfif&gt;

	&lt;cfif not len(trim(form.comments))&gt;
		&lt;cfset errors = errors & "You must include your comments.&lt;br /&gt;"&gt;
	&lt;/cfif&gt;

	&lt;cfif form.captcha neq session.captcha&gt;
		&lt;cfset errors = errors & "You did not enter the right text. Are you a spammer?&lt;br /&gt;"&gt;
	&lt;/cfif&gt;
		
	&lt;cfif errors is ""&gt;
		&lt;!--- do something here ---&gt;
		&lt;cfset showForm = false&gt;
	&lt;/cfif&gt;
	
&lt;/cfif&gt;

&lt;cfif showForm&gt;

	&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
	&lt;script&gt;
	$(document).ready(function() {
		$("#captchaDiv").load("showcaptcha.cfm");	
		
		$("#reloadLink").click(function(e) {
			$("#captchaDiv").load("showcaptcha.cfm");			
			e.preventDefault();
		});
	})
	&lt;/script&gt;

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
			&lt;div id="captchaDiv"&gt;&lt;/div&gt;
			Can't read? &lt;a href="" id="reloadLink"&gt;Reload&lt;/a&gt;
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