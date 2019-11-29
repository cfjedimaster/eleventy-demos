---
layout: post
title: "What's an expert ColdFusion developer?"
date: "2011-05-17T08:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/05/17/Whats-an-expert-ColdFusion-developer
guid: 4235
---

Nicci wrote to me last night with the following question:

<blockquote>
I was recently approached by an IT recruiter friend of mine regarding a position looking for an expert-level Coldfusion developer.

I have been working with CF for about 5 years and in no way consider myself expert-level, but my question is this; with "expert-level" obviously being a very subjective phrase, what would you expect from an expert-level CF developer?

Just hoping to get a feel for the expectation, within the community.
</blockquote>
<!--more-->
<img src="https://static.raymondcamden.com/images/cfjedi/code-ninja.png" style="float:left;padding-right:5px;padding-bottom:5px" /> I love easy to answer questions like this! The answer is "It Depends." Thanks, and good night.<more/>Ok, so maybe we can talk a <i>little</i> bit more about this. Here are some traits/qualities/skill/etc that come to my mind when thinking about what would be an "Expert". As always, I encourage folks to add to this list (or disagree!!) in the comments below.

<ul>

<li>While not necessarily an Expert quality, the number one thing I look for in a developer is what they do when they are stuck. This could be as simple as not knowing what the syntax is for a particular tag. I do <b>not</b> believe that an Expert has to memorize all arguments to every tag/function in the language. I <b>do</b> expect that they know where to find them. The answer is - obviously - the docs (or the built in help in your IDE), but an expert is going to have these references ready at all times. I'd expect an Expert to know that ColdFusion has Exchange functionality. I'd not expect them to rattle off the syntax off the top of their head.

<li>Conversely, while I expect everyone to know how to work with the basic docs, I'd go on to say an expert knows where to dig when something goes wrong. Given a typical bug report ("It's just not working!"), an Expert understands how ColdFusion applications "flow" and would be able to trace a process to find out where the issue is. This could be as simple as recognizing that the error occurs after a CFC is called and the result was something unexpected and not handled by a CFM. This could be as complex as a MVC framework that expected a particular model call to run before another and is misconfigured order-wise. 

<li>Going deeper, an Expert should have some understanding of the guts of the low level operations of ColdFusion. Notice I said "some understanding" - I know enough about JVM tuning to know what I don't know. But I know at least to <i>look</i> in that area if I see performance issues or out of memory errors. An Expert knows where to find the logs. How to use them to help diagnose issues. I'd also say that an Expert should at least have some familiarity with either <a href="http://www.fusion-reactor.com/fr/">FusionReactor</a>, <a href="http://www.seefusion.com/">SeeFusion</a>, or the built in ColdFusion Server Monitor. 

<li>An Expert has a basic idea of what code is going to perform poorly. I'm not talking about knowing that compareNoCase is better than eq (and I'm not saying it is - but I've seen folks make those types of comparisons), but being able to look at code and recognize inefficiencies in the design. For example, I've seen code that recreates large CFCs on every request. An Expert should recognize that the CFC could be created one time and stored in the application scope. 

</ul>

I think there's one common theme to everything listed above: Understanding how ColdFusion works and having a tool set ready for when things <i>don't</i> work. This is less "I can do everything" and more "I know where to turn to." Speaking for myself (and I know some people think I've got a big enough ego already, but let's just assume for today I'm an expert ;) I know who to turn to for issues. <a href="http://cfwhisperer.net/">Mike Brunt</a> for performance. <a href="http://www.petefreitag.com/">Pete</a> and <a href="http://www.12robots.com/">Jason</a> for security. <a href="http://www.iotashan.com/">Shannon Hicks</a> for Solr. Etc. If a client came to me for a problem in those areas and I couldn't answer them directly, I think it's valuable that I know who to turn to. I'd think that would be valuable in any employee. 

I'll make one last point. The question here specifically relates to what defines an Expert programmer. I tried to answer that. (Although I hope my readers can flesh it out a lot more.) I think it's an entirely <i>different</i> question to ask about hiring an Expert programmer for your organization. In other words, how to get that great person in your organization as opposed to just hiring the hot shot Ninja for a week of consulting. For that I'll leave you with an article written by Hal Helms: <a href="http://www.halhelms.com/blog/index.cfm?mode=entry&entry=FA956DCC-FF20-683A-FD4BBAFAE4E5D838">Hiring and Cultivating Great Developers</a>