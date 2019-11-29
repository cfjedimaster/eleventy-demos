---
layout: post
title: "Ask a Jedi: Adding Print support for CFMAP"
date: "2009-12-08T14:12:00+06:00"
categories: [coldfusion,jquery]
tags: []
banner_image: 
permalink: /2009/12/08/Ask-a-Jedi-Adding-Print-support-for-CFMAP
guid: 3637
---

Dale asks:

<blockquote>
I want the user to be able to print a cfmap that is within a cfwindow.  Is there a way to add a print button to a cfwindow or cfmap?
</blockquote>

I had to dig a bit to find the answer, and of course as soon as I did, my buddy <a href="http://www.cfsilence.com">Todd Sharp</a> pointed out multiple ways to make it better, but the answer is, yes, you can. Here is how I solved it.
<!--more-->
I began by creating a simple application that allowed a user to enter an address and display a window containing the map. The front end code was pretty simple:

<code>
&lt;cfajaximport tags="cfwindow,cfmap"&gt;

&lt;html&gt;
&lt;head&gt;
&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script&gt;
$(document).ready(function() {

	$("#getAddressBtn").click(function() {
		try {
			ColdFusion.Window.destroy('mapWindow')
		} catch(e) {}
		var address = $("#address").val()
		ColdFusion.Window.create('mapWindow', 'Map', 'test2.cfm?address='+escape(address), {% raw %}{height:500,width:500,modal:false,closable:true, draggable:true,resizable:true,center:true,initshow:true }{% endraw %})
	})

	

})
&lt;/script&gt;
&lt;/head&gt;

&lt;body&gt;

&lt;h2&gt;Print Map Test&lt;/h2&gt;

&lt;form&gt;
&lt;input type="text" name="address" id="address" size="100" value="Lafayette, LA 70508"&gt; &lt;input type="button" id="getAddressBtn" value="Display Map"&gt;&lt;br/&gt;
&lt;/form&gt;
</code>

As you can see, I've got a text field and a button. I use jQuery to listen for a button click and then simply create a new window pointing to a CFM file that will create my map. Note - I was surprised to see there is still no easy way to tell if a CFWINDOW object exists. Hence the try/catch around my destroy. Sure you can use JavaScript variables to remember if the window exists, but I was hoping for a simple exists() type check.

The code that serves up the map is rather simple:

<code>
&lt;cfparam name="url.address" default=""&gt;

&lt;cfif len(trim(url.address))&gt;

	&lt;cfoutput&gt;Address: #url.address#&lt;/cfoutput&gt;
	&lt;cfmap centeraddress="#url.address#" zoomlevel="13"&gt;

&lt;/cfif&gt;
</code>

Who doesn't love how easy ColdFusion 9 makes it easy to work with maps?? Ok, so I first made sure this code worked fine. Once I did, I began my first attempt at printing. I did some Google searches about printing part of the page, and in almost all cases it involved some simple DOM manipulation behind the scenes. Luckily I was able to find a jQuery plugin called <a href="http://www.bennadel.com/index.cfm?dax=blog:1591.view">print</a>. It was created by some guy called Ben Nadel, which frankly sounds like a made up name to me. But his code worked - and was darn easy. Just take a selector and run print() on it:

<code>
$("#someselector").print()
</code>

Booyah! Ok, so here is the question though. How do I find out the ID of the window that holds the map? You would think it would be the same as the window name, but it isn't. I did some digging into the Ext docs and found that if you get access to the window object itself (which ColdFusion gives you a hook to), you can run getEl(), which returns the Ext.Element for the window. That object contains an ID field for the DOM item.

I added a print button to my page and then wired up the code. First, here is the button I added:

<code>
&lt;input type="button" id="print" value="Print Map"&gt;
</code>

And here is the JavaScript code:

<code>
$("#printBtn").click(function() {
	//silently ignore if no win....
	try {
		var mywin = ColdFusion.Window.getWindowObject('mapWindow')
		var realid = mywin.getEl().id;
		$("#" + realid).print()
	} catch(e) {}
})
</code>

As you can see, I make use of the Ext API to grab the real ID, which is then used with jQuery and passed to Ben's plugin. Worked like a charm!

But of course, Todd had to ruin it by making it simpler. First off, instead of using code to find the ID of my window, why not simply wrap the AJAX-loaded content with a div? Next - instead of a try/catch around my print operation, just run the darn code. Since the selector will return nothing if the window isn't there, it's harmless. Finally, Todd also suggested just putting the print button in the window. Duh. So here is the new version of the front end:

<code>
&lt;cfajaximport tags="cfwindow,cfmap"&gt;

&lt;html&gt;
&lt;head&gt;
&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script type="text/javascript" src="/jquery/jquery.print.js"&gt;&lt;/script&gt;
&lt;script&gt;
$(document).ready(function() {

	$("#getAddressBtn").click(function() {
		try {
			ColdFusion.Window.destroy('mapWindow')
		} catch(e) {}
		var address = $("#address").val()
		ColdFusion.Window.create('mapWindow', 'Map', 'test2.cfm?address='+escape(address), {% raw %}{height:500,width:500,modal:false,closable:true, draggable:true,resizable:true,center:true,initshow:true }{% endraw %})
	})

	$("#printBtn").live("click",function() {
		$("#print").print()
	})

})
&lt;/script&gt;
&lt;/head&gt;

&lt;body&gt;

&lt;h2&gt;Print Map Test&lt;/h2&gt;

&lt;form&gt;
&lt;input type="text" name="address" id="address" size="100" value="Lafayette, LA 70508"&gt; &lt;input type="button" id="getAddressBtn" value="Display Map"&gt;&lt;br/&gt;
&lt;/form&gt;
</code>

One small thing I want to point out. Because I'm going to move my button to AJAX-loaded content, I've switched from a simple click event listener to a live listener that monitors the click for the button. Finally, here is my map code. Note the new div, and also note that the print button is outside.

<code>

&lt;cfparam name="url.address" default=""&gt;

&lt;cfif len(trim(url.address))&gt;

	&lt;div id="print"&gt;
	&lt;cfoutput&gt;Address: #url.address#&lt;/cfoutput&gt;
	&lt;cfmap centeraddress="#url.address#" zoomlevel="13"&gt;
	&lt;/div&gt;

	&lt;input type="button" id="printBtn" value="Print Map"&gt;

&lt;/cfif&gt;
</code>