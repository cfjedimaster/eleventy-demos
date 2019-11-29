---
layout: post
title: "Don't forget to validate those checkboxes/radio buttons/multi selects/etc"
date: "2009-01-05T09:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/01/05/Dont-forget-to-validate-those-checkboxesradio-buttonsmulti-selectsetc
guid: 3176
---

Ok, so I know "Validate Your Form Fields" is one of the ten commandments of web development, but even Jedis can screw this up at times. Here is a great, and maybe a bit subtle, example of something I screwed up in <a href="http://blogcfc.riaforge.org">BlogCFC</a>.
<!--more-->
Over the weekend a slew of error emails came in to our <a href="http://blog.broadchoice.com">blog at work</a> and then this morning another user reported the same error. The error was:

<blockquote>
<p>
The SUBSCRIBE argument passed to the addComment function is not of type boolean.
</p>
</blockquote>

This came from the Add Comment code. When you post a comment to my blogware, there is a subscribe checkbox. The checkbox will pass a true value, and since it is a checkbox, nothing at all will be passed if you leave it be. Therefore this code:

<code>
&lt;cfparam name="form.subscribe" default="false"&gt;
</code>

Will handle setting that state to false. That works fine until some spammer/script kiddie does a form post with subscribe set to a non-boolean value.

I fixed this easily enough (BlogCFC users can download the fix in about 5 minutes) by adding:

<code>
&lt;!--- validate boolean ---&gt;
&lt;cfif not isBoolean(form.subscribe)&gt;
	&lt;cfset form.subscribe = false&gt;
&lt;/cfif&gt;
&lt;cfif not isBoolean(form.rememberme)&gt;
	&lt;cfset form.rememberme = false&gt;
&lt;/cfif&gt;
</code>

Pretty simple mistake on my part. What's interesting/sad is that this is exactly the same type of thing I've had to worry about since I started ColdFusion development 10+ years ago!