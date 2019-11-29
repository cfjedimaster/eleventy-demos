---
layout: post
title: "Building your first Model-Glue application - The Final Battle"
date: "2006-04-10T00:04:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/04/09/Building-your-first-ModelGlue-application-The-Final-Battle
guid: 1197
---

<img src="http://ray.camdenfamily.com/images/mg.jpg" align="left" border="1" hspace="5">
Ok, pardon the dramatic title. I guess I'm just happy to be wrapping this thing up. I loved writing it, but it certainly turned out to be more work than I thought it was going to be. To be honest, I'm not terribly surprised. If there is one thing I've learned in my years as a web developer, even the simplest project can turn out to be more complex than you (or the client) can imagine. I had hoped to cover a complete application, and I did, but I definitely cut a few corners towards the end. Sorry! I do hope that those of you who haven't looked into a framework yet will give <a href="http://www.modelglue.com">Model-Glue</a> a shot with your own development developments. So let me talk a bit about what I didn't cover, and what could have been improved.

<b>Security</b>

Those of you who read my blog regularly know that I'm a bit of a security nut, specifically when it comes to the proper checking of input variables. By that I mean form, url, cookie, and any value that is not directly controlled by your code. I find myself <i>not</i> being as anal as I normally would be. I think it's a visual problem. I'm so used to seeing URL, or FORM, and immediately thinking "Have I properly checked this variable?" Because Model-Glue abstracts this into the Event object (which is a good thing, don't get me wrong), I find myself forgetting to be as secure as I normally would be. Again - this is <i>my</i> fault and something I'll have to work as I write more Model-Glue applications. I point it out as I definitely noticed a few places I could have improved my checking in the PhotoGallery application. 

<b>Error Handling</b>

Out of the box, Model-Glue will automatically fire an event, Exception, when an error occurs. One thing the PhotoGallery application needs is a nicer error handling template. Right now it just reports that an error has occurred. It would be trivial to add some simply code to email the exception to the owner. You can't assume your users will tell you about errors. (Shoot, I can tell you that I've sent <i>hundreds</i> of error reports to sites and only one in ten bother to write me back and thank me.) This is definitely <i>not</i> a Model-Glue suggestion, but a suggestion for all of your web sites. It takes about five minutes and can help you keep in touch with your web site.

<b>Logging</b>

One thing I tend to do a lot in my applications is logging. I probably would have added a lot more logging to this application if it were a real live production site. I'd log user creation, updates, new gallery, image uploading, etcetera. 

While not exactly "logging", I would have used more metadata for my database tables. I mentioned this normally whenever I was describing a particular table. By metadata I simply mean a record of when a record was created and when it was last updated. I sometimes I also record the username of the user who last modified the record. 

<b>The End</b>

Thank you to everyone who commented on the series and helped keep me on topic. Attached to entry is a zip that contains not only the source code (with a SQL Server database creation script), but also PDF copies of this entry and all the earlier articles. (To be honest, the zip will not contain this entry until about five minutes after I post - just in case your reading this entry immediately after I posted it.) If someone takes the photo gallery application and actually uses it, please let me know. Post the URL to this entry and share it with everyone else.

<b>EDITED:</b>

Emmet McGovern created an "uber" PDF that joins all the individual PDFs in one PDF. The zip still contains the individual PDFs as well. I did <b>not</b> update the file attached to this entry. In fact, I'm going to delete it. Please use the link in the right hand pod: <a href="http://www.raymondcamden.com/downloads/mgapp.zip">http://www.coldfusionjedi.com/downloads/mgapp.zip</a>