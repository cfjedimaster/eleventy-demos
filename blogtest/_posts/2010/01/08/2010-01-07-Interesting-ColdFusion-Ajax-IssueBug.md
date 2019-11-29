---
layout: post
title: "Interesting ColdFusion Ajax Issue(Bug?)"
date: "2010-01-08T09:01:00+06:00"
categories: [coldfusion,javascript,jquery]
tags: []
banner_image: 
permalink: /2010/01/08/Interesting-ColdFusion-Ajax-IssueBug
guid: 3677
---

Yesterday a reader wrote me with an interesting question. He was using ColdFusion's Ajax controls to load content into a cfdiv. Within the content loaded via Ajax, he had a simple form with some checkboxes. He wanted to use jQuery to support a "Check All" button. For some reason though the event handler he used never worked. Let's take a look at his initial code.
<!--more-->
First - here is the root page:
<p/>
<code>
&lt;cflayout type="border" name="layoutborder" height="200"&gt;
 &lt;cflayoutarea name="Center" position="center"&gt;
   &lt;a href="javascript:ColdFusion.navigate('test2a.cfm','catz')"&gt;Click Here&lt;/a&gt;
 &lt;/cflayoutarea&gt;
&lt;/cflayout&gt;
&lt;cfdiv id="catz"&gt;&lt;/cfdiv&gt;
</code>
<p/>

As you can see, he uses a simple border style layout with a link that makes use of ColdFusion.navigate. Now let's look at test2a.cfm:
<p/>

<code>
&lt;script&gt;
$(document).ready(function() {
	console.log("Confirm I ran...")
	 $("#checkboxall").click(function() {
		console.log("Ran the checkbox")
 var checked_status = this.checked;
  $("input[name=mapid]").each(function()
  {
   this.checked = checked_status;
  });

	})

})
&lt;/script&gt;

&lt;input id="checkboxall" type="checkbox" /&gt;Check all below&lt;br/&gt;
&lt;FORM&gt;
       &lt;input name="mapid" type="checkbox" /&gt;&lt;BR&gt;
       &lt;input name="mapid" type="checkbox" /&gt;&lt;BR&gt;
       &lt;input name="mapid" type="checkbox" /&gt;&lt;BR&gt;
&lt;/form&gt;
</code>
<p/>

Pardon the tabbing above - these scripts went through some adjustments. Anyway - nothing too special here. You can see the main form with the special checkbox above it. The jQuery code has an event listener for the special checkbox. When run it simply gets the other checkboxes and either checks or de-checks (is that a word?) the boxes. 
<p/>

So again - this <i>should</i> work. On a whim, I made a tweak. I switched from using a click listener to the live() feature. I've blogged on this before. jQuery's live() feature allows you to use event listener for DOM items that don't exist yet. So if you want to always bind to links, and you load content that may contain links, you need to use live(). From what I knew though, this shouldn't be required. The event listener was run when the content was loaded. However, when I switched the code to:
<p/>

<code>
 	$("#checkboxall").live("click",function()  {
</code>
<p/>

It worked! So that was last night. This morning I tried to dig a bit deeper into this. As I said, this change should <b>not</b> have been required, but it obviously worked (the reader confirmed it). So I did an interesting test. I wrote a new front end page that made use of both ColdFusion.navigate and jQuery:
<p/>

<code>
&lt;script src="http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js"&gt;&lt;/script&gt;
&lt;script&gt;

$(document).ready(function() {

	$("#loadIt").click(function() {
		$("#content").load("test2a.cfm")
	})

})

&lt;/script&gt;

&lt;input type="button" value="Load Content" id="loadIt"&gt;

&lt;div id="content"&gt;&lt;/div&gt;

&lt;cflayout type="border" name="layoutborder" height="200"&gt;
 &lt;cflayoutarea name="Center" position="center"&gt;
   &lt;a href="javascript:ColdFusion.navigate('test2a.cfm','catz')"&gt;Click Here&lt;/a&gt;
 &lt;/cflayoutarea&gt;
&lt;/cflayout&gt;
&lt;cfdiv id="catz"&gt;&lt;/cfdiv&gt;
</code>
<p/>

And here is where things get crazy. As you can see, I've got the original code on the bottom. Above it I have a simple button that runs the jQuery load() function. Basically though both should be doing the same thing: Request test2a.cfm and load it into a thing. 
<p/>

I was shocked to see though that the jQuery loaded content worked as I expected! At this point I was truly lost. I opened up Firefox (I've pretty much given up on Firefox except for Firebug) and looked at the XHR requests. In general, I saw two things different.
<p/>

First - ColdFusion's navigate function adds a bunch of junk to the URL. I knew this of course. It handles suppressing debugging, preventing caching, and other stuff. As an example, here is the jQuery URL versus ColdFusion's:
<p/>

http://localhost/test2a.cfm<br/>
http://localhost/test2a.cfm_cf_containerId=catz&_cf_nodebug=true&_cf_nocache=true&_cf_clientid=730C445ABFA5719A14A7DBC87B0E5259&_cf_rc=0

<p/>

As I said - I expected that. The second change was surprising. In a <a href="http://www.insideria.com/2009/04/jqueryserver-side-tip-on-detec.html">previous blog post</a> I talked about how you can check for a HTTP header, X-Requested-With, to sniff an Ajax request. This is set by jQuery and other Ajax frameworks. It isn't (as far as I know) an actual part of the low level HTTP implementation in JavaScript. ColdFusion's code, however, does <b>not</b> send this header. While I don't believe this is the issue, it is surprising. I'm going to file an ER for this and I'm going to see if I can tweak the core ColdFusion JavaScript code to add this header in. Maybe it <i>will</i> make a difference.