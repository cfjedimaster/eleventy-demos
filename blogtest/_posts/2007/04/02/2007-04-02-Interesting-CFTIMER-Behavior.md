---
layout: post
title: "Interesting CFTIMER Behavior"
date: "2007-04-02T14:04:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/04/02/Interesting-CFTIMER-Behavior
guid: 1936
---

A few days ago I was working on an update to <a href="http://coldfire.riaforge.org">ColdFire</a> (mainly support for CFTIMER), when I ran into an interesting problem. When you use <a href="http://www.cfquickdocs.com/?getDoc=cftimer">CFTIMER</a>, you have a few options for how to display the timer information. Those options are inline, outline, comment, and debug. I wanted to ensure that ColdFire only picked up on timer information that used type=debug. Turned out I didn't need to worry about it. Internally - ColdFusion didn't record any cftimer call that wasn't type=debug. But I kept my inline cftimer test in so I could be sure it was acting like I thought it would.

But then ColdFire simply stopped working. I wasn't sure why - but then I realized that ColdFire thought a flush had happened! I had certainly not ran a cfflush (I have a separate test page for that), so I wasn't sure what was wrong. 

Turns out that when you use cftimer/type=inline, ColdFusion itself performs a flush! You can see this yourself by running this code:

<code>
&lt;cftimer type="inline" label="foo"&gt;
&lt;/cftimer&gt;

&lt;cfset thread = CreateObject("java", "java.lang.Thread")&gt;
&lt;cfset thread.sleep(5000)&gt;
</code>

ColdFusion will quickly display foo, and then execute the sleep. This was also confirmed by a friend at Adobe.

So while obviously this isn't a big huge deal (just one more thing to document for ColdFire), it may bite you if you try to do a cfheader call after a cftimer call. If you do, you will get:

<blockquote>
Failed to add HTML header.

ColdFusion was unable to add the header you specified to the output stream. This is probably because you have already used a CFFLUSH tag in your template,or buffered output is turned off
</blockquote>