---
layout: post
title: "Changing the text of a CFWINDOW"
date: "2007-09-28T09:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/09/28/Changing-the-text-of-a-CFWINDOW
guid: 2375
---

A quick tip - how do you change the text of a window created by CFWINDOW? All you need to do is grab the underlying window object:

<code>
var win = ColdFusion.Window.getWindowObject("mywin");
</code>

In this object there is a body property which is a complex structure pointing to the body of the window. I thought perhaps the body was a simple string. I did:

<code>
win.body = 'Chicago better not be too cold';
</code>

Which didn't work (nor did it throw an error). Then I used ColdFusion's Ajax debugger:

<code>
ColdFusion.Log.dump(win.body);
</code>

This revealed the entire body element and I saw that there was a dom key which pointed to the DOM object. So all together now - the code is:

<code>
var win = ColdFusion.Window.getWindowObject("mywin");
win.body.dom.innerHTML = "Hi Ray, how are you?";
</code>

And there is a complete template for you to try:

<code>
&lt;script&gt;
function test() {
	var win = ColdFusion.Window.getWindowObject("mywin");
	win.body.dom.innerHTML = "Hi Ray, how are you?";
}
&lt;/script&gt;


&lt;cfwindow name="mywin" width="400" height="400" closable="true" initShow="true" title="Test"&gt;
Initial Content
&lt;/cfwindow&gt;

&lt;form&gt;
&lt;input type="button" onClick="test()" value="test"&gt;
&lt;/form&gt;
</code>

<b>Edit:</b> Please be sure to read Todd's comment below. There is a simpler way to do what I did above. I'd nuke my own entry - but I figure the alternative I used would still be of interest to folks.