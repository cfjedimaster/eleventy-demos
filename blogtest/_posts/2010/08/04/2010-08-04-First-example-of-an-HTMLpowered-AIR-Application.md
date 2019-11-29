---
layout: post
title: "First example of an HTML-powered AIR Application"
date: "2010-08-04T14:08:00+06:00"
categories: [jquery]
tags: []
banner_image: 
permalink: /2010/08/04/First-example-of-an-HTMLpowered-AIR-Application
guid: 3898
---

In the past few days I've given a basic <a href="http://www.raymondcamden.com/index.cfm/2010/7/31/Building-your-first-HTMLAdobe-AIR-Application">introduction</a> to the resources necessary to work with HTML AIR apps as well as a basic <a href="http://www.coldfusionjedi.com/index.cfm/2010/8/3/Building-your-first-HTMLAdobe-AIR-Application--Using-Aptana">walkthrough</a> of how you can use Aptana for your editing. In today's entry I'm going to cover two things. First - what does working within the AIR framework mean for you as a developer, and secondly, what does a real example look like. As a first example, it isn't HelloWorld per se, but it gives you an idea of what "real" code looks like.
<!--more-->
<p>
So first off - I've already talked about how a simple HTML page is used as the basis for your AIR application. Along with the application descriptor XML file, that's the minimum you need. But certainly you want to do more than Hello World. You want to tie into the power that the AIR framework gives you. What exactly <i>does</i> AIR allow you to do? Quite a lot actually:
<p>
<ul>
<li>You can read and write files and directories from the user's machine.
<li>You can access network resources and do fancy socket type operations. 
<li>You can build in support for drag and drop.
<li>You can support copy and paste.
<li>You can work with audio, both playing MP3s as well as accessing the user's microphone.
<li>You can work with an embedded local database.
<li>Like any other "real" application, you can create an icon for your application as well as register your application as the handler for a particular file type. Want your application to support .ray files? Doable!
<li>You can (under certain circumstances) run other applications on the user's system.
<li>You can create native windows - think about JavaScript window.create on steroids.
<li>You can create applications that have no UI - think services that run in the background.
</ul>
<p>
And frankly - a lot more too. For the most part, think of any "real" application, and - in general (I won't say 100%) - Adobe AIR will allow you to create it. Even better - you can create it once and ship it out to Windows, Macs, and Linux machines. (This too requires an *. You <i>will</i> see cases where you write code specifically for one platform or the other. So for example, AIR allows you to put an icon in the Windows taskbar. Since that doesn't make sense on the Mac, you will write your code to check for that support.) 
<p>
Ok - that's cool and all - but <i>how</i> does this happen? Quite simple - AIR extends your HTML application to give JavaScript access to new objects in the DOM. Specifically they are: runtime, nativeWindow, and htmlLoader. You can imagine that your writing code for a browser with super powers. So for example, to get access to a local file, you can do something like this:
<p>
<code>
var theFile = new runtime.flash.filesystem.file("some path");
</code>
<p>
If that seems like a bit too much typing, there is a handy-dandy aliases file that ships with the SDK. If you make use of Aptana, it will gladly copy that file into your project. Once you have the aliases file, the code above gets even simpler.
<p>
<code>
var theFile = new air.File("...");
</code>
<p>
Ok, so with that out of the way, let's look at our first example. I'll paste the entire code and then go over the details. I've also included the AIR file that you can download and install yourself. 
<p>

<code>

&lt;html&gt;
    &lt;head&gt;
        &lt;title&gt;Demo working with selected file&lt;/title&gt;
        &lt;script type="text/javascript" src="lib/air/AIRAliases.js"&gt;&lt;/script&gt;
		&lt;script src="lib/jquery/jquery-1.4.2.js"&gt;&lt;/script&gt;        
		&lt;script&gt;
		var file;
		
		$(document).ready(function() {
			air.trace('App started');

			file = air.File.documentsDirectory;
			file.addEventListener(air.Event.SELECT, handleSelect);
			
			//bind to file button
			$("#fileButton").click(function() {
				file.browseForOpen("Pick something");				
			})
			
			//bind to launcher button
			$("#launcher").live("click",function() {
				if(file.name) file.openWithDefaultApplication();
			})
		})

		function handleSelect(ev) {
			air.trace('you picked a file');
			var s = "";
			s += "Name: " + file.name + "&lt;br/&gt;";
			s += "Directory? " + file.isDirectory + "&lt;br/&gt;";
			s += "Native path: " + file.nativePath + "&lt;br/&gt;";
			s += "Parent: " + file.parent.nativePath + "&lt;br/&gt;";
			s += "url: " + file.url + "&lt;br/&gt;";
			s += "&lt;input type='button' id='launcher' value='Launch in native app'&gt;";

			$("#dump").html(s);
		}			
		&lt;/script&gt;
    &lt;/head&gt;
    &lt;body&gt;
    	
		&lt;input type="button" id="fileButton" value="Click Me"&gt;
		&lt;div id="dump"&gt;&lt;/div&gt;
		
    &lt;/body&gt;
&lt;/html&gt;
</code>

<p>

We've got a few things going on here, so let's break it down. I like to start at the bottom normally since I typically use buttons, forms, and DIVs as a way to debug. In this case, you can see I've got one button (fileButton) and one div (dump). Scroll on up to the document.ready block. If by some reason you don't know jQuery, just think of that as "Run me when the page is ready" block. The first "special" line is air.trace. This will send a debug message which Aptana will nicely display for you in the IDE. Think of this as console.log. 

<p>

Next check out this line:

<p>

<code>
file = air.File.documentsDirectory;
</code>

<p>

One of the coolest features of the AIR File API is that it has a few useful shortcuts. The documentsDirectory is one of them. It allows you to point to a user's documents directory no matter what OS they are using. Similar aliases exist for the desktop and other common folders. The next line adds a SELECT handler. We're going to tie our button to a 'pick a file' dialog and need a way to say what method should be run when the file is selected.

<p>

So how do we support asking the user to pick a file? In a regular HTML form that would be an input/type=file control. In AIR we can simply prompt the user to pick a file. This can be based on <i>any</i> UI or event. So I simply use jQuery to say that the click event for our button should run browseForOpen. Note - if I wanted to I could require you to pick files of a certain type. I've not done that here.

<p>

Skip past the last part of the document.ready block and check out the select handler, handleSelect. This will be run after the user has selected a file. The file object will point to the file on their file system and gives us access to a lot of things. In my example I just worked with a few of them, like name, path, url, etc. Size is there too if you want it. I'd recommend checking the docs out on the <a href="http://help.adobe.com/en_US/air/reference/html/flash/filesystem/File.html">File API</a> for more information. 

<p>

The last part of the puzzle is the laucher button I create. It showcases another cool feature, openWithDefaultApplication. As you can guess, this will ask the OS to run the file with whatever application is registered for it. So on my Mac, PDFs open with Preview, and on my PC it opens with Acrobat. Simple. 

<p>

To give you some idea of what this looks like, here are two quick screen shots:

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/Screen shot 2010-08-04 at 1.06.24 PM.png" />

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/Screen shot 2010-08-04 at 1.06.42 PM.png" />

<p>

The number one thing I want you to take from this is the fact that the "special" parts - ie the file references and such - were all pretty simple. I'd say more code was involved with the jQuery event handlers and the display portion. 

<p>

Any questions? Tomorrow we look at another file example. You can download the AIR file below.<p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2009%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fexampl1%{% endraw %}2Eair'>Download attached file.</a></p>