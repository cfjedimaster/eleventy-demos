---
layout: post
title: "Ask a Jedi: Is it worthwhile to learn everything about ColdFusion immediately?"
date: "2007-02-08T09:02:00+06:00"
categories: [coldfusion,development]
tags: []
banner_image: 
permalink: /2007/02/08/Ask-a-Jedi-Is-it-worthwhile-to-learn-everything-about-ColdFusion-immediately
guid: 1828
---

A few days ago an interesting <a href="http://ray.camdenfamily.com/forums/messages.cfm?threadid=7C79D8D0-F53C-E7BB-AF97A5AF4B929F86">post</a> was made to my forums. I asked the author if he minded me moving the conversation over here and he was cool with it. While his question involves ColdFusion, I really do think it could apply to any other language. First let's start with his question:

<blockquote>
I was wondering if there are distinct advantages for using advanced coldfusion as opposed to the more basic stuff. For example, the stuff one can learn in the first 2/3rds of Ben Forte's book "Coldfusion Construction Kit" is adequate for getting a database-driven site up and running, etc...but are there serious short-comings, or safety issues, or performance issues encountered if one doesn't use the advanced coding techniques found in later chapters and in the 'advanced cf' book? I'm wondering because I don't see a use in spending more time learning the more complex advanced (like frameworks, for ex) unless I can see clear-cut reasons why its better, safer, faster, etc.
</blockquote>
<!--more-->
He then followed up with this clarification:

<blockquote>
And also - to clarify - I'm not against learning new advanced code skills, but I am sort of pressed for time on this project and wondering if I'd be shooting myself in the foot if I don't keep forging ahead into the advanced code, etc. (I've found some of the framework source (fuseaction, modelglue) to be rather difficult).
</blockquote>

So I think his question could be summarized like so: Given a time constraint, does it make sense to cover everything you can related to ColdFusion (or a language) or is it just enough to learn the basics? Using driving as an example - is it good enough to know how to use the car or should you force yourself to make the time to take a safe driving class?

I definitely don't think I have the best answer here. In an ideal world, you would make the time. I do think it makes sense to practice with the basics to get a good hand on it before moving on to more advanced topics. At the same time though I would at least make the time to review security, performance, and frameworks. In other words - learn the core language well, and at least <i>know</i> about the security and performance concerns. You may not quite understand them, but you should be aware of them.

As a practical example - consider the basic query. You can learn how to do database stuff with ColdFusion in about 30 minutes. (Let's see you do that in ASP.Net. ;) Does it make sense to also learn about cfqueryparam? Absolutely. While it may be a bit much for a newbie, it is one of those things where if you don't do it in the beginning, you will regret it later.

Out of all the things you mentioned: security, performance, and frameworks, security is the one thing I would not skip under any circumstances. 

As a last note (and this isn't the last note as I know this entry will get a lot of responses), frameworks are kind of funny. I can see how, right now, you don't think you need them. Trust me - that will change soon. I think most folks happily develop simple little web sites and never think twice about frameworks. But as soon as their sites begin to get even a little bit complex, they start to see how frameworks can help them with the problems that start rising.