---
layout: post
title: "Using ColdFusion's DirectoryWatcher Gateway"
date: "2006-10-13T18:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/10/13/Using-ColdFusions-DirectoryWatcher-Gateway
guid: 1587
---

Last month I blogged about using ColdFusion's <a href="https://www.raymondcamden.com/2006/09/14/Using-ColdFusions-Asynchronous-Gateway-3/">Asynchronous Gateway</a>. Today I want to show another example of an Enterprise Gateway: The DirectoryWatcher. The DirectoryWatcher gateway does what you imagine it would - it watches a directory. It lets you monitor additions, changes, and deletions from a directory.

So with that in mind - let's build a simple example. I'm going to create a simple DirectoryWatcher to examine a folder that my client is using to drop images into. The DirectoryWatcher will do two things:
<!--more-->
<ol>
<li>Check the extension of the image and delete it if it isn't a list of valid extensions. I don't want all image formats for example, but just the ones that will work on the web.
<li>Check the size of the image, and if it is too big, resize it.
</ol>

Sounds simple, right? First off - how do we check the size of an image? I typically recommend Alagad's <a href="http://www.alagad.com/index.cfm/name-aic">Image Component</a>, but for this I wanted a free solution folks could download right away, so I used <a href="http://www.opensourcecf.com/imagecfc/index.cfm">Image CFC</a>.

As before - we will start off in the Event Gateway Instances page of your ColdFusion Aministrator. Create a new instance using the DirectoryWatcher type. For my instance, I created a CFC under web root called imagewatcher.cfc. For the config file I copied the example config file to web root and named it imagewatcher.cfg. I then added my gateway instance. 

Let's start by taking a look at the config file. Again - if you copy from the samples folder (C:\CFusionMX7\gateway\config\directory-watcher.cfg), you only need to edit one line. Here is the file I used:

	#
	# DirectoryWatcherGateway configuration file
	#

	# The directory you want to watch.  If you are entering a Windows path
	# either use forward slashes (C:/mydir) or escape the back slashes (C:\\mydir).
	directory=c:/apache2/htdocs/images

	# Should we watch the directory and all subdirectories too
	# Default is no.  Set to 'yes' to do the recursion.
	recurse=no

	# The interval between checks, in miliseconds
	# Default is 60 seconds
	interval=10000

	# The comma separated list of extensions to match.
	# Default is * - all files
	extensions=*

	# CFC Function for file Change events
	# Default is onChange, set to nothing if you don't want to see these events
	changeFunction=onChange

	# CFC Function for file Add events
	# Default is onAdd, set to nothing if you don't want to see these events
	addFunction=onAdd

	# CFC Function for file Delete events
	# Default is onDelete, set to nothing if you don't want to see these events
	deleteFunction=onDelete

Pay attention to the directory line. This tells the gateway what directory to monitor. I also made the gateway run a bit quicker then normal. The default interval was 60 seconds, but I changed it to 10. You may ask - why didn't I change the extensions? I want my watcher to "clean up" any non-image uploads, so by keeping the extensions setting to *, I can ensure my CFC will always run. 

So far so good? Now let's take a look at the CFC:

<pre><code class="language-markup">
&lt;cfcomponent&gt;

&lt;cfset variables.imageExtensions = "jpg,gif,png"&gt;

&lt;cffunction name="onAdd" output="false" returnType="void"&gt;
	&lt;cfargument name="CFEvent" type="struct" required="true"&gt;
	&lt;cfset var data = arguments.CFEvent.data&gt;
	&lt;cfset var filename = data.filename&gt;
	&lt;cfset var imageData = ""&gt;
	&lt;cfset var imagecfc = createObject("component", "image")&gt;
	
    &lt;cfif not listFindNoCase(variables.imageExtensions, listLast(filename, "."))&gt;
		&lt;cflog file="imagewatcher" text="Deleting #filename# since it wasn't an image."&gt;
		&lt;cffile action="delete" file="#filename#"&gt;
		&lt;cfreturn&gt;
	&lt;/cfif&gt;

	&lt;cfset imageData = imagecfc.getImageInfo("", filename)&gt;
	
	&lt;!--- anything wrong? ---&gt;
	&lt;cfif structKeyExists(imageData, "errormessage")&gt;
		&lt;cflog file="imagewatcher" text="Deleting #filename# because: #imageData.errormessage#."&gt;
		&lt;cffile action="delete" file="#filename#"&gt;
		&lt;cfreturn&gt;
	&lt;/cfif&gt;

	&lt;cflog file="imagewatcher" text="#filename# is an ok image."&gt;	
	
	&lt;!--- too big? ---&gt;
	&lt;cfif imageData.width gt 250&gt;
		&lt;cflog file="imagewatcher" text="Resizing #filename# because width was #imageData.width#."&gt;
		&lt;cfset imagecfc.scaleX("", filename, filename, 250)&gt;
	&lt;/cfif&gt;
	&lt;cfif imageData.height gt 250&gt;
		&lt;cflog file="imagewatcher" text="Resizing #filename# because height was #imageData.height#."&gt;
		&lt;cfset imagecfc.scaleY("", filename, filename, 250)&gt;
	&lt;/cfif&gt;

&lt;/cffunction&gt;

&lt;/cfcomponent&gt;
</code></pre>

I mentioned earlier that the DirectoryWatcher gateway lets you monitor both adds, edits, and deletes from a folder. In our case we only need to monitor adds. Therefore my CFC has one function - onAdd. ColdFusion will pass a structure of data to the component that includes the filename. Once I get that I check the extension. If it isn't valid, I delete it.

I then use ImageCFC to get information about the image. If anything goes wrong, ImageCFC returns an error message, so I simply look for that and log it. Also note that I delete the file as well.

Next I check the width and height. If either is bigger than 250 pixels, I scale the image. (One thing that would be nice if is ImageCFC had one simple Scale function, so I can ask it to just ensure the image wasn't bigger in any dimension.)

That's it! If you try this at home, have fun by throwing some files in the folder and just watching them change. (Be sure to use copies!) I had some large images and thought it was cool to watch their file sizes shrink as soon as the gateway picked them up. 

Of course this isn't the only thing you could have done. I could have created thumnnails instead of shrinking the original file. I could have made thumbnails and then moved the images into another folder. I could have added a watermark. You get the idea.

<a href="http://livedocs.macromedia.com/coldfusion/7/htmldocs/00001649.htm#135887">Adobe's Docs on DirectoryWatcher</a>