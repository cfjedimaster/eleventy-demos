---
layout: post
title: "Handling session timeouts in Ajax applications - Follow up"
date: "2010-09-16T00:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/09/15/Handling-session-timeouts-in-Ajax-applications-Follow-up
guid: 3943
---

A few days ago I posted a simple article discussing how you could handle session timeouts in an Ajax application (<a href="http://www.raymondcamden.com/index.cfm/2010/9/8/Example-of-handling-session-time-outs-in-an-Ajax-application">Example of handling session time outs in an Ajax application</a>). If you haven't yet read that entry, please do so. The basic gist of the article was to make use of a custom exception that your Ajax application could pick up on. This worked - but only because I had tested on my development server where <b>Robust Exception Info</b> was turned on. Reader Jason <a href="http://www.coldfusionjedi.com/index.cfm/2010/9/8/Example-of-handling-session-time-outs-in-an-Ajax-application#c73CC9AE6-C699-4CBE-E42555C4B392E03C">pointed out</a> that in production, where this is turned off (everyone does have it turned off, right?) the code didn't work.

<p/>

Turns out my method of looking for a string within the exception doesn't work when the exception info is suppressed in production. Of course, this is totally obvious now, like most things after a bug is found. I apologize for the mistake and I hope this entry makes it a bit more simpler. As I mentioned in the last entry, there are multiple ways to solve this problem. Here is how I modified my application.

<p/>

My technique was to simply add a header to the response. Unfortunately, you can't use the cfheader tag within a script based CFC. I had to make a file just to include it:

<p/>

<code>
public void function onError(exception,eventname) {
   if(arguments.exception.rootcause.message == "SessionTimeout") {
      include "header.cfm";
      throw(message=arguments.exception.rootcause.message);
   }
   writelog(file='application', text='my onerror ran: #serializejson(arguments.exception.rootcause.message)#');
}
</code>

<p/>

As you can see, I'm still throwing the exception, but I'm also including a file named header.cfm. That just has:

<p/>

<code>
&lt;cfheader name="SessionTimeout" value="1"&gt;
</code>

<p/>

Finally - I modified my ajaxSetup error handler then to check for this header. I've never checked headers in JavaScript before but it's pretty simple:

<p/>

<code>
var sessionTimeout = x.getResponseHeader("SessionTimeout");
if(sessionTimeout == 1) {
   alert("Your session has timed out.");
   location.href = 'login.cfm';
}
</code>

<p/>

Pretty simple, right? Off the top of my header, another way to handle this would be to redirect to a special CFM page that just outputs SessionTimeout. Your error handler should still run since JSON wasn't returned. You could then check for that string. I haven't tried that method but it's another alternative to consider.

<p/>

Does this make sense? I'm still thinking of an entry that handles this <b>and</b> shows handling errors in general.