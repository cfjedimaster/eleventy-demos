---
layout: post
title: "Google+ API Released"
date: "2011-09-15T17:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/09/15/Google-API-Released
guid: 4366
---

Today Google+ released their "API" - <a href="http://developers.google.com/+/overview">Google+ Platform</a>. I put that in quotes because their API now is only three methods, but it's a start at least. The API allows you to get a user profile, get a user's post stream, and fetch one particular post (what they call activities). OAuth is supported, but you can fetch public data as long as you get an API key. Since the results are all in JSON, using the API is disappointingly trivial. (Heh, ok, so I'm being sarcastic.) Here's an incredibly trivial example using my person ID.
<!--more-->
<p>

<code>
&lt;cfset userid = "115106614688778962135"&gt;
&lt;cfset key = "allyourbasearebelongtoadobe"&gt;

&lt;cfif not structKeyExists(application, "userprofile")&gt;
	&lt;cfhttp url="https://www.googleapis.com/plus/v1/people/#userid#?key=#key#"&gt;
	&lt;cfset dataString = cfhttp.fileContent.toString()&gt;
	&lt;cfset data = deserializeJSON(dataString)&gt;
	&lt;cfset application.userprofile = data&gt;
&lt;cfelse&gt;
	&lt;cfset data = application.userprofile&gt;
&lt;/cfif&gt;
&lt;cfif not structKeyExists(application, "userstream")&gt;
	&lt;cfhttp url="https://www.googleapis.com/plus/v1/people/#userid#/activities/public?key=#key#"&gt;
	&lt;cfset dataString = cfhttp.fileContent.toString()&gt;
	&lt;cfset stream = deserializeJSON(dataString)&gt;
	&lt;cfset application.userstream = stream&gt;
&lt;cfelse&gt;
	&lt;cfset stream = application.userstream&gt;
&lt;/cfif&gt;
	
&lt;cfoutput&gt;
	&lt;a href="#data.url#"&gt;&lt;img src="#data.image.url#?sz=100" align="left" border="0"&gt;&lt;/a&gt;
	&lt;a href="#data.url#"&gt;#data.displayName#&lt;/a&gt;
	&lt;cfif len(data.tagline)&gt;
		&lt;br/&gt;
		&lt;i&gt;"#data.tagline#"&lt;/i&gt;
	&lt;/cfif&gt;
	&lt;br clear="left"&gt;
	&lt;cfloop index="post" array="#stream.items#"&gt;
		&lt;a href="#post.url#"&gt;#post.title#&lt;/a&gt; (#post.updated#)&lt;br/&gt;
	&lt;/cfloop&gt;
&lt;/cfoutput&gt;
</code>

<p>

Since JSON "just works" in ColdFusion, there really isn't much to say here. The result objects are <i>very</i> detailed (here is the spec for the <a href="http://developers.google.com/+/api/latest/people#resource">person</a> resource) and you can do quite a bit with it. One of the cool tricks, for example, is that the image profile URL can be resized on the fly. Notice the sz attribute on the URL? That handles resizing it automatically. Here's how this little template rendered:

<p/>

<img src="https://static.raymondcamden.com/images/ScreenClip184.png" />

<p/>

The activities listed above are only my public ones. But you could take my code above to easily generate a "badge" on your home page with your latest public posts (which is what you would want to share publicly anyway). I assume the API will be expanded soon. I'd love to see them create a way to embed profile pictures via an email address, much like a Gravatar service.