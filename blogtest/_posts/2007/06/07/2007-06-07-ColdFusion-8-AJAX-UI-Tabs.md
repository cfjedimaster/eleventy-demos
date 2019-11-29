---
layout: post
title: "ColdFusion 8: AJAX UI Tabs"
date: "2007-06-07T23:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/06/07/ColdFusion-8-AJAX-UI-Tabs
guid: 2104
---

Yesterday I blogged about <a href="http://www.raymondcamden.com/index.cfm/2007/6/6/ColdFusion-8-AJAX-UI-Layouts">layouts</a> in ColdFusion 8. This was accomplished with the handy cflayoutarea and cflayout tags. Today's post will use the same tabs but deal with tabs. (No, not bar tabs.) I'm a big fan of tabs for breaking up complex forms, so I'm happy to see this baked into the product. 

<br clear="left">
<!--more-->
Let's start with a simple example:

<code>
&lt;cflayout type="tab"&gt;

	&lt;cflayoutarea title="Tab 1"&gt;
	This is the first tab.
	&lt;/cflayoutarea&gt;
	
	&lt;cflayoutarea title="Tab 2"&gt;
	This is the second tab.
	&lt;/cflayoutarea&gt;
	
&lt;/cflayout&gt;
</code>

As you can see - this uses the same tags discussed in the previous post, except this time I used a type of tab. Insdie a tab based layout, all cflayoutarea groups will create a tab. The titles of the layoutareas will be the titles of the tabs. You can see a live demo of this <a href="http://www.coldfusionjedi.com/demos/layout/layout1.cfm">here</a>.

Building basic tab sets is trivial enough. ColdFusion provides many options for the tabs as well. As an example, you can supply a tab height to the layout control like so:

<code>
&lt;cflayout type="tab" tabheight="100"&gt;

	&lt;cflayoutarea title="Tab 1"&gt;
	&lt;p&gt;
	This is the first tab.
	&lt;/p&gt;
	&lt;p&gt;
	This is the first tab.
	&lt;/p&gt;
	&lt;p&gt;
	This is the first tab.
	&lt;/p&gt;
	&lt;p&gt;
	This is the first tab.
	&lt;/p&gt;
	
	&lt;/cflayoutarea&gt;
	
	&lt;cflayoutarea title="Tab 2"&gt;
	This is the second tab.
	&lt;/cflayoutarea&gt;
	
&lt;/cflayout&gt;
</code>

This will set the height for the tabs. The content in the tabs will automatically scroll if they need to. (If for some reason you don't want this, you can set the overflow attribute to hidden.) The code above can be seen <a href="http://www.coldfusionjedi.com/demos/layout/layout2.cfm">here</a>.

You can also set the tabs to display at the bottom:

<code>
&lt;cflayout type="tab" tabheight="100" tabPosition="bottom"&gt;
</code>

<a href="http://www.coldfusionjedi.com/demos/layout/layout3.cfm">Demo</a>

By default, the first tab is selected, but you can also specify a default tab in the code:

<code>
&lt;cflayoutarea title="Tab 2" selected="true"&gt;
</code>

<a href="http://www.coldfusionjedi.com/demos/layout/layout4.cfm">Demo</a>

You can even disable a tab if you want:

<code>
&lt;cflayoutarea title="Tab 2" disabled="true"&gt;
</code>

<a href="http://www.coldfusionjedi.com/demos/layout/layout5.cfm">Demo</a>

Along with all of these options, there is a nice JavaScript API to work with the tabs. You can select a tab. You can enable or disable tabs. You can even hide or show a tab (although this wasn't working for me so I assume it is currently buggy). For an example of all of this (including the buggy show/hide code), see this final <a href="http://www.coldfusionjedi.com/demos/layout/layout6.cfm">demo</a>. The code for this demo is:

<code>
&lt;cflayout type="tab" tabheight="100" name="mytabs"&gt;

	&lt;cflayoutarea title="Tab 1" name="t1"&gt;
	&lt;p&gt;
	This is the first tab.
	&lt;/p&gt;	
	
	&lt;p&gt;
	&lt;form&gt;
	&lt;select onChange="if(this.selectedIndex != 0) ColdFusion.Layout.selectTab('t' + this.options[this.selectedIndex].value,'mytabs')"&gt;
	&lt;option&gt;&lt;/option&gt;
	&lt;cfloop index="x" from="2" to="5"&gt;
	&lt;cfoutput&gt;
	&lt;option value="#x#"&gt;Select tab #x#&lt;/option&gt;
	&lt;/cfoutput&gt;
	&lt;/cfloop&gt;
	&lt;/select&gt;
	&lt;/p&gt;
	
	&lt;p&gt;
	&lt;a href="javaScript:ColdFusion.Layout.showTab('hiddentab','mytabs')"&gt;Show Hidden Tab&lt;/a&gt; /
	&lt;a href="javaScript:ColdFusion.Layout.hideTab('hiddentab','mytabs')"&gt;Hide Hidden Tab&lt;/a&gt;
	&lt;/p&gt;
	&lt;/cflayoutarea&gt;
	
	&lt;cfloop index="x" from="2" to="5"&gt;
		&lt;cflayoutarea title="Tab #x#" name="t#x#"&gt;
		&lt;cfoutput&gt;
		&lt;p&gt;
		This is tab number #x#.
		&lt;/p&gt;
		&lt;/cfoutput&gt;
		&lt;/cflayoutarea&gt;
	&lt;/cfloop&gt;
	
	&lt;cflayoutarea title="Dharma Tab" name="hiddentab" inithide="true"&gt;
	This is the hidden tab. Can't touch this.
	&lt;/cflayoutarea&gt;
		
&lt;/cflayout&gt;
</code>