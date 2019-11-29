---
layout: post
title: "Stupid jQuery Trick - HTML Preview"
date: "2010-04-28T14:04:00+06:00"
categories: [javascript,jquery]
tags: []
banner_image: 
permalink: /2010/04/28/Stupid-jQuery-Trick-HTML-Preview
guid: 3795
---

This came up in an earlier conversation today, and I don't think it's something anyone would actually use, but I love how simple it is and - well, it's kinda cool too. And stupid. (Which means it was fun to write.) So what in the heck am I talking about? Imagine you give a textarea field for your client to enter text into. You trust them with HTML, but don't want to bother with a rich text area. It would be nice to give them the ability to see their code while they type. Here's a quickie jQuery solution for this.
<!--more-->
<p>
<code>
&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script&gt;
$(document).ready(function() {
	$("#codehere").keyup(function() {
		$("#preview").html($(this).val())
	})
})
&lt;/script&gt;

code here:&lt;br/&gt;
&lt;textarea id="codehere" cols="50" rows="10"&gt;&lt;/textarea&gt;

&lt;p/&gt;

preview here:
&lt;div id="preview"&gt;&lt;/div&gt;
</code>

<p>

Working from the bottom first - notice I've got my form (well, to be technical, it's just one field, not a complete form) and a div set up for my preview. My jQuery code then simply then binds to the form and on every key press, I set the HTML property of the preview div with the text value of the form. You can play with this <a href="http://www.raymondcamden.com/demos/apr282010/test3.cfm">here</a> or if you just want to see what it looks like, here is a simple screen shot.

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/Screen shot 2010-04-28 at 12.51.16 PM.png" title="jQuery RTE FTW"/>

<p>

<b>Edited at 2:39 PM:</b> Thanks to multiple commenter for pointing out I should be using keyup instead.