---
layout: post
title: "Ask a Jedi: Whacking the CFC"
date: "2005-11-03T10:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/11/03/Ask-a-Jedi-Whacking-the-CFC
guid: 895
---

John asks:

<blockquote>
ok, here's one - if i've got a CFC in the application scope - what's the best way to get rid of it? Structclear? set application.cfcname to ""?
</blockquote>

Well, my question is - do you really want to get rid of it or just refresh it? Normally you want to refresh. Typically I'll have my onRequestStart look for url.reinit, and if it exists, I'll call onApplicationStart. This will reload all my application variables. (Be warned though that this is not thread-safe, but 99% of the time all my onApplicationStart does is set a bunch of application variables.) 

But if you really want to get rid of it (and this applies to <i>any</i> value in a structure, not just Application variables), you wouldn't want to use structClear, as that would clear the entire structure. What you want is structDelete():

<code>
&lt;cfset structDelete(application,"somepoorinnocentCFC")&gt;
</code>

Setting the value to string would also delete the CFC, but could lead to problems if your code always assumes application.someCFC is really a CFC.