---
layout: post
title: "Automating watermarking of images with ColdFusion"
date: "2010-06-04T08:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/06/04/Automating-watermarking-of-images-with-ColdFusion
guid: 3837
---

Earlier this week Bobby H. started an <a href="http://www.houseoffusion.com/groups/cf-talk/thread.cfm/threadid:61445#334299">interesting thread</a> over on cf-talk. He was using ColdFusion image processing to automatically watermark a random image in a directory. This worked ok for him, but he had some odd caching issues. One of the things I recommended (and others) was to look at a solution that would permanently  watermark the images. ColdFusion is fast and all, but any time you work with files your going to have <i>some</i> slow down. Bobby agreed, but also wanted to keep the convenience of just being able to FTP up an image and have it automatically become one of watermarked images his could could randomly chose from. I thought I'd whip up two quick examples of how this could be done. There are other ways as well, but hopefully these examples will be useful for others.

<p/>
<!--more-->
In my first example, I'm going to create a simple script that will scan one directory for images, apply watermarks, and then copy it to a destination directory. This script can then be set up as a simple scheduled task using whatever interval makes sense. Here is the script:

<p>

<code>

&lt;cfset depotfolder = expandPath("./depot")&gt;
&lt;cfset processedfolder = expandPath("./images")&gt;
&lt;cfset watermark = imageRead(expandPath("./watermark.png"))&gt;
&lt;cfset watermarkinfo = imageInfo(watermark)&gt;

&lt;!--- First, scan depot for files ---&gt;
&lt;cfdirectory directory="#depotfolder#" name="files"&gt;

&lt;cfloop query="files"&gt;
	&lt;cfset theFile = directory & "/" & name&gt;
	&lt;!--- Is it an image? ---&gt;
	&lt;cfif isImageFile(theFile)&gt;
		&lt;cfoutput&gt;
		#theFile# is an image, will be watermarked.&lt;br/&gt;
		&lt;/cfoutput&gt;	
		&lt;cfset imgFile = imageRead(theFile)&gt;
		&lt;cfset imgInfo = imageInfo(imgFile)&gt;
		&lt;!--- paste in the watermark ---&gt;
		&lt;cfset imagepaste(imgFile, watermark, imgInfo.width-watermarkinfo.width, imgInfo.height-watermarkinfo.height)&gt;
		&lt;!--- save it and delete original ---&gt;
		&lt;cfset imageWrite(imgFile, processedfolder & "/" & name, true)&gt;
		&lt;cffile action="delete" file="#theFile#"&gt;		
	&lt;cfelse&gt;
		&lt;cfoutput&gt;
		#theFile# is not an image. Deleting.&lt;br/&gt;
		&lt;/cfoutput&gt;
		&lt;cffile action="delete" file="#theFile#"&gt;
	&lt;/cfif&gt;
&lt;/cfloop&gt;
</code>

<p>

Not much to it, right? I begin with a few simple definitions: my depot folder (where images were FTPed or copied up), the destination folder, and the actual watermark. I get all the files from the depot, and for each, I check to see if it is an image. If so, we simply use the imagePaste function to copy our watermark over. I do a small bit of math to place the watermark in the lower right hand corner. Here is an example:

<p>

<img src="https://static.raymondcamden.com/images/meatwork1.jpg" title="My what a handsome fellow..." />

<p>

Pretty simple, right? Obviously the output statements were just for testing. I won't see them when this is run as a scheduled task, but I can log the results so it might still be useful. This works ok, but I also thought it might be nice to create a version that makes use of an Event Gateway. Event Gateways are one of those ColdFusion features that really didn't take off, and that's kind of sad. They are pretty darn powerful  and allow your server to do things it normally could not. One of the sample gateways that ship with ColdFusion is the <a href="http://help.adobe.com/en_US/ColdFusion/9.0/Developing/WSc3ff6d0ea77859461172e0811cbec22c24-77f7.html">directory watcher</a>. Now I call that a "sample" gateway but don't take that to mean it is just there to demonstrate the feature. This gateway is very useful and could be used in any production site. The directory watcher, as you may guess, monitors a directory for changes. So anytime a file is added, edited, or deleted, ColdFusion can then run a CFC to process those changes. Our need here (auto watermarking images) is a perfect example of that. I began by going to my ColdFusion Administrator and creating a new instance of the gateway.

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/autowatermarker1.png" title="CF Admin settings for EG" />

<p>

I've got both an INI file and a CFC file declared. The INI file, at minimum, must specify the folder to watch. I specified an interval as well so it would run a bit quicker then the usual 60 seconds:

<p>

<code>
directory=c:/webroot/autowatermark/depot
interval=30000
</code>

<p>

The component then is simply our last script rewritten in CFC format (and script format). I've put the code within a method called onAdd, which is the default method called when a file is added to a directory. Outside of that though nothing really else has changed:

<p>

<code>
component {

	public void function onAdd(required struct cfevent) {
		//for debugging
		writelog(file='application',text='autowatermarker #serializejson(arguments.cfevent.data)#');
		var theFile = arguments.cfevent.data.filename;
		
		var processedfolder = expandPath("./images");

		if(isImageFile(theFile)) {
			imgFile = imageRead(theFile);
			imgInfo = imageInfo(imgFile);
			
			var watermark = imageRead(expandPath("./watermark.png"));
			var watermarkinfo = imageInfo(watermark);
			imagepaste(imgFile, watermark, imgInfo.width-watermarkinfo.width, imgInfo.height-watermarkinfo.height);
			imageWrite(imgFile, processedfolder & "/" & getFileFromPath(theFile), true);
			fileDelete(theFile);
		} else {
			fileDelete(theFile);
		}

	}

}
</code>

<p>

And that's it. Once my event gateway was running, I could drag any number of files into the folder and just sit back and wait. Within 30 seconds they were all "noticed" by the event gateway, watermarked, and copied over. Like magic. :)

<p>

Ok, so that's it really, but I want to leave you with a few issues I ran into when playing with this gateway. This really isn't on topic to the original need, but these things tripped me up so I figured I'd share.

<p>

First - I had a lot of issues getting my ini file set up right. I noticed when I started my gateway I kept getting a failed response. Unfortunately, the CF Admin refused to tell me <i>why</i> the gateway failed. Turns out the gateway logged to a file called watcher.log. This was available/viewable via the admin. In there I saw that I had a typo in the folder name. Not quite as obvious was that I also needed to switch from \ format to / format for the paths. This is something I recommend in CF code anyway as it is portable across operating systems. 

<p>

Secondly - the docs seems to imply that if you only care about files added, then you can forget about writing the delete/update functions. However, when my CFC code deleted the images while processing, the gateway tried to run the delete handler. I never saw an error, but one was logged. This is harmless - but if you are anal retentive like me, you will probably want to create shell functions just to ensure nothing is logged.