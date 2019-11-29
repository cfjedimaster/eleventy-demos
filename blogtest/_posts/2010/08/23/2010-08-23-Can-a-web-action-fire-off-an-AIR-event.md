---
layout: post
title: "Can a web action fire off an AIR event?"
date: "2010-08-23T18:08:00+06:00"
categories: [coldfusion,jquery]
tags: []
banner_image: 
permalink: /2010/08/23/Can-a-web-action-fire-off-an-AIR-event
guid: 3921
---

This was a great question that came in via a reader last week. Because of the nature of his business I have to be a bit vague. Basically he wanted to know if there was some way where a click on a web page could have some type of response within an AIR application. As with most things there are a few ways this could be handled. Here is what I came up with (and consider this a call out for more ideas and suggestions please!).
<!--more-->
<p>

Probably the simplest and more direct solution would be to use messaging (either with BlazeDS or LCDS, or perhaps the sexy new LCCS). In this scenario, you could imagine a ColdFusion page that - when run - uses sendGatewayMessage to communicate with an event gateway set up to handle messaging between your web server and any number of AIR clients. The AIR application would need to be running of course, but don't forget you can build AIR apps that run just in the Dock/Tray so they aren't always in the face of your user. Messaging is pretty simple. Most examples focus on chat but this would be a good example of how it could be used for a <i>non</i>-social interaction. 

<p>

So as I said - that's one option. But the more I thought about it - the more I was intrigued by another idea. Did you know that Adobe AIR applications can register themselves to handle certain file types? So for example, if you wrote an application that plays MP3 files (come on - anyone can beat iTunes, right?) then your application could register itself for .mp3 files. Anytime a MP3 file is double clicked the request would be handed over to your AIR application.

<p>

Most likely that type of interaction is difficult and hard to actually use, right? Yeah - I'm being a bit sneaky. I found this great article by Jeff Swartz which discusses this topic plus a few more: <a href="http://www.adobe.com/devnet/air/ajax/quickstart/startup_options.html">AIR application start-up options</a>. For this blog entry I'm going to focus just on registering your application to handle certain file types. I'll then tie this to a ColdFusion script that will dynamically generate files that will be handled by the AIR application.

<p>

From the <a href="http://www.adobe.com/devnet/air/ajax/quickstart/startup_options.html">article</a>, we can see that registering your AIR application to handle a file type comes down to two steps:

<p>

First - you have to add a section to your application.xml file. This section is a File block and defines information that the file system will use when creating the registration. I won't describe these XML keys as Jeff's article does a good job of it, but honestly, you can tell just by looking at them:

<p>

<code>
&lt;fileType&gt;
	&lt;name&gt;AIR.sample.file&lt;/name&gt;
	&lt;extension&gt;foo&lt;/extension&gt;
	&lt;description&gt;AIR start-up sample application file&lt;/description&gt;			
	&lt;contentType&gt;text/plain&lt;/contentType&gt;
	&lt;icon&gt;
		&lt;image16x16&gt;icons/AIRApp_16.png&lt;/image16x16&gt;
		&lt;image32x32&gt;icons/AIRApp_32.png&lt;/image32x32&gt;
		&lt;image48x48&gt;icons/AIRApp_48.png&lt;/image48x48&gt;
		&lt;image128x128&gt;icons/AIRApp_128.png&lt;/image128x128&gt;
	&lt;/icon&gt;
&lt;/fileType&gt;
</code>

<p>

Like in Jeff's article, I'm building support for files that use the .foo extension. I added this to the application.xml file in a new project called FooHandler. Now let's look at the code part of this. Telling your AIR application to integrate with the file extension comes down to 3 basic calls: 

<p>

<ul>
<li>air.NativeApplication.nativeApplication.isSetAsDefaultApplication("foo") - Am I handling foo?
<li>air.NativeApplication.nativeApplication.setAsDefaultApplication("foo") - I want to handle foo
<li>air.NativeApplication.nativeApplication.removeAsDefaultApplication("foo") - I no longer want to handle foo
</ul>

<p>

I wish it was more difficult. Honest. Well, there is a bit more. Adobe AIR has support for an "invocation" event on startup. Basically, "How was I started" and "Were there any arguments?" We're going to tie into this within our sample application. Here is the script I used (and again, thanks go to Jeff for article):

<p>

<code>

&lt;html&gt;
    &lt;head&gt;
        &lt;title&gt;New Adobe AIR Project&lt;/title&gt;
        &lt;script type="text/javascript" src="lib/air/AIRAliases.js"&gt;&lt;/script&gt;
        &lt;script type="text/javascript" src="lib/jquery/jquery-1.4.2.js"&gt;&lt;/script&gt;
		&lt;script&gt;
		function openFile(path) {
			var contents = "";
			file = new air.File(path);
			var stream = new air.FileStream();
			stream.open(file, air.FileMode.READ);
			contents = stream.readUTFBytes(stream.bytesAvailable);
			stream.close();
			return contents;
		}
		function invokeHandler(event) {		
			var log = '&lt;br/&gt;';
			log += new Date().toTimeString() + ": InvokeEvent.reason == " + event.reason + "&lt;br/&gt;";
			log += "  InvokeEvent.arguments.length == " + event.arguments.length + "&lt;br/&gt;";
			for (i = 0; i &lt; event.arguments.length; i++)
			{
				log += "  InvokeEvent.arguments[" + i + "] == " + event.arguments[i] + "&lt;br/&gt;";
			}
			if (event.arguments.length &gt; 0)
			{
				var fileContents = openFile(event.arguments[0]);
			}
			$("#log").append(log);
		}

		$(document).ready(function() {
			//always ensure i'm registered for FOO files
			if (!air.NativeApplication.nativeApplication.isSetAsDefaultApplication("foo")) {
				$("#log").append("I set myself up for .foo&lt;br/&gt;");
				air.NativeApplication.nativeApplication.setAsDefaultApplication("foo");	
			}

			//tell the app to run this when turned on
			air.NativeApplication.nativeApplication.addEventListener(air.InvokeEvent.INVOKE, invokeHandler);
			$("#log").append("Done running&lt;br/&gt;");

		});
		&lt;/script&gt;
    &lt;/head&gt;
    &lt;body&gt;
	
		&lt;div id="log"&gt;&lt;/div&gt;
		
    &lt;/body&gt;
&lt;/html&gt;
</code>

<p>

So what's going on here? In my jQuery startup block you can see where I check if I'm registered for foo. A good application would probably prompt you, but I've decided to build AIR apps for Evil and Sinister purposes. After setting myself up to "own" the .foo extension, I then add a listener for the invocation event. Scrolling up, you can see I took Jeff's sample code and modified to print out to a DIV on the page. You can see where it checks if there were any arguments to the application invocation, and if so, prints them. Now this code makes an assumption that isn't entirely safe. It assumes that if one arg exists, it is the filename. That will certainly be true when I double click on a .foo file. However I could have also launched the application from the command line. Keep that in mind if you use this in production. Anyway, if there was a file used an argument, it's contents will be displayed on screen. I slimmed things down a bit in this version:

<p>

<code>

&lt;html&gt;
    &lt;head&gt;
        &lt;title&gt;New Adobe AIR Project&lt;/title&gt;
        &lt;script type="text/javascript" src="lib/air/AIRAliases.js"&gt;&lt;/script&gt;
        &lt;script type="text/javascript" src="lib/jquery/jquery-1.4.2.js"&gt;&lt;/script&gt;
		&lt;script&gt;
		function openFile(path) {
			var contents = "";
			file = new air.File(path);
			var stream = new air.FileStream();
			stream.open(file, air.FileMode.READ);
			contents = stream.readUTFBytes(stream.bytesAvailable);
			stream.close();
			return contents;
		}
		
		function invokeHandler(event) {		
			if (event.arguments.length &gt; 0) {
				var fileContents = openFile(event.arguments[0]);
				$("#log").append(fileContents);
			}
		}

		$(document).ready(function() {
			//always ensure i'm registered for FOO files
			if (!air.NativeApplication.nativeApplication.isSetAsDefaultApplication("foo")) {
				$("#log").append("I set myself up for .foo&lt;br/&gt;");
				air.NativeApplication.nativeApplication.setAsDefaultApplication("foo");	
			}

			//tell the app to run this when turned on
			air.NativeApplication.nativeApplication.addEventListener(air.InvokeEvent.INVOKE, invokeHandler);
			$("#log").append("Done running&lt;br/&gt;");

		});
		&lt;/script&gt;
    &lt;/head&gt;
    &lt;body&gt;
	
		&lt;div id="log"&gt;&lt;/div&gt;
		
    &lt;/body&gt;
&lt;/html&gt;
</code>

<p>

So how do you test this? If you run this from Aptana, you can't (as far as I know) fake a "double click on a file event". You need to actually generate the AIR file, run the installer, and then run your application. I did that. I went to the folder where AIR installed the .exe and created a .foo file:

<p>

<img src="https://static.raymondcamden.com/images/Capture14.PNG" />

<p>

When double clicking on ray.foo, I then get:

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/Capture15.PNG" />

<p>

Woot! Ok, so now for the final part to this puzzle. Let's build a simple ColdFusion script that will generate dynamic .foo files. Here is what I came up with:

<p>

<code>
&lt;cfsetting showdebugoutput="false"&gt;
Generating.

&lt;cfheader name="Content-disposition" value="attachment;filename=test.foo"&gt;
&lt;cfcontent type="text/plain"&gt;This is not my gun. This is something else. &lt;cfoutput&gt;#dateFormat(now(), "long")# #timeFormat(now(), "long")#&lt;/cfoutput&gt;
</code>

<p>

Ok, not very exciting, but you can see where I'm setting up my CFM to force the download of a file called test.foo. Within I have some simple random content. When I run this I get a nice little automatic download:

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/Capture16.PNG" />

<p>

And clicking this then gives me:

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/Capture17.PNG" />

<p>

It would be nice if it was a one step process (I haven't tested it in Firefox), but it's a beginning. Obviously you probably don't want to just read out the file to screen. You could have data in there, JSON for example, that is read and interpreted by your application to do - well - whatever it is your application needs to do. 

<p>

Any comments on this process? The code is attached to the entry.<p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2009%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2FFooHandler%{% endraw %}2Ezip'>Download attached file.</a></p>