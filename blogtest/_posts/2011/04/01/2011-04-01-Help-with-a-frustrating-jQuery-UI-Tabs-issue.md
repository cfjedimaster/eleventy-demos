---
layout: post
title: "Help with a frustrating jQuery UI Tabs issue"
date: "2011-04-01T14:04:00+06:00"
categories: [jquery]
tags: []
banner_image: 
permalink: /2011/04/01/Help-with-a-frustrating-jQuery-UI-Tabs-issue
guid: 4180
---

Earlier today John Ramon asked me a simple jQuery UI question: How do I keep links in tabs to load in the tab itself? I smugly answered, "That's easy" and directed him to the <a href="http://jqueryui.com/demos/tabs/#...open_links_in_the_current_tab_instead_of_leaving_the_page">answer</a> which is on the jQuery UI Tabs page. It's a common request for obvious reasons. I assumed that was the end of it until John threw something crazy into the works. A <i>second</i> link.
<!--more-->
<p>

So imagine that you have a page with tabs. Here is a simple example. Note it already includes the "load links in tab in the tab" fix:

<p>

<code>

&lt;script src="jquery-ui-1.8.11.custom/js/jquery-1.5.1.min.js"&gt;&lt;/script&gt;
&lt;script src="jquery-ui-1.8.11.custom/js/jquery-ui-1.8.11.custom.min.js"&gt;&lt;/script&gt;
&lt;link rel="stylesheet" href="jquery-ui-1.8.11.custom/css/ui-lightness/jquery-ui-1.8.11.custom.css" type="text/css" /&gt;


&lt;script&gt;
$(function() {
	$( "#tabs" ).tabs({

		 load: function(event, ui) {
				console.log("load event ran");
		        $('a', ui.panel).click(function() {
		            $(ui.panel).load(this.href);
		            return false;
		        });
		    }

	});
		
});
&lt;/script&gt;

&lt;div id="tabs"&gt;
	&lt;ul&gt;
		&lt;li&gt;&lt;a href="#tabs-1"&gt;Nunc tincidunt&lt;/a&gt;&lt;/li&gt;
		&lt;li&gt;&lt;a href="test2.cfm"&gt;Aenean lacinia&lt;/a&gt;&lt;/li&gt;
	&lt;/ul&gt;
	&lt;div id="tabs-1"&gt;
		&lt;p&gt;Proin elit arcu, rutrum commodo, vehicula tempus, commodo a, risus. Curabitur nec arcu. Nunc tristique tempus lectus.&lt;/p&gt;
	&lt;/div&gt;
&lt;/div&gt;
</code>

<p>

The second tag, test2.cfm, is the one that will include our link:

<p>

<code>
&lt;a href="test3.cfm"&gt;link to test3&lt;/a&gt;
</code>

<p>

And here is test3.cfm:

<p>

<code>
&lt;a href="test2.cfm"&gt;back to 2&lt;/a&gt;&lt;br&gt;
&lt;cfoutput&gt;#now()#&lt;/cfoutput&gt;
</code>

<p>

So what I would expect is that when I click the link in the second tag, test3.cfm would load up. When I click the link to return, I'd expect test2.cfm to load back up again. However, that doesn't work. Check for yourself here: <a href="http://www.raymondcamden.com/demos/april12011/test.cfm">http://www.coldfusionjedi.com/demos/april12011/test.cfm</a> And before you click - make note of the console.log message. If you are not using a browser with a console, please switch. 

<p>

So - it didn't work, right? Why? My console.log runs when I open up the second tab, but does not run again when test3.cfm is loaded, which implies that jQuery UI didn't consider this a tab load. That <i>kind</i> of makes sense, but I'm having a hard time imagining the jQuery guys putting up a solution that works for one link only. It seems so... obviously wrong that I figure I must be missing something.