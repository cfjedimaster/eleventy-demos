---
layout: post
title: "Food for thought - 10 Beginner Tips from the PHP Masters"
date: "2010-11-08T12:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/11/08/Food-for-thought-10-Beginner-Tips-from-the-PHP-Masters
guid: 4007
---

I'm a regular reader of <a href="http://www.dzone.com">DZone</a>, a good tech aggregator. One of the items today caught my attention and I thought I'd share it with my readers: <a href="http://mashable.com/2010/10/21/php-tips-for-beginners/">10 Beginner Tips from PHP Masters</a> So why in the heck am I linking to a PHP article? Two reasons.
<!--more-->
In my <a href="http://www.raymondcamden.com/index.cfm/2010/10/29/Slides-from-my-MAX-presentation-Best-Practices-of-the-Modern-ColdFusion-Developer">MAX presentation</a> one of the things I recommended to developers was learning a new language. I boldly stated that learning PHP might be an option. (But I'd probably recommend Flex or AIR over PHP as it compliments ColdFusion a heck of a lot more.) With that in mind, whenever I see an article about PHP development that may be interesting, I try to make time to look at it. It isn't always helpful. (I can remember reading about PDF development in PHP and thanking Adobe for making things so simple with cfdocument.) But it certainly gives you perspective and that can useful.

The second reason I'm pointing this article out is that - for the most part - everything stated in the article could be useful for beginner ColdFusion developers as well. This isn't surprising really. Good development practices are universal. But it's the type of article that folks may dismiss out of hand due to being labelled a "PHP" article.

So with that in mind - I'm going to assume you took a few minutes to <a href="http://mashable.com/2010/10/21/php-tips-for-beginners/">read the article</a> and have now returned here. I've got some comments about each particular point.

<b>1)  Start with OOP</b>

This is a pretty bold statement and one I'm not sure I'd agree with. If you are a 100% rank noob to development that this could be a bit of a deal killer. I've seen people new to programming struggle with IF and loop statements so going straight into OOP might not be a good idea. I'd probably rephrase this into a more generic discussion about design patters in general. I wouldn't even call it that. Rather, I'd talk about how developers have suffered similar problems over the past few decades and because of this, a set of "attack plans" for these problems have arisen. I'd talk about OOP, MVC, etc, as ways of <i>possibly</i> handling such issues but keep it simple. The idea is - put the thought in the newbies mind that once they get past syntax issues and begin creating applications of a reasonable size that they <b>will</b> run into issues and most likely these issues are things that have happened many times before.

<b>2)  Google It</b>

Yeah - that can't be said enough. You can also Tweet it too. 

<b>3) Join Open Source Projects</b>

One of the biggest "sins" you could do is be a user of OS and never a contributor. Don't make the mistake of thinking the only way you can help is via writing code. Lots of OS projects need help with documentation and testing. And as Eamon says in the article, perusing OS projects is a great way to see how folks write code. 

<b>4) Just Do It</b>

Ditto. I made the same recommendation in my presentation. I'm a big fan of writing <a href="http://www.coldfusionjedi.com/index.cfm/2009/7/23/Generating-mazes-in-ColdFusion">stupid, useless code</a>. I find it a great way to "exercise" my development skills.

<b>5) Avoid Coding Burnout</b>

I'll narrow in on the "find a mentor" aspect of this tip. There are plenty of ColdFusion Masters out there who regularly share tips and offer a place to ask questions. There also a butt load of <a href="http://groups.adobe.com">user groups</a> you can join to mingle with other developers. If there isn't one in <a href="http://groups.adobe.com/index.cfm?event=page.maps">your area</a> than you can join the <a href="http://www.meetup.com/coldfusionmeetup/">ColdFusion Online Meetup</a>. 

<b>6) Try Drupal</b>

Yeah, ok, so ignore this one. It seems more like a repeat of 3 anyway. ;)

<b>7) Study Seasoned Coders</b>

So this is kind of a repeat of 3 as well, but with the wealth of <a href="http://www.riaforge.org/index.cfm?event=page.category&id=1">OS ColdFusion projects</a> out there you have a lot to learn from. I'll make two comments here though. First - while it's nice to study how others have done things, it is a bad idea to simply copy their code without understanding <i>why</i> they did things the way they did. This is something that <a href="http://corfield.org/blog/">Sean Corfield</a> has railed against for a while now and I agree completely. It's also a mistake I've made many times myself. Secondly - don't just focus on the masters. Look at other beginners as well. I'm probably in the minority when it comes to this. You have to be careful to avoid mistakes made by other beginners. But assuming you can't learn something from other beginners is a mistake. <b>You should always view other peoples' code with a critical eye</b>.

<b>8) Know Test-Driven Development, Encapsulation and Source Control</b>

Yeah, a big ditto here. Repeat after me - <b>there is no longer an excuse not to use source control</b>. Period.

<b>9) Read Up on Data Storage</b>

It is no surprise that for many applications, the DB layer is the weakest link. I've used the excuse "I suck at SQL" for years, and frankly, it's kind of dumb. Take the time to learn more then the basics of SQL and also learn how you can "minimize" your ignorance. By that I mean if you've already encapsulated your persistence layer than you've made it easier for people with stronger SQL skills to come in and fix your SQL.

<b>10)  Learn about Security</b>

This falls into the "I don't care how complex it is you need to be thinking about from Day 1" bucket. Try to understand what scopes are particularly vulnerable to attack. Understand SQL injection, or at least understand how to prevent it by slapping in some cfqueryparam tags. Take some time to at least think about authentication <i>and</i> authorization and what it means for your application. Also read the <a href="http://www.adobe.com/products/coldfusion/whitepapers/pdf/91025512_cf9_lockdownguide_wp_ue.pdf">ColdFusion Security Lockdown Guide</a> (PDF) and share it with your network administrator.