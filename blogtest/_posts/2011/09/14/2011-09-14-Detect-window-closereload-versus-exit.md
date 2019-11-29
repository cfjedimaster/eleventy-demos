---
layout: post
title: "Detect window close/reload versus exit"
date: "2011-09-14T11:09:00+06:00"
categories: [javascript,jquery]
tags: []
banner_image: 
permalink: /2011/09/14/Detect-window-closereload-versus-exit
guid: 4364
---

This was an interesting question that came in from a reader:

<p/>

<blockquote>
I need to show a warning message on unload event of window.  I'm using below code.
<br/><br/>
Problem is its coming on all hyperlinks, submit buttons.
and if i try to trap event object, its coming as NULL.
</blockquote>

<p/>
<!--more-->
The code he was using made use of the beforeunload window event. Now - let me state right away I'm <b>hate</b> sites that do something when I try to leave them. That being said - he was trying to prevent folks from losing work when closing a window or tab by mistake. At the same time though he didn't want his safety code to run on simple clicks (or form submits). Here's the method I came up with. It just supports ignoring links, not form submits, but I'll throw it out there for folks to tear apart.

<p/>

<code>
&lt;html&gt;

&lt;head&gt;
&lt;script type="text/javascript"
src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script&gt;
$(window).bind('click', function(event) {
       if(event.target.href) $(window).unbind('beforeunload');
});
$(window).bind('beforeunload', function(event) {
       return 'pls save ur work';
});
&lt;/script&gt;
&lt;/head&gt;

&lt;body&gt;

&lt;a href="test2.cfm"&gt;reload&lt;/a&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>

<p>

Basically, I listen to both the click event and the beforeunload event. If a click happens (on a link), I unbind the beforeunload listener allowing the person to leave the page without getting the message. What do folks think? Ignoring the fact that it won't work on a form submit (but that's trivial enough to add), are there any other ways this can be improved?