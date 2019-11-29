---
layout: post
title: "Interesting (Real world) Security Issue"
date: "2006-01-25T12:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/01/25/Interesting-Real-world-Security-Issue
guid: 1057
---

I found an interesting security bug today in some code at a client's site. (And unlike some other security holes, this was is real.) The problem was that the logon system was letting people in if they had an invalid logon. Users were correctly blocked at first, but as soon as they had an invalid logon, and then reloaded, they were let in. Why? Consider this code and make a guess before I show the answer:
<!--more-->
<code>
&lt;CFIF NOT ISDefined("Session.ProLoginOK")&gt;
	&lt;CFLOCATION URL="login/login.cfm" ADDTOKEN="No"&gt;
&lt;CFELSEIF Session.ProLoginOK IS ""&gt;
	&lt;CFLOCATION URL="login/login.cfm" ADDTOKEN="No"&gt;
&lt;/CFIF&gt;
</code>

Figured it out? On an invalid login, the code set session.prologinok to "No". Since "No" defined the variable, and wasn't "", there was no forced logon template run. 

Something to watch out for in your own code!