---
layout: post
title: "Ask a Jedi: ColdFusion Hosting Plans"
date: "2006-03-07T18:03:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/03/07/Ask-a-Jedi-ColdFusion-Hosting-Plans
guid: 1139
---

Paul asks:

<blockquote>
Master Ray,
How about some tips for ColdFusion developers using shared hosting plans?

As I
look at hosts and read reviews, I'm actually a bit scared to throw my stuff into
a shared hosting plan, how do I know my source code with info like passwords for
dsns is safe? How do I know my MySQL or Access databases are safe?
</blockquote>

There are a few things I'd consider here. Let me address something else first. One thing you want to be absolutely sure about when you pick a host is to check which features they allow, and be <i>sure</i> that they don't have plans on changing those settings. I recently had a problem with a host who had allowed cffile and then all of a sudden turned it off - without warning. This threw a major monkey wrench into the site since it was about to launch. 

I'd check to see a) what features they support and b) how they handle the changing of such features. (In other words, will they give you a decent amount of time, and potentially a refund, if they change their mind on what they will support.)

So to really answer your question, what you probably want is a host that will support ColdFusion <a href="http://livedocs.macromedia.com/coldfusion/7/htmldocs/00001766.htm#1116021">security sandboxes</a>. Sandboxes should allow both your files to be protected (from someone doing a cffile or cfdirectory on them) as well as preventing someone from connecting to your databases. 

If your host doesn't support that, I'm not quite sure what else you can do. You could encrypt your files, but that encryption has been broken for some time now. (Although it would stop the casual hacker.) 

I haven't had any personal experience with this (this blog, plus my other CF sites, are all hosted on it's own box) so if my readers want to chime in - please do so. (Like you guys need an invitation from me to speak your mind. ;)