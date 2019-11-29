---
layout: post
title: "Simple Example: Sound effects for an HTML/Adobe AIR Application"
date: "2010-10-24T10:10:00+06:00"
categories: [jquery]
tags: []
banner_image: 
permalink: /2010/10/24/Simple-Example-Sound-effects-for-an-HTMLAdobe-AIR-Application
guid: 3982
---

This morning when I couldn't sleep (I'm sorry PST, but I'm a CST guy and always will be) I thought that it might be kind of fun to look into added sound effects to an Adobe AIR application. I've worked with sound before. I've got a sample application that lets you drag a MP3 file onto it and the code will then parse the ID3 info and find the lyrics for you. But I wanted to add something simpler to an application - like a button click sound. The code for playing a song versus a sound effect isn't really any different, but here is a simple example to give you an idea of how you can do it.
<!--more-->
<p/>

Since the code is short enough, I'll paste in the entire thing and then explain what I'm doing:

<p/>
<code>

&lt;html&gt;
    &lt;head&gt;
        &lt;title&gt;New Adobe AIR Project&lt;/title&gt;
        &lt;script type="text/javascript" src="lib/air/AIRAliases.js"&gt;&lt;/script&gt;
    	&lt;script type="text/javascript" src="lib/jquery/jquery-1.4.2.min.js"&gt;&lt;/script&gt;
		&lt;script&gt;
		$(document).ready(function() {
			
			//preload the sounds
			var snd1 = air.File.applicationDirectory.resolvePath("lib/sound/button-4.mp3");
			var btn1 = new air.Sound(new air.URLRequest(snd1.url));

			var snd2 = air.File.applicationDirectory.resolvePath("lib/sound/button-5.mp3");
			var btn2 = new air.Sound(new air.URLRequest(snd2.url));

			$("#btnTest").click(function() {
				btn1.play();			
			});

			$("#btn2Test").click(function() {
				btn2.play();			
			});

		});
		&lt;/script&gt;    
    &lt;/head&gt;
    &lt;body&gt;

	&lt;input type="button" id="btnTest" value="Test Sound"&gt;

	&lt;input type="button" id="btn2Test" value="Test Another Sound"&gt;
	
    &lt;/body&gt;
&lt;/html&gt;
</code>

<p/>

You can look at this code snippet as two distinct parts - the layout and the JavaScript code. The layout is pretty simple, two buttons. The code shows how MP3 files are loaded. (I should point out - you can only work with MP3 files.) You begin by simply creating a pointer to your file. In this case my files are stored relative to my application in a lib/sound folder. 

<p/>

<code>
var snd1 = air.File.applicationDirectory.resolvePath("lib/sound/button-4.mp3");
</code>

<p/>

You then create a new Sound object. Sound objects take URLs, not paths, so we use the url property of the file object. 

<p/>

<code>
var btn1 = new air.Sound(new air.URLRequest(snd1.url));
</code>

<p/>

The final part is to create a way to play the sound. I've done this with an event handler on my buttons:

<p/>

<code>
$("#btnTest").click(function() {
	btn1.play();			
});
</code>

<p/>

And that's it. I've packaged up the zip and a compiled AIR file and attached it to this blog entry. You can, of course, do a lot more complex things with sound in AIR. Check the <a href="http://help.adobe.com/en_US/air/html/dev/WS5b3ccc516d4fbf351e63e3d118676a5a2f-8000.html">Working with Sound</a> part of the docs for more info.

<p/>

p.s. Sound effects courtesy of <a href="http://www.soundjay.com">Soundjay.com</a>.<p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2009%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2FSimpleSoundDemo%{% endraw %}2Ezip'>Download attached file.</a></p>