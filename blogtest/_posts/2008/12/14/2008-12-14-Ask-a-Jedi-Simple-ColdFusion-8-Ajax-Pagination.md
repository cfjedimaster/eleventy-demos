---
layout: post
title: "Ask a Jedi: Simple ColdFusion 8 Ajax Pagination"
date: "2008-12-14T16:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/12/14/Ask-a-Jedi-Simple-ColdFusion-8-Ajax-Pagination
guid: 3147
---

Omer asks:

<blockquote>
<p>
I am looking for a way to navigate videos without refreshing the page. Currently I have pagination on the page and I only show 10 videos at a time. I only want portion of page to change when user select a different page number. I want to explore cfdiv and any other coldFusion 8 functions to accomplish this task. Thanks for your help in this regard.
</p>
</blockquote>

This is pretty similar to how I used to do pagination on <a href="http://www.coldfusionbloggers.org">ColdFusionBloggers.org</a>. That site now is mostly jQuery based, but here is a simple demo of how it could be done using just what ColdFusion 8 provides.
<!--more-->
First, we will begin with our main page. The pagination will all be run via a DIV:

<code>
&lt;h2&gt;My Page&lt;/h2&gt;

&lt;cfdiv bind="url:test2.cfm" /&gt;
</code>

The cfdiv tag will output a div and automatically load the url, test2.cfm, as soon as the page loads. (Got to love how easy that is in ColdFusion!)

Now let's look at test2.cfm. 99% of the code here is my simple pagination code. It's not perfect, and it's fake of course, but here is it:

<code>
&lt;cfparam name="url.start" default="1"&gt;
&lt;cfset total = 92&gt;
&lt;cfset perpage = 10&gt;

&lt;cfloop index="x" from="#url.start#" to="#min(url.start+perpage-1, total)#"&gt;
	&lt;cfoutput&gt;Record #x#&lt;br /&gt;&lt;/cfoutput&gt;
&lt;/cfloop&gt;

&lt;cfoutput&gt;
&lt;cfif url.start gt 1&gt;
	&lt;a href="#ajaxLink('#cgi.script_name#?start=#url.start-perpage#')#"&gt;Previous&lt;/a&gt;
&lt;cfelse&gt;
	Previous
&lt;/cfif&gt;
/
&lt;cfif (url.start+perpage-1) lt total&gt;
	&lt;a href="#ajaxLink('#cgi.script_name#?start=#url.start+perpage)#"&gt;Next&lt;/a&gt;
&lt;cfelse&gt;
	Next
&lt;/cfif&gt;
&lt;/cfoutput&gt;
</code>

There is a grand total of one thing I had to do to make this work within my Ajax-loaded div from the previous template. I wrapped the links with ajaxLink. This will automatically convert the link into code that will use Ajax to load the data and simply replace the contents of the current div.

You can view a live demo of this <a href="http://www.raymondcamden.com/demos/ajaxpaginationdemo/test.cfm">here</a>. Personally I think this is a rather nice, if simple, use of Ajax. Paging through lots of data can be slow and tedious, and anything that can make it a bit nicer is probably a good idea.