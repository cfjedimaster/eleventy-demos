---
layout: post
title: "Using JavaScript to update the browser window title when the user is away"
date: "2010-10-19T12:10:00+06:00"
categories: [javascript,jquery]
tags: []
banner_image: 
permalink: /2010/10/19/Using-JavaScript-to-update-the-browser-window-title-when-the-user-is-away
guid: 3975
---

For a few months now I've noticed a few sites making use of an interesting technique. When I have a tab open to their site, but not focused, they will change the title when some event occurs. When I switch back to the tab the title reverts back to the normal state. I thought I'd take a few moments and see if I could mock that up in JavaScript as an experiment. It turned out to be pretty darn trivial, except for a minor bug with Chrome. Here is how I solved it - and as always - if anyone has suggestions for how to improve it, let me know. I'll also point out that this blog entry makes use of jQuery (why wouldn't it?) but that jQuery is not required to create something like this.
<!--more-->
<p/>

To begin, I create a simple page that would monitor both the blur and focus events of the window. I logged these events to a textarea. Here is that test in it's entirety:

<p/>

<code>

&lt;html&gt;
&lt;head&gt;
&lt;title&gt;Simple Title Test&lt;/title&gt;
&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script&gt;

$(document).ready(function() {
	//When the window is focused...
	$(window).focus(function() {
		curr = $("#test").val();
		curr += '\nfocus in '+(new Date());
		$("#test").val(curr);
	});

	//When the window is blurred...
	$(window).blur(function() {
		curr = $("#test").val();
		curr += '\nblur in '+(new Date());
		$("#test").val(curr);
	});
	
});

&lt;/script&gt;
&lt;/head&gt;
&lt;body&gt;

&lt;textarea id="test" cols="100" rows="50"&gt;&lt;/textarea&gt;
&lt;/body&gt;
&lt;/html&gt;
</code>

<p/>

Nothing too fancy there - just two event handlers. My main goal here for this test was to ensure that blur/focus would work correctly in a tabbed environment. Technically when I switch tabs I'm leaving the window but I"m in the same application. I <i>assumed</i> it would work but I wanted to be sure. You can see this yourself here: <a href="http://www.raymondcamden.com/demos/oct192010/test3.cfm">http://www.coldfusionjedi.com/demos/oct192010/test3.cfm</a>. By the way - I noticed that if you click in the address bar it considers it a blur. That may or may not be desirable, but I think it is ok for now.

<p/>

Ok - so we've a basic handle on when the tab is in focus and when it is not. Now let's actually build something that updates the title. I don't want to build a complete application per se, but I want to mimic what some of these other sites are doing. Facebook for example will tell you the number of chats you have waiting. I used that as my model. I began though by simply creating a function that will run in the background:

<p/>

<code>
window.setInterval('fakeStuff()',2000);
</code>

<p/>

And fakeStuff did...

<p/>

<code>
function fakeStuff() {
	if(Math.random() &gt; 0.5) {
	}
}
</code>

<p/>

Essentially, every two seconds, there is a 50/50 chance the event occurred and we need to do something. Ok, so now let's handle that. We have two basic tasks. We need to update the title with the number of chats you have missed if the window is out of focus. If the window is in focus, we want to suppress that, and ensure the title is restored. Here is the complete template. I'll walk through it and explain what each part does.

<p/>

<code>
&lt;html&gt;
&lt;head&gt;
&lt;title&gt;Simple Title Test&lt;/title&gt;
&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script&gt;
var focused = true;
var baseTitle = "";
var chatsMissed = 0;

//I'm the fake function that represents some process. We randomly determine if a new chat happened
function fakeStuff() {
	if(Math.random() &gt; 0.5) {
		if(!focused) {
			chatsMissed++;
			window.document.title = baseTitle + " ("+chatsMissed+")";
		}		
	}
}

$(document).ready(function() {

	//store the base title
	baseTitle = window.document.title;
	
	//When the window is focused...
	$(window).focus(function() {
		focused = true;
		//		window.document.title = baseTitle;
		//chrome bug: http://heyman.info/2010/oct/7/google-chrome-bug-when-setting-document-title/
		setTimeout(function() {
			document.title = baseTitle;
			}, 100);
			
		chatsMissed = 0;
	});

	//When the window is blurred...
	$(window).blur(function() {
		focused = false;
	});

	//setup a process
	window.setInterval('fakeStuff()',2000);
})
&lt;/script&gt;

&lt;/head&gt;
&lt;body&gt;

&lt;h1&gt;Some Page...&lt;/h1&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>

<p/>

So - skipping to the script block, I create 3 page wide variables. One for the focused state (I bet I can get that as a property of the Window object actually), one for the base title of the page, and one for the number of chats missed.

<p/>

Our fakeStuff function now will check to see if the window isn't focused. If it isn't, it updates the title with that number. 

<p/>

The window blur function just sets the global variable, but the focus one is a bit more complex. We obviously reset the number of missed chats, and the focus variable, but fixing the title was a bit more difficult. Chrome, for some reason, didn't "redraw" the title. Even though I set it, and could confirm that in the console, it just didn't draw it in the UI. Thanks to the blog entry <a href="http://heyman.info/2010/oct/7/google-chrome-bug-when-setting-document-title/">here</a>, I discovered others have the problem as well, and that a simple time out will fix the issue. You can test this version by hitting up the big button below.

<p/>

<a href="http://www.coldfusionjedi.com/demos/oct192010/test1.cfm"><img src="https://static.raymondcamden.com/images/cfjedi/icon_128.png" title="Demo, Baby" border="0"></a>

<p/>

To test, simply open it up in a tab and come back here. Give it a few seconds and you should see the title change. (Note that if you have a lot of tabs open you may not see this - just close a few tabs first. I'm sure you can look at LOL Cats again later.)