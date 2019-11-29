---
layout: post
title: "Spry 1.5's new \"Session Expired\" Support"
date: "2007-03-20T17:03:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/03/20/Spry-15s-new-Session-Expired-Support
guid: 1908
---

I <a href="http://ray.camdenfamily.com/index.cfm/2007/3/15/Spry-15-Preview">blogged</a> about the Spry 1.5 preview a few days ago and finally made time to whip up a quick demo of one of the new features - <a href="http://labs.adobe.com/technologies/spry/preview/samples/session_handling/">Session Handling</a>
<!--more-->
First and foremost - let me explain exactly what is meant by this. As you know, ColdFusion can't alert you when your session expires. It is a server side event. So obviously Spry can't get the notification from the server. 

Instead what Spry supports is noticing a particular <i>result</i> from the server. So imagine a site with a login system. Typically you hit the site. Log in. Access the data. Now imagine you sit there on a Spry-ified page and let your session time out. You click to load a new page of AJAX data and Spry throws an error. Why? Because the back end returned a login form instead of a proper XML (or JSON) result.

So what to do? Well you now return a message to your AJAX requests. This message is the literal string: session expired. It doesn't need to be in XML. If Spry sees this as the result of a data request, it will then fire off an event. So consider this simple page:

<code>
&lt;div spry:region="mydata"&gt;

	&lt;div spry:state="loading"&gt;Loading...&lt;/div&gt;
	&lt;div spry:state="error"&gt;Oh crap, something went wrong!&lt;/div&gt;
	&lt;div spry:state="expired"&gt;
		&lt;strong&gt;Your session has expired!&lt;/strong&gt; 
	&lt;/div&gt;	
	&lt;div spry:state="ready"&gt;
	
	&lt;p&gt;
	&lt;table width="500" border="1"&gt;
		&lt;tr&gt;
			&lt;th onclick="mydata.sort('name','toggle');" style="cursor: pointer;"&gt;Name&lt;/th&gt;
			&lt;th onclick="mydata.sort('age','toggle');" style="cursor: pointer;"&gt;Age&lt;/th&gt;
			&lt;th onclick="mydata.sort('gender','toggle');" style="cursor: pointer;"&gt;Gender&lt;/th&gt;
		&lt;/tr&gt;
		&lt;tr spry:repeat="mydata"&gt;
			&lt;td style="cursor: pointer;"&gt;{% raw %}{name}{% endraw %}&lt;/td&gt;
			&lt;td style="cursor: pointer;"&gt;{% raw %}{age}{% endraw %}&lt;/td&gt;
			&lt;td style="cursor: pointer;"&gt;{% raw %}{gender}{% endraw %}&lt;/td&gt;
		&lt;/tr&gt;
	&lt;/table&gt;	
	&lt;/p&gt;
	
	&lt;p&gt;
	&lt;a href="javaScript:mydata.loadData()"&gt;Reload&lt;/a&gt;
	&lt;/p&gt;
	&lt;/div&gt;
	
&lt;/div&gt;
</code>

I have a loading, error, and ready div, along with a new expired div. If Spry sees "session expired" in the result, it will display that div automatically. (And you could include a nice link to the login page of course.)

To see a demo of this, visit this <a href="http://www.raymondcamden.com/demos/session/index.cfm?initial=1">link</a>.  Click the reload link a few times, then simply go idle for 45 seconds. Click the Reload link again and you will (hopefully) see the session expired message.

How did I handle this? In my onRequestStart in Application.cfc I used this code:

<code>
&lt;cfif not structKeyExists(session, "loggedin") and findNoCase("people.cfm", thePage)&gt;
	&lt;cfcontent type="text/html" reset="true"&gt;&lt;cfoutput&gt;session expired&lt;/cfoutput&gt;&lt;cfabort&gt;
&lt;/cfif&gt;
</code>

Notice that I check both for the session variable as well as the page. For any other page I want to force the user to the login form, but for AJAX requests I want to display the proper message. You could make this process easier by using a URL format like xml.foo.cfm for all AJAX requests. (I do something similar for my Model-Glue site.)

By the way - curious about the cfcontent? I discovered something interesting. Right now Spry is <i>very</i> picky. If you have any whitespace before or after the session expired message, it won't work. My Application.cfc did make use of output=false in both the cfcomponent and cffunction tag. Yet somehow I was still ending up with white space. My theory is - and I'll try to prove this tomorrow - is that when CF encountered the cfabort in onRequestStart, it didn't have a chance to "cleanup" the white space the method had generated.