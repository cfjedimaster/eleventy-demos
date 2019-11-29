---
layout: post
title: "Ask a Jedi: Running code on Tab change with ColdFusion 8 Tabs"
date: "2008-12-01T17:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/12/01/Ask-a-Jedi-Running-code-on-Tab-change-with-ColdFusion-8-Tabs
guid: 3127
---

Rob Featherpants asks:

<blockquote>
<p>
I'm building ColdFusion sites again after a while away, and I wonder if you can help me with a little advice about cflayoutarea and tabs. I am building a tabbed interface as part of a form. Outside of the tabs is a textarea, with its height set as an inline style. I want to change this height when one of the tabs is selected and set a cookie to remember which tab was last active ... i.e. have onClick on the tab trigger a Javascript.  Can I do this?
</p>
</blockquote>

Yep, you can, although it does take a few lines of JavaScript.
<!--more-->
ColdFusion provides an API to get access to the underlying Ext based TabPanel object. You can get this object by running:

<code>
var mytabs = ColdFusion.Layout.getTabLayout('mytabs');
</code>

If you check the Ext docs for <a href="http://extjs.com/deploy/ext/docs/output/Ext.TabPanel.html">TabPanel</a>, you will see there is an 'on' API call that lets you easily add event listeners. I used this:

<code>
mytabs.on('tabchange', function(tabpanel,activetab) {% raw %}{ console.log('changed to a new tab '+activetab.getText()); }{% endraw %})
</code>

The tabchange event passes the tabpanel object and the active tab. I defined a function that simply uses Firebug to log the text of the selected tab. Here is a complete example. Please note I use AjaxOnLoad to run the code to register the event:

<code>
&lt;html&gt;

&lt;head&gt;
&lt;script&gt;
function setup() {
	var mytabs = ColdFusion.Layout.getTabLayout('mytabs');
	mytabs.on('tabchange', function(tabpanel,activetab) {% raw %}{ console.log('changed to a new tab '+activetab.getText()); }{% endraw %})
}
&lt;/script&gt;
&lt;/head&gt;

&lt;body&gt;

&lt;cflayout type="tab" name="mytabs"&gt;

	&lt;cflayoutarea title="Tab 1"&gt;
	tab 1
	&lt;/cflayoutarea&gt;
	
	&lt;cflayoutarea title="tab 2"&gt;
	tab 2
	&lt;/cflayoutarea&gt;
	
&lt;/cflayout&gt;

&lt;/body&gt;
&lt;/html&gt;

&lt;cfset ajaxOnLoad('setup')&gt;
</code>