---
layout: post
title: "JavaScript Tip - Auto Capitalizing"
date: "2010-03-16T09:03:00+06:00"
categories: [javascript,jquery]
tags: []
banner_image: 
permalink: /2010/03/16/JavaScript-Tip-Auto-Capitalizing
guid: 3750
---

A reader asked me an interesting question yesterday. His system required all form input to be in capital letters. He wanted to know if there was a way to force the caps lock key to be abled on the client machine. As far as I know, this isn't possible. You can <a href="http://www.codeproject.com/KB/scripting/Detect_Caps_Lock.aspx">detect</a> the status of the caps lock key, but actually enabling it is not something you can do via JavaScript. However, it is pretty trivial to simply automatically capitalize the user's input. Here is one simple example in jQuery.
<p/>
I began with a simple form containing two inputs:
<p/>
<code>
&lt;form&gt;
Name: &lt;input type="text" name="name"&gt;&lt;br/&gt;
Email: &lt;input type="text" name="email"&gt;&lt;br/&gt;
&lt;/form&gt;
</code>
<p/>
I then whipped up this simple jQuery:
<p/>
<code>
&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script&gt;
$(document).ready(function() {
	$("input").keyup(function() {
		var val = $(this).val()
		$(this).val(val.toUpperCase())
	})
})
&lt;/script&gt;
</code>
<p/>
This code binds to all input fields on the page. I'd probably filter it to a particular FORM ID normally, but this works fine. I listened for the keyup event and simply took the entire val and converted it to upper case. You can see a demo of this <a href="http://www.raymondcamden.com/demos/mar162010/test.cfm">here</a>. Not terribly exciting, but it works, as long as JavaScript is enabled of course.