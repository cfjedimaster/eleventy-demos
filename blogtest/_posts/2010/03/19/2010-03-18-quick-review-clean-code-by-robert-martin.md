---
layout: post
title: "Quick Review: Clean Code by Robert Martin"
date: "2010-03-19T10:03:00+06:00"
categories: [books,coldfusion]
tags: []
banner_image: 
permalink: /2010/03/19/quick-review-clean-code-by-robert-martin
guid: 3755
---

<iframe src="http://rcm-na.amazon-adsystem.com/e/cm?lt1=_top&bc1=000000&IS2=1&nou=1&bg1=FFFFFF&fc1=000000&lc1=0000FF&t=raymondcamden-20&o=1&p=8&l=as1&m=amazon&f=ifr&asins=0132350882" style="width:120px;height:240px;float:left;margin-right:5px;margin-bottom:5px" scrolling="no" marginwidth="0" marginheight="0" frameborder="0"></iframe>

A few months ago, <a href="http://www.briankotek.com/blog/">Brian Kotek</a> recommended I pick up a book called "Clean Code" by Robert C. Martin. I picked it up, put it in my "To Read" queue, and promptly forgot about it for a while. Then one day I had a long plane ride coming up and as I was wrapping up another book, I threw in "Clean Code" so I'd have something to start reading. (Am I the only who absolutely fears being on a plane with nothing to do?) 

Within five minutes of cracking open the book, I had dug into my backpack, brought out my pen, and was underlining madly. I had not known really want to expect, but it turns out that this is easily (for me anyway) one of the most important programming books I've read in my life.

I absolutely will not do it justice, but at a high level, the book concerns itself with the quality of the code you produce. This covers <i>everything</i> from variable naming, class and method structure, commenting, etc. Martin goes into a level of detail I frankly did not know was even possible. We all "know", for example, what makes up good variable naming rules, but Martin goes into the theory at a level I had not thought of before. 

What makes this incredible is that after numerous chapters talking about best practices and what you should and should not do, Martin follows it up with an extremely in depth code refactoring. You see the original code and you get to follow the author's thought process as he makes changes. I'll point out that the code used in book is Java, but everything discussed is more than applicable to other languages, especially ColdFusion.

If there is one section I especially liked it was the one discussing method structure, including naming, their impact on the rest of your code, and even the number of arguments the method accepts. It really made me think that I need to reconsider how I use CFCs.

The book is not without controversy of course. Martin says right out (and more than once), that he expects you to disagree with him. I found his comments on, well, commenting, to be a bit extreme at times. I absolutely loved that section though (as a side note, it is the same reason I like listening to Rush sometimes - it's more fun to listen to someone you don't agree with!) This quote probably exemplifies Martin's core feeling on quotes: <b>"Comments are always failures."</b> Pretty strong, right? While he is certainly not against all code, I do think he isn't considering the situation I know others have seen - years old code that may have made perfect sense to a developer in 2002, but makes no sense 8 years later.

I <b>strongly</b> urge my readers to pick this up. It is not something you will likely "get" in a first reading. I'm planning on rereading it again in a few months. I'm also considering forming a presentation based on the material. But all in all I can think of no other book I'd recommend to a developer looking to raise the level of their craft.

p.s. Let me add that - in the same vein - Dan Wilson's CF Online Meetup presentation covered some of the same concepts yesterday. You can watch the streaming recording of it <a href="http://experts.na3.acrobat.com/p70807903/">here</a>.