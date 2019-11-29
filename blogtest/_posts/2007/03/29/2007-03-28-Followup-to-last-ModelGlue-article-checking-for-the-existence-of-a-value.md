---
layout: post
title: "Followup to last Model-Glue article - checking for the existence of a value"
date: "2007-03-29T08:03:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/03/29/Followup-to-last-ModelGlue-article-checking-for-the-existence-of-a-value
guid: 1929
---

In my <a href="http://ray.camdenfamily.com/index.cfm/2007/3/27/Interesting-ModelGlue-Feature-to-watch-out-for">last article</a>, I talked about what I considered to be an odd side effect of using getValue on the event object. I really should have told folks how you can check for the existence of a value without actually doing the get. In other words, if all you want to do is see if the value exists, you should do this:

<code>
&lt;cfif arguments.event.valueExists("dharma")&gt;
</code>

As opposed to getting it and checking if it is equal to "". Of course, if you are building a form, then you need to do both, since it is possible then the value <i>will</i> exist and be blank.

<code>
&lt;cfif arguments.event.valueExists("dharma") and arguments.event.getValue("dharma") neq ""&gt;
</code>

Something to keep in mind, and while I don't like this strange behavour of getValue, I'll definitely not forget now.

p.s. The ViewState has a similar API, but it uses viewState.exists() instead.