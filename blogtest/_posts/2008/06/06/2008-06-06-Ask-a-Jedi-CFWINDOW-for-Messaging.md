---
layout: post
title: "Ask a Jedi: CFWINDOW for Messaging?"
date: "2008-06-06T11:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/06/06/Ask-a-Jedi-CFWINDOW-for-Messaging
guid: 2866
---

Anjorin asks:

<blockquote>
<p>
Please am trying do something and i can get the logic. i am working on small site that include an instant messaging section like the one on facebook. i am trying to use cfwindow, but the problem am having is how to have a listener that listens for new messages. Is it possible to have cfwindow call a function recurrently.
</p>
</blockquote>
<!--more-->
Well first off - using something like Flex and LiveCycle Data Services would make this issue trivial. I assume you can't go that route though. If you want to use a 100% pure Ajax solution, and you want to stick with CF8 (and not use jQuery), then you can do this with polling. 

By that I mean you need to have the client perform a request to the server every N seconds or so. This is done pretty easily with the setInterval function. Consider the following:

<code>
&lt;html&gt;

&lt;head&gt;
&lt;script&gt;
function pinger() {
	ColdFusion.navigate('pinger.cfm','mydiv');
}
&lt;/script&gt;
&lt;/head&gt;

&lt;body onLoad="setInterval(pinger,4000)"&gt;

&lt;h2&gt;Hello World&lt;/h2&gt;

&lt;cfdiv id="mydiv" /&gt;
&lt;/body&gt;
&lt;/html&gt;
</code>

I've set up the client to run a function, pinger, every 4 seconds. You probably want to make that 30 or even 60. The file you hit, in my case, pinger.cfm, would be responsible for checking to see if a message exists for the user. Here is some simple code I used:

<code>
&lt;cfif randRange(1,10) lt 5&gt;
&lt;script&gt;
ColdFusion.Window.create('win#ranrange(1,999)#','Message','message.cfm?m=x',{% raw %}{center:true,closable:true}{% endraw %});
&lt;/script&gt;
&lt;/cfif&gt;
</code>

It basically says: If a random number from 1 to 10 is less than 5, make a new window. I named the window dynamically, but you should use another method to give it a truly unique name. I then point it to message.cfm. This is the file that will load the message for the user. The code I used was just this:

<code>
&lt;cfparam name="url.m"&gt;
&lt;cfoutput&gt;Message #url.m#&lt;/cfoutput&gt;
</code>

In a real example this would use the database (Transfer FTW) to grab the relevant message, do security checks, etc. 

Note that in order for this to work now, back in my first file I have to add:

<code>
&lt;cfajaximport tags="cfwindow"&gt;
</code>

This simply warns ColdFusion to load what it needs for CFWINDOW support.

Any way, the general idea is to run an interval on the client that will poll the server for new messages. Just remember to be gentle with that duration, and I'll say it again - Flex+LDS allows for <b>real</b> communication and would be your best bet.