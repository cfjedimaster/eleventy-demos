---
layout: post
title: "The Friday \"How dumb was I\" post"
date: "2008-02-22T09:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/02/22/The-Friday-How-dumb-was-I-post
guid: 2666
---

So I'm going to blame this on my head cold, but yesterday I spent a good hour trying to figure out why my code was failing. The code did (essentially):

<code>
&lt;cfset result = util.getRetVal(a,b)&gt;
</code>

I cfdumped util. I clearly saw getRetVal. I even get anal. I created a new instance of the CFC (util was actually an Application scoped CFC placed in a view) and called it there and got the same error. I then deleted every other method but getRetVal and it still didn't work.

For a good sixty minutes I beat my head against the wall. If I were a laptop, my fan would have sounded like a jet engine. I then showed it to Todd Sharp. We hashed it back and forth a bit when he mentioned he had no trouble calling getRetValue.

See it? Let me say it again: getRetVal<b>ue</b>.

Ugh. Over an hour wasted because I used Val instead of Value. Nice.