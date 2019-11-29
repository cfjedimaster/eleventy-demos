---
layout: post
title: "Using ColdFusion's Asynchronous Gateway - 2"
date: "2006-09-08T00:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/09/07/Using-ColdFusions-Asynchronous-Gateway-2
guid: 1520
---

Earlier today I <a href="http://ray.camdenfamily.com/index.cfm/2006/9/7/Using-ColdFusions-Asynchronous-Gateway">blogged</a> about ColdFusion's Asynchronous Gateway. I promised a more appropriate example to demonstrate the power of the gateway, and instead of watching the Steelers lose, I figured I'd write code instead.
<!--more-->
One note: I don't mean to imply that using the Asynch Gateway for logging is bad, or not a "real" example. Michael Dinowitz wrote a good <a href="http://ray.camdenfamily.com/index.cfm/2006/9/7/Using-ColdFusions-Asynchronous-Gateway#c89F8A3E8-D6AC-4872-1D09456B111E3280">comment</a> about he uses asynch logging on his own site. Be sure to read his remarks.

So - the new demo. A while ago I wrote a <a href="http://ray.camdenfamily.com/index.cfm/2006/7/21/CFTHREADCFJOIN-Proof-of-Concept">proof of concept</a> for Adobe's new cfthread/cfjoin tags (which may or may not be added to the product). The code simply fetched my RSS feed, grabbed each URL, and then downloaded them via CFHTTP to the local file system. Here is an example of the code using nothing special at all, just simple CFML:

<code>
&lt;cfhttp url="http://ray.camdenfamily.com/rss.cfm" result="result"&gt;
&lt;cfset myrss = result.filecontent&gt;
&lt;cfset myrssParsed = xmlParse(myrss)&gt;
&lt;cfset myurls = xmlSearch(myrssParsed, "/rss/channel/item/link/text()")&gt;
&lt;cfset links = arrayNew(1)&gt;

&lt;cfloop index="x" from="1" to="#arrayLen(myurls)#"&gt;
   &lt;cfset arrayAppend(links, myurls[x].xmlvalue)&gt;
&lt;/cfloop&gt;

&lt;cfloop index="loopcounter" from="1" to="#arrayLen(links)#"&gt;
	&lt;cfhttp url="#links[loopcounter]#" result="result"&gt;
	&lt;cfset filename = getDirectoryFromPath(getCurrentTemplatePath()) & "agtest/" & loopcounter & ".html"&gt;
	&lt;cffile action="write" file="#filename#" output="#result.filecontent#"&gt;
	&lt;cfoutput&gt;Done with #links[loopcounter]#&lt;br&gt;&lt;/cfoutput&gt;
	&lt;cfflush&gt;
&lt;/cfloop&gt;
</code>

The first half of the code handles creating an array of links. (And will not be repeated in my next example, but it will still be used.) I then loop over each item in the array, fetch it, and store the result. On average this took about 8-9 seconds on my machine. 

Now for the Asynch version. I created a new gateway instance named URLSucker. Obviously you want to use the Asynchronous Gateway type. I pointed it to a new CFC. Lets take a look at that code:

<code>
&lt;cfcomponent output="false"&gt;

&lt;cffunction name="onIncomingMessage" output="false" returnType="void"&gt;
	&lt;cfargument name="cfEvent" type="struct" required="yes"&gt;
	&lt;cfset var result = ""&gt;
	
	&lt;cfif structKeyExists(arguments.cfEvent.data, "url") and structKeyExists(arguments.cfEvent.data, "filename")&gt;
		&lt;cfhttp url="#arguments.cfEvent.data.url#" result="result"&gt;
		&lt;cffile action="write" file="#arguments.cfEvent.data.filename#" output="#result.fileContent#"&gt;	
	&lt;/cfif&gt;
			
&lt;/cffunction&gt;
	
&lt;/cfcomponent&gt;
</code>

This is rather short so it should be easy to explain. I mentioned in the last entry that your CFC has to have a method named onIncomingMessage. The data that I pass to the gateway will exist in the arguments.cfEvent.data value. For URLSucker, there are two values - a URL and a filename. I fetch the HTML and save it. Now let's go back to our CFM and see how the new calls work:

<code>
&lt;cfset props = structNew()&gt;
&lt;cfloop index="loopcounter" from="1" to="#arrayLen(links)#"&gt;
	&lt;cfset filename = getDirectoryFromPath(getCurrentTemplatePath()) & "agtest/a_" & loopcounter & ".html"&gt;
	&lt;cfset props.url = links[loopcounter]&gt;
	&lt;cfset props.filename = filename&gt;
	&lt;cfset status = sendGatewayMessage("URLSucker", duplicate(props))&gt;
	&lt;cfif status&gt;
		&lt;cfoutput&gt;Done with #links[loopcounter]#&lt;br&gt;&lt;/cfoutput&gt;
		&lt;cfflush&gt;
	&lt;/cfif&gt;
&lt;/cfloop&gt;
</code>

If you remember, the gateway expects a struct of data. I create it once before the loop since I will just be changing the values inside the loop. I create the URL and filename values I mentioned that my CFC will be using. I then use sendGatewayMessage, telling it to use URLSucker and passing in my structure. (Note the duplicate() call, I'll come back to it later.)

So - at this point, I've basically taken the slow part of my code out of the CFM and I'm letting the asych gateway handle running it. If you run the CFM again it will be incredibly faster. If you then monitor the agtest folder (that's where I stored the results), you will see the files pop up a few seconds after the CFM is run. 

Pretty easy, eh? What's up with the duplicate() call then? Well, structs passed to functions are actually passed by referenced. I knew this - but I thought that there was enough of a disconnect between my CFM and the CFC that the duplicate wouldn't be needed. But without it, all your files end up using the filename and url of the last entry in the loop. Very surprising, but also very easy to fix.

p.s. As I wrote this, the Steelers have now taken the lead. Someone remind me to blog next time the Saints play.