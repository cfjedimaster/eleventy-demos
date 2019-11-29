---
layout: post
title: "Quick example of serving up cached XML (with CF8 and CF9)"
date: "2009-08-03T12:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/08/03/Quick-example-of-serving-up-cached-XML-with-CF8-and-CF9
guid: 3471
---

A user on Twitter asked me about how to use cached data to serve up XML files. He had tried to use cfcache along with cfcontent and ran into trouble. I thought I'd whip up a quick example of how you could manually cache the data yourself, and I created a quick ColdFusion 9 version as well. Ok, so let's look at some sample code.
<!--more-->
First, here is an example of the "slow" version. It creates an XML feed based on URL parameters. The code that generates the XML is artificially slowed down via the sleep call:

<code>
&lt;cffunction name="getXML" output="false" returnType="string"&gt;
	&lt;cfargument name="type" type="string" required="true"&gt;
	&lt;cfset var res = ""&gt;
	
	&lt;cfsavecontent variable="res"&gt;&lt;cfoutput&gt;&lt;products type="#arguments.type#"&gt;&lt;product&gt;&lt;/product&gt;&lt;/products&gt;&lt;/cfoutput&gt;&lt;/cfsavecontent&gt;
	&lt;cfset sleep(2000)&gt;
	&lt;cfreturn res&gt;
&lt;/cffunction&gt;

&lt;cfparam name="url.type" default="cool"&gt;
&lt;!--- ensure valid type ---&gt;
&lt;cfif not listFindNoCase("cool,sexy,suave", url.type)&gt;
	&lt;cfset url.type =  "cool"&gt;
&lt;/cfif&gt;

&lt;cfset xml = getXML(url.type)&gt;

&lt;cfcontent type="text/xml" reset="true"&gt;&lt;cfoutput&gt;#xml#&lt;/cfoutput&gt;
</code>

The basic gist of the code is: Get and validate a URL parameter type. Get the XML. Serve it up. Done. To make this a bit quicker, we can simply use the Application scope. Consider this newer version:

<code>
&lt;cfapplication name="xmlcachingdemo"&gt;

&lt;cffunction name="getXML" output="false" returnType="string"&gt;
	&lt;cfargument name="type" type="string" required="true"&gt;
	&lt;cfset var res = ""&gt;
	
	&lt;cfsavecontent variable="res"&gt;&lt;cfoutput&gt;&lt;products type="#arguments.type#"&gt;&lt;product&gt;&lt;/product&gt;&lt;/products&gt;&lt;/cfoutput&gt;&lt;/cfsavecontent&gt;
	&lt;cfset sleep(2000)&gt;
	&lt;cfreturn res&gt;
&lt;/cffunction&gt;

&lt;cfparam name="url.type" default="cool"&gt;
&lt;!--- ensure valid type ---&gt;
&lt;cfif not listFindNoCase("cool,sexy,suave", url.type)&gt;
	&lt;cfset url.type =  "cool"&gt;
&lt;/cfif&gt;

&lt;!--- check cache ---&gt;
&lt;cfif not structKeyExists(application, "xmlcache_#url.type#")&gt;
	&lt;cfset application["xmlcache_#url.type#"] = getXML(url.type)&gt;
&lt;/cfif&gt;

&lt;cfcontent type="text/xml" reset="true"&gt;&lt;cfoutput&gt;#application["xmlcache_#url.type#"]#&lt;/cfoutput&gt;
</code>

Note that I added a cfapplication tag directly in my code. I don't recommend that - but for a quick test, it does the trick. The main difference though is in the logic right before we serve up the XML. Now we look in the Application scope for a key based on the URL type. If the user requests the sexy xml, the key will be: xmlcache_sexy. Each of the three XML types will have their own key and their own place in the Application scope. If it does not exist, we simply store it. If you run this example, you will see that the first hit for each type is slow, but then the next request will be served up immediately. 

One issue with this version though is that there is no time out for the cache. You can get around that by storing metadata with the key. In order words, store both the XML and the time it was generated. Then check that time and see if you should refresh the cache. Certainly doable, and it would only add a few more lines of code, but let's see how ridiculously easy this is in ColdFusion 9:

<code>
&lt;cfapplication name="xmlcachingdemo2"&gt;

&lt;cffunction name="getXML" output="false" returnType="string"&gt;
	&lt;cfargument name="type" type="string" required="true"&gt;
	&lt;cfset var res = ""&gt;
	
	&lt;cfsavecontent variable="res"&gt;&lt;cfoutput&gt;&lt;products type="#arguments.type#"&gt;&lt;product&gt;&lt;/product&gt;&lt;/products&gt;&lt;/cfoutput&gt;&lt;/cfsavecontent&gt;
	&lt;cfset sleep(2000)&gt;
	&lt;cfreturn res&gt;
&lt;/cffunction&gt;

&lt;cfparam name="url.type" default="cool"&gt;
&lt;!--- ensure valid type ---&gt;
&lt;cfif not listFindNoCase("cool,sexy,suave", url.type)&gt;
	&lt;cfset url.type =  "cool"&gt;
&lt;/cfif&gt;

&lt;!--- check cache ---&gt;
&lt;cfset cachedXML = cacheGet("xmlcache_#url.type#")&gt;
&lt;cfif isNull(cachedXML)&gt;
	&lt;cfset cachedXML = getXML(url.type)&gt;
	&lt;cfset cachePut("xmlcache_#url.type#",cachedXML, createTimeSpan(0,0,10,0))&gt;
&lt;/cfif&gt;

&lt;cfcontent type="text/xml" reset="true"&gt;&lt;cfoutput&gt;#cachedXML#&lt;/cfoutput&gt;
</code>

I've switched my code to now check against the built in cache system using cacheget. I use the same keyname as before though. If the result is null, I run the slow function and store it, but note now that I can easily make use of the cache system's time out value. Now my XML will be cached for 10 minutes. I don't need to check the time at all, cacheGet will simply return a null when the item times outs.

p.s. The user on Twitter had mentioned issues with cfcache and cfcontent. I did <b>not</b> notice any issue with that though. I put cfcache on top of my page and it just worked. I've asked him to please let us (you and I, gentle reader) know more about the error/problem he saw. Maybe cfcache would be ok for him. Personally though I prefer the more manual approach in ColdFusion Not 9.