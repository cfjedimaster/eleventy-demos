---
layout: post
title: "Ask a Jedi: Where to use Transfer?"
date: "2008-12-08T11:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/12/08/Ask-a-Jedi-Where-to-use-Transfer
guid: 3138
---

Justin asks:

<blockquote>
<p>
How do you best recommend setting up your application structure for a Transfer app? 
</p>
<p>
For example let's say I'm building a CMS for blog posts, so there are essentially pages to list, create,update & delete
</p>
<p>
Would you create a Blog.cfc and call transfer methods from that CFC or would you call the transfer methods directly from the .cfm pages
</p>
<p>
Is one way better than the other? Is one way more 'proper' than the other?
</p>
</blockquote>

I hate to get into 'better'/'proper' type things without being <i>real</i> clear up front that this is normally a matter of opinion. Being still new to Transfer, I'd love to hear what others think (whether they use Transfer or Reactor or some other ORM). Here is my opinion.
<!--more-->
The ORM you use creates a layer between you and the database. I no longer write a query statement to fetch my blog posts, but instead, ask Transfer to handle the relationship and return to me a set of Blog objects.

That being said, the fact is that you are still getting information. You are still working with a model layer. To me, that is a different concern than your front end. So the short answer is that yes, I do build a CFC that speaks to Transfer. When I did <a href="http://www.cflib.org">CFLib</a> in Transfer earlier this year, I created a few Services CFCs. The Controller layer speaks to the service and the service handles getting the data. 

In theory, I could switch from Transfer to Reactor or even Hibernate. As long as the model layer returned an object that supported the same API as Transfer, I'd be ok. From what I know of Hibernate, that would work for the simple properties (get/setName). I'm not so sure it would work well for related data. So for example, Transfer's automatic method injection for manytomany adds 'getXArray', where X is the name of the property. I'd bet Reactor does this differently. I'm not quite sure how I'd handle such a change, but I'd think it is safe to assume this doesn't happen very often. (So for example, I've probably had 2-3 clients over the past 15 years do complete database platform changes.)

As a last note, my <a href="http://www.raymondcamden.com/index.cfm/transfer">Transfer series</a> of posts did not make use of any type of MVC framework. I wanted to keep things as simple as possible and keep our focus on Transfer itself. So in that regards, the sample code isn't something I'd actually go to production with probably.