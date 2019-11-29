---
layout: post
title: "Ask a Jedi: Handling errors in ColdFusion Ajax applications"
date: "2008-09-09T00:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/09/08/Ask-a-Jedi-Handling-errors-in-ColdFusion-Ajax-applications
guid: 3005
---

Shirzad (cool name!) asks:

<blockquote>
<p>
How do you prevent the Coldfusion Ajax alert message "error retrieving markup..."? Sometimes errors are inevitable.  I want to prevent users on our public site from seeing the javascript alert that pops up whenever there's an error in a coldfusion ajax container (or at the very least change the message so it isn't asking people to add cfdebug to the parameters). Is there any way to do this? 
</p>
</blockquote>
<!--more-->
There are a couple ways of handling errors with ColdFusion 8's Ajax features. Here is a quick overview of some of them in regards to the cfdiv tag. First, let's make an error. I'll take a simple cfdiv:

<code>
&lt;cfdiv id="testdiv" bind="url:test2.cfm"/&gt;
</code>

And here is test2.cfm:

<code>
&lt;cfthrow&gt;
</code>

As you can guess, this will immediately throw an error when loaded by the div. The cfdiv tag supports an onBindError attribute. It lets you specify a JavaScript function to run when an error occurs (big surprise there). Here is a modified version of our original script:

<code>
&lt;script&gt;
function handleError(c,m) {
	console.log('error '+c+' '+m);
}
&lt;/script&gt;

&lt;cfdiv id="testdiv" bind="url:test2.cfm" onBindError="handleError"/&gt;
</code>

The docs specify that the error handler should take two arguments - a status code and message. When I ran this, I correctly saw the error log, but I also saw the 'naked' CF error in the div. I thought perhaps that the onBindHandler would automatically hide the error but it doesn't. I then tried this:

<code>
document.getElementById("testdiv").innerHTML = "Error!";
</code>

But for some reason, it wouldn't work. I was able to get this to work:

<code>
ColdFusion.navigate('/user.cfm','testdiv');
</code>

The file user.cfm was just another random file on my server. You would normally point it to a file that had some kind of 'Error' message. 

Another option is to specify a global error handler. This is done with the setGlobalErrorHandler:

<code>
function handleGError(s) {
	console.log('global error called '+s);
}	

ColdFusion.setGlobalErrorHandler(handleGError);
</code>

Notice though that this function only takes one argument, a message. I don't know why - but it seems to me as if it should work the same as the error error. Anyway, if you use this, and remove the onBindError, the global error handler will fire. 

As yet another example of how you can handle errors, the cfajaxproxy tag has an onError attribute. You can also set a specific error handler for an instance of an AjaxProxy object. 

Check the docs for other tags and how they can provide support for this as well. (Consider this my "This your homework" part.) CFGRID for example supports onError which works the same as the onBindError for cfdiv.