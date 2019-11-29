---
layout: post
title: "Ask a Jedi: Multiple questions on Application startup and templating"
date: "2008-01-09T10:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/01/09/Ask-a-Jedi-Multiple-questions-on-Application-startup-and-templating
guid: 2583
---

Just a quick note before I dive into this question. I've noticed lately I've been getting a few questions that cover stuff that I've answered before. I have <b>no</b> problems answering them again. Sometimes they cover things that really need repeating. I'm just commenting here as it seems like it has occurred a bit often lately, and if my readers are getting a bit miffed, I wanted to explain why. (As another FYI, I plan on running a survey like Todd is <a href="http://cfsilence.com/blog/client/index.cfm/2008/1/8/Quick-Blog-Survey-Tell-Me-How-Im-Doing">doing</a> so you will have the opportunity to tell me exactly what you think of my blog.) Ok, on with the questions!

Tony asks:
<blockquote>
<p>
Question 1 of 2:  I am now transitioning into using Application.cfc (I know...I know...but better late than never) and am not terribly sure what to do with my CFC instances.  To be totally honest, I'm trying to pretty much update ALL of my CF bad habits into any and all best
practices that I can.  So, up til now I've been invoking components where needed and that, of course, is not terribly great practice.  What I want to do is create them in Application.cfc so I can just refer to them when needed sitewide. This, I know, is no new concept. I just need assistance with getting started with it.

Which function within Application.cfc would be the best place to add createObject() reference? Can you clear this up for me?  You have many posts that deal with Application.cfc issues, but I haven't tracked down the answer to my question so I thought I'd contact you directly.
</p>
</blockquote>
<!--more-->
Congratulations on moving to Application.cfc. You won't regret it. What you want to use is the onApplicationStart method. It is run when your application starts and is the proper place for initialization code. Please see this specific blog post for more information: <a href="http://www.raymondcamden.com/index.cfm/2007/11/9/Applicationcfc-Methods-and-Example-Uses">Application.cfc Methods and Example Uses</a>

<blockquote>
<p>
I normally just use cfinclude for master header and footer files (and additional function libraries).  If I'm not using Model-Glue (or other framework) specifically, what is considered a good practice as far master templates are
concerned?  Or is it still ok to use cfinclude for master container files as long as CFCs are being leveraged correctly?
</p>
</blockquote>

I think you have two questions here. Should I use cfincludes for layout and should I use a cfinclude for 'master libraries' (of UDFs I assume). Let's cover layout. I don't like using cfinclude for layout. Mainly because variables will leak in between them and for sites with complex layout, it is better to have some separation. Normally I recommend custom tags. See this article: <a href="http://www.coldfusionjedi.com/index.cfm/2007/9/3/ColdFusion-custom-tag-for-layout-example">ColdFusion custom tag for layout example</a>.

As for UDF libraries, I don't have a firm idea yet of what I consider best. You can easily do a cfinclude in your Application.cfc onRequestStart function. However, this will <b>not</b> place the UDFs in your variables scope. You can do this in onRequest, but onRequest has negative side effects. What I do sometimes is this - I include the library in onRequestStart, but the UDF declarations are copied to the request scope. So my UDF file may look like so:

<code>
&lt;cfscript&gt;
function parisIQ() {% raw %}{ return 0; }{% endraw %}
request.parisIQ = parisIQ;

function britneyIQ() {% raw %}{ return -10; }{% endraw %}
request.britneyIQ = britneyIQ;
&lt;/cfscript&gt;
</code>

Basically I just copy the UDFs into the request scope and then reference them as request.parisIQ() or request.britneyIQ(). This also had the side effect of making them easily available in custom tags as well.