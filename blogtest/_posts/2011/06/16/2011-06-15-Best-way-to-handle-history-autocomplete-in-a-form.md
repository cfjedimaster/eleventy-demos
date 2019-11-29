---
layout: post
title: "Best way to handle history autocomplete in a form?"
date: "2011-06-16T10:06:00+06:00"
categories: [javascript,jquery]
tags: []
banner_image: 
permalink: /2011/06/16/Best-way-to-handle-history-autocomplete-in-a-form
guid: 4269
---

This was an interesting question sent to me by Joel:

<p>

<blockquote>
I have a text input that it used for a search criteria, and I only want to enable the search button when at least 5 characters have been entered. (The list of possible matches is huge, and I don't want 25,000 results returned to the browser.)
<br/><br/>
Suppose the text input is called "searchBox". With jQuery, I can do this:
<br/><br/>
$("#searchBox").keyup(function() {<br/>
 $("#btnGo").button("option", "disabled", $(this).val().length < 5 );<br/>
});<br/>
<br/><br/>
(It's a jQuery UI button, which is why the syntax for enabling is different from a normal button).
<br/><br/>
Most browsers keep a form input history. So If I start to type "apple" and I've typed it before, I can just click and choose it from the list. This does not fire the keyup event. I can bind "change" also, but that only fires when the input loses focus. Any thoughts on how to bind the selection of form history to enable the button?
</blockquote>

<p/>
<!--more-->
Apparently dealing with a browser's autocomplete isn't quite as simple as one would think. I did a quick example to prove this (and I wanted a non-jQuery UI one to test):

<p/>

<code>
&lt;html&gt;
&lt;head&gt;
&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script&gt;
$(document).ready(function() {

	$("#search").keyup(function() {
	 $("#searchBtn").attr("disabled", $(this).val().length &lt; 5 );
	});

})
&lt;/script&gt;
&lt;/head&gt;

&lt;body&gt;

&lt;form action="test.html" method="post"&gt;
&lt;input type="text" name="search" id="search"&gt; &lt;input type="submit" value="Search" id="searchBtn" disabled="true"&gt;
&lt;/form&gt;
</code>

<p/>

If you run this (online demo <a href="http://www.raymondcamden.com/demos/july162011/test.html">here</a>) and enter a few values, you should be able to see the "manual" approach work, but as soon as you use something from the browser's autocomplete history, it doesn't register. In my initial Google search, the first result I found suggested simply turning it off. That's doable but not exactly a solution. What about using the change handler?

<p/>

<code>
$("#search").change(function() {
 $("#searchBtn").attr("disabled", $(this).val().length &lt; 5 );
});
</code>

<p/>

That works - but not immediately. The user has to click elsewhere to register the change. After a bit more searching I found <a href="http://api.jquery.com/change/#comment-111389587">this comment</a> on the jQuery docs for change. The user, Robin, mentioned listening for a new HTML5, input. (This was the first time I'd heard of this. I thought I knew about all the HTML5 Form stuff. Guess I was wrong. Looks to be documented <a href="http://www.w3schools.com/html5/html5_ref_eventattributes.asp">here</a>.) I gave this a try:

<p/>

<code>
&lt;html&gt;
&lt;head&gt;
&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script&gt;
$(document).ready(function() {

	$("#search").keyup(function() {
	 $("#searchBtn").attr("disabled", $(this).val().length &lt; 5 );
	});



	$("#search").live("input",function() {
	 $("#searchBtn").attr("disabled", $(this).val().length &lt; 5 );
	});
})
&lt;/script&gt;
&lt;/head&gt;

&lt;body&gt;

&lt;form action="test.html" method="post"&gt;
&lt;input type="text" name="search" id="search"&gt; &lt;input type="submit" value="Search" id="searchBtn" disabled="true"&gt;
&lt;/form&gt;
</code>

<p/>

You can demo this one <a href="http://www.coldfusionjedi.com/demos/july162011/testAA.html">here</a>. Good news! Works in Chrome. Works in Firefox. Works in - oh crap. Not IE. Since apparently IE9 doesn't support <i>anything</i> Form-related in HTML5. *sigh* At this point, I'm willing to just give up on IE and just use "change" - as I said, it doesn't work immediately, but by this point, IE users are probably used to a substandard experience. Here is the "final" template I used. 

<p/>

<code>
&lt;html&gt;
&lt;head&gt;
&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script&gt;
$(document).ready(function() {

	$("#search").keyup(function() {
	 $("#searchBtn").attr("disabled", $(this).val().length &lt; 5 );
	});

	$("#search").change(function() {
	 $("#searchBtn").attr("disabled", $(this).val().length &lt; 5 );
	});

	$("#search").live("input",function() {
	 $("#searchBtn").attr("disabled", $(this).val().length &lt; 5 );
	});
})
&lt;/script&gt;
&lt;/head&gt;

&lt;body&gt;

&lt;form action="test.html" method="post"&gt;
&lt;input type="text" name="search" id="search"&gt; &lt;input type="submit" value="Search" id="searchBtn" disabled="true"&gt;
&lt;/form&gt;
</code>

<p/>

You can try this demo <a href="http://www.coldfusionjedi.com/demos/july162011/testBB.html">here</a>. So - does anyone have a nicer solution?