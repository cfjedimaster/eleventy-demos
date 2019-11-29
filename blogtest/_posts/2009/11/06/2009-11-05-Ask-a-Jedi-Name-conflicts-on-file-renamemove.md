---
layout: post
title: "Ask a Jedi: Name conflicts on file rename/move"
date: "2009-11-06T09:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/11/06/Ask-a-Jedi-Name-conflicts-on-file-renamemove
guid: 3593
---

Matt asks:

<blockquote>
My question is - is there a simple way to check for nameconflict on cffile action=rename like there ins on cffile action=upload. I have an application where I want to rename whatever they upload to match their order number.  It's fine if they just upload one image, but not cool if there is more than one.  I'm just checking to see if there is an easier way than some kind of fileexists, then add a 1 to the filename before the rename.
</blockquote>

Unfortunately there isn't a simpler way, not that I'm aware of. Your solution is one I used myself very recently. Here is a live working example of code that is run <i>after</i> I used cffile/upload and did security checks. That portion is done and now I just need to copy it to the storage directory.
<!--more-->
<code>
&lt;cflock type="exclusive" name="#variables.lockname#" timeout="30"&gt;

	&lt;cfif not directoryExists(folder)&gt;
		&lt;cflog file="picard" text="created a file store for #folder#"&gt;
		&lt;cfdirectory action="create" directory="#folder#"&gt;
	&lt;/cfif&gt;

	&lt;!--- before we move our file out of ram and onto disk, need to look for files w/ same name. If so, 
	we prepend N_ in front, going up forever basically ---&gt;
	&lt;cfif fileExists(folder & "/" & getFileFromPath(newFile))&gt;
		&lt;cfset var keepGoing = true&gt;
		&lt;cfset var counter = 1&gt;
		&lt;cfloop condition="keepGoing"&gt;
			&lt;cfset uniqueFileName = folder & "/" & counter & "_" & getFileFromPath(newFile)&gt;
			&lt;cfif fileExists(uniqueFileName)&gt;
				&lt;cfset counter++&gt;
			&lt;cfelse&gt;
				&lt;cfset dest = uniqueFileName&gt;
				&lt;cfset keepGoing = false&gt;
			&lt;/cfif&gt;
		&lt;/cfloop&gt;
	&lt;cfelse&gt;
		&lt;cfset dest = folder & "/" & getFileFromPath(newFile)&gt;
	&lt;/cfif&gt;

	&lt;cffile action="move" source="#newFile#" destination="#dest#"&gt;		

&lt;/cflock&gt;	
</code>

So a few notes on this code block. It's written for ColdFusion 9 which is why you use var keywords littered throughout. To get this to work in a CF8 CFC you would simply ensure you do the vars at the beginning. 

The lock is critical here. In this case, all file moves are done via one FileService component. So the exclusive lock here ensures that only one move is done at a time. I did my best to minimize the size of the lock. It's only done after the upload processing and security checks. This is also an big <b>hole</b> in the logic. It assumes only ColdFusion has access to the folder. Obviously ColdFusion has no way to <i>really</i> lock a folder by itself. Some other process could drop a file in the folder at the same time. 

I assume the main logic of this is pretty simple. I use a conditional loop that increments a counter which is prepended to the file name. In theory this should run pretty darn quickly. Outside of this block I've used logic to create date based folders so that ensures I don't end up with one folder that contains a few thousand files. 

Lastly - there is another nice way to handle this as well. Use UUID file names. You can grab the extension of the original file and simply use the UUID as the filename. So foo.jpg becomes #createUUID()#.jpg. This will create an ugly, but unique file name, in far fewer lines of code. I'd use this if you don't care about the original file name. A good example of this would be for things like images.