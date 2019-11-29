---
layout: post
title: "ColdFusion 8: A \"Tip\" For You..."
date: "2007-06-04T01:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/06/04/ColdFusion-8-A-Tip-For-You
guid: 2086
---

Ok, the title is a dumb one, but one of the nice new tags in ColdFusion 8 is the cftooltip tag. As you can imagine, it creates a DHTML based tooltip. It is rather easy to use as well:
<!--more-->
<code>
&lt;cftooltip tooltip="The following table displays sales for products over the past year."&gt;
&lt;table&gt;
&lt;tr&gt;
	&lt;th&gt;Product&lt;/th&gt;
	&lt;th&gt;Sales&lt;/th&gt;
&lt;/tr&gt;
&lt;tr&gt;
	&lt;td&gt;Apples&lt;/td&gt;
	&lt;td&gt;3,313&lt;/td&gt;
&lt;/tr&gt;
&lt;tr&gt;
	&lt;td&gt;Bananas&lt;/td&gt;
	&lt;td&gt;5,491&lt;/td&gt;
&lt;/tr&gt;
&lt;tr&gt;
	&lt;td&gt;Cherries&lt;/td&gt;
	&lt;td&gt;1,232&lt;/td&gt;
&lt;/tr&gt;
&lt;/table&gt;
&lt;/cftooltip&gt;
</code>

Whenever someone hovers their mouse over the table, the text explaining the data will pop up. The tag has a few optional arguments for how quickly the tool tip should appear or go away, but the other main attribute you can use is sourcefortooltip. Here is a simple example:

<code>
&lt;cfloop index="x" from="1" to="5"&gt;
	&lt;cftooltip sourcefortooltip="test3.cfm?id=#x#"&gt;
	&lt;cfoutput&gt;
	&lt;p&gt;
	This is the #x# paragraph. 
	&lt;/p&gt;
	&lt;/cfoutput&gt;
	&lt;/cftooltip&gt;
&lt;/cfloop&gt;
</code>

Now when the user mouses over the paragraph, ColdFusion will do an AJAX request to test3.cfm?id=X, where X is a value from 1 to 5. You can return any HTML you would like, including images. Here is the simple file I used:

<code>
&lt;cfparam name="url.id" default=""&gt;
&lt;cfoutput&gt;
&lt;b&gt;Tip #url.id#&lt;/b&gt;: This is an example of a dynamic tooltip.
#timeFormat(now(),"H:mm:ss")#
&lt;/cfoutput&gt;
</code>

Why the time? I was testing. ColdFusion caches the result of the tooltip text, so even if you mouse away and return back over the item, the seconds value is not going to change. This is probably a good thing performance wise, but something you don't want to forget. 

Personally, I can see this being very useful for forms. I can imagine using this quite a bit for buttons, links, etc, to make it clear what each item does. Since I have the ability to slow down the appearance of the tooltip, I can set this to a good value such as not to bug people who actually know what they are doing.