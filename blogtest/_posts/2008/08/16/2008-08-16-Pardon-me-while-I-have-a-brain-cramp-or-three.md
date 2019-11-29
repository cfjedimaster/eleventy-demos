---
layout: post
title: "Pardon me while I have a brain cramp (or three)"
date: "2008-08-16T15:08:00+06:00"
categories: [development]
tags: []
banner_image: 
permalink: /2008/08/16/Pardon-me-while-I-have-a-brain-cramp-or-three
guid: 2973
---

If you have followed me this week on <a href="http://twitter.com/cfjedimaster">twitter</a>, you saw me mention that I was working on quite a few new technologies this week. This has easily been a week of both pure joy and pain. Over the past 5 days I worked with:

<ul>
<li>Flex (pretty familiar with it, just out of practice)
<li>AIR (kind of familiar with it, not much practice yet)
<li>Groovy (never used it)
<li>JBoss (never used it)
<li>Hibernate (never used it)
<li>Spring (never used it)
<li><a href="http://testng.org/doc/">testng</a> (never used it) (and I assume this is the one item most of my readers won't recognize - it's a Java unit testing framework)
</ul>
<!--more-->
I'm still trying to get a grip on what I learned this week (and a heck of a lot of thanks need to go to <a href="http://www.firemoss.com">Joe</a> and <a href="http://www.corfield.org/blog">Sean</a> for their very patient help) and I will most likely post more technical entries later on over at the <a href="http://blog.broadchoice.com">Broadchoice blog</a>, but here are some <b>very</b> early impressions. 

<b>Flex</b><br/>
Ok, I already knew Flex, and loved it. What made it difficult this week was getting a grip on how my coworkers were using it. I've blogged before that I felt like I had a good grip on Flex in general, but needed to move into better architecture. Much like how I had to move into using a framework to grow as a developer. This was my first time using interfaces, delegates, and mock objects in Flex, and like most things, because I had an actual need for it (after Joe showed me why) it made a heck of a lot more sense than reading about them in an abstract sense. 

<b>Groovy</b><br/>
Groovy is what I'm most interested in right now. I find it interesting that they seem to have employed some of the same ideas that ColdFusion did. Typeless, practical, etc. I can see why it's getting so much press now, and I can see why some folks have expressed an interest in writing the model layer in Groovy while keeping the view in ColdFusion. I will say that I find the shortness of it a bit difficult at times, much like I found the abbreviated nature of jQuery a bit hard to grok at first as well. I know - it's crazy. It's almost like I want to type more and that should be wrong, but at least when learning though I find more descriptive code to be friendlier. But I've got about 1000 pages of Groovy docs to read (two books), so hopefully I'll know a bit more as time passes.

<b>JBoss</b><br/>
Um, boy, I really, really appreciate how easy ColdFusion makes development. The whole Eclipse setup, restart on any change, forcing Groovy to recompile at times, etc, is <b>very</b> annoying. I don't know. It seems like "Java Application Servers" in general have always been a pain to use - but I tend to use them in spurts so maybe its just that I'm never gotten a chance to get some good experience. JBoss is easily the part of the stack I like the least.

<b>Hibernate/Spring</b><br/>
So I knew that Transfer was based on Hibernate and ColdSpring was based on Spring and so far, both of these are really familiar to me. I had no problem working with Spring, and I've slowly begin to learn how Groovy/Hibernate play together. Not writing SQL in other languages is just as good as not writing SQL in ColdFusion. Imagine that.

<b>testng</b><br/>
I finally got the unit testing bug earlier this year and it is not only a good development practice, it can be kind of fun as well. I get a little jolt of excitement as I watch to see if all my tests will pass. I also learned a valuable lesson this Friday when I did not run the tests my coworkers wrote. I spent hours trying to get JBoss to respond right to something I was doing, and if I had run the unit test, I would have seen the issue right away. I'm being dragged (kicking and screaming I suppose) into TDD.