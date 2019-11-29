---
layout: post
title: "ColdFusion 8: AJAX UI Vertical and Horizontal Boxes"
date: "2007-06-08T22:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/06/08/ColdFusion-8-AJAX-UI-Vertical-and-Horizontal-Boxes
guid: 2108
---

Tonight I'm blogging again about ColdFusion, AJAX, and the new layout controls in ColdFusion 8. Tonight's entry is once again  talking about cflayout and cflayoutarea. This entry will discuss the VBox and HBox type.
<!--more-->
Now I have to admit. This feature has me a bit puzzled. First the basic syntax:

<code>
&lt;cflayout type="hbox"&gt;
</code>

That creates a layout where all the things inside it will be positioned horizontally. The opposite of this is the VBox:

<code>
&lt;cflayout type="vbox"&gt;
</code>

Now - I don't know about you - but when I saw this, the first thing I thought of was Flex. Flex has a VBox and HBox, and they are useful for layout out your controls in a particular direction. So for example a set of buttons can be laid out in an HBox. 

So the first thing I tried was this:

<code>

&lt;cflayout type="hbox"&gt;
&lt;p&gt;
Hi
&lt;/p&gt;

&lt;p&gt;
Go
&lt;/p&gt;

&lt;/cflayout&gt;
</code>

I thought that maybe the JavaScript code would pick up all the block level elements between the tags and lay them out horizontally. Nope. You can see the result <a href="http://www.raymondcamden.com/demos/layout/layout11.cfm">here</a>.

Turns out that the only items you can position with this tag pair are cflayoutarea tags. For example:

<code>
&lt;cflayout type="hbox"&gt;

	&lt;cflayoutarea name="randomlayout"&gt;
	This is a basic layout.
	&lt;/cflayoutarea&gt;
	
	&lt;cflayoutarea name="anotherlayout" style="background-color: blue"&gt;
	The Blue Zone.
	&lt;/cflayoutarea&gt;

&lt;/cflayout&gt;
</code>

You can see the result of this <a href="http://www.coldfusionjedi.com/demos/layout/layout12.cfm">here</a>.

So I have to be honest and say... I don't quite get it. If you remember, the <a href="http://www.coldfusionjedi.com/index.cfm/2007/6/6/ColdFusion-8-AJAX-UI-Layouts">border style</a> layout lets us position items in all four compass points and in the middle. I guess if I wanted a bit more control, like perhaps two things on top, I could use a VBox to set it up. Outside of that - I'm a bit unsure of how useful this would be. (Which is ok - I don't expect <i>every</i> ColdFusion tag to be useful to me.) 

The docs provide a more fuller example, viewable <a href="http://www.coldfusionjedi.com/demos/layout/layout10.cfm">here</a>. Have folks done anything with this feature yet they care to share?