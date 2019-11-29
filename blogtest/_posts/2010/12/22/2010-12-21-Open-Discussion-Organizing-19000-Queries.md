---
layout: post
title: "Open Discussion - Organizing 19000 Queries"
date: "2010-12-22T10:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/12/22/Open-Discussion-Organizing-19000-Queries
guid: 4063
---

This one is a doozy. I thought my readers would enjoy it. From a reader, Doug: (And note - I removed the angle brackets from his code because I'm too lazy to replace them out with escaped entities.)

<p>

<blockquote>
Our 12 year old source code pretty much hasn't been updated since CF6.  While trash and start over comes to mind, we do not have the liberty to do so.  Our plan is to make the code more maintainable by separating the display, business logic and database code into a pseudo framework with CFCs.  We started with database queries since cfquery tags are easy to find, and we also have the immediate goal (requirement) of making the code database independent (currently Oracle, and they use a lot of built in functions, and proprietary join syntax).  With ~34% of the queries duplicated among the CFMs (so far), we figured eliminating duplicates might be good start for the 19000+ queries in the whole project.  We ran into a snag when we began to stuff these functions (10000+ lines) into a single CFC as it crashed some earlier versions of Dreamweaver we have on our outdated hardware.  Our solution was to split our functions into separate CFCs, but alas, we had made a design blunder.  We were using a single object to call all of our functions:
<p>
cfset application.database = createObject("component", "coldfusn.cfcs.database").init(settings)<br/>
<br/>
cfset queryresults = application.database.function1(blah1, blah2)<br/>
<br/>
cfset queryresults = application.database.function45(blah1)<br/>
<br/>
cfset queryresults = application.database.function943(blah1, blah2, blah3)<br/>
<p>
One solution was to create a database object for each new CFC we used and change each function call to match:
<p>
cfset application.database = createObject("component", "coldfusn.cfcs.database").init(settings)<br/>
cfset application.database1 = createObject("component", "coldfusn.cfcs.database1").init(settings)<br/>
cfset application.database2 = createObject("component", "coldfusn.cfcs.database2").init(settings)<br/>
<br/>
cfset queryresults = application.database.function1(blah1, blah2)<br/>
<br/>
cfset queryresults = application.database1.function45(blah1)<br/>
<br/>
cfset queryresults = application.database2.function943(blah1, blah2, blah3)<br/>
<p>
But none of us liked the prospect of figuring out which functions were in which files (since they were pretty much split arbitrarily).  The solution we've been going with was to "chain" our CFCs together so any function can be called from a single object:
<p>
database.cfc<br/>
cfcomponent extends="database1"<br/>
<br/>
database1.cfc<br/>
cfcomponent extends="database2"<br/>
<br/>
database2.cfc<br/>
<br/>cfcomponent  <i>add extends if more files are needed</i>
<p>
Then our existing CFM code works with unlimited CFCs.  It's an abuse of class inheritance, but I didn't know of a better way to do it... until onMissingMethod().
<p>
So, the question is, would a solution involving onMissingMethod and isCustomFunction() to dynamically call the correct CFC be more or less elegant/efficient than inheritance chaining?  Know of a better idea involving none of the above?
</blockquote>
<p>
<!--more-->
First and foremost - and I say this every time - but it bears repeating. Do not forget that there are always multiple ways to solve problems like this. I'm not saying that because ColdFusion is so versatile - it is - but this applies to all problems of this nature. In my discussions with Doug I know he gets this, but I try to remind my readers of this every time. <b>There is no one way.</b> 
<p>

Ok - so I think the goal of moving into an MVC system makes sense. I'd probably look into an established framework over a peusdo one that I'm assuming you are rolling your own. Doug said he wasn't interested in a full rewrite, but there's going to be a lot of work involved in updating/creating these CFCs anyway. Something nice and simple like <a href="http://fw1.riaforge.org/">FW/1</a>. I always tend to suggest an established framework over a homegrown one as it makes it easier to bring in new developers. Regardless of what framework you use though let's move on to your ideas on handling your queries.

<p>

Normally I'd say that any IDE crashing is not an excuse to change your code. That's like letting your 4 year old dictate your eating habits. However, 10K+ lines in a file is probably a bad idea anyway. 

<p>

I think your biggest mistake though was to break them up numerically. Some in cfc 1, some in cfc 2, etc. Your workarounds may or may not be effective, but the root of your organization, in my opinion, is critically wrong. I'd look into dividing your queries into "areas of concerns." I'm not sure if there is a more appropriate OO way to describe that, but I tend to break up web sites into their AOCs to help me organize my CFCs. So if my site handled products, users, blog entries, and beer, I'd consider each of them a separate area of concern and would group my CFCs around them. At the simplest level, I could have a product CFC, a user CFC, a blog CFC, and a beer CFC. I'd imagine Doug's site has a way to group his CFCs as well. It may not be so evenly divided. Take Amazon for example. While they have users and reviews, products are obviously their biggest area. Based on that - you could further break up products into more specific product types. 

<p>

Thoughts? I promised Doug some feedback on this so don't let me down folks. ;)