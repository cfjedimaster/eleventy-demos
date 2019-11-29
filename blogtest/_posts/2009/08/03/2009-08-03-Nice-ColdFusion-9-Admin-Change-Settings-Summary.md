---
layout: post
title: "Nice ColdFusion 9 Admin Change - Settings Summary"
date: "2009-08-03T17:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/08/03/Nice-ColdFusion-9-Admin-Change-Settings-Summary
guid: 3472
---

Earlier today I twittered about the Settings Summary page of the ColdFusion Administrator. I'm working on a general ColdFusion Admin guide for a client (set this normally, turn that off normally, etc) and I mentioned how this tool is a handy way to quickly view all your settings at once. Ryan Hartwich replied that in ColdFusion 9, they added a new "Save as PDF" option:

<img src="https://static.raymondcamden.com/images/Picture 178.png" />

It works as expected, with one minor nit. It saves the file as settings.cfm, not settings.pdf. Most likely they simply wrapped the output in cfdocument and left it at that. One simple fix for that (in case folks are curious), is to place this right above the cfdocument: 

<code>
&lt;cfheader name="Content-Disposition" value="inline; filename=print.pdf"&gt;
</code>

Obviously the filename can be changed to suit. 

I filed a bug report on the download issue. I'm <i>really</i> digging the <a href="http://cfbugs.adobe.com/cfbugreport/flexbugui/cfbugtracker/main.html#">public bug tracker</a>.