---
layout: post
title: "Ask a Jedi: How to approach moving logic into objects"
date: "2010-12-09T09:12:00+06:00"
categories: [coldfusion,development]
tags: []
banner_image: 
permalink: /2010/12/09/Ask-a-Jedi-How-to-approach-moving-logic-into-objects
guid: 4048
---

Here is a great question that came in from Tim G. 

<blockquote>
I have a OOP-ish question for you.

I am looking into the many frameworks to build a new application. well its to rebuild an older out dated app.

I want to use coding best practices and framework conventions to build the application.

My problem is my business logic is so complex i am having a hard time trying to encapsulate it with objects.

Do you know of a way I can accomplish encapsulation of business logic that is very complex into Objects? Or do you know of examples or tutorials that can give me some ideas on how to accomplish this the right way?

For example:
when user A logs into the system we need to build out all of their vacation data. to do this we need to find the Companies vacation policy(there are 10), load that up, look at the users vacation profile(there are 5) they are in, pull in any dates taken and calculate their balance(depends on what country / state they are in). All of this is in a custom tag now and creates structs of all the data. But its far from Object Oriented and I know its not best practice coding.
</blockquote>
<!--more-->
Good question Tim, and you hit upon a few different points here. I am certainly not going to pretend I have the best answer here - but I know my readers are going to chime in. I want to comment on a few different things here.

<blockquote>
"I want to use coding best practices and framework conventions to build the application."
</blockquote>

That's good - but I want to be sure that you aren't just doing this because you think you have to - or that it matches up with the latest buzzword bingo game. I'm definitely 100% behind using frameworks behind applications, but that is because <b>it solves a problem</b>. If you aren't comfortable understanding what your problems are and how a framework can help you, then <b>stop</b> and take some time to figure that out. Sean Corfield has a <a href="http://www.corfield.org/blog/post.cfm/are-objects-bad">great blog entry</a> from last night that I think folks should read. While you should read the entire post, I'm going to call out one very specific, very critical passage: 

<blockquote>
"I try to be pragmatic about what works and I don't believe in One True Way(tm)"
</blockquote>

Amen. I cannot tell you how many times I've wasted time trying to find the "Right Way" when just getting something done would have been better. I'm certainly not advocating against planning, architecture, etc, but at a certain point you need to be practical and just <b>write some darn code</b>. Anyway - carrying on...

<blockquote>
"My problem is my business logic is so complex i am having a hard time trying to encapsulate it with objects."
</blockquote>

Then don't. You can't always mash some process into a nice and tidy "Object" box. That's not the way the real world works. 

<blockquote>
"For example: when user A logs into the system we need to build out all of their vacation data. to do this we need to find the Companies vacation policy(there are 10), load that up, look at the users vacation profile(there are 5) they are in, pull in any dates taken and calculate their balance(depends on what country / state they are in). All of this is in a custom tag now and creates structs of all the data. But its far from Object Oriented and I know its not best practice coding."
</blockquote>

So - you have a custom tag. Why is that bad? CFCs certainly have more features, but do not automatically assume the logic in a custom tag is automatically worse than a CFC. Typically - yeah - it is. CFCs allow for better organization of your logic into packages. You can take various related processes and store them into a CFC that exposes a simpler API to the world. Custom tags don't really allow for that nicely. About the only thing I use custom tags for now is layout. But my point is - you've already done some code encapsulation. That's great and shouldn't dismiss it out right. 

Now if we want to practically attack your example, there are a few things that stick out to me. One - you mention the companies have vacation policies. Ok, so I would imagine a Company CFC that would abstract out the process of getting the vacation policies, perhaps something like: policies = mycompany.getVacationPolicies. You then mention user's have a vacation profile. So again, I'd imagine a User CFC having a method that returns their profile. What's behind that method could be ORM, could be SQL, could be LDAP, whatever. 

The actual method names I used above aren't really the point though. What I see is that you have some complex process. That process involves a set of steps. When I have to tackle something like that, I begin to break into into the various component parts and slowly build up. Step one was getting company vacation policies. So I work on that in a vacuum pretty much. Ensure it is nicely encapsulated. I then move on from there. There is a lot of back and forth as time goes on of course - but the process of separating the concerns into a set of APIs is generally how I tackle this.

I feel like the text above is wholly inadequate, but this is the type of thing that is hard to explain over a blog post. Can anyone else chime in with some thoughts?