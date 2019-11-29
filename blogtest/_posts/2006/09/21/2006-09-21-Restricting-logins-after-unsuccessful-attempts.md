---
layout: post
title: "Restricting logins after unsuccessful attempts"
date: "2006-09-21T17:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/09/21/Restricting-logins-after-unsuccessful-attempts
guid: 1547
---

I saw an article on <a href="http://www.dzone.com">dzone.com</a> today that talked about ways to restrict logins after a number of unsuccessful attempts. I thought I'd show a quick demo of how to do this in ColdFusion. This method is <b>not</b> perfect and I'll talk about alternatives. I will also link to the original article so you can see how it was done there.
<!--more-->
So - the concept is simple. If a user tries to log on N times, and fails, you want to prevent them from logging in again. This prevents a hacker (or script kiddie) from spending all day trying to guess a user's password. 

You don't want to block the user forever of course, but just for a period of time. So let me show you the code I used for this demo, and then I'll talk about it. (A quick note - I wrote a one page demo for this post. On a real site this code may be broken up a bit into multiple files.)

<code>
&lt;cfapplication name="test" sessionmanagement="true" clientmanagement="true"&gt;

&lt;cfparam name="session.loginattempts" default="0"&gt;

&lt;cfif structKeyExists(form, "logon") and structKeyExists(form, "username") and structKeyExists(form, "password") and session.loginattempts lt 3&gt;
	&lt;cfif false&gt;
		&lt;!--- log the user in ---&gt;
		&lt;cfset session.loginattempts = 0&gt;
	&lt;cfelseif true&gt;
		&lt;cfset session.loginattempts = session.loginattempts + 1&gt;
	&lt;/cfif&gt;
&lt;/cfif&gt;

&lt;cfif session.loginattempts lt 3&gt;
	&lt;cfoutput&gt;
	&lt;form action="#getFileFromPath(getCurrentTemplatePath())#" method="post"&gt;
	&lt;/cfoutput&gt;
	username: &lt;input type="text" name="username"&gt;&lt;br&gt;
	password: &lt;input type="password" name="password"&gt;&lt;br&gt;
	&lt;input type="submit" name="logon" value="Logon"&gt;
	&lt;/form&gt;
&lt;cfelse&gt;
	Sorry, but you have attempted to logon too many times.&lt;br&gt;
	You are either very stupid or a hacker. Please go away.
&lt;/cfif&gt;
</code>

This is pretty self-explanatory. I initialize a session variable called loginattempts. (This would normally be done in the onSessionStart method of your Application.cfc file.) When the user attempts to login and they fail, I increase this value. 

Later on I notice if the loginattempts value is too high and I display a message instead of the login form. As a side note - it occurred to me while writing this entry that I checked the value on display but did <b>not</b> check it when the form was submitted. I modified my initial CFIF to add that last clause. That way the user can't just hit "Back" and continue to try to login, or write their own form on their desktop and post from there.

So - this works easily enough but has a few problems. First - it uses session variables. It takes me all of two seconds to clear those values by using the Firefox Web Developer toolbar. Or I could switch to the <a href="http://www.microsoft.com/windows/ie/default.mspx">Browser that Shalt not be Named</a>. This technique would stop some script kiddies, but not someone who was very serious.

Instead of using the session scope (or some other cookie), you could check the IP address of the person making the request. This could be stored in a simple struct where each key is the IP address and the value is the number of login attempts. However, you would also need to store the time of the last login attempt. The nice thing about the session variable is that it will automatically go away when the session dies, thereby allowing the user another chance to login. 

This method would not be full proof as you can't always trust the IP, and if the server were to go down you would lose the Application scope anyway. (Of course, it's hard to hack into a site that is down. It would only matter if your site actually came back up.)

One more idea - and what the original article did (linked below) - is to log the attempts to a database. This gives you the added benefit of being able to do tracking later on. If you see numerous daily failures from one IP, it is probably something you want to check out.

Anyway - enjoy - and readers - feel free to share how you did this in your own applications.

The original dzone.com article: <a href="http://www.webcheatsheet.com/php/blocking_system_access.php">Blocking access to the login page after three unsuccessful login attempts</a>