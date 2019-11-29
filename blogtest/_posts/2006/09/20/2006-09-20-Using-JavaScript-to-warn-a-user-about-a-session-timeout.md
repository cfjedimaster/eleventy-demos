---
layout: post
title: "Using JavaScript to warn a user about a session timeout"
date: "2006-09-20T17:09:00+06:00"
categories: [coldfusion,javascript]
tags: []
banner_image: 
permalink: /2006/09/20/Using-JavaScript-to-warn-a-user-about-a-session-timeout
guid: 1543
---

A coworker asked me this today so I thought I'd whip up a quick example. Many bank sites like to use a JavaScript warning to let you know when your session is about to end. Personally these things bug the heck out of me, but in the interest of helping her out (and others), here is a way to do it in ColdFusion and JavaScript. (Explanation follows the code.)
<!--more-->
<code>
&lt;!--- Minutes into MS ---&gt;
&lt;cfset sessionTimeout = 2&gt;
&lt;html&gt;

&lt;head&gt;
&lt;title&gt;Timeout Example&lt;/title&gt;

&lt;script&gt;
&lt;cfoutput&gt;
var #toScript((sessionTimeout-1)*60*1000,"sTimeout")#
&lt;/cfoutput&gt;
setTimeout('sessionWarning()', sTimeout);

function sessionWarning() {
	alert('Hey bonehead, your session is going to time out unless you do something!');	
}
&lt;/script&gt;

&lt;/head&gt;

&lt;body&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>

Let me go down line by line. First off - you can't introspect an application to see what the session time out value is. (I'm sure you could with ServiceFactory methods, but that's cheating.) So I'm using a variable to stand in for the number of minutes a session will last. 

<code>
&lt;cfset sessionTimeout = 2&gt;
</code>

I would probably have set this in the application scope somewhere, but again, this is just a simple demo. I used 2 to make it a bit quicker to test. Now I need to get that value into JavaScript, but there are two things I need to change. First - I want to give the user a warning so she has time to do something. So, I subtract one from the number of minutes. You can obviously subtract more or less depending on how much of a warning you want to give. Secondly, the JavaScript code I'm going to use, setTimeout, expects time in milliseconds. So I take my number of minutes and multiply it by 60 and then 1000.

<code>
&lt;cfoutput&gt;
var #toScript((sessionTimeout-1)*60*1000,"sTimeout")#
&lt;/cfoutput&gt;
</code>

Why didn't I just multiply by 60000? Because I'm dumb and tend to forget things. The 60*1000 helps me remember. What is the toScript function? It lets you convert a ColdFusion variable into a valid JavaScript variable. For more information, check the <a href="http://www.cfquickdocs.com/?getDoc=ToScript">toScript documentation</a>. Honestly, it's a bit overkill for what I'm doing, but I thought I'd remind folks of this cool little utility. The next line simply tells JavaScript to call my function in the proper number of seconds:

<code>
setTimeout('sessionWarning()', sTimeout);
</code>

Lastly, my "warning" function is a simple alert. You can use DHTML instead of an Alert or any other JavaScript obviously. But the alert is the simplest way to get your message across. 

<code>
function sessionWarning() {
	alert('Hey bonehead, your session is going to time out unless you do something!');	
}
</code>

There ya go. To use this on your site you could simply include it in your layout code. Of course, you want to ensure it <b>isn't</b> loaded if the user isn't logged in.