---
layout: post
title: "Ask a Jedi: Getting the current directory"
date: "2008-05-08T11:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/05/08/Ask-a-Jedi-Getting-the-current-directory
guid: 2814
---

I sometimes like to start the morning off with an easy question. Makes me feel all smarty-pants and stuff. Here is a quickie from Patrick that may actually be news to some folks, so hopefully it will be easy for me - helpful for others.

<blockquote>
<p>
Hi Ray, me again  I have a, maybe silly, question about getting the current
directory. I have to get the current directory in which a template resides. But
I don't want the full path.

If i run www.example.com/folder/index.cfm i
should get "folder" but not path/to/somewhere/in/the/system/folder. I tried with
expandpath("./") and getDirectoryFrom Path(ExpandPath(CGI.SCRIPT_NAME)) but this
always returns a full path. Any built in function i forgot to try? Thanks for a
hint!
</p>
</blockquote>
<!--more-->
This is two issues here. How do I get the directory from a full path, and how do I get the current directory. The first one is simple. The <a href="http://www.cfquickdocs.com/cf8/?getDoc=GetDirectoryFromPath">getDirectoryFromPath()</a> function will take any full path and return just the directory. There is also a corresponding <a href="http://www.cfquickdocs.com/cf8/?getDoc=GetFileFromPathh">getFileFromPath()</a> function.

The second issue is slightly more complicated. ColdFusion has two functions related to getting the current template. They are <a href="http://www.cfquickdocs.com/cf8/?getDoc=GetBaseTemplatePath">getBaseTemplatePath()</a> and <a href="http://www.cfquickdocs.com/cf8/?getDoc=GetCurrentTemplatePath">getCurrentTemplatePath()</a>. I tend to forget which does what, but consider this first example:

<code>
&lt;cffunction name="onRequestStart" returnType="boolean" output="true"&gt;
	&lt;cfargument name="thePage" type="string" required="true"&gt;
	&lt;cfoutput&gt;
	getCurrentTemplatePath()=#getCurrentTemplatePath()#&lt;br&gt;
	getBaseTemplatePath()=#getBaseTemplatePath()#&lt;br&gt;
	&lt;p&gt;
	&lt;/cfoutput&gt;		
	&lt;cfreturn true&gt;
&lt;/cffunction&gt;
</code>

When I run test4.cfm, I get:

getCurrentTemplatePath()=/Users/ray/Documents/Web Sites/webroot/Application.cfc<br>
getBaseTemplatePath()=/Users/ray/Documents/Web Sites/webroot/test4.cfm

The getCurrentTemplatePath refers to the actual file being run right now, which is Application.cfc, and getBaseTemplatePath returns to the main file being executed.

If that sounds a bit unclear, forgive me. As I said, I <i>always</i> forget the difference (one reason I'll fail the CF8 cert probably). In general you are going to want to use getCurrentTemplatePath if you want to consider the file where the actual function is being run.