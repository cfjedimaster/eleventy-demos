---
layout: post
title: "Ask a Jedi: Requiring an API key for web services"
date: "2008-02-14T09:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/02/14/Ask-a-Jedi-Requiring-an-API-key-for-web-services
guid: 2650
---

Jacob asks:

<blockquote>
<p>
We're launching a web service that allows folks to query our
datasource.  the problem is, how do we only allow folks who are passing a proper api key?  

any ideas on this issue?  adding anything to the end of the url after ?wsdl on the cfc call bonks out cf8.....
</p>
</blockquote>

Well first off, you can't invoke a particular method via a web service the same way you can run a CFC method over HTTP. Ie, you can't just add &method=X to the URL. Web Services require a particular method of speaking too and responding to them. When you hit your CFC with ?wsdl in the URL, all you are really doing is asking for the <i>descriptor</i> of the CFC. To <i>invoke</i> a web service, you have to pass XML to it in a particular format. ColdFusion hides all of this from you when you run CFINVOKE. I assume you are trying to test, and if so, I'd suggest just using CFINVOKE.

So that being said - all you have to do to require an API key is require it. Imagine this simple web service:

<code>
&lt;cfcomponent output="false"&gt;

&lt;cffunction name="time" access="remote" returnType="string" output="false"&gt;
	&lt;cfreturn now()&gt;
&lt;/cffunction&gt;

&lt;/cfcomponent&gt;
</code>

It returns the current time when the time() method is run. To require an API key, you would simply add a new argument:

<code>
&lt;cfcomponent output="false"&gt;

&lt;cffunction name="time" access="remote" returnType="string" output="false"&gt;
	&lt;cfargument name="api" type="string" required="true"&gt;
	&lt;cfreturn now()&gt;
&lt;/cffunction&gt;

&lt;/cfcomponent&gt;
</code>

You would then simply validate the API. I'd recommend building another CFC to handle that, and create an instance in your web service CFC to use it.

You should also consider building in rate limiting. Most Web 2.0 sites do this. By that I mean they only allow X number of requests per day. You can add simple database logging of API calls and check to see if a user has gone over their limit. This is also a nice way to monetize your service. Provide up to 1000 calls for free, and charge for folks who need more.

Not only will this help throttle the use of your web service, it will also discourage (but not stop) folks from sharing their API keys with other people.

(If folks would like a full example of a CFC using an API check, let me know and I'll write up a demo.)