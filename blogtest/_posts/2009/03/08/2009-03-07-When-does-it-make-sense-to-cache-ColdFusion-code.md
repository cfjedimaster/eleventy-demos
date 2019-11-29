---
layout: post
title: "When does it make sense to cache ColdFusion code?"
date: "2009-03-08T11:03:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/03/08/When-does-it-make-sense-to-cache-ColdFusion-code
guid: 3269
---

This is in response to a question asked of me on Twitter (I'm using Twitter <i>a lot</i> recently, but I'd probably suggest folks use emails for questions as Twitter can be hard to catch up). The user asked potential bottlenecks with cfdocument and cfpdf. This brought up a general suggestion I thought I'd share on the blog. When does it make sense to cache ColdFusion code?
<!--more-->
There is no one answer to this. But I can tell you what serves as a red flag to me when coding. <b>Anything operation that involves binary data is probably a candidate for caching.</b> By binary data I mean anything non-text based, and PDFs certainly fall into that category. Images as well. So when I code and do something with cfdocument, I immediately ask myself if this is an operation I can cache so as to not run on every request. This does not mean I <b>must</b> cache these operations. Nor does it imply they are always slow. Again, I'm simply talking about the types of things that make me at least think of possible bottlenecks/slow processes/etc. 

As a practical example, when I was building the <a href="http://www.coldfusioncookbook.com">ColdFusion Cookbook</a>, I knew I was going to have a PDF export option. I also figured that the operation would a) be expensive (due to the size) and b) be an excellent candidate for caching since the content wouldn't be updated often. So I intentionally built it with a simple logical check. When you request the PDF, it will only be generated if it doesn't exist. On the flip side, when I edit content, the cached PDF will be deleted. 

Another practical example - when I <a href="http://www.raymondcamden.com/index.cfm/2009/2/17/jQuery-Thickbox-and-ColdFusion-Dynamic-Image-Resizing">blogged</a> about jQuery Thickbox and ColdFusion image resizing, I wrote my image manipulation code to only resize once. While ColdFusion probably could handle resizing on every request quickly enough, I thought it was best to save those thumbnails so they wouldn't be regenerated every request.

Remember - most best practices are suggestions, and this blog post is merely that - a suggestion. Happy Sunday all.