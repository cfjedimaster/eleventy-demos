---
layout: post
title: "How to do a \"Your download will begin...\" type page."
date: "2006-12-05T11:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/12/05/How-to-do-a-Your-download-will-begin-type-page
guid: 1694
---

A user recently asked me how I did the, "Your download will begin..." page at <a href="http://www.riaforge.org">RIAForge</a>. For an example, click the big download button at the <a href="http://galleon.riaforge.org">Galleon project page</a>. (Note it was updated this morning!)
<!--more-->
First off - forcing a download is easy enough. You can use a cfheader/cfcontent combo like so:

<code>
&lt;cfheader name="Content-disposition" value="attachment;filename=""#thefile#"""&gt;		
&lt;cfcontent file="#downloadpath#" type="application/unknown"&gt;	</code>

For RIAForge I used the unknown application type, but you can easily sniff the extension and use the proper mime type. (Something I need to do to RIAForge.) But how do I do this on a "Your download will begin..." type page? I simply link to a page and then add logic to either display the message 	or start the download. Here is the exact code RIAForge uses:

<code>
&lt;cfset project = viewState.getValue("project")&gt;

&lt;cfset viewState.setValue("title", "#project.getName()# Download")&gt;

&lt;cfif not structKeyExists(url, "doit")&gt;

	&lt;cfheader name="refresh" value="1; url=#viewstate.getValue("myself")#action.download&doit=true"&gt;

	&lt;cfoutput&gt;
	&lt;p /&gt;
	&lt;div class="subhead"&gt;#viewState.getValue("title")#&lt;/div&gt;
	&lt;div class="copy"&gt;
	&lt;p&gt;
	Your download will begin momentarily.
	&lt;/p&gt; 
	&lt;/div&gt;
	&lt;/cfoutput&gt;

&lt;cfelse&gt;

	&lt;cfif project.getExternalDownload() neq ""&gt;
		&lt;cflocation url="#project.getExternalDownload()#" addToken="false"&gt;
	&lt;cfelse&gt;
		&lt;cfset downloadpath = viewState.getValue("downloadpath")&gt;
		&lt;cfset thefile = getFileFromPath(downloadpath)&gt;
	&lt;/cfif&gt;
	
	&lt;cfheader name="Content-disposition" value="attachment;filename=""#thefile#"""&gt;		
	&lt;cfcontent file="#downloadpath#" type="application/unknown"&gt;		

&lt;/cfif&gt;
</code>

I basically use a URL hook "doit" to determine if I'm showing the page or starting the download. Now you may ask - why in the heck do this anyway? Everyone say, Thank you IE! Along with the recent EOLAS issue, IE also changed how they handle what they consider to be automatic file downloads. If a page tries to download a file and you had not linked directly to the file, you will get a warning. If you tell IE to accept the download then it reloads the page. So if you were on a <i>different</i> page, you need to reclick the download link. Because I send the user to a page just for the download, it makes the process a bit less painless. They still have a reload, but they don't need to click on a download link.

One more quick note. This process was also helpful for RIAForge as it lets project owners point to external URLs for download information. With this download page I can handle updating the download stats for a project even when RIAForge doesn't actually host the zip.

<b>Edited to fix an issue with files that have spaces in them. Thanks Rob Gonda.</b>