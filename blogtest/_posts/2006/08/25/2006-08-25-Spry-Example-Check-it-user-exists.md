---
layout: post
title: "Spry Example: Check if user exists"
date: "2006-08-25T18:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/08/25/Spry-Example-Check-it-user-exists
guid: 1497
---

Here is a something cool you can add to your web site. You have a registration form that asks for a username. In order to save the user time and a trip to the server, you want to see if the username exists as they type it in. Let's look at how Spry could handle this. 

First, let me build a simple form:
<!--more-->
<code>
&lt;form id="userform" action="null.html" method="post"&gt;
&lt;h2&gt;Register&lt;/h2&gt;
&lt;table width="600" border="0"&gt;
	&lt;tr valign="top"&gt;
		&lt;td align="right" width="200"&gt;username (min 4 characters)&lt;/td&gt;
		&lt;td width="400"&gt;&lt;input type="text" id="username" name="username" onKeyUp="checkUsername()"&gt;
		&lt;span id="resultblock" class="error"&gt;&lt;/span&gt;&lt;/td&gt;
	&lt;/tr&gt;
	&lt;tr&gt;
		&lt;td align="right"&gt;password&lt;/td&gt;
		&lt;td&gt;&lt;input type="password" name="password"&gt;&lt;/td&gt;
	&lt;/tr&gt;
	&lt;tr&gt;
		&lt;td align="right"&gt;confirm password&lt;/td&gt;
		&lt;td&gt;&lt;input type="password2" name="password2"&gt;&lt;/td&gt;
	&lt;/tr&gt;
	&lt;tr&gt;
		&lt;td&gt;&nbsp;&lt;/td&gt;
		&lt;td&gt;&lt;input type="button" value="Fake Submit"&gt;&lt;/td&gt;
	&lt;/tr&gt;
&lt;/table&gt;
&lt;/form&gt;
</code>

The only thing you want to pay attention to here are these two lines:

<code>
&lt;input type="text" id="username" name="username" onKeyUp="checkUsername()"&gt;
&lt;span id="resultblock" class="error"&gt;&lt;/span&gt;
</code>

What I've done here is used a bit of JavaScript to execute when the form field is changed. (And I know onKeyUp has a few issues. Can folks recommend a more well rounded approach?) As the user types, it will call my function, checkUsername():

<code>
function checkUsername() {
	var uvalue = document.getElementById("username").value;
	if(uvalue.length &lt; 4) {% raw %}{ status(''); return; }{% endraw %}
	Spry.Utils.loadURL("GET","userchecker.cfm?username="+encodeURIComponent(uvalue), false, usercheck);
	
}
</code>

In this code I grab the value of the form field. If the size  is less than 4, I clear my result message and leave the function (the status function will be described in a bit). If we have enough characters, I then use loadURL, from the Spry.Utils package, to call a server side file. (Here is my earlier <a href="http://ray.camdenfamily.com/index.cfm/2006/7/12/Sending-Data-with-Spry">entry</a> on loadURL.) I fire off the event and wait for the result. (At the end I'll talk about how to modify it to not wait.) Lastly, a function named usercheck will be called with the result. Let's take a look at that function:

<code>
function usercheck(request) {
	var result = request.xhRequest.responseText;
	
	if(result == 0) status("Username not available!");
	else status('');
}
</code>

When the result returns from the request, I have an object that contains information returned in the result. In this case, my server side script will return either a 1 or a 0. 0 is the flag for the username not being available, so I use my status function to write that result. Here is the status function in case you are curious:

<code>
function status(str) {
	var resultblock = document.getElementById("resultblock");
	resultblock.innerHTML = str;	
}
</code>

As you can see, it is just using a bit of DHTML to update the span block next to my form field. Last but not least, here is the ColdFusion code running behind the scenes. Obviously it is not hooked up to anything real:

<code>
&lt;cfsetting showdebugoutput=false&gt;

&lt;cfparam name="url.username" default="bob"&gt;

&lt;cfset takennames="victor,jack,ashley,gloria,nikki"&gt;

&lt;cfif listFindNoCase(takennames, url.username)&gt;
	&lt;cfset available = 0&gt;
&lt;cfelse&gt;
	&lt;cfset available = 1&gt;
&lt;/cfif&gt;

&lt;cfoutput&gt;#available#&lt;/cfoutput&gt;
</code>

You can test this out <a href="http://ray.camdenfamily.com/demos/spryuser">here</a>, and be sure to view source on the HTML page for a more complete view. 

So I mentioned earlier that if I made my request not wait (asynch), then I'd have to modify things a bit. Because the user could keep on typing, I would need to return both the result and the username in my server side code. I'd then need to check and see if the username in the form field was still the same. I'll post a followup showing an asynch version later on.

<b>Edited on August 26: Rob Brooks-Bilson raises some very good points about the security of this. Please be sure you read the comments below.</b>