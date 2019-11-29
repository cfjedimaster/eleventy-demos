---
layout: post
title: "ColdFusion 8: Admin API and Trusted Cache"
date: "2007-06-07T08:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/06/07/ColdFusion-8-Admin-API-and-Trusted-Cache
guid: 2100
---

Along with cool tags and functions added in ColdFusion 8, there have also been some neat updates to the Admin API. If you don't know what the Admin API is - it is a set of CFCs that give you programmatic access to various administrator type functions. One example is being able to list and create datasources. Today I want to show one of the new features in the Admin API under ColdFusion 8 - being able to clear individual files from the trusted cache.

<more />

One of the caching settings you can use within ColdFusion is the trusted cache. By turning this on, ColdFusion will parse your file one time, and will never parse it again. If you change the file, even to fix something small like a typo, you have to login to the Admin and hit the "Clear Template Cache" button.

Well the Admin API lets us do this directly from code. This existed even back in ColdFusion 7. But the problem is - when you just fix one file, why do you have to clear the entire cache?

ColdFusion 8 updates the API so you can pass in a list of files. If you do, only those files are updated. This can be pretty darn useful. Here is a sample application I built that demonstrates this new API:

<code>

&lt;cfoutput&gt;
&lt;form action="#cgi.script_name#" method="post"&gt;
Enter file name or directory: &lt;input type="text" name="cachefile"&gt; &lt;input type="submit" value="Clear File/Folder from Template Cache"&gt;
&lt;/form&gt;
&lt;/cfoutput&gt;

&lt;cfif structKeyExists(form, "cachefile") and len(trim(form.cachefile))&gt;
	&lt;cfset form.cachefile = trim(form.cachefile)&gt;
	&lt;!--- detect folder versus file ---&gt;
	&lt;cfset filelist = ""&gt;
	&lt;cfif directoryExists(form.cachefile)&gt;
		&lt;cfdirectory directory="#form.cachefile#" name="files"&gt;
		&lt;cfloop query="files"&gt;
			&lt;cfset filelist = listAppend(filelist, form.cachefile & "/" & name)&gt;
		&lt;/cfloop&gt;
	&lt;cfelseif fileExists(form.cachefile)&gt;
		&lt;cfset filelist = form.cachefile&gt;
	&lt;cfelse&gt;
		&lt;cfoutput&gt;
		&lt;p&gt;
		&lt;b&gt;You entered a file or folder (#form.cachefile#) that did not exist.&lt;/b&gt;
		&lt;/p&gt;
		&lt;/cfoutput&gt;
		&lt;cfabort&gt;
	&lt;/cfif&gt;
	
	&lt;cfoutput&gt;
	&lt;p&gt;
	Going to clear the following file(s) from the template cache:&lt;br /&gt;
	&lt;cfdump var="#listToArray(filelist)#"&gt;
	&lt;/p&gt;
	&lt;/cfoutput&gt;

	&lt;cfinvoke component="cfide.adminapi.administrator" method="login" adminPassword="admin"&gt;
	&lt;cfinvoke component="cfide.adminapi.runtime" method="clearTrustedCache" templateList="#fileList#"&gt;
&lt;/cfif&gt;
</code>

It begins with a simple form asking you to name a file or a directory. One submitted, I check and see if you entered a folder. If you did, I do a cfdirectory to get the files in the folder. Once I have the files ready, I simply login to the Admin (note that I have hard coded the password here) and then run the clearTrustedCache function.

Pretty simple, right? There are a few updates I could do to this. I could make the cfdirectory tag recurse. I could also  ask you for the ColdFusion admin password instead of hard coding it. I could even use Ben Forta's cool <a href="http://www.forta.com/blog/index.cfm/2007/6/5/ColdFusion-Ajax-Tutorial-5-File-System-Browsing-With-The-Tree-Control">file browser</a>. 

If I were to package up this as something you could include in the ColdFusion admin (like <a href="http://spoolmail.riaforge.org">SpoolMail</a>), would folks use it?