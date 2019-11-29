---
layout: post
title: "Traffic on ColdFusion Bloggers"
date: "2015-02-18T09:22:42+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2015/02/18/traffic-on-coldfusion-bloggers
guid: 5700
---

So a reader of mine pinged me today with this question:

<blockquote>
Hi Ray,
I hope that things are good with you!

Do you have any stats on the number of articles posted on CFBloggers & number of views over the years?

I've been doing CF for 15 years, for places like Cornell Med Ctr in NYC, The Mayo Clinic in Rochester, Mn & many other Fortune 500 companies.

Right now the State of (Top Secret) is looking to move to Grails or Rails from CF.

Is the CF gravy train coming to a halt and how quickly?
</blockquote>

I can share information about CFBloggers easily enough. To be fair, I don't think web traffic is a good metric for this site. Since it is an aggregator, I'd think most folks would use the RSS feed as a means to monitor the site. Also, everything is Tweeted so I'm thinking a lot of folks may skip hitting the page directly. Lastly, when I move the site from ColdFusion to Node I decided to stop proxying the hits. What I mean is - previously - when you clicked a link from CFB you would hit the site first, I'd log it, and then I'd forward you to the external blog entry. Now I just send you straight there. 

Ok, so with that in mind, here is a chart showing page views, per month, since the site went live in 2007.

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/02/cfb1.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/02/cfb1.png" alt="cfb1" width="800" height="186" class="alignnone size-full wp-image-5701" /></a>

As you can see, there is a great jump in 2009, one I wish I could explain. I thought perhaps it was adding Twitter support, but that was <a href="http://www.raymondcamden.com/2008/7/14/Follow-ColdFusion-Bloggers-on-Twitter">done</a> in July of 2008, a good year before the jump. 

As you can see though it has slowly declined over time. I'm not sure that's necessarily indicative of ColdFusion but blogging in general. I don't have research to back this up, but it seems like more and more people are abandoning blogs versus starting new ones. My own traffic has gone up and down over the years, but is mostly up though. If you're curious, here is the history of  my blog in page views.

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/02/rkc.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/02/rkc.png" alt="rkc" width="800" height="137" class="alignnone size-full wp-image-5702" /></a>

So yeah, let's hit that last statement, the one that isn't controversial at all.

<blockquote>
Is the CF gravy train coming to a halt and how quickly?
</blockquote>

Let me begin by saying that I am 100% completely the wrong person to try to answer this. I'm not wise about the industry. I know crap about business. I like to write code, write about code, and talk about code. What follows are my personal observations and nothing more.

More and more the server seems to be less important than it used to be. I've been learning about Node.js, and I think it is cool. (It has been a while since I used Groovy but it was cool too!) But I find myself doing much of the same stuff I did in ColdFusion. Listen for requests, hit a database, and output crap. ColdFusion was awesome because it made that <strong>incredibly</strong> easy. It still does! But the issue is that it isn't the <i>only</i> thing that makes it incredibly easy. Looking at the landscape of server technologies out there, I still think ColdFusion is the most approachable technology for non-computer professionals. (As an aside, some people may refer to these folks as "Five Taggers", but I just look at them as programmers in training, or, people who need to get shit done. They don't overuse pound signs or skip using frameworks because they are stupid - they're just human and may not have the time to learn their craft like the rest of us. I wish some folks in our community would have a bit more patience and understanding.) However, outside of this demographic I don't know how much "ease of use" ColdFusion offers over other solutions. Groovy is a good example of that. Again, I'm <i>years</i> rusty with it, but it made Java coding a heck of lot easier from what I remember. By the same token, if you already know JavaScript, then learning Node means you've already got a huge leg up on beginning. 

Keeping in mind my focus for the past few years has been on client-side and mobile, I'm not seeing a lot of <i>new</i> people using ColdFusion. The ColdFusion questions I get tend to be from folks I already know, or from folks who are maintaining existing code. I don't have access to the number of developers using ColdFusion (Adobe would have that, and obviously it would only cover their customers, not necessarily people using Railo or Lucee), but I'd assume that number is growing well. 

Growing the developer base has been discussed by a <strong>lot</strong> of people far smarter than I. I do not know what it will take to do it. I think <a href="http://lucee.org/">Lucee</a> is really exciting and could possibly attract folks, but again, this really isn't my area. 

I think ColdFusion will continue for a few years, I just don't think it will <i>grow</i> any more. I think we'll see a ColdFusion 12, but after that, I'm not sure. I'd expect Adobe to can it the minute it becomes unprofitable, which to be fair, is probably totally expected for a business. I do want to see ColdFusion 13 just because I think it would be a cool number to get too. ;)

Myself, and others in the ColdFusion community, have been saying for nearly ten years now, that if you only know ColdFusion, you are making a huge mistake. That applies to <i>any</i> skill. As a web developer, you <strong>need</strong> to have a good set of skills in your wheelhouse. You certainly don't need to know everything (yeah, good luck with even attempting that), but having multiple complementary skill sets is a must.