---
layout: post
title: "Spry Error Callback Example"
date: "2006-09-07T15:09:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2006/09/07/Spry-Error-Callback-Example
guid: 1519
---

Today's entry is from a guest blogger. Now before folks get all excited, I don't have a "real" concept of guest blogging here. Rather - he had a good problem with Spry and he shared his solution with me. He doesn't have a blog yet (hmm, someone should consider making a service so it is easy for folks to use BlogCFC w/o needing a real host, hmmm indeed) so I said I'd blog it for him. 

Daniel Budde II (wraith) had this to share about error handling in Spry. I <a href="http://ray.camdenfamily.com/index.cfm/2006/7/14/New-features-in-Spry">blogged</a> about states in Spry before - and there is a simple way to create an error state for Spry, but what if you want a more controlled result for Spry?

From Daniel:<br/>

I made a post about it on the Adobe Spry forum.  It's not the clearest post, but I just thought I would give it to you to look at if you want.  I'm interested in the responses people will give.

http://www.adobe.com/cfusion/webforums/forum/messageview.cfm?forumid=72&catid=602&threadid=1190912&enterthread=y

Ok, I had a problem with it in IE because IE's XMLHttpRequest object has a send() method that will throw an error if the status code from the web server is not "200".  When it throws the error it prevents the "synchronous" execution of the Spry.Utils.loadURL.callback method.  So, to get around this you need to use "asynchronous" mode which will rely on the "onreadystatechange" method and will then call the callback method which will in turn call a custom error handler if you have one set.

Here is my example:

<code>
var optionsObj = new Object();

optionsObj.errorCallback = ShowError;

Spry.Utils.loadURL("GET", url, true, ValidateForm, optionsObj);
</code>
 
There is a list of available options that you can set in the SpryData.js file and here those are:

[ "method", "url", "async", "username", "password", "postData", "successCallback", "errorCallback", "headers", "userData", "xhRequest" ]

Obviously some of those are used and setup no matter what (method, url, async). 

Ray again: Just in case it wasn't clear, the ShowError variable is a function that is a called when the error occurs.