---
layout: post
title: "Creating a Dialog with jQuery UI (2)"
date: "2009-02-02T10:02:00+06:00"
categories: [jquery]
tags: []
banner_image: 
permalink: /2009/02/02/Creating-a-Dialog-with-jQuery-UI-2
guid: 3217
---

Yesterday I <a href="http://www.raymondcamden.com/index.cfm/2009/2/1/Creating-a-Dialog-with-jQuery-UI">blogged</a> about my experience working with jQuery UI and the Dialog widget. In general it went well (after a slightly rough start), but I was able to get things working nicely and even played around with the themes a bit. I thought things were working fine. I could click my link, and the dialog would show up. (See the exciting, thrilling demo <a href="http://www.coldfusionjedi.com/demos/jqueryuitest2/test3.html">here</a>.) However, there was a bug with how I used the code. If you click on the link it will load the dialog, but if you close it, you can't reopen it. Here is how I fixed the problem.
<!--more-->
First, let's take a quick look at how the dialog was set up:

<code>
&lt;script&gt;
function showDialog(){
	$("#example").dialog();
	return false;
}
&lt;/script&gt;
</code>

The function showDialog was tied to a simple link on the page. Clicking it once works fine, but any subsequent link would do nothing. Checking the <a href="http://docs.jquery.com/UI/Dialog">docs</a> a bit closer, I discovered that the .dialog() call was mostly meant to be used to <i>setup</i> the Dialog, not show it. It certainly will show a dialog of course, as you can see in the demo, but really it should only have been used once. Here is a modified version that works nicer:

<code>
&lt;script&gt;
function showDialog(){
	$("#example").dialog("open");
	return false;
}

$(document).ready(function() {
	$("#example").dialog({% raw %}{autoOpen:false}{% endraw %});	
});

&lt;/script&gt;
</code>

In this version, I use the $(document).ready to set up the dialog box when the page loads. Notice the use of autoOpen:false. This will set up my dialog but not show it. Now my showDialog function can run dialog("open") to pop open the dialog no matter how many times it is closed.

You can see a demo of this, and the amazing 'Swanky Purse' theme, here: <a href="http://www.coldfusionjedi.com/demos/jqueryuitest2/test4.html">http://www.coldfusionjedi.com/demos/jqueryuitest2/test4.html</a> Remember you can View Source for the complete page.

<img src="https://static.raymondcamden.com/images/cfjedi//Picture 137.png">

I will also point out two other fixes by posters on the last blog entry. One by <a href="http://www.coldfusionjedi.com/index.cfm/2009/2/1/Creating-a-Dialog-with-jQuery-UI#c3756144B-19B9-E658-9D520379F25FC045">Akira</a> and one by <a href="http://www.coldfusionjedi.com/index.cfm/2009/2/1/Creating-a-Dialog-with-jQuery-UI#c377472A5-19B9-E658-9D8A4FD907CB6E07">Joel Cox</a>.