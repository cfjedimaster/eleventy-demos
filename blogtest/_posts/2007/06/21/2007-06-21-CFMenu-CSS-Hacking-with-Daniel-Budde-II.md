---
layout: post
title: "CFMenu CSS Hacking with Daniel Budde II"
date: "2007-06-21T12:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/06/21/CFMenu-CSS-Hacking-with-Daniel-Budde-II
guid: 2139
---

I don't normally do "Guest Posts", but Daniel and I were talking about some hacking with CFMENU and CSS. He came up with some interesting findings and as he doesn't have a blog (hey Daniel, I know a good <a href="http://www.blogcfc.com">one</a>!) I offered to post his findings here. Everything that follows is his work.
<!--more-->
I started on a project a couple days ago that is intended purely for ColdFusion 8, since I wanted to incorporate cfmenu into it.  Along the way with my tinkering of cfmenu, I wanted to know how to separate out the style information into a css file rather than using the 'style, menuStyle and childStyle' attributes of cfmenu and cfmenuitem.

I investigated the source of my page and learned that the scripts and css linking necessary to the cfmenu tags are automatically injected into the <head> tag of my page by ColdFusion.  I eventually figured out that I could override the style statements in the css pages if I used an ID selector with the name of my menu.

<code>
&lt;!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"&gt;
&lt;html xmlns="http://www.w3.org/1999/xhtml"&gt;
&lt;head&gt;
	&lt;meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" /&gt;
	&lt;title&gt;Untitled Document&lt;/title&gt;
	&lt;style type="text/css"&gt;
		#myMenu { 
			background-color: #FFCCFF;
		}
	&lt;/style&gt;
&lt;/head&gt;

&lt;body&gt;
&lt;cfmenu name="myMenu" type="horizontal"&gt;
	&lt;cfmenuitem name="acrobatInfo" href="http://www.adobe.com/acrobat" display="AcrobatI" /&gt;
&lt;/cfmenu&gt;
&lt;/body&gt;
&lt;/html&gt;
</code>

This could also be done from a linked css document, which is ultimately what I was looking to accomplish.  

My next goal was to remove the little arrows that indicated when there was a sub-menu.  I have done many menus in the past and many of them I never used a sub-menu indicator (you will see why I call it a sub-menu indicator in a moment).  Since I knew cfmenu used the Yahoo UI library to create the end result of the menu, I started searching through the YUI documentation for a solution.  

The <a href="http://developer.yahoo.com/yui/menu/">YUI Menu Documentation</a> describes 6 particular classes, that once you understand what they are, it makes setting up style rules for them much easier.

<ul>
<li>menu: a single vertical menu set
<li>menuitem: a single list item in a Menu
<li>menubar: a single horizontal menu set
<li>menubaritem: a single list item in a MenuBar
<li>hassubmenu: a menuitem or menubaritem that has a correspond submenu
<li>first-of-type: first of a menu, menuitem, menubar or menubaritem in a set
</ul>

I wound up finding in the YUI Menu Documentation the answer I was looking for.  A class named submenuindicator would allow me to control the arrows, but for some odd reason it refused to work.  I found a note stating that this would not work for older versions of the YUI and this did apply to me.  You can see what I found out about this in the ColdFusion 8 Forums, but suffice it to say I fixed the problem I was having.  I used the YUI Menu Documentation to come up with this example, which shows how to remove the sub-menu indicator from the top level horizontal menu, but leave it in the lower vertical menus.  I affect the 'visibility' property instead of the 'display', because I noticed in FireFox that my menu would break.

<code>
&lt;!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"&gt;
&lt;html xmlns="http://www.w3.org/1999/xhtml"&gt;
&lt;head&gt;
	&lt;meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" /&gt;
	&lt;title&gt;Untitled Document&lt;/title&gt;
	&lt;style type="text/css"&gt;
		body {
			font-family: Verdana, Arial, Helvetica, sans-serif;
		}
		
		/* Hide the Horizontal Bar sub-menu indicator, but not any of the Vertical */
		#myMenu li.hassubmenu.yuimenubaritem em.submenuindicator { 
			visibility: hidden;
			width: 0px;
			height: 0px;
			padding: 0px 0px 0px 0px;
			margin: 0px 0px 0px 0px;
		}
		
		#myMenu li.hassubmenu.yuimenubaritem li.hassubmenu.yuimenuitem em.submenuindicator { 
			visibility: inherit;
			width: 8px;
			height: 8px;
			margin: 0px -16px 0px 10px;
		}


		/* Change Horizontal Bar delimiter - shows use of 'first-of-type' */
		#myMenu li.yuimenubaritem {
			border-color: #FF0000;
		}
		
		#myMenu li.yuimenubaritem.first-of-type {
			border: none;
		}
	&lt;/style&gt;
&lt;/head&gt;


&lt;body&gt;

&lt;cfmenu name="myMenu" type="horizontal"&gt;

	&lt;cfmenuitem name="acrobatInfo" href="http://www.adobe.com/acrobat" display="AcrobatI" /&gt;

	&lt;!--- the ColdFusion menu item has a pull-down submenu. ---&gt;
	&lt;cfmenuitem 	name="cfInfo" 
					href="http://www.adobe.com/products/coldfusion"
					display="ColdFusion"&gt;
		
		&lt;cfmenuitem name="cfbuy" href="http://www.adobe.com/products/coldfusion/buy/" display="Buy" /&gt;

		&lt;cfmenuitem name="cfdocumentation" href="http://www.adobe.com/support/documentation/en/coldfusion/" display="Documentation"&gt;

			&lt;cfmenuitem name="cfmanuals" href="http://www.adobe.com/support/documentation/en/coldfusion/index.html##manuals" display="Product Manuals" /&gt;

			&lt;cfmenuitem name="cfrelnotes" href="http://www.adobe.com/support/documentation/en/coldfusion/releasenotes.html" display="Release Notes" /&gt;

		&lt;/cfmenuitem&gt;
		
		&lt;cfmenuitem name="cfsupport" href="http://www.adobe.com/support/coldfusion/" display="Support" /&gt;

	&lt;/cfmenuitem&gt;

	&lt;cfmenuitem name="flexInfo" href="http://www.adobe.com/flex" display="Flex" &gt;
		&lt;cfmenuitem name="fldocumentation" href="http://www.adobe.com/support/documentation/en/flex/" display="Documentation" /&gt;
	&lt;/cfmenuitem&gt;
&lt;/cfmenu&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>


I do not pretend to be the best at writing css statements and this is just an example, but there might be some better statements to accomplish what I have done.  I hope this is helpful to those of you that plan on using cfmenu.