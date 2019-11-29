---
layout: post
title: "Question from Reader: ColdFusion and Licensing Schemes"
date: "2009-07-17T12:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/07/17/Question-from-Reader-ColdFusion-and-Licensing-Schemes
guid: 3446
---

Kevin asked:

<blockquote>
<p>
Hi, I need some advice about licensing models. I am in the process of putting together a CF app and would like to sell it to anyone who feels they could use it. How do I implement a licensing scheme? I need to protect it so one customer
can't make copies of it (and perhaps sell it himself or give it away for free). I came across an <a href="http://msdn.microsoft.com/en-us/library/aa479017.aspx">article</a> that explains how to do it in ASP.Net. It gave me some ideas, but I was wondering if you know of  a methodology specific to CF?
</p>
</blockquote>

Unfortunately, this is not something I've ever dealt with. It's much easier to just give stuff away and not worry about it! (Although even just giving away code in an OS model means you have to think about what license to use.) So with that being said, I hope my readers can help him out. There are ways to distribute your application without the code: <a href="http://livedocs.adobe.com/coldfusion/8/htmldocs/help.html?content=deploying_5.html">Sourceless Distribution</a> but I've never made use of this myself. 

You can also encrypt your code, but remember that most folks can find a decryptor easily enough. 

You can consider storing a license key with your application, and having the application "phone home" to a validation system on your server. But you would <b>not</b> want to do that on every hit. This would be a great place to make use of onApplicationStart.

I'm not aware of any <i>public</i> ColdFusion code that makes this easier/simpler and again, I hope my readers have more ideas.