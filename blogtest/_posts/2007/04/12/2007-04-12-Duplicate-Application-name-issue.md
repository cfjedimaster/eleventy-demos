---
layout: post
title: "Duplicate Application name issue"
date: "2007-04-12T12:04:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/04/12/Duplicate-Application-name-issue
guid: 1955
---

A friend of mine was tearing his hair out trying to solve a problem that occurred randomly. For some reason he would get an error about a certain application variable not existing. He showed me the code - and we both agreed that this was simply not possible. The variable was clearly being defined in the application.
<!--more-->
The error would normally occur after some amount of down time. If he started the application himself he could never recreate the error. I had him turn down the application timeout to 5 minutes, let the application time out, and we still couldn't recreate the issue.

Turns out the problem was far simpler. He had another application on the site with the same name! The reason the error would occur randomly and after a period of inactivity was that sometimes the other application would load up before the one that was throwing errors.

So this brings up the question - how do you prevent this? On a box that you control this is relatively simple. You could do a global search and replace over all the folders that contain code. Unfortunately, this will only be easily done for cfapplication tags. You would also need to search for this.name but only inside Application.cfc files. It <i>is</i> possible though. (Do I smell a new Friday Puzzler?) On a shared server though this is impossible, and even if you did do a scan, some other client can easily upload code after you scan. (To be clear, this is a problem on a shared server where you share one ColdFusion instance.)

You can help prevent this by using unique application names. Since the only purpose of the application name is to give the code a unique memory space on the server, you don't have to make a 'friendly' name at all. You could use a long name - just be sure the name is less than or equal to 64 characters in length. As an example, consider this code from BlogCFC. It actually uses a "base" name and also adds part of the file path to it. I did this for folks running BlogCFC on shared servers:

<code>
&lt;cfset prefix = hash(getCurrentTemplatePath())&gt;
&lt;cfset prefix = reReplace(prefix, "[^a-zA-Z]","","all")&gt;
&lt;cfset prefix = right(prefix, 64 - len("_blog_#blogname#"))&gt;
&lt;cfapplication name="#prefix#_blog_#blogname#" sessionManagement="true" loginStorage="session"&gt;
</code>