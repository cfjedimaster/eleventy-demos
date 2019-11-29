---
layout: post
title: "Trusted Cache and the VFS"
date: "2010-10-14T13:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/10/14/Trusted-Cache-and-the-VFS
guid: 3970
---

So a few days ago I wrote a <a href="http://www.raymondcamden.com/index.cfm/2010/10/13/Why-arent-you-using-Trusted-Cache">quick blog entry</a> asking why more people weren't making use of Trusted Cache. While not a silver bullet, it can sometimes be a quick way to improve your site performance. A reader, johans, <a href="http://www.coldfusionjedi.com/index.cfm/2010/10/13/Why-arent-you-using-Trusted-Cache#c8CB03A28-B62A-C0C4-DE3D4EC8ABD734D1">commented</a> asking what the impact would be on files stored in the virtual file system (VFS). I assumed it would act the same - ie, any changes would not be picked up. Today I wrote a quick template to see if I was right:
<!--more-->
<p>

<code>
&lt;cfset num = randRange(1,9999)&gt;
&lt;cfset content = "&lt;cfoutput&gt;Your num is #num#&lt;/cfoutput&gt;"&gt;
&lt;cfset fileName = "ram://foo.cfm"&gt;
&lt;cffile action="write" file="#fileName#" output="#content#"&gt;

&lt;cfoutput&gt;My number is #num#&lt;p/&gt;&lt;/cfoutput&gt;

&lt;!--- note, RAM mapping was made in cf admin ---&gt;
&lt;cfinclude template="/RAM/foo.cfm"&gt;
</code>

<p>

When run, this code creates a random number and writes the CFML to display it to a file in the vfs. Yes, the code is dumb. There is no need to use cfoutput in this case. But I wanted to ensure I had some dynamic code in the VFS. After writing it, we output the number and include the template. Don't forget you can't cfinclude a file via a full physical path. I made a mapping in the CF Admin for my VFS called RAM and included it like that. 

<p>

Before turning on trusted cache, I ran this template a few times and saw what I expected - the same number in both outputs. After turning on the trusted cache, the number in the VFS "froze" since ColdFusion wasn't picking up on the changed CFM. (Which is expected - this isn't a bug.) To be clear, ColdFusion is still writing the file out and changing it. That part works fine. It's just the compiled version of the CFM that is being cached and reused. Clearing the trusted cache immediately brought out the new number. 

<p>

So what if you want to make use of the VFS like this and make use of the trusted cache? Well if we assume you aren't writing to a static file on every request, you can simply use the Admin API to clear it. If you do need something for every request you could consider unique file names. Just be sure to "clean up" or your VFS will fill up eventually.