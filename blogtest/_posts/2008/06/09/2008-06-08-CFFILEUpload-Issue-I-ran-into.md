---
layout: post
title: "CFFILE/Upload Issue I ran into"
date: "2008-06-09T10:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/06/09/CFFILEUpload-Issue-I-ran-into
guid: 2869
---

A few days ago I was debugging an issue with <a href="http://canvas.riaforge.org">Canvas</a> when I ran across an interesting issue with CFFILE, action=upload. The user reported that the files he uploaded via the wiki were not visible. With some debugging, I found that files named foo.whatever ended up being upload to a folder with the same name as the filename, so instead of having the file end up here:
<!--more-->
<code>
uploadsfolder/foo.whatever
</code>

They ended up here:

<code>
uploadsfolder/foo.whatever/foo.whatever
</code>

After an hour or so of debugging, I finally noticed something. The code to handle the uploads was specifying a path <i>and</i> filename for the destination. The docs for cffile/action=upload say that destination has to be directory. But apparently this has worked for quite sometime, <b>except</b> in ColdFusion 7.0.1 where the behavior was broken. This <a href="http://kb.adobe.com/selfservice/viewContent.do?externalId=f97044e&sliceId=1">hotfix</a> was released just to correct this issue. 

This is probably just one more little facet of CFML I've forgotten, although I will say the docs should be updated to make this more clear.