---
layout: post
title: "Updating an HTML/Adobe AIR Application Title"
date: "2011-02-09T18:02:00+06:00"
categories: [jquery]
tags: []
banner_image: 
permalink: /2011/02/09/Updating-an-HTMLAdobe-AIR-Application-Title
guid: 4114
---

So this falls into the pretty obvious category, but as I had not tried it before I wanted to confirm it would work. Yesterday I noticed that my FTP program (<a href="http://filezilla-project.org/">FileZilla</a> - has both a client and a server and is free - very recommended!) changed the application title based on what server I was connected to. This gave me a bit of context about what the application was up to. As an example, here is what FileZilla looks like in my task bar after I've connected to my web server.
<!--more-->
<p>

<img src="https://static.raymondcamden.com/images/ScreenClip19.png" />

<p>

Yeah, not rocket science but interesting. I figured this would be trivial in an Adobe AIR application so I whipped up the following simple example.

<p>

<code>
&lt;html&gt;
    &lt;head&gt;
        &lt;title&gt;MyApp&lt;/title&gt;
        &lt;script type="text/javascript" src="lib/air/AIRAliases.js"&gt;&lt;/script&gt;
        &lt;script type="text/javascript" src="lib/jquery/jquery-1.4.2.js"&gt;&lt;/script&gt;
		&lt;script&gt;
		$(document).ready(function() {
		
			$("#button1, #button2, #button3").click(function() {
				var label = $(this).attr("value");
				window.document.title = label + " - MyApp";
			});
		});
		&lt;/script&gt;
    &lt;/head&gt;

    &lt;body&gt;
		&lt;input type="button" id="button1" value="Test One"&gt; 
		&lt;input type="button" id="button2" value="Test Two"&gt; 
		&lt;input type="button" id="button3" value="Test Three"&gt; 
		
    &lt;/body&gt;
&lt;/html&gt;
</code>

<p>

The application consists of three simple buttons. Whenever you click one, I use a jQuery event handler to pick up the label and use it to update the window title. That's the same code you would use to update the title of your browser (something I explored a while back in <a href="http://www.coldfusionjedi.com/index.cfm/2010/10/19/Using-JavaScript-to-update-the-browser-window-title-when-the-user-is-away">this blog entry</a>) and it works the exact same for AIR as well. Here is a simple screen shot after clicking button two.

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip20.png" />

<p>

Yeah - not too terribly exciting but hey - I was curious. :)