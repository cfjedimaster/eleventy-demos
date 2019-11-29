---
layout: post
title: "Small ColdFusion Admin Bug (DSN Form and Timeouts)"
date: "2010-02-25T11:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/02/25/Small-ColdFusion-Admin-Bug-DSN-Form-and-Timeouts
guid: 3733
---

I just filed a bug report for this (<a href="http://cfbugs.adobe.com/cfbugreport/flexbugui/cfbugtracker/main.html#bugId=82246">#82246</a>) and I didn't really think of it as that big a deal, but the more I thought about it, the more I thought I could see someone else running into it as well. I was using the ColdFusion Administrator and had it open to the list of DSNs. I needed to edit a DSN but when I had clicked, my session had expired. After logging in I was brought back to the place I had been trying to access. Let's say it was DSN cfisfasterthanphp. When the form loaded, the name had been changed to: 

cfisfasterthanphp?targeted=true

I can easily see missing that. Even more - the rest of the form was blank. Now - that <i>should</i> be pretty obvious, but again, I missed it. I almost hit submit as a quick way to return to the list and get back to the edit. If I had done so, I would have lost the rest of my DSN information. (Which I know I have documented somewhere... um... yeah....)

p.s. Handling state (where you were going, what was in your form, etc) is a <i>non</i> trivial matter when it comes to web sites. How about a quick blog entry on some techniques to handle cases like this?