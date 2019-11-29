---
layout: post
title: "Doing a form POST in Spry"
date: "2007-01-14T20:01:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2007/01/14/Doing-a-form-POST-in-Spry
guid: 1765
---

I <a href="http://ray.camdenfamily.com/index.cfm/2006/7/12/Sending-Data-with-Spry">blogged</a> about half a year ago on how to send data with Spry. One thing I had not done (until recently) was send a form POST with Spry. Keith, over on the Spry forums, <a href="http://www.adobe.com/cfusion/webforums/forum/messageview.cfm?forumid=72&catid=602&threadid=1229233&enterthread=y?">posted</a> a good example on how to do it. With his permission I'm reposting his example. (With a slight modification or two.)
<!--more-->
The basic syntax to do a POST with Spry works like so:

<code>
Spry.Utils.loadURL('POST', url, true, resFunc, {% raw %}{postData: formData, headers: {"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"}{% endraw %}});
</code>

The first argument simply specifies that we are using a POST instead of a GET operation. The second argument is the URL to load. The third argument specifies if the operation should be asynchronous or not. The next argument is the function to run when the HTTP operation is finished. The next set of arguments are options to pass along to the HTTP operation. The headers should be used as is, and formData in this example points to a string that contains your form information. Here is an example:

<code>
var fname = $("FName").value;
var lname = $("LName").value;
var cred = $("Credentials").value;
	
//Create a string of data
var formData = 'firstname='+fname+'&lastname='+lname+'&credentials='+cred;
formData = encodeURI(formData);
</code>

By the way - I plan on writing a simpler method to handle this.