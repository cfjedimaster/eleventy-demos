---
layout: post
title: "Determining the HTTP request method in ColdFusion"
date: "2012-02-22T07:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2012/02/22/Determining-the-HTTP-request-method-in-ColdFusion
guid: 4530
---

I was talking to someone recently about REST and ColdFusion 10 (something I'd like to demo here soon) and the question of HTTP methods came up. One of the interesting things ColdFusion 10's REST support allows for is CFC methods locked down to a particular HTTP request type. This allows you to ensure a method is run only for a GET request, or PUT, or whatever makes sense for your business logic. 

<p/>
<!--more-->
But what about ColdFusion 9, and earlier? Is it possible to programatically respond to different request types? Absolutely. You've got not one, but two different ways to check how the current CFM/CFC file was requested:

<p/>

<code>
&lt;cfoutput&gt;
cgi.request_method=#cgi.request_method#&lt;br/&gt;
&lt;/cfoutput&gt;
&lt;cfset req = getHTTPRequestData()&gt;
&lt;cfoutput&gt;
getHTTPRequestData().method=#req.method#
&lt;/cfoutput&gt;
</code>

<p>

In the example above, the first way we check the request method is via the CGI scope. That's simple enough. But you can also use the ColdFusion function, getHTTPRequestData. This returns the method in the result structure. 

<p>

Either of these methods should work fine for you.