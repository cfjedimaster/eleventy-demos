---
layout: post
title: "Proof of Concept - Throttling automatic emails in ColdFusion"
date: "2010-10-14T19:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/10/14/Proof-of-Concept-Throttling-automatic-emails-in-ColdFusion
guid: 3971
---

Ok, so hopefully you've got a nice system for handling errors within your ColdFusion application. (And if not, don't worry, there's a <a href="http://www.raymondcamden.com/index.cfm/2007/12/5/The-Complete-Guide-to-Adding-Error-Handling-to-Your-ColdFusion-Application">guide</a> for that.) And maybe you even have your error handler sending you a nice, informative email on every error. Great. Until one day something goes haywire and you end up with 1000 emails in your inbox. (Although that's never happened to me. Honest. Well, not this week. I mean today.) Wouldn't it be nice if you could send email - but perhaps tell ColdFusion to not send the <i>same</i> email within a timeframe? Here is my stab at building such a service.
<!--more-->
<p/>

I began by defining an API in my mind. I'd pass to my method an object containing all my mail properties. This would be used for the actual cfmail tag that. Next we will provide a simple timeout value. We will use minutes so that a value of 5 means "If I try to send the same email within 5 minutes, don't send it again." And finally, let's get a bit complex. If your email is partially dynamic, perhaps it has a URL variable printed in it, we don't have each one to fire off a new message when the <i>core</i> reason for the email hasn't changed. So our final attribute will be a simple regex that will be run against the body. Here is the code I came up with:

<p/>

<code>
&lt;cfcomponent output="false"&gt;

&lt;cfset variables.cache = {}&gt;

&lt;cffunction name="throttleSend" access="public" output="false" returnType="boolean"&gt;
	&lt;cfargument name="mail" type="struct" required="true" hint="Structure of args for the mail."&gt;
	&lt;cfargument name="limit" type="numeric" required="true" hint="Number of minutes to wait before sending again."&gt;
	&lt;cfargument name="regex" type="string" required="false" hint="This regex is performed on your mail body. Helps remove items that may be dynamic in the body but should not be considered for caching."&gt;	
	
	&lt;!--- used for required mail tags ---&gt;
	&lt;cfset var reqlist = "to,from,subject,body"&gt;
	&lt;cfset var l = ""&gt;
	&lt;cfset var body = ""&gt;
	&lt;cfset var cacheBody = ""&gt;
	&lt;cfset var hashKey = ""&gt;
	
	&lt;!--- quickly validate the mail object ---&gt;
	&lt;cfloop index="l" list="#reqlist#"&gt;
		&lt;cfif not structKeyExists(arguments.mail, l)&gt;
			&lt;cfthrow message="mail object is missing required key #l#"&gt;
		&lt;/cfif&gt;
	&lt;/cfloop&gt;
	
	&lt;!--- Ok, first, create the hash ---&gt;
	&lt;cfset body = arguments.mail.body&gt;
	&lt;cfif structKeyExists(arguments, "regex")&gt;
		&lt;cfset cacheBody = rereplace(body,regex,"","all")&gt;
		&lt;cfset hashKey = hash(arguments.mail.to & " " & arguments.mail.subject & " " & cacheBody)&gt;
	&lt;cfelse&gt;
		&lt;cfset hashKey = hash(arguments.mail.to & " " & arguments.mail.subject & " " & body)&gt;
	&lt;/cfif&gt;
	

	&lt;!--- If we already sent it and it hasn't expired, don't do squat ---&gt;
	&lt;cfif structKeyExists(variables.cache, hashKey) and dateCompare(now(), variables.cache[hashKey]) is -1&gt;
		&lt;cfreturn false&gt;
	&lt;/cfif&gt;

	&lt;!--- Ok, so we need to mail ---&gt;
	&lt;cfmail attributecollection="#arguments.mail#"&gt;#body#&lt;/cfmail&gt;

	&lt;cfset variables.cache[hashKey] = dateAdd("n", arguments.limit, now())&gt;
	&lt;cfreturn true&gt;
	
&lt;/cffunction&gt;

&lt;/cfcomponent&gt;
</code>

<p/>

From top to bottom, the CFC begins by creating a Variables scoped cache. This will store our 'memory' in terms of what we have already emailed. The main function, throttleSend, begins by first doing quick validation on the keys of the mail object passed in. As far as I know, these are the only required arguments for cfmail (as long as you have a server defined elsewhere). Next we need to do some work on the mail body. We have an optional regex and if supplied, we need need to run it against the body of our mail. We create a hash value based on the to, subject, and body of the email. The regexed version checks the cleaned body while the non-regexed version just uses the body as is. I chose these three values randomly. You can may want to only check the body, or just the subject (although that makes the regex feature pointless).

<p/>

Once we have the hashed value, we can check for it within our cache variable and if it exists, and hasn't expired, we actually send the mail. We then store the hash and create an expirey date and we're done. I made the method return false if the message wasn't sent because I thought there was a chance you may want to know this. Now here is a small template that shows how I tested it:

<p/>

<code>

&lt;cfapplication name="mtdemo"&gt;

&lt;cfif not structKeyExists(application, "throttler") or structKeyExists(url,"init")&gt;
	&lt;cfset application.throttler = new mailthrottle()&gt;
&lt;/cfif&gt;

&lt;cfset mailOb = {
	to="ray@camdenfamily.com",
	from="ray@camdenfamily.com",
	subject="Error about X!",
	body="This is the body of the email."
}&gt;

&lt;cfset res = application.throttler.throttleSend (mailOb,2)&gt;

&lt;cfoutput&gt;result was #res#&lt;/cfoutput&gt;
&lt;p/&gt;

&lt;cfset mailOb = {
	to="ray@camdenfamily.com",
	from="ray@camdenfamily.com",
	subject="Error about X!",
	body="This is the body of the email. Random: #randRange(1,100)#"
}&gt;

&lt;cfset res = application.throttler.throttleSend (mailOb,2,"Random: [0-9]{% raw %}{1,3}{% endraw %}")&gt;

&lt;cfoutput&gt;result was #res#&lt;/cfoutput&gt;
</code>

<p/>

In the first example I've got a static email. In the second one I've got a bit of dynamicness to it, but I can use the optional third regex value to remove it. What's cool though is that it only removes it from the check. When the email goes out, it includes the value.