---
layout: post
title: "Adobe's Active Content Fix"
date: "2006-04-25T10:04:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2006/04/25/Adobes-Active-Content-Fix
guid: 1233
---

So, I don't know about you, but since I don't use the <a href="http://www.microsoft.com/windows/ie/default.mspx">devils' browser</a>, I really haven't been too concerned about the upcoming (now here) EOLAS update which impacts Flash. When the update was rolled out and my project manager noticed the change on a client site, it was time to correct it. 

So I took a look at Adobe's <a href="http://www.macromedia.com/devnet/activecontent/">Active Content Developer Center</a> and was surprised at how simple their fix was. Luckily my company's CMS system has a custom tag to spit out the code for Flash SWFs. All I had to do was modify that. The code change in question could not be simpler, I mean, look at this:

<code>
&lt;script&gt;
AC_FL_RunContent(
	'movie', 'filenameWithOutSWF',
	'width','48',
	'height','1516',
	'id','myidiscoolerthanyourid');
&lt;/script&gt;
</code>

Shoot, even if this IE change had <i>not</i> happened, this would have been a useful little script to get Flash onto a page. 

I just wanted to make sure people knew about this fix. I was actually surprised by how fast I was able to fix the client's code with this. 

One little note. I wasn't sure how to handle FlashVars. I thought they were special and the JavaScript code that Adobe provided didn't have a way to handle them. Duh. FlashVars are just one more property. Here is a modified version of the code above.

<code>
&lt;script&gt;
AC_FL_RunContent(
	'movie', 'filenameWithOutSWF',
	'width','48',
	'height','1516',
	'id','myidiscoolerthanyourid',
	'FlashVars','msg=DharmaWasHere&station=Swan'
);
&lt;/script&gt;
</code>

Truly simple and elegant solution. Thanks Adobe!