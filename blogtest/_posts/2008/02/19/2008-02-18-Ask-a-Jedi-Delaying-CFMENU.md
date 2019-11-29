---
layout: post
title: "Ask a Jedi: Delaying CFMENU"
date: "2008-02-19T11:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/02/19/Ask-a-Jedi-Delaying-CFMENU
guid: 2658
---

Ronald asks:

<blockquote>
<p>
Ray, I am new to ColdFusion (and web programming) and really like the new CF8 menu tags.  I am using a horizonal menu on a site I am developing and on one page I have embedded a google calendar.  It works great except that it takes a couple of seconds to get the google calendar and during that time the menu gets a little crazy and show the menu items in horizonal fashion.  It only lasts a second or 2, but is enough to be an annoyance.  Do you have any suggestions?  Is there a way to turn off the menu until after the page content appears?
</p>
</blockquote>

Absolutely. Don't forget that you can embed items on a page via the CFDIV tag. Consider this simple example:

<code>
&lt;!--- Menu ---&gt;
&lt;cfdiv id="menuDiv" /&gt;

&lt;p&gt;
Normal content...
&lt;/p&gt;
</code>

When rendered, all you will see is "Normal content..." because we didn't actually load anything into menuDiv. ColdFusion makes it easy to load the content though via the ColdFusion.navigate function:

<code>
ColdFusion.navigate('menu.cfm','menuDiv');
</code>

Where menu.cfm is simply your menu. Here is what I used:

<code>
&lt;cfmenu name="mainMenu" selectedFontColor="white" selectedItemColor="red"&gt;
	&lt;cfmenuitem display="Alpha" href="foo" /&gt;
	&lt;cfmenuitem display="Geta" href="foo" /&gt;
	&lt;cfmenuitem display="Gamma" href="foo" /&gt;
&lt;/cfmenu&gt;
</code>

The only thing you have to remember is to use the CFAJAXIMPORT tag in your main page. This "warns" ColdFusion that it will be using a feature at some point that requires particular JavaScript files. Here is the complete sample file I used. 

<code>
&lt;cfajaximport tags="cfmenu"&gt;
&lt;html&gt;
&lt;head&gt;
&lt;script&gt;
function loadMenu() {
	ColdFusion.navigate('menu.cfm','menuDiv');
}
&lt;/script&gt;
&lt;/head&gt;

&lt;body&gt;

&lt;!--- Menu ---&gt;
&lt;cfdiv id="menuDiv" /&gt;

&lt;cfset sleep(2000)&gt;
&lt;p&gt;
Normal content...
&lt;/p&gt;

&lt;/body&gt;
&lt;/html&gt;

&lt;cfset ajaxOnLoad("loadMenu")&gt;
</code>

In my code, I used a sleep() call to represent the 'slow' Google Map. I told the page to run loadMenu when done. You would need to change this to find some other way to see if your Google Map is done. All loadMenu does then is load the menu into the div.