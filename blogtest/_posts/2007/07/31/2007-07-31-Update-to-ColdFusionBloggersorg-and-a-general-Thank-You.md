---
layout: post
title: "Update to ColdFusionBloggers.org, and a general Thank You!"
date: "2007-07-31T18:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/07/31/Update-to-ColdFusionBloggersorg-and-a-general-Thank-You
guid: 2240
---

Let me start with the thank you first. In the last few weeks I've gotten a few <a href="http://www.amazon.com/gp/registry/wishlist/ref=yourlists_pop_1/002-1385569-4322431">wish list</a> purchases that were <b>very</b> much appreciated, but were from people who I could not find an email address for. So if you sent me something and didn't hear from me, please know I appreciate it. 

So now to the <a href="http://www.coldfusionbloggers.org">ColdFusionBloggers.org</a> update. One issue I've been trying to deal with lately is the date issue. CFFEED parses in RSS feed times into GMT, which in theory means that everyone's blog entries should be sorted correctly, but every now and then I'd see a blog entry that appeared to be 10-20 hours in the future when it really shouldn't be. I'm not quite sure this is the best solution, but I've added a new field to the entries table to store a 'created' timestamp. This is set when my processor adds the entry. I know sort by this field as well. (For entries I had already processed, I kept their original date for the created field, so it may take a day for this to shake out.) I think this is a good solution. The main problem with it will be when I get around to adding the admin and add a new feed. 

I'm definitely still thinking about this. No matter what - having a created field isn't bad - I just may change my mind later on sorting by it. Anyway - the code has been updated, and there is now an Install text file written by <a href="http://carehart.org/">Charlie Arehart</a>.