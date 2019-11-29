---
layout: post
title: "Ask a Jedi: Using links to select tabs in jQuery UI Tabs"
date: "2010-06-11T10:06:00+06:00"
categories: [javascript,jquery]
tags: []
banner_image: 
permalink: /2010/06/11/Ask-a-Jedi-Using-links-to-select-tabs-in-jQuery-UI-Tabs
guid: 3845
---

Frances asked:
<p>
<blockquote>
Ray, thank you so much for this article:
<a href="http://www.insideria.com/2009/03/playing-with-jquery-tabs.html
">http://www.insideria.com/2009/03/playing-with-jquery-tabs.html</a>. I had spent many hours over several days trying to find a way to link
directly to a specific tab from an external URL. I found lots of references
to doing this when loading the tabs with Ajax, but it appeared that there
was no way to do it when not using Ajax, which was simply mind-boggling. You
just solved it for me. Add me to the list of people who think this should be
included in the jquery.ui API.
<br/><br/>
Now, just one more thing: How can I do the same thing from a text link
within the same page? I naming the tab anchors and then referencing them
with a hashmark (e.g., a href="#4"), but that puts the tabs smack at the top
of the browser window, cutting off the content above the tabs (which makes
since, since named anchors are supposed to put the target link at the top of
the window).
<br/><br/>
So how do I make a text link that will activate a specific tab within the
same page without having to use a full URL that would reload the page?
</blockquote>
<!--more-->
<p>
This is rather simple once you take a look at the <b>Methods</b> docs for <a href="http://jqueryui.com/demos/tabs/">jQuery Tabs</a>. One of the methods you can call is select, which will pick one of the tabs. Here is a very simple example showing this.
<p>

<code>
&lt;html&gt;

&lt;head&gt;
&lt;script src="http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js"&gt;&lt;/script&gt;
&lt;script src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.7.2/jquery-ui.min.js"&gt;&lt;/script&gt;
&lt;link href="http://ajax.googleapis.com/ajax/libs/jqueryui/1.7.2/themes/ui-lightness/jquery-ui.css" type="text/css" rel="Stylesheet" /&gt;
&lt;script type="text/javascript"&gt;
$(document).ready(function() {
	$('#tabs').tabs()
})
&lt;/script&gt;
&lt;/head&gt;

&lt;body&gt;

&lt;div id="tabs"&gt;
&lt;ul&gt;
  &lt;li&gt;&lt;a href="#tab-1"&gt;Tab 1&lt;/a&gt;&lt;/li&gt;
  &lt;li&gt;&lt;a href="#tab-2"&gt;Tab 2&lt;/a&gt;&lt;/li&gt;
  &lt;li&gt;&lt;a href="#tab-3"&gt;Tab 3&lt;/a&gt;&lt;/li&gt;
&lt;/ul&gt;

&lt;div id="tab-1"&gt; 
  &lt;p&gt;Tab 1&lt;/p&gt;
&lt;/div&gt;
&lt;div id="tab-2"&gt;
Tab 2
&lt;/div&gt;
&lt;div id="tab-3"&gt;
Tab 3
&lt;/div&gt;

&lt;/div&gt;

&lt;p&gt;
Sample text with inline links to tags. So you can 
click &lt;a href="" onclick="$('#tabs').tabs('select',1);return false;"&gt;here&lt;/a&gt; for tab 2 
and &lt;a href="" onclick="$('#tabs').tabs('select',2);return false;"&gt;here&lt;/a&gt; for tab 3.
&lt;/p&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>

<p>

Moving from top to bottom, I begin by simply loading up the relevant JavaScript and CSS files for my jQuery UI tabs. 

<p>

Next I set up my tabs. This is done with $('#tabs').tabs(). jQuery finds the tabs block in my HTML, uses its mojo, and transforms it into beautiful tabs. So far so good. Now look at the last paragraph, specifically the two links. Here is one of them:

<p>

<code>
&lt;a href="" onclick="$('#tabs').tabs('select',1);return false;"&gt;
</code>

<p>

What the link does is simply make use of the API to call the select method. Tabs are 0 based so this will select the second tab. Nice and simple. Click the big ole Demo button below to see it in action.

<p>

As a side note - I try to avoid onclicks now and use jQuery event handlers instead. However - and I'm certainly willing to be admit I'm wrong here - it just felt cleaner to have it directly on the link instead.

<p>

<a href="http://www.raymondcamden.com/demos/june112010/test5.cfm"><img src="https://static.raymondcamden.com/images/cfjedi/icon_128.png" title="Demo, Baby" border="0"></a>