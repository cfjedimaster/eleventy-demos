---
layout: post
title: "ColdFusion 8.0.1 change to CFEXECUTE"
date: "2008-04-09T08:04:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/04/09/ColdFusion-801-change-to-CFEXECUTE
guid: 2762
---

I haven't seen this discussed yet, so I thought I'd bring it up (for those of you too lazy to read the release notes, and you know who you are!). One of the cool changes to ColdFusion 8.0.1 is the addition of the errorVariable and errorFile attributes to the cfexecute tag. As you can guess, this helps record any errors that may return from your external process. Before this change, there was no way to get the error. Here is a simple example:

<code>
&lt;cfexecute name="#variables.bin#" arguments="#realcommand#" variable="result" timeout="99" errorVariable="errorv"/&gt;
	
&lt;cfif len(errorv)&gt;
Handle the error...
&lt;cfelse&gt;
Handle the good result...
&lt;/cfif&gt;
</code>

Pretty simple, right? One thing to watch out for is that you cannot use both errorVariable and errorFile. So if you want programatic access to the error and you want to log it - simply use errorVariable and then follow it up with a fileWrite() to save the string.