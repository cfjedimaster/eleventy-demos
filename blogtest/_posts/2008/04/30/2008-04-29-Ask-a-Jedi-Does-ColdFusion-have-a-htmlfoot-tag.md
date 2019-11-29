---
layout: post
title: "Ask a Jedi: Does ColdFusion have a htmlfoot tag?"
date: "2008-04-30T10:04:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/04/30/Ask-a-Jedi-Does-ColdFusion-have-a-htmlfoot-tag
guid: 2796
---

Rob asks:

<blockquote>
<p>
Is there a &lt;cfhtmlfoot&gt; tag? One that would write at the end of html file, before &lt;/body&gt; tag...
</p>
</blockquote>

In case folks don't get why he is asking, ColdFusion comes with a <a href="http://www.cfquickdocs.com/cf8/?getDoc=cfhtmlhead">cfhtmlhead</a> tag that lets you dynamically add stuff to the HEAD portion of an HTML document. There is <b>not</b> a corresponding tag like what Rob wants, but there is no reason we can't hack one up in a custom tag. My solution will make use of both the Request scope and the oft-maligned (by me) onRequest function. First, a sample page:

<code>
&lt;cf_htmlfoot text="&lt;p&gt;&copy; Raymond Camden #year(now())#"&gt;
&lt;html&gt;

&lt;head&gt;
&lt;title&gt;Test&lt;/title&gt;
&lt;/head&gt;

&lt;body&gt;

&lt;p&gt;
Woohoo,web design kicks butt.
&lt;/p&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>

This is a trivial page with simple text on it. Note the call to the custom tag, htmlfoot, on top. The custom tag just does this:

<code>
&lt;!--- the text to add ---&gt;
&lt;cfparam name="attributes.text" default=""&gt;

&lt;!--- where we store it ---&gt;
&lt;cfparam name="request.footertext" default=""&gt;

&lt;!--- add it ---&gt;
&lt;cfset request.footertext &= attributes.text&gt;
</code>

As you can see, we simply take your text, and append it to the text we want to add to the foot. This actually makes my tag better as I don't think you can have multiple cfhtmlhead tags. If I weren't so lazy, I'd also make the custom tag support this syntax:

<code>
&lt;cf_htmlfoot&gt;
Foo Foo
&lt;/cf_htmlfoot&gt;
</code>

Anyway, the last step is to enable onRequest to notice the Request scope variable we created:

<code>
&lt;cffunction name="onRequest" returnType="void"&gt;
	&lt;cfargument name="thePage" type="string" required="true"&gt;
	&lt;cfset var content = ""&gt;

	&lt;cfsavecontent variable="content"&gt;
	&lt;cfinclude template="#arguments.thePage#"&gt;
	&lt;/cfsavecontent&gt;

	&lt;cfif structKeyExists(request, "footertext")&gt;
		&lt;cfset content = replacenocase(content, "&lt;/body&gt;", "#request.footertext#&lt;/body&gt;")&gt;
	&lt;/cfif&gt;

	&lt;cfoutput&gt;#content#&lt;/cfoutput&gt;
&lt;/cffunction&gt;
</code>

There isn't much to talk about here. All I did was look for the Request variable, and if it existed, I insert it into the result HTML before outputting it to the browser. Again, I'm not a big fan of onRequest, but this is an interesting example of how one could use it.