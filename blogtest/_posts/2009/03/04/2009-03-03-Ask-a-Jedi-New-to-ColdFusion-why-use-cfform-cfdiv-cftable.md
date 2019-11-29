---
layout: post
title: "Ask a Jedi: New to ColdFusion, why use cfform, cfdiv, cftable?"
date: "2009-03-04T10:03:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/03/04/Ask-a-Jedi-New-to-ColdFusion-why-use-cfform-cfdiv-cftable
guid: 3263
---

Caleb asks:

<blockquote>
<p>
First of all I'm only 6 months into ColdFusion so this may come off as a silly question. I see elements in the documentation like &lt;cfform&gt;, &lt;cfdiv&gt;, &lt;cftable&gt;, etc. Many already have an HTML equivalent. I was wondering if I should be using those in place of my typical &lt;form&gt;, &lt;div&gt;, or &lt;table&gt; tags and if so, what is the benefit?
</p>
</blockquote>

This is an excellent question. I haven't been new to ColdFusion for 10 years, but I can definitely see how someone new to the language would be wondering about exactly this issue. While other language elements like cfif, cfhttp, etc, have no relation to the actual rendered page, the tags you mentioned all do client-side items that can be done in "normal" HTML. 

The documentation does describe each of these tags. I'd encourage you to check them out in the reference to get the basic syntax rules. For some of these items you should also check the Developer's Guide for more in depth coverage. There is an entire section on cfform (chapter 30, Building Dynamic Forms with cfform Tags) and cfdiv is discussed in depth as well (chapter 34, Using Ajax UI Components and Features).

In all cases, each of these tags do things that you could do without ColdFusion. As an example, cfform makes it easier to do serverside and clientside validation. As I covered in my blog last week though you can do this yourself with jQuery. As another example, cfdiv makes it easy to create a region that can be loaded with content via Ajax. Again, jQuery (and other Ajax libraries) can do this as well. So why bother?

ColdFusion has always been about making web development easy. For a long time now this has been more than just serverside stuff. Both cftable and cfform are pretty old. ColdFusion 8 added cfdiv and many other Ajax features. If you don't know JavaScript, these tools can be a life safer. The benefit here then is something ColdFusion shines at - RAD. 

When ColdFusion 8 came out there was some debate about whether Adobe had wasted time building so much client-side Ajax functionality. My opinion is that this was the right move on Adobe's part. I think a lot of people forget that the those of who actually read blogs are probably twice as advanced as most users. 

So to (finally) answer you Caleb - should you use it? Sure. If you find that they aid your development then why not? If you feel more comfortable writing your own JavaScript (just to pick on cfform/cfdiv specifically) then use that instead. Ditto for any other feature.