---
layout: post
title: "Position of CFERROR Matters"
date: "2006-11-30T17:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/11/30/Position-of-CFERROR-Matters
guid: 1683
---

Chalk this up to the "I can't believe you never saw this before" file. While this is incredibly obvious, I never really ran into this today. Where you put your CFERROR tag (for those using Application.cfm instead of Application.cfc) matters. Consider:

<code>
&lt;cferror template="exception.cfm" type="exception"&gt;
&lt;cfoutput&gt;#x#&lt;/cfoutput&gt;
</code>

The code above will work correctly.

<code>
&lt;cfoutput&gt;#x#&lt;/cfoutput&gt;
&lt;cferror template="exception.cfm" type="exception"&gt;
</code>

The code above will <b>not</b> work correctly because the error occurs before ColdFusion has been told what to do with an error. As I said - incredibly obvious but it never really bit me in the rear till today. 

Now you might say - why not just move it to the top of your Application.cfm file. Well that would work - but what if your exception handler itself uses variables in the Application scope? For example - an application.adminemail setting to know where to fire off error reports. I think you might consider doing code something like so in your exception handler:

<code>
&lt;cfif not structKeyExists(application, "adminemail")&gt;
  &lt;cfset mailTo="some hard coded address"&gt;
&lt;cfelse&gt;
  &lt;cfset mailTo = application.adminemail&gt;
&lt;/cfif&gt;
</code>

While it is never nice to hard code values - it might be acceptable as a last case resort. Someone remind me tomorrow and I'll post my "typical" exception handler.