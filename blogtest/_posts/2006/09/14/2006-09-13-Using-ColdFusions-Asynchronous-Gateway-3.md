---
layout: post
title: "Using ColdFusion's Asynchronous Gateway - 3"
date: "2006-09-14T10:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/09/14/Using-ColdFusions-Asynchronous-Gateway-3
guid: 1531
---

I had promised a summary page a while ago concerning my two articles on ColdFusion's Asynch Gateways. In case you missed it, here are the older articles:

<a href="http://ray.camdenfamily.com/index.cfm/2006/9/7/Using-ColdFusions-Asynchronous-Gateway">Using ColdFusion's Asynchronous Gateway</a><br>
<a href="http://ray.camdenfamily.com/index.cfm/2006/9/7/Using-ColdFusions-Asynchronous-Gateway--2">Using ColdFusion's Asynchronous Gateway - 2</a><br>
<!--more-->
There were a few things I didn't get to that I'm going to cover in this post. First off - since my last article, Damon Cooper has updated his <a href="http://ray.camdenfamily.com/index.cfm/2006/9/13/Updated-CFTHREADCFJOIN-POC-from-Adobe">cfthread/cfjoin proof of concept</a>. Be sure to check it out as it is a very simple, yet currently unsupported, way of doing asynch CFML. 

Next - for another way of working with Asynch CFML, check out Sean Corfield's <a href="http://code.google.com/p/cfconcurrency/">Concurrency</a> library. You can even use this in Model-Glue: Unity which is pretty darn cool.

Lastly, I wanted to talk a bit more about the data structure you send to the gateway with the sendGatewayMessage function. I alluded to the fact that there were some "special" keys that you should not use as they have special meaning to the Asynch Gateway. They are:

cfcpath<br>
method<br>
originatorID<br>
timeout<br>

I'll start from the bottom. If you pass a timeout key in the data structure, it will tell ColdFusion how long your asynch code should be allowed to run. If not used, it defaults to the Timeout Request value in the ColdFusion admin. You would use this if you think your process may need more time.

As you can imagine, originatorID lets you give a custom value for the originatorID. This is passed to your CFC and defaults to CFMLGateway. This could be useful for logging purposes, or could even change what your code does. 

The method value changes what method the gateway will call on your CFC. By default the method is onIncomingMessage. 

Ok - so what about CFCPath? Well, if you remember from the <a href="http://ray.camdenfamily.com/index.cfm/2006/9/7/Using-ColdFusions-Asynchronous-Gateway">first post</a>, I talked about how you needed to create a Gateway Instance and point it to a CFC. One question you may have is - what if my application needs to do multiple things in an asynchronous manner? Well, you could use multiple gateways, but that may be overkill if you have quite a few different things you want to run asynchronously. You could also use different methods. That works - but then you may be mixing code for different business rules all in one CFC. 

The cfcpath value lets you simply override the CFC that gets called. This way you could make one instance and have it work with multiple CFCs. One thing to note - the value must be the <b>full path</b> to the CFC, not the relative "dot" path we are used to.