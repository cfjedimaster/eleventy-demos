---
layout: post
title: "Ask a Jedi: Getting file permissions"
date: "2008-11-30T11:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/11/30/Ask-a-Jedi-Getting-file-permissions
guid: 3126
---

Jibu asks:

<blockquote>
<p>
I am using Linux(Railo) as my server and I want to show the files permission(mode) in a directory as -rwxr-xr-x (eq.). How can I show this?
</p>
<p>
We can set file permission using FileSetAccessMode() but how to get this permission like "-rwxr-xr-x" this to show in a page ?
</p>
</blockquote>
<!--more-->
So I don't know if this is the best answer, but it's what I was able to glean from Google this morning. Java 6 does have some functions that can tell you if the <i>current application</i> can read, write, and execute a file. (See the <a href="http://java.sun.com/javase/6/docs/api/java/io/File.html">File</a> doc.) But as far as I can tell, this only applies to the user that the application is running as.

I found more than a few search results though that mentioned using a system specific command. In ColdFusion that means cfexecute. Consider this sample:

<code>
&lt;cfexecute name="ls" arguments="-l /Users/ray/lhp.txt" variable="result" timeout="99" /&gt;
</code>

This returns:

<blockquote>
<p>
-rw-r--r--  1 ray  ray  6386 May 12  2007 /Users/ray/lhp.txt
</p>
</blockquote>

This is simple enough to parse with a string function:

<code>
&lt;cfoutput&gt;#listFirst(result, chr(32))#&lt;/cfoutput&gt;
</code>

By treating the result as a list, I can then end up with just the permissions. Obviously this won't run on Windows, but you get the idea.