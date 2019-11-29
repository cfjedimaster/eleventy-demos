---
layout: post
title: "ColdFusion 8: AJAX UI Menus"
date: "2007-06-18T18:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/06/18/ColdFusion-8-AJAX-UI-Menus
guid: 2129
---

Continuing on with my tour of the new AJAX UI controls in ColdFusion 8, today I want to talk about menus. It seems like I've been building DHTML menus since before the dinosaurs walked the Earth, so it's nice to see this made a <i>heck</i> of a lot easier in ColdFusion 8. Let's get into it.

<more />

At the simplest level, menus are made with the cfmenu and cfmenuitem tags:

<code>
&lt;cfmenu bgColor="##c0c0c0"&gt;
	&lt;cfmenuitem display="Item One" href="http://www.adobe.com" /&gt;
	&lt;cfmenuitem display="Item Two" href="http://www.cnn.com" /&gt;
&lt;/cfmenu&gt;
</code>
		
This example creates a menu with two items. One that will show "Item One", and link to Adobe, and another one labeled "Item Two" that will link to CNN. I supplied an optional background color. By default the menu will be a normal horizontal menu. This creates the menu you see <a href="http://www.raymondcamden.com/demos/layout/menu1.cfm">here</a>. (I put some text under the menu so you could see it in context.)

How do you create sub menus? Just nest the menu items!

<code>
&lt;cfmenu bgColor="##c0c0c0"&gt;
	&lt;cfmenuitem display="Adobe" href="http://www.adobe.com" /&gt;
	&lt;cfmenuitem display="Products"&gt;
		&lt;cfmenuitem display="ColdFusion" href="http://www.adobe.com/go/coldfusion" /&gt;
		&lt;cfmenuitem display="Flash" href="http://www.adobe.com/go/flash" /&gt;
	&lt;/cfmenuitem&gt;
&lt;/cfmenu&gt;
</code>

This example creates a submenu under a menu named Products. You can see this in action <a href="http://www.coldfusionjedi.com/demos/layout/menu2.cfm">here</a>.

How about a vertical menu? Just add a type to the cfmenu tag:

<code>
&lt;cfmenu bgColor="##c0c0c0" selectedItemColor="##ff0000" type="vertical" width="200"&gt;
</code>

I added a few things here. First the type="vertical". Then notice I also specified a highlight color for the menu. I think the red goes great with the gray. Next - since this isn't a menu going across the page, I supplied a width. I put this into a table and you can see the result <a href="http://www.coldfusionjedi.com/demos/layout/menu3.cfm">here</a>.

Another option - you can supply images to go along with your menu items. These should (obviously) be smaller sized images. I'm using a <a href="http://www.famfamfam.com/lab/icons/silk/">Silk Icon</a> in the next example:

<code>
&lt;cfmenuitem display="ColdFusion" href="http://www.adobe.com/go/coldfusion" image="page_white_coldfusion.png" /&gt;
</code>

Another modification you can make is to add dividers. This would be useful for breaking up a long menu into sections:

<code>
&lt;cfmenuitem divider="true" /&gt;
</code>

Demo <a href="http://www.coldfusionjedi.com/demos/layout/menu4.cfm">here</a>.

So thats a quick look at cfmenu. I didn't cover everything (that's what docs are for!), but hopefully this will give you a taste of the control.