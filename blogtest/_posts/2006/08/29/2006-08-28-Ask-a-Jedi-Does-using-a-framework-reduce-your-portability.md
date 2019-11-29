---
layout: post
title: "Ask a Jedi: Does using a framework reduce your portability?"
date: "2006-08-29T08:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/08/29/Ask-a-Jedi-Does-using-a-framework-reduce-your-portability
guid: 1501
---

Dave asks an important question for those using frameworks:

<blockquote>
You have shed light on frameworks, methodologies and how we can benefit from them.  I think it would be simply spiffing if you would address a similar topic on your blog: portability.  How portable is an application that employs mach-ii, modelglue, mvc... How might this affect redeployment,
distribution or selling such an application? 

This is sure to be a critical factor for many developers who are evaluating the new frameworks. It would be
dandy if you could start what I hope will become an ongoing discussion in the ColdFusion community.
</blockquote>

This is a pretty interesting question. I can only speak to Model-Glue as I have not used Mach-II or Fusebox. In general, the portability of these applications typically comes down to one question - can you use a mapping? I know that Model-Glue can be used without a mapping. The last time I did this I remember it being a bit of a pain, but doable. But in general, this would be the only issue you wound run into. Of course, the flip side of this is that you may deploy to a location that does allow mappings and is already using one for your framework. Then you either use the version they have or you force your code to use your version.
<!--more-->
In the best of worlds - you have a box with the frameworks set up so that any site can use them. The frameworks can be updated easily and all applications get the benefit of the new updates. Oh, and they are always 100% backwards compatible as well. Of course, no one I know actually lives in that world. 

So what should you do? If I were moving to an ISP, I'd setup a very simple application that uses the framework. For example, Model-Glue comes with a simple application. Get that application up on the ISP and ensure it runs correctly.  The last Model-Glue site I created used both a mapping for Model-Glue and ColdSpring, and the ISP had no issue making that for me, but it is something you want to know ahead of time obviously. 

One last practical example: The next contest entry that will be reviewed (in a few hours) used Fusebox 5. I didn't even know this till after I started using the application. I'd consider that a good example of portability.

What problems/concerns have others run into?