---
layout: post
title: "Quick example of the Google Docs API"
date: "2007-12-07T15:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/12/07/Quick-example-of-the-Google-Docs-API
guid: 2523
---

Earlier this morning a user forwarded me a job request from someone looking for code to integrate with Google Docs. In the past I've <i>really</i> detested Google's APIs, but I figured I'd take a look and see how bad it is. Turns out it wasn't as bad as I thought. I wrote up a quick demo. <b>This is not some new project.</b> This was just written for fun and as a proof of concept. 

The first thing you have to before calling the Google Docs API (any Google service I believe) is to authenticate. Now if you remember my complaints about the Calendar API - they had some funky login process that took 3 steps, including one that "may" occur. I love API's with "may" in them. The authentication API now is somewhat more simpler. Consider:

<code>
&lt;cfhttp url="https://www.google.com/accounts/ClientLogin" method="post" result="result" charset="utf-8"&gt;
	&lt;cfhttpparam type="formfield" name="accountType" value="HOSTED_OR_GOOGLE"&gt;
	&lt;cfhttpparam type="formfield" name="Email" value="rcamden@gmail.com"&gt;
	&lt;cfhttpparam type="formfield" name="Passwd" value="whereiscfonadobedotcom"&gt;
	&lt;cfhttpparam type="formfield" name="service" value="writely"&gt;
	&lt;cfhttpparam type="formfield" name="source" value="camden-cfgoogledocs-0"&gt;
&lt;/cfhttp&gt;
</code>

This is a fairly typical form post. Some things to note: The accoutnType is supposed to be either Google or Hosted, but they also allow for HOSTED_OR_GOOGLE if you don't know which one you are using. Kudos to Google for doing something helpful. The second thing to note is that the names for Email and Passwd must match the case I've shown above. Why? I don't know. Case-sensitivity is the Lindsey Lohan of Comp Sci. The service is, obviously, the service you are connecting too. Writely is the service value for docs. The source value is simply a name you give for your automated program. I shoulda called my super-megatron-9000 or something, but camden-cfgoogledocs-0 worked as well.

If done correctly, this returns a string of values in this form:

<blockquote>
<p>
LSID=Longfreakinglist<br/>
SID=Evenmorecrap<br/>
Auth=Stuff
</p>
</blockquote>

I wrote up some quick code to treat the result like a list and store the results:

<code>
&lt;cfset content = result.filecontent&gt;
&lt;cfset authdata = structNew()&gt;

&lt;cfloop index="line" list="#content#" delimiters="#chr(10)#"&gt;
	&lt;cfset dtype = listFirst(line, "=")&gt;
	&lt;cfset value = listRest(line, "=")&gt;
	&lt;cfset authdata[dtype] = value&gt;
&lt;/cfloop&gt;
</code>

Now you have authentication information. This can be passed in with your quest:

<code>
&lt;cfhttp url="http://docs.google.com/feeds/documents/private/full" method="get" result="result" charset="utf-8"&gt;
	&lt;cfhttpparam type="header" name="Authorization" value="GoogleLogin auth=#authdata.auth#"&gt;
&lt;/cfhttp&gt;
</code>

I've asked for a generic list of documents and I've passed the authorization header. This returns an Atom feed. Now as we know, CFFEED can parse this nicely. But CFFEED requires a URL or a real file. So I just treated it like a normal XML packet:

<code>
&lt;cfset packet = xmlParse(result.filecontent)&gt;
&lt;cfloop index="x" from="1" to ="#arrayLen(packet.feed.entry)#"&gt;
	&lt;cfset entry = packet.feed.entry[x]&gt;
	&lt;cfset title = entry.title.xmltext&gt;
	&lt;cfset updated = entry.updated.xmltext&gt;
	&lt;cfset type = entry.category.xmlattributes.label&gt;
	&lt;cfset sourceurl = entry.content.xmlattributes.src&gt;
	&lt;cfoutput&gt;[#type#] #title# (#updated#)&lt;br&gt;&lt;/cfoutput&gt;
&lt;/cfloop&gt;
</code>

What I've done here is loop over the entry results. I grabbed some of the values - not all - and I output them. The type variable will signify if the document is a written doc, spreadsheet, or presentation.

Oddly - there is no way to directly download or export a document. You do get access to the "content" URL in the result. Notice I store the above. If you want, you can get the contents like so:

<code>
&lt;cfhttp url="#somesourceurl#" method="get" result="result" charset="utf-8"&gt;
	&lt;cfhttpparam type="header" name="Authorization" value="GoogleLogin auth=#authdata.auth#"&gt;
&lt;/cfhttp&gt;
&lt;cfoutput&gt;#result.filecontent#&lt;/cfoutput&gt;
</code>

This returns a textual version of the document. When I say text I mean HTML as well. The result I got mirrored nicely in HTML what I had seen when writing the document.

Not too bad. Someone could wrap this up into a CFC in a few minutes. I didn't cover the entire API here - see this doc for more information:

<a href="http://code.google.com/apis/documents/overview.html">http://code.google.com/apis/documents/overview.html</a>

The API has some nice filtering options. You can also upload as well.