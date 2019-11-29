---
layout: post
title: "Quick XML tip - inserting HTML into an XML object"
date: "2010-09-13T07:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/09/13/Quick-XML-tip-inserting-HTML-into-an-XML-object
guid: 3939
---

(<b>Quick edit: I think some of the HTML blocks I posted were escaped poorly in the blog post. I've got to run, but if so, I'll fix them later today.</b> <b>Second Edit - I replaced the badly formatted code examples with screen shots.</b>) This came up on cf-talk (both the question and the answer from almost three years ago!) and I thought it would be good to share. Jake Munson noted that whenever he tried to insert HTML into an XML object, the HTML ended up escaped. Let's look at a quick example.
<!--more-->
<p/>

<code>
&lt;cfset s = "&lt;font color=""red""&gt;&lt;b&gt;foo&lt;/b&gt;&lt;/font&gt;"&gt;
&lt;cfxml variable="x"&gt;
&lt;root&gt;
&lt;child name="one" /&gt;
&lt;/root&gt;
&lt;/cfxml&gt;
&lt;cfset x.root.child[1].xmlText = s&gt;

&lt;cfoutput&gt;
#htmleditformat(toString(x))#
&lt;/cfoutput&gt;
</code>

<p/>

We begin with the HTML we want to insert in variable s. Next we define a real simple and small XML string in x. So far so good. Next we insert s into x. What is the result?

<p/>

<img src="https://static.raymondcamden.com/images/Screen shot 2010-09-13 at 6.19.01 AM.png">

<p/>

As you can see, the HTML was escaped. That's not good. So what to do? When I first saw this, I brought up the fact that this is probably a <i>feature</i>. When you insert HTML into XML, you are normally supposed to wrap it in a CDATA block. CDATA blocks allow for any data, even bad XML, inside a valid XML block. As we know, HTML doesn't always follow proper XML works (or it should, but real world HTML doesn't always do so). I recommended simply wrapping up the string in CDATA like so:

<p/>

<code>
&lt;cfset x.root.child[1].xmlText = "&lt;![CDATA[" &  s & "]]&gt;"&gt;
</code>

<p/>

How well does that work? Badly:

<p/>

<img src="https://static.raymondcamden.com/images/cfjedi/Screen shot 2010-09-13 at 6.19.50 AM.png" />

<p/>

Finally I did some Googling, and ran across <a href="http://www.mail-archive.com/cf-talk@houseoffusion.com/msg312892.html">another cf-talk post</a>, from 2008, by Chris Johnson. Turns out there is another way to set values. I was using the xmlText attribute, but there is actually an xmlCData attribute as well!

<p/>

<code>
&lt;cfset x.root.child[1].xmlCData =   s&gt;
</code>

<p/>

Which returns:

<p/>

<img src="https://static.raymondcamden.com/images/cfjedi/Screen shot 2010-09-13 at 6.20.41 AM.png" />

<p/>

Perfect! And as Chris points out, this is actually <a href="http://livedocs.adobe.com/coldfusion/7/htmldocs/wwhelp/wwhimpl/common/html/wwhelp.htm?context=ColdFusion_Documentation&file=00001512.htm">documented</a>. In all my years working with XML and ColdFusion, this is the first I've seen of this feature though. I hope this helps others.