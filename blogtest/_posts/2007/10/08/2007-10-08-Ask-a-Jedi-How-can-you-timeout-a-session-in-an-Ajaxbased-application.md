---
layout: post
title: "Ask a Jedi: How can you timeout a session in an Ajax-based application?"
date: "2007-10-08T12:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/10/08/Ask-a-Jedi-How-can-you-timeout-a-session-in-an-Ajaxbased-application
guid: 2397
---

Todd Sharp, who is normally the one providing me CF8-Ajax based answers, asked me this question today:

<blockquote>
Imagine you have an Ajax-based site. The front end acts like a dashboard. In other words, the user never leaves the page, but executes various actions that do Ajaxy-type things on the back end. But if the user sits by and does nothing, how can I recognize a session timeout when the next Ajax-based call is done?
</blockquote>

So Todd and I have been talking about this off and on all morning, so pardon the randomness of the response. In general what I recommended was this:

Build a Ping service. Your application can ping the server every minute. As you know - this will keep your session alive. However - what you can do is simply use onSessionStart to define a session variable named lasthit. In your onRequestStart - update lasthit to now(). In your ping, simply pass a URL parameter that will flag onRequestStart to <i>not</i> update the variable. 

Your ping request can handle the timeout anyway it wants. You can return the number of minutes left till timeout, and if less than 5 minutes, use a new ColdFusion-Ajax window to prompt the user. (Much better than an alert!) You can not warn them at all, but use location.href to push them to a timeout page (and do a manual structClear on the session). 

On an interesting side note - <a href="http://labs.adobe.com/technologies/spry/">Spry</a> has native support for this. By returning a particular string instead of your normal XML/JSON packet, you can fire off a 'Session Ended' event. (See my article on this feature <a href="http://www.raymondcamden.com/index.cfm/2007/3/20/Spry-15s-new-Session-Expired-Support">here</a>.)
ColdFusion's Ajax support does not - although you can <i>kind of</i> do it by using the onError support in ColdFusion's various Ajax-based tags. This support gives you access to the error thrown, so you could introspect the error and run your own handler for the session ending then.

So as always - I'm open to suggestions and options. Has anyone built something like this into an Ajax-application? Everything I've built so far with Ajax only uses Ajax in parts of the site - not everywhere.