---
layout: post
title: "Ask a Jedi: Application.cfm, subdirectories, and paths"
date: "2006-08-08T09:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/08/08/Ask-a-Jedi-Applicationcfm-subdirectories-and-paths
guid: 1453
---

Brad asked the following question:

<blockquote>
In CF 6.1, I have application.cfm in the root directory.  It contains a custom tag that records PPC visits.  If I have a page in a subdirectory (below root)--what will happen when the custom tag is executed in the application.cfm in the root?
I'm using the &quot;CF_&quot; format and not CFIMPORT.  

I'm just curious how application.cfm handles paths when executed from a subdirectory that does not have it's own application.cfm.
</blockquote>

This is one of those things that I'm always unsure of, so I whipped up a quick test. I wrote an Application.cfm file like so:
<!--more-->
<code>
&lt;p&gt;
Running from Application.cfm
&lt;/p&gt;

&lt;cfinclude template="include.cfm"&gt;

&lt;cf_tag&gt;
</code>

As you can see, I have a simple message and an include as well as a custom tag call. I dropped in a simple index.cfm:

<code>
&lt;p&gt;
This is index.cfm in root.
&lt;/p&gt;
</code>

I then added a subdirectory named sub and added this index.cfm in that folder:

<code>
&lt;p&gt;
This is index.cfm in sub.
&lt;/p&gt;
</code>

Running the index.cfm in both the root and child subdirectory worked as expected. Both the include and custom tag call were relative to the root folder. I tested this both in CFMX and CFMX7 to be sure. I also tested it with Application.cfc:

<code>
&lt;cfcomponent&gt;

&lt;cffunction name="onRequestStart"&gt;
	&lt;cfoutput&gt;
	&lt;p&gt;
	Running from App.cfc
	&lt;/p&gt;
	&lt;/cfoutput&gt;
	&lt;cfinclude template="include.cfm"&gt;
	&lt;cf_tag&gt;
&lt;/cffunction&gt;

&lt;/cfcomponent&gt;
</code>

And this also worked fine. Lastly, as a quick off topic note. This particular question came to me in March. As a reminder - I don't reply to all my "Ask a Jedi" stuff immediately. If you send a question and you need an answer asap, please tell me. That doesn't mean I'll answer (I do have a 9-5 ya know ;) but I will at least try to reply back letting you know I can't answer on time.