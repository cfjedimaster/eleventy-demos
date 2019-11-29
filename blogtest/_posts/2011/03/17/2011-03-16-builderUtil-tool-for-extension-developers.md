---
layout: post
title: "builderUtil - tool for extension developers"
date: "2011-03-17T10:03:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2011/03/17/builderUtil-tool-for-extension-developers
guid: 4161
---

I've made no secret of my love for ColdFusion Builder extensions. To me - this is the single most important feature of ColdFusion Builder. Version 2, currently in <a href="http://labs.adobe.com/technologies/coldfusionbuilder2/">public beta</a>, adds additional features to extension developers, including support for views (woot!) as well as other miscellaneous features. I've developed a few public extensions myself (you can see mine and many others on the <a href="http://www.riaforge.org/index.cfm?event=page.category&id=14">RIAForge category</a> page) and have developed various libraries/utilities to help my development. I finally decided to formalize this with a library I'm calling <a href="http://builderhelper.riaforge.org/">builderHelper</a>.
<!--more-->
<p>

builderHelper is a simple CFC that abstracts out a lot of the common tasks I've run into when developing extensions. To work with it, you simply initialize it with your IDE XML info:

<p>

<code>
&lt;cfset helper = new builderHelper(form.ideeventinfo)&gt;
</code>

<p>

Once initialized, you get a whole set of helpful utility functions. For example, imagine you have an extension that works in both the editor view as well as the Navigator. You can quickly check to see which mode is being run:

<p>

<code>
&lt;cfif helper.getRunType() is "projectview"&gt;
</code>

<p>

If the user did use the Navigator (labelled "projectview"), you may need to know if they selected a file or folder, and which file or folder they selected.

<p>

<code>
&lt;cfset selection = helper.getSelectedResource()&gt;
&lt;cfif selection.type is "folder"&gt;
	&lt;cfset files = directoryList(selection.path, true, "path")&gt;
&lt;cfelse&gt;
	&lt;cfset files[1] = selection.path&gt;
&lt;/cfif&gt;
</code>

<p>

Or perhaps they used the editor and you need to know the selection:

<p>

<code>
&lt;cfset selection = helper.getSelectedText()&gt;
&lt;!--- for now, we do the entire file, period ---&gt;
&lt;cfset contents = fileRead(selection.path)&gt;
</code>

<p>

Helpful, right? One of the new features in ColdFusion Builder 2 is a callback url. This callback url is - well - a url (duh) that your extension can use to send special commands to. These commands allow you to do things with Builder itself. Need to open a file? You use the callback url. Need to refresh a folder because your extension changed crap? Use the callback url. Want to know what tables exists in a datasource? Ditto.

<p>

This system has a simple XML inteface. So for example, to refresh a folder you send an XML packet containing the folder. My builderUtil makes this even easier though. Consider:

<p>

<code>
&lt;cfset helper.refreshFile(f)&gt;
</code>

<p>

As a full example, I've included a zip to this blog entry for an extension I wrote called "Fix Smart Quotes." I'm doing tech editing on a jQuery Mobile book and some of the code samples include Smart Quotes. (If there was ever anything more misnamed before than I don't know what it is...) I can fix those easily enough by selecting a smart quote, hitting ctrl-c, going to search, doing a replace, etc, and it takes me all of 10 seconds, but I thought - why not use an extension and do it even quicker. The code below is the full handler for this extension. Notice that I never have to deal with XML once. All the grunt work is done via the helper.

<p>

<code>


&lt;cfset helper = new builderHelper(form.ideeventinfo)&gt;

&lt;cfif helper.getRunType() is "projectview"&gt;
	&lt;cfset selection = helper.getSelectedResource()&gt;
	&lt;cfif selection.type is "folder"&gt;
		&lt;cfset files = directoryList(selection.path, true, "path")&gt;
	&lt;cfelse&gt;
		&lt;cfset files[1] = selection.path&gt;
	&lt;/cfif&gt;
	
	&lt;cfloop index="f" array="#files#"&gt;
		&lt;cfset contents = fileRead(f)&gt;
		&lt;cfset contents = replace(contents, chr(226) & chr(128) & chr(157), """", "all")&gt;
		&lt;cfset fileWrite(f, contents)&gt;
		&lt;cfset helper.refreshFile(f)&gt;
	&lt;/cfloop&gt;
	
	&lt;cfoutput&gt;Processed #arrayLen(files)# file(s).&lt;/cfoutput&gt;
	
&lt;cfelse&gt;
	&lt;cfset selection = helper.getSelectedText()&gt;
	&lt;!--- for now, we do the entire file, period ---&gt;
	&lt;cfset contents = fileRead(selection.path)&gt;
	&lt;cfset contents = replace(contents, chr(226) & chr(128) & chr(157), """", "all")&gt;
	&lt;cfset fileWrite(selection.path, contents)&gt;
	&lt;cfset helper.refreshFile(selection.path)&gt;
&lt;/cfif&gt;
</code>

<p>

You can download this extension below. I probably will not put this up on RIAForge as it's pretty limited. The extension includes <a href="http://builderhelper.riaforge.org/">builderHelper</a> itself obviously so you don't need to download it from RIAForge.<p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2009%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Ffsq%{% endraw %}2Ezip'>Download attached file.</a></p>