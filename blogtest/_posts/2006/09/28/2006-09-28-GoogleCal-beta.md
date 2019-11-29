---
layout: post
title: "GoogleCal beta"
date: "2006-09-28T22:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/09/28/GoogleCal-beta
guid: 1563
---

Ugh. That's all I can say. I spent a few hours the last few nights trying to get GoogleCal able to add events. I was finally able to do so with some help from Teddy Payne and a nice fellow on Google Groups. But wow. What an experience after working with the Yahoo services. How bad was it? This is how you add an event in Google's Calendar API.

1) First you make a request passing in your username and password. This returns an authentication string.

2) Then you make a <i>second</i> request where you pass in your event data. The funny thing is here that Google says they may or may not return a redirect. In all my tests, it did return a redirect and you need to grab another authentication string called a gsessionid.

3) Guess what? Now you make a <b>third</b> HTTP request passing the <b>same</b> event data again.

That's right - it takes three HTTP requests to add an event. Now I was able to cache the first one at least, but wow. What a royal pain in the rear. I mean - seriously - could they make it harder? Maybe I'm just not "Google Smart".

Anyway - enough complaining. I've attached a zip of the new GoogleCal.cfc. I have not updated the core zip. I'd like folks to give it a quick test if they can (code snippet below). I don't think it is very stable yet, but give it a try.

<code>
&lt;cfset title = "Test Event 2"&gt;
&lt;cfset description = "This is a test event."&gt;
&lt;cfset authorName = "Raymond Camden"&gt;
&lt;cfset authorEmail = "rcamden@gmail.com"&gt;
&lt;cfset where = "Mars"&gt;
&lt;cfset startTime = createDateTime(2006, 9, 30, 3, 0, 0)&gt;
&lt;cfset endTime = createDateTime(2006, 9, 30, 3, 30, 0)&gt;

&lt;cfinvoke component="#application.gcal#" method="addEvent" returnVariable="result"&gt;
	&lt;cfinvokeargument name="username" value="rcamden@gmail.com"&gt;
	&lt;cfinvokeargument name="password" value="imnottelling"&gt;
	&lt;cfinvokeargument name="title" value="#title#"&gt;
	&lt;cfinvokeargument name="description" value="#description#"&gt;
	&lt;cfinvokeargument name="authorname" value="#authorname#"&gt;
	&lt;cfinvokeargument name="authormemail" value="#authoremail#"&gt;
	&lt;cfinvokeargument name="where" value="#where#"&gt;
	&lt;cfinvokeargument name="start" value="#starttime#"&gt;
	&lt;cfinvokeargument name="end" value="#endtime#"&gt;
&lt;/cfinvoke&gt;
</code><p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Cwebsites{% raw %}%5Cdev%{% endraw %}2Ecamdenfamily{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2FGoogleCalendar%{% endraw %}2Ezip'>Download attached file.</a></p>