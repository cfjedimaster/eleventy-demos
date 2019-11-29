---
layout: post
title: "Transfer deep relationship/order bug"
date: "2008-06-13T07:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/06/13/Transfer-deep-relationshiporder-bug
guid: 2880
---

Ok, maybe I'm a bit too geeky, but sometimes I love bugs that take hours of debugging and head scratching to solve. I discovered (and reported to Mark) a simple bug in Transfer.
<!--more-->
One of the cooler aspects of being able to design your objects in Transfer is the ability to set a onetomany relationship. You can say that you object is related to N other objects. Transfer then makes it easy to load these objects when you need them. You can even tell Transfer to return the objects as a struct or as an ordered array - and here is where the bug lies. Imagine the following:

You have a Grandparent object.<br />
Grandparents have a onetomany to Kid. You've told Transfer to return the Kids as an array sorted by Age descending.<br />
The Kid object has a onetomany to GrandKid. Since babies are cuter, you've told Transfer to return them sorted by Age ascending.

Ok, now here is where it gets weird, and where I ended up losing a few hours. If you get a Grandparent and then loop over the kids and for each kid, loop over the grandkids, the grandkids will <b>not</b> be sorted correctly. They will sort in the same direction that Kids were sorted. 

If you get a Kid however and then get the Grandkids, they will be sorted correctly.

At <a href="http://www.broadchoice.com">work</a>, our Admin was doing the Grandparent/Kid/GrandKid thing and our front end was doing the Kid/GrandKid thing. I couldn't understand why the sort kept changing, and since Transfer was caching, the order seemed to be based on whoever ran first.

There is a quick fix for this - and it is incredibly difficult. In my Kid definition, I simply said that the onetomany for Grandkids was lazy. That's it. Once I did that the sorting worked correctly and peace returned to the world at large. 

Two final notes: I'm psyched I finally broke Transfer - it means I'm properly learning it! I played with <a href="http://www.fusion-reactor.com/">Fusion Reactor</a> on the Mac and was impressed how well it worked there. I did run into an issue with the JDBC wrapper and MySQL. Read this <a href="http://groups.google.com/group/fusionreactor/browse_thread/thread/214430b00c23eb8c/86ded4670b759221?lnk=gst&q=mysql+wrapper#86ded4670b759221">thread</a> for a proper fix.