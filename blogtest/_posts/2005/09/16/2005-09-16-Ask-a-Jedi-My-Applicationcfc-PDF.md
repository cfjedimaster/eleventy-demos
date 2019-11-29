---
layout: post
title: "Ask a Jedi: My Application.cfc PDF"
date: "2005-09-16T17:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/09/16/Ask-a-Jedi-My-Applicationcfc-PDF
guid: 785
---

A user asks:

<blockquote>
Have a question regarding your <a href="http://www.raymondcamden.com/downloads/app.pdf">Application.cfc PDF</a>. I do not understand (I'm a newbie) why you have this.scriptProtect set to false instead of true. Wouldn't it be better to protect it? This is my understanding from the CFMX7 documentation. Thanks.
</blockquote>

To be honest, I didn't think about making the PDF have "best practices" per se - I just wanted a nice 'skeleton' Application.cfc PDF I could use for my own applications, and share with others. 

That being said - what <b>should</b> you use for the setting? Unfortunately I have two answers for this. My readers will probably chime in as well (hopefully).

The scriptProtect feature is a very nice addition to CFMX7, although it is not perfect. (See my <a href="http://www.coldfusionjedi.com/index.cfm/2005/9/14/ScriptProtect-Gotcha">last post</a> on it and pay particular attention to Pete's comment.) Of course, nothing is perfect. So normally I'd would say, always turn it on. 

However - when you use this feature, you can't disable it. Sometimes you may want to allow potentially dangerous HTML in form entries. For example, on this blog, I have the right to use whatever HTML I want when creating entries. I wouldn't want scriptProtect to stop me. Since the setting is application-wide, I can't just turn it off for me when I'm logged in. That alone is enough reason for me not to use it here. (Although BlogCFC is staying backwards-compat with CFMX 6.1 and BlueDragon 6.2.) If that isn't a concern for you, then I'd say definitely turn the feature on.