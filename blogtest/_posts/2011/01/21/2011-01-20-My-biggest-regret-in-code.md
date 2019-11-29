---
layout: post
title: "My biggest regret (in code)"
date: "2011-01-21T09:01:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2011/01/21/My-biggest-regret-in-code
guid: 4089
---

I think it's perfectly natural (and expected!) to look back at the code you wrote last year (or last week even) and find things you would do better. If you can't do that then you are either not looking at your code with a critical eye or you aren't moving forward as a developer. That being said, I was thinking about something in the shower (sad, I know) and I thought I'd write about my biggest regret in terms of the code I've written. I've put out a lot of code as open source and I'm proud of that. If I look at the various "products" I've released I can see a definite change in my development skills over the years. But there is one mistake that I've made ever since the beginning and I <i>really</i> wish I could go back in time and change it. So what am I being so hard on myself about?
<!--more-->
Storing passwords in plain text. 

If you look at most of my open source applications, I do not use any form of encryption for my user tables. Some projects support it optionally, like Galleon, but others, like BlogCFC, do not support it at all.

So yeah - that's dumb. It's not like ColdFusion doesn't have an easy way to handle it. For a <i>long</i> time there has been support for various types of encryption as well as hashing. I'll be honest and say it was just pure laziness. (I take some comfort in knowing I'm not the only lazy coder out there.)

What am I going to do about it? Well speaking specifically of BlogCFC, <a href="http://rob.brooks-bilson.com/index.cfm/blogs/rob/index.cfm">Rob Brooks-Bilson</a> is working on updating the code base to support encryption for BlogCFC users. Nice. I should have done it back in V1, but better later than never. As for my other projects, I'm thinking that as I perform minor updates I'll use it as an excuse to update my authentication as well.

So open question. What do you regret? 

<img src="https://static.raymondcamden.com/images/regret_trooper.jpg" />