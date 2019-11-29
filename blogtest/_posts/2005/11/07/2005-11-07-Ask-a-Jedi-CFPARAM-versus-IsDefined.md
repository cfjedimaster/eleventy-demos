---
layout: post
title: "Ask a Jedi: CFPARAM versus IsDefined"
date: "2005-11-07T12:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/11/07/Ask-a-Jedi-CFPARAM-versus-IsDefined
guid: 901
---

A reader asks:

<blockquote>
Hi there Jedi.  So which is better to do?  Check for a null URL value using CFPARAM or CFisDefined?  CFPARAM is so much straightforward and usually seems to work just about any place I need it.  I have no idea why some folks opt for CFisDefined (if I'm even getting that tag right).
</blockquote>

First off - neither is better. Each does exactly what you want them to do. CFPARAM will create a variable if one doesn't exist (and optionally do type checking), while isDefined only checks for the existence of a variable. So again - one isn't better than the other. You simply use the one that makes sense.

Now, what you may be asking is - why would folks do the following instead of CFPARAM:

<code>
&lt;cfif not isDefined("url.id")&gt;
  &lt;cfset url.id = 1&gt;
&lt;/cfif&gt;
</code>

There are a few reasons. First off - you typically pass a hard coded value to CFPARAM, but you may have more complex logic. In other words, you may want to day, if URL.ID is not defined, <b>and</b> it is in the morning, do this, otherwise do that. While you could point CFPARAM to a UDF that did that, it would be more readable to use cfif and isDefined. Another example - if url.id does exist, you may want to preload a bunch of form variables with data from the database. If url.id does not exist, you may want to default those values. You may then choose to use isDefined instead. 

Another possibility - while CFPARAM can do optional type checking, it can't be as precise as you may like. So I can tell CFPARAM to ensure a value is numeric, but I can't check to see if the value is an integer or greater than zero.

Anyone else have a comment on why they would use one over the other?