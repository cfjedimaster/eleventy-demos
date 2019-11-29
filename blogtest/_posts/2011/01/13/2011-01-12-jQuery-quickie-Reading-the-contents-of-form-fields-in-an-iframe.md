---
layout: post
title: "jQuery quickie: Reading the contents of form fields in an iframe"
date: "2011-01-13T07:01:00+06:00"
categories: [javascript,jquery]
tags: []
banner_image: 
permalink: /2011/01/13/jQuery-quickie-Reading-the-contents-of-form-fields-in-an-iframe
guid: 4081
---

Mihai asks:

<p>

<blockquote>
I'm having trouble reading the contents of an iframe with jQuery. I have a Rich Text Editor (MceEdit) that dynamically generates an iframe that holds al the styled text until sumbit. Only then, it populates the textarea that gets POSTed to the server. What I want to do, is read the content of the iframe  before submit, so I can send to the server via AJAX. (I'm trying to implement an autosave feature). I've already tried something like $('iframe').contents() or $('iframe').contents().html() but it doesn't work.
</blockquote>
<!--more-->
<p>

It looks like you were real close. The <a href="http://api.jquery.com/contents/">contents()</a> method of jQuery is exactly what you want to use. The docs even specifically mention it being the one to use for iframes. Here is the demo I came up. I began without any code, just some simple html.

<p>

<code>
&lt;html&gt;
&lt;head&gt;
&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script&gt;
$(document).ready(function() {

})
&lt;/script&gt;
&lt;/head&gt;

&lt;body&gt;

&lt;input type="button" id="testBtn" value="Click to read"&gt;

&lt;iframe src="test2.cfm" id="testFrame"&gt;&lt;/iframe&gt;
&lt;/body&gt;
&lt;/html&gt;
</code>

<p>

Ok I lie - there is a bit of code - the document ready block, but it's not doing anything yet. Now let's look at test2.cfm:

<p>

<code>
&lt;form&gt;
&lt;textarea id="content" cols="20" rows="20"&gt;
&lt;/textarea&gt;
&lt;/form&gt;
</code>

<p>

So far so good. Now let's make that button actually do something. Here is what I added:

<p>

<code>
$("#testBtn").click(function() {
	var text = $("#testFrame").contents().find("#content").val();
	console.log(text);
});
</code>

<p>

So as I said, contents() was what you wanted. I just tie to that a find() command to get my textarea and then use a val() to get the value. If you want to try this, click the button below, and <b>please note I make use of console</b>. If your browser doesn't support console this demo will not work. It should be obvious that the concept still works cross platform if you remove the console call. 

<p>

<a href="http://www.raymondcamden.com/demos/jan132011/test.cfm"><img src="https://static.raymondcamden.com/images/cfjedi/icon_128.png" title="Demo, Baby" border="0"></a>