---
layout: post
title: "Ask a Jedi: How do I convert JSON to XML?"
date: "2009-09-02T10:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/09/02/Ask-a-Jedi-How-do-I-convert-JSON-to-XML
guid: 3509
---

Jody asks:

<blockquote>
Quick question... But probably long answer... Is there anyway possible to convert JSON to XML?
</blockquote>

Tsk tsk, Jody. I find your lack of faith (in ColdFusion!) to be disturbing! ;) Actually it isn't that difficult at all. The process I'd employ is to first convert the JSON into a native ColdFusion data structure and then convert that to XML. Here are a few examples.
<!--more-->
First, let's talk about JSON conversion. In ColdFusion 8, this is a no-brainer. It's just built in. So to convert some data into JSON I could do this:

<code>
&lt;cfset s = {}&gt;
&lt;cfset s.name = "Raymond Camden"&gt;
&lt;cfset s.age = 36&gt;
&lt;cfset s.kids = ["Jacob","Lynn","Noah"]&gt;
&lt;cfset s.handed = "left"&gt;

&lt;cfset jsonVersion = serializeJSON(s)&gt;
&lt;cfoutput&gt;json version=#jsonVersion#&lt;p&gt;&lt;/cfoutput&gt;
</code>

This returns: json version={% raw %}{"HANDED":"left","NAME":"Raymond Camden","AGE":36.0,"KIDS":["Jacob","Lynn","Noah"]}{% endraw %}

Now if we pretend we <i>began</i> with that JSON, converting it back into ColdFusion is as simple as: 

<code>
&lt;cfset data = deserializeJSON(jsonVersion)&gt;
</code>

Note - if you don't have ColdFusion 8, I recommend the <a href="http://www.epiphantastic.com/cfjson/">CFJSON</a> CFC for JSON conversion. It's like butter. 

Ok, so at this point we are back to having native ColdFusion data, how do we convert it to XML? Outside of WDDX support, there is no way to convert dynamic ColdFusion data into XML. I've got my own little CFC for that, <a href="http://www.raymondcamden.com/projects/toxml/">toXML</a>, but I never updated it to be recursive. I picked a random project from RIAForge, <a href="http://anythingtoxml.riaforge.org/">AnythingToXML</a>, and decided to use that. It works ok, but note that it assumes you want to serve up the XML data instead of actually work with it. I manually edited the project's CFC to remove the <cfcontent> tag. 

Anyway, after a few seconds looking at the docs, I was able to generate the XML like so:

<code>
&lt;!--- then convert to xml ---&gt;
&lt;cfset xmlcfc = createObject("component", "AnythingToXML.AnyThingToXml")&gt;
&lt;cfset packet = xmlcfc.toXML(data,"data")&gt;

&lt;cfoutput&gt;#htmlEditFormat(packet)#&lt;/cfoutput&gt;
</code>

Not really rocket science, but it works. Of course, you don't have to use a component. If you know the form of your data, you can always build the XML manually. Consider the following template. It makes use of the Twitter API to get JSON data for a search. I then loop over the results and generate XML.

<code>
&lt;cfset q = "coldfusion"&gt;
&lt;cfhttp url="http://search.twitter.com/search.json?q=#urlEncodedFormat(q)#" result="result"&gt;

&lt;cfset data = deserializeJSON(result.fileContent)&gt;

&lt;cfxml variable="packet"&gt;
&lt;twitterresults&gt;
	&lt;cfoutput&gt;
	&lt;query&gt;#xmlFormat(q)#&lt;/query&gt;
	&lt;cfloop index="r" array="#data.results#"&gt;
		&lt;result&gt;
			&lt;user&gt;#xmlFormat(r.from_user)#&lt;/user&gt;
			&lt;created&gt;#xmlFormat(r.created_at)#&lt;/created&gt;
			&lt;text&gt;#xmlFormat(r.text)#&lt;/text&gt;
		&lt;/result&gt;
	&lt;/cfloop&gt;
	&lt;/cfoutput&gt;
&lt;/twitterresults&gt;
&lt;/cfxml&gt;

&lt;cfdump var="#packet#"&gt;
</code>

The Twitter API returns more information than what I've used. I kept things simple though. Here is a quick screen shot showing the result:

<img src="https://static.raymondcamden.com/images/cfjedi/Picture 184.png" />

One quick last note - well ok, two quick notes. First off - the <a href="http://apiwiki.twitter.com/Twitter-API-Documentation">Twitter API</a> kicks major butt. I'm blown away with how simple it is to use and how - lord forbid - how much it helps you actually use it. (Google - are you listening? Please don't buy Twitter and ruin the API.) Secondly - Twitter supports ATOM results. This is a flavor of RSS and is XML already, so technically, I wouldn't need to convert the JSON.