---
layout: post
title: "DirectoryWatcher and ColdFusion Image Manipulation Example"
date: "2007-10-29T16:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/10/29/DirectoryWatcher-and-ColdFusion-Image-Manipulation-Example
guid: 2441
---

Now that ColdFusion 8 gives us a crap load of image functions as well as event gateways in all editions, I thought I'd write up a super quick demo on how you can use both in your application. If you've never played with event gateways before, either because you thought they were too complex or you were running the Standard edition of ColdFusion, you should really take a look now. Event gateways are extremely powerful - but not as complex as you may think.

Before I begin - please check the <a href="http://livedocs.adobe.com/coldfusion/8/htmldocs/UseGateways_1.html">docs</a> on event gateways for a full explanation. I'm just writing a quick example here and won't be covering all the details.
<!--more-->
The gateway I want to talk about today is the Directory Watcher. This gateway lets you, obviously, monitor a directory. You can have ColdFusion notice a change to the directory. This change can either be a new file, a modified file, or a deleted file.

So what are we going to do with our gateway? Our client, Hogwarts Press, Inc., has a group of reporters who handle press relations for the Hogwarts school. Being non-techies, they just want to take pictures. They can't be bothered to change these pictures for web publication. 

To make things easier then we've set up a simple FTP connection for them to send their files to. They will download the pictures off their camera and FTP them up to a folder. (FTP is probably too much for them. You could also imagine an AIR application that lets them just drop files onto an icon.) The pictures will all be stored here:

/Users/ray/Documents/Web Sites/webroot/testingzone/dirwatcherimage/spool

Our code needs to:

<ul>
<li>Check the file to ensure it is an image. (You never know with those non-techies.
<li>If an image, resize to a max width and height of 500 each. (Of course, you could also do other things like change the quality.)
<li>Move the image to a folder named 'ready.'
<li>If the file wasn't an image, delete it.
</ul>

So let's start off by creating an instance of the DirectoryWatcher gateway. This is done in the ColdFusion Administrator. In order to do it, though, you need to specify a CFC and a configuration file. I created two empty files, watcher.cfc and config.ini. The figure below shows the values I set for my gateway. The name isn't important - but should reflect what your gateway is doing, or the application it is working with.

<img src="https://static.raymondcamden.com/images/degi.png">


Now we need to edit the config file. This file is used by the event gateway to control the behavior of the code watching the directory. As I mentioned above - the gateway can notice adds, edits, and deletes. All I really care about is the add, so my config file looks like so:

<code>
# The directory you want to watch.  If you are entering a Windows path
# either use forward slashes (C:/mydir) or escape the back slashes (C:\\mydir).
directory=/Users/ray/Documents/Web Sites/webroot/testingzone/dirwatcherimage/spool

# Should we watch the directory and all subdirectories too
# Default is no.  Set to 'yes' to do the recursion.
recurse=no

# The interval between checks, in miliseconds
# Default is 60 seconds
interval=6000

# The comma separated list of extensions to match.
# Default is * - all files
extensions=*

# CFC Function for file Change events
# Default is onChange, set to nothing if you don't want to see these events
changeFunction=

# CFC Function for file Add events
# Default is onAdd, set to nothing if you don't want to see these events
addFunction=onAdd

# CFC Function for file Delete events
# Default is onDelete, set to nothing if you don't want to see these events
deleteFunction=
</code>

Notice the addFunction line. This simply says that the gateway should run the onAdd method of my CFC. Now let's take a look at the CFC:

<code>
&lt;cfcomponent&gt;

&lt;cffunction name="onAdd"&gt;
	&lt;cfargument name="cfevent"&gt;
	&lt;cfset var myfile = arguments.cfevent.data.filename&gt;
	&lt;cfset var image = ""&gt;
	&lt;cfset var newdest = getDirectoryFromPath(myfile)&gt;
	
	&lt;cfif not isImageFile(myfile)&gt;
		&lt;cflog file="dirwatcher" text="#myfile# is NOT an image"&gt;
		&lt;cffile action="delete" file="#myfile#"&gt;
		&lt;cfreturn /&gt;
	&lt;/cfif&gt;
			
	&lt;cflog file="dirwatcher" text="#myfile# is an image"&gt;

	&lt;!--- resize ---&gt;
	&lt;cfset image = imageRead(myfile)&gt;
	&lt;cfif image.width gt 500 or image.height gt 500&gt;
		&lt;cfset imageScaleToFit(image,500,500,"highestquality")&gt;
		&lt;cflog file="dirwatcher" text="Resized to 500x500"&gt;
	&lt;/cfif&gt;
	&lt;cfset imageWrite(image, myfile)&gt;	

	&lt;!--- copy to ready ---&gt;
	&lt;!--- newdest is the same path as spool, so 'cheat' and switch to ready ---&gt;
	&lt;cfset newdest = replace(newdest, "/spool", "/ready")&gt;
	&lt;cffile action="move" source="#myfile#" destination="#newdest#/#getFileFromPath(myfile)#"&gt;
	
	&lt;cflog file="dirwatcher" text="Moved to #newdest#/#getFileFromPath(myfile)#"&gt;
	
&lt;/cffunction&gt;

&lt;/cfcomponent&gt;
</code>

The first thing I want you to note is the argument: cfevent. When the gateway "talks" to my CFC, it will pass one argument, CFEVENT, that contains information about the event. In particular, the "data" key contains 3 values: filename, type, and lastmodified. The filename is obviously the filename. The type refers to the type of operation, and will either by ADD, CHANGE, or DELETE. Why is this even needed when I'm in an onAdd event? Nothing prevents me from pointing both the change and add functions to the same CFC method. My code could then check the value to see exactly what is going on. 

So note then that I get the file out of the data. The rest of the code is rather simple. I check and see if the file is an image. If it isn't - I delete and leave the CFC. If it is - and if the image is too big - I resize it. 

Note the use of cflog. All of this code runs behind the scenes. No web pages are viewed in this process. Therefore I used cflog so I could monitor what was going on.

As the web developer, what's nice is that I can now just look at my "ready" folder and put the web-ready images up on the web site.

As a few last notes:

<ul>
<li>The code would be better if it handled name conflicts better. 
<li>As mentioned, "web ready" means more than just shrinking. I was just trying to keep things simple.
<li>I mentioned FTP or an AIR app, but <i>anything</i> could drop files into this folder.
</ul>

That's it. Hopefully folks find this useful!