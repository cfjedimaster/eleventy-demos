---
layout: post
title: "ColdFusion Quickie - Moving a file to a day-based folder"
date: "2009-06-10T14:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/06/10/ColdFusion-Quickie-Moving-a-file-to-a-daybased-folder
guid: 3389
---

Here is a quick ColdFusion tip I hope people find useful. Let's say you have a site where users upload files. You may store all these files in one main assets folder. Doing so though could lead to a very large folder, and after time could actually impact performance. What about creating dynamic folders based on the date? So if a user uploads a file today, it would be moved to assetroot/2009/6/10. Here is a quick example of that.
<!--more-->
First, our code needs to determine what the folder name for the current date should be. Normally I would begin with an "assets" folder, but for this example, I'll consider the root folder to be the same folder as the CFM:

<code>
&lt;cfset folder = getDirectoryFromPath(getCurrentTemplatePath())&gt;
</code>

To create the date based folder, I'll use the format described above - year/month/day.

<code>
&lt;cfset newFolder = folder & "/" & year(now()) & "/" & month(now()) & "/" & day(now())&gt;
</code>

Remember from my <a href="http://www.raymondcamden.com/page.cfm/Cross-Operating-System-ColdFusion-Development-Guid">Cross Operating System Guide</a> that the forward slash works perfectly across all operating systems. No need to worry about \ versus /. 

Now we need to see if this folder already exists. If multiple people are uploading files, you only need to create the folder once:

<code>
&lt;cfif not directoryExists(newFolder)&gt;
	&lt;cfdirectory action="create" directory="#newFolder#"&gt;
&lt;/cfif&gt;
</code>

What's nice is - even if the year folder, or month folder, doesn't exist, ColdFusion will create them for you. If the year and month folders exist, ColdFusion will just create the day folder. 

Finally, you just need to move the file. If you were using cffile to process the upload, you could use the destination attribute. In my sample code, I just used a hard coded file.

<code>
&lt;cfset fileToMove = expandPath("./missing.jpg")&gt;

&lt;cfset fileMove(fileToMove,newFolder & "/" & getFileFromPath(fileToMove))&gt;
</code>

I pointed to a file in the same folder, missing.jpg, and used the fileMove function. Note how I get the file from the complete source path and use the newFolder attribute. 

Here is the complete template (with a few additional outputs for testing):

<code>
&lt;cfset folder = getDirectoryFromPath(getCurrentTemplatePath())&gt;

&lt;cfset newFolder = folder & "/" & year(now()) & "/" & month(now()) & "/p" & day(now())&gt;
&lt;cfoutput&gt;new folder is #newFolder#&lt;br/&gt;&lt;/cfoutput&gt;

&lt;cfif not directoryExists(newFolder)&gt;
	nope, doesn't exist&lt;br/&gt;
	&lt;cfdirectory action="create" directory="#newFolder#"&gt;
&lt;/cfif&gt;

&lt;cfset fileToMove = expandPath("./missing.jpg")&gt;

&lt;cfset fileMove(fileToMove,newFolder & "/" & getFileFromPath(fileToMove))&gt;
</code>