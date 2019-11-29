---
layout: post
title: "How are Facebook and Google+ creating link previews?"
date: "2011-07-26T10:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/07/26/How-are-Facebook-and-Google-creating-link-previews
guid: 4308
---

Last night I noticed something interesting. I had added a link to a Google+ post (I'd post the link here, but it looks like you can't edit a Google+ share setting after it is written) and noticed it used an image from the link in the post. It wasn't a "URL Preview" (ie, a screen shot), but rather one of the images from the page itself. I decided to dig into this a bit and figure out what image it picked and why. Here is what I've found.
<!--more-->
<p/>

I began my search and - not surprisingly - immediately found an answer for Facebook's link previews over on Stack Overflow: <a href="http://stackoverflow.com/questions/1079599/facebook-post-link-image">Facebook Post Link Image</a>. Turns out that Facebook makes use of two possible values for their link previews:

<p/>

<ol>
<li>First, Facebook looks for an OpenGraph tag like so: &lt;meta property="og:image" content="image url"/&gt; There's a set of these OpenGraph tags to allow for even more customization of how Facebook "sees" your page. You can read the <a href="http://developers.facebook.com/docs/reference/plugins/like/">documentation</a> for more detail on this. (That link is about their Like feature, but it applies in general.) 
<li>If Facebook can't find that, it then looks for another link tag: &lt;link rel="image_src" href="image url" /&gt;. If you have <i>both</i> of these tags, then Facebook gives preference to the OpenGraph tag.
</ol>

<p/>

What's even cooler is that Facebook provides a "Lint" tool that allows you to test how it will parse your page: <a href="http://developers.facebook.com/tools/lint/">URL Linter</a>. I encourage you to give this a try. It's probably worthwhile for your client sites as well.

<p/>

Unfortunately <b>none of these</b> worked for Google+. No amount of Googling helped. After some more testing I've been able to determine that Google+ simply uses the first image it finds. This seems odd. The first image in a web page is probably something layout related and not really "critical" to the page itself. That being said, it seems to be the logic Google uses. So consider this HTML.

<p/>

<pre><code class="language-markup">
&lt;html&gt;
&lt;head&gt;
&lt;title&gt;Test Title&lt;/title&gt;
&lt;meta name="description" content="A description for the page." /&gt;
&lt;link rel="image_src" href="http://www.raymondcamden.com/images/meatwork.jpg" /&gt;
&lt;meta property="og:image" content="http://www.coldfusionjedi.com/images/ScreenClip145.png"/&gt; 
&lt;/head&gt;

&lt;body&gt;

&lt;h1&gt;A Test Title&lt;/h1&gt;

&lt;img src="http://www.coldfusionjedi.com/images/eyeballs/right.jpg"&gt;

&lt;p&gt;
This is a page.
&lt;/p&gt;

&lt;img src="http://www.coldfusionjedi.com/images/IMAG0235.jpg"&gt;

&lt;/body&gt;
&lt;/html&gt;
</code></pre>

<p/>

Given this HTML, Facebook will grab this URL for the preview: http://www.coldfusionjedi.com/images/ScreenClip145.png. Google+ will instead pick this one: http://www.coldfusionjedi.com/images/eyeballs/right.jpg. As much as I'm a Google+ fan now, I really think Facebook is making a much better choice.

<p/>

Ok, given the logic above, what about writing our own code to mimic this behavior? I wrote a simple UDF that accomplishes this - I'll post it to <a href="http://www.cflib.org">CFLib</a> a bit later today.

<p/>

<pre><code class="language-markup">
&lt;cffunction name="getURLPreview" output="false" returnType="string"&gt;
	&lt;cfargument name="theurl" type="string" required="true"&gt;
	&lt;cfargument name="defaultimageurl" type="string" required="false" default="" hint="If we can't find an image, the UDF will return this."&gt; 

	&lt;cfset var httpResult = ""&gt;
	&lt;cfset var html = ""&gt;
	&lt;cfset var match = ""&gt;
	&lt;cfset var srcmatch = ""&gt;

	&lt;!--- grab the html ---&gt;
	&lt;cfhttp url="#arguments.theurl#" result="httpResult"&gt;
	&lt;cfif httpResult.responseheader.status_code neq 200&gt;
		&lt;cfreturn ""&gt;
	&lt;/cfif&gt;

	&lt;cfset html = httpResult.fileContent&gt;

	&lt;!--- First look for meta/og:image ---&gt;
	&lt;!--- Example: &lt;meta property="og:image" content="http://www.coldfusionjedi.com/images/ScreenClip145.png"/&gt; ---&gt;
	&lt;cfset match = reFindNoCase("&lt;meta[[:space:]]+property=""og:image""[[:space:]]+content=""(.+?)""[[:space:]]*/{% raw %}{0,1}{% endraw %}&gt;", html,1,1)&gt;

	&lt;cfif match.pos[1] gt 0&gt;
		&lt;cfreturn mid(html, match.pos[2], match.len[2])&gt;
	&lt;/cfif&gt;

	&lt;!--- Then try link rel/image_src ---&gt;
	&lt;!--- Example: &lt;link rel="image_src" href="http://www.coldfusionjedi.com/images/meatwork.jpg" /&gt; ---&gt;
	&lt;cfset match = reFindNoCase("&lt;link[[:space:]]+rel=""image_src""[[:space:]]+href=""(.+?)""[[:space:]]*/{% raw %}{0,1}{% endraw %}&gt;", html,1,1)&gt;

	&lt;cfif match.pos[1] gt 0&gt;
		&lt;cfreturn mid(html, match.pos[2], match.len[2])&gt;
	&lt;/cfif&gt;

	&lt;!--- Finally, try ANY image ---&gt;
	&lt;cfset match = reMatchNoCase("&lt;img.*?&gt;",html)&gt;
	&lt;cfif arrayLen(match) gte 1&gt;
		&lt;!--- return the source ---&gt;
		&lt;cfset srcmatch = reFindNoCase("src=""(.+?)""", match[1],1,1)&gt;
		&lt;cfreturn mid(match[1], srcmatch.pos[2], srcmatch.len[2])&gt;
	&lt;/cfif&gt;

	&lt;cfreturn arguments.defaultimageurl&gt;
&lt;/cffunction&gt;
</code></pre>

<p/>

If you read slowly down the UDF you can see it attempts to mimic Facebook's logic first and then finally resorts to the 'first image on page' logic. It also allows for default image argument. Now personally - I don't necessarily think the first image on page thing is going to make sense. If you agree, just remove that block of code.