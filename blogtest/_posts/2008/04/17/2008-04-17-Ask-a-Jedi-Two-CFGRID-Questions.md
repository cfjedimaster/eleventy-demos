---
layout: post
title: "Ask a Jedi: Two CFGRID Questions"
date: "2008-04-17T12:04:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/04/17/Ask-a-Jedi-Two-CFGRID-Questions
guid: 2774
---

Joel asks:

<blockquote>
<p>
I have problems with using CFGRID and hope
you can help. Here are my issues:

1. When sorting the 2nd and 3rd columns
sort ok, the first causes an error stating an "Error in executing the Query".
</p>
</blockquote>

This is actually not a CFGRID issue, but an issue with your data provider, which is most likely a CFC. You need to debug why your CFC is throwing an error. This can be done multiple ways. The easiest is to use Firebug - not the request throwing the error, and open the request in a new tab. You will see more information about the error.

<blockquote>
<p>
2. And is there a way to prevent the columns from being moved?
</p>
</blockquote>

Well, I'm not sure why you would want to block that, but if you get access to underlying grid object (using ColdFusion.Grid.getGridObject(), you should be able to use the Grid api to disable this behavior. You may have to look up the Grid docs at Ext first though. (And yes, I'm being lazy, but I figure telling you where to look is a bit helpful. :)

Now let me assume my Stan "I think I've learned something" pose: This blog entry speaks to two topics I've covered a few times before, and I really think it touches on folks who are just now getting into Ajax stuff because of ColdFusion. It is critical you get that:

a) Learn to debug. Tools like Firebug are critical for figuring out what went wrong with an Ajax-based request. You must - I repeat, <b>must</b> get familiar with this as it will make your life much easier to handle.

b) Remember that the Ajax tools that ColdFusion 8 uses are all based on third party tools. You can (and should) go to those sites - read the docs - and get familiar with them if you want to go "beyond the basics" in terms of how you use them within ColdFusion.