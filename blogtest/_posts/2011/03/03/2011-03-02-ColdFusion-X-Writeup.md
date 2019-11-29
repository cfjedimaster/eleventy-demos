---
layout: post
title: "ColdFusion X Writeup"
date: "2011-03-03T06:03:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/03/03/ColdFusion-X-Writeup
guid: 4145
---

Today at Scotch on the Rocks, Adam Lehman released some tidbits about the upcoming new release of ColdFusion, ColdFusion X. I tweeted as much as possible, but for those who don't use Twitter, and for those who want a general one page summary they can comment on, here is what he said and my opinion where applicable. Please note that anything announced today could easily change between now and the real release. Also remember these notes are based on my memory of what Adam said. Any mistakes are my fault.

1) Verity will be removed.<br/>

Not much to say about this. Adam suggested anyone using Verity now should begin looking into transitioning to Solr. Even if Verity wasn't being removed I think most people would recommend this anyway. Verity <b>was</b> a good product. I don't think it got the credit it deserved. But it's ancient now and Solr is much more capable. 

2) JRun is being removed in favor of Tomcat.<br/>

Not much to say about this one. I've used Tomcat before and it seems ok - but I've had issues with it and Apache. Hopefully that won't be a problem. Adam said - multiple times - that Adobe would be supporting Tomcat so that if you had issues with ColdFusion and Tomcat you won't be left out in the cold. I'm guessing this will be a slightly painful transition the <i>first</i> time and then after that - not much of a big deal. Unofficial reports are that ColdFusion runs much faster over Tomcat so any 'free' speed boost is a good thing.

3) Webservices updated to Axis 2.<br/>

Anyone who does much with web services in ColdFusion will know that it's use of Axis 1 leads to issues with many service providers. ColdFusion X will upgrade Axis to 2.latest while keeping support for Axis 1 as well. It was suggested that in ColdFusion 11 Axis 1 would go away completely. This update will help enable Exchange 2010 support.

4) Scheduled tasks updated.<br/>

Scheduled tasks will support chaining (run task B when A is done), conditions (don't run if CPU is 80% busy), priroty, and grouping (consider A, B, and C a group and do this to them as a whole). Also - finally - you will be able to make them application specific. 

5) Jobs<br/>

Basically you wrap a set of code in a cfjob tag and it runs asynchronously. It gets added to a queue you can introspect and modify. Basically a shorthand for cfthread but with more control over the queue stack. 

6) Java loader/proxies.<br/>

No more need for JavaLoader - you can now load jars/classes via a This scope attribute in the Application scope. On the Java side, your Java code can create an interface from a CFC. Both seem like really nice, useful updates.

7) Closures.<br/>

Ok, I'm on the fence on this one. I load closures in JavaScript. I honestly don't know how much I'd use them in a server side language. I'm sure I'll regret saying that though and I bet I'll wonder how I ever lived without them. Then again, it could end up being the next cfinterface. It was hinted that the implementation could be similar to what Mark <a href="http://blog.mxunit.org/2010/01/what-would-your-cfml-look-like-with.html">blogged</a> about a few months ago.

8) HTML5/jquery<br/>

Nothing concrete was said here, but it was stressed that HTML5 and jQuery would be supported in big ways. 

Finally, I was told, under NDA, that the release date would be