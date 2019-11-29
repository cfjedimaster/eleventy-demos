---
layout: post
title: "Collapsible content and Ajax loading with jQuery Mobile"
date: "2011-04-05T19:04:00+06:00"
categories: [coldfusion,javascript,jquery,mobile]
tags: []
banner_image: 
permalink: /2011/04/05/Collapsible-content-and-Ajax-loading-with-jQuery-Mobile
guid: 4186
---

John sent me an interesting question. He wants to make use of jQuery Mobile but needed a way to get sets of content on a page that would load only when requested. He tried using a list view but this failed to render properly for his needs. Turns out - there are all kinds of nice gems within jQuery Mobile, one of them being <a href="http://jquerymobile.com/demos/1.0a4/#docs/content/content-collapsible.html">collapsible content</a> items. 
<p>
<!--more-->
<p>

They are - like most things in jQuery Mobile - incredibly simple to use. Just wrap your content in a specially marked div and you get a collapsible item:

<p>

<pre><code class="language-markup">&lt;div data-role="collapsible"&gt;   
    	&lt;h1&gt;Item One&lt;/h1&gt;
    	&lt;p&gt;
    	This is my content.
    	&lt;/p&gt;
&lt;/div&gt;
</code></pre>

<p>

And that's it. Really. If you want to make the content default to collapsed, you have to write a bunch of JavaScript code... nah, I'm kidding, you just add an argument:

<p>

<pre><code class="language-markup">&lt;div data-role="collapsible" data-collapsed="true"&gt;   
    	&lt;h1&gt;Item One&lt;/h1&gt;
    	&lt;p&gt;
    	This is my content.
    	&lt;/p&gt;
&lt;/div&gt;
</code></pre>

<p>

Ok, so that's <i>incredibly</i> trivial. What isn't so trivial is how to make the actual content something you load via Ajax. The docs don't discuss this, but a Google search turned up this <a href="http://forum.jquery.com/topic/collapsible-content-on-click-events">forum posting</a> that says an event is fired when your div is collapsed or expanded. The example they provide is this:

<p>

<pre><code class="language-javascript">$('div').live('expand', function(){
    console.log('expand');
  }).live('collapse', function(){
    console.log('collapse');
});
</code></pre>

<p>

Easy enough, right? So I whipped up a super simple static front page:

<p>

<pre><code class="language-markup">&lt;!DOCTYPE html&gt; 
&lt;html&gt; 
	&lt;head&gt; 
	&lt;title&gt;Page Title&lt;/title&gt; 
	&lt;link rel="stylesheet" href="http://code.jquery.com/mobile/1.0a4/jquery.mobile-1.0a4.min.css" /&gt;
	&lt;script src="http://code.jquery.com/jquery-1.5.2.min.js"&gt;&lt;/script&gt;
	&lt;script src="http://code.jquery.com/mobile/1.0a4/jquery.mobile-1.0a4.min.js"&gt;&lt;/script&gt;
	&lt;script&gt;

	$('div.info').live('expand', function(){
		//get the ID for this record
		var record = $(this).data("record");
	    console.log('expanded '+record);
		$(".detail", this).load("test2.cfm?record="+record);
	  });

	&lt;/script&gt;
&lt;/head&gt; 
&lt;body&gt; 

&lt;div data-role="page"&gt;

	&lt;div data-role="header"&gt;
		&lt;h1&gt;Page Title&lt;/h1&gt;
	&lt;/div&gt;

	&lt;div data-role="content"&gt;	

		&lt;div data-role="collapsible" data-collapsed="true" class="info" data-record="1"&gt;   
	    	&lt;h1&gt;Item One&lt;/h1&gt;
			&lt;div class="detail"&gt;&lt;/div&gt;   
	    &lt;/div&gt;

		&lt;div data-role="collapsible" data-collapsed="true" class="info" data-record="2"&gt;    
	    	&lt;h1&gt;Item Two&lt;/h1&gt;    
			&lt;div class="detail"&gt;&lt;/div&gt;  
	    &lt;/div&gt;
	
	&lt;/div&gt;

	&lt;div data-role="footer"&gt;
		&lt;h4&gt;Page Footer&lt;/h4&gt;
	&lt;/div&gt;

&lt;/div&gt;

&lt;/body&gt;
&lt;/html&gt;
</code></pre>

<p>

I've got two collapsible items here - hard coded. Normally this would probably be database driven. Note that I've applied a class to them as well as a data item called record. If you go up to the JavaScript, you can see I've modified the selector to be more specific. It only picks up divs with the info class. I also only care about expansion so I didn't bother with a collapse handler. Once one of my divs is opened, I grab the record value (imagine this is a database table primary key) and call a load event. test2.cfm isn't doing anything interesting but here it is anyway:

<p>

<pre><code class="language-markup">&lt;cfparam name="url.record" default=""&gt;

&lt;cfoutput&gt;
This is dynamic data for record #url.record#
&lt;/cfoutput&gt;
</code></pre>