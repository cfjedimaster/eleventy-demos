---
layout: post
title: "Best of ColdFusion 10: PDF Protector"
date: "2012-05-31T10:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2012/05/31/Best-of-ColdFusion-10-PDF-Protector
guid: 4636
---

Welcome to the second entry in the <a href="http://www.raymondcamden.com/index.cfm/2012/2/29/Best-of-Adobe-ColdFusion-10-Beta-Contest">Best of ColdFusion 10</a> contest: The PDF Protector by <a href="http://lagaffe.be/blog/my-blog/">Guust Nieuwenhuis</a>. PDF Protector is a simple application that provides a quick way to add watermarks and copyright notices to PDF files. Due to the fact that it works with file uploads, I will not be hosting an online version of this application. Please download the bits at the <a href="https://github.com/Lagaffe/PDFProtector">GitHub repo</a> to play with it. 

The first thing I noticed about this application was how well designed it was. Sure, it's just another application using Bootstrap, but Guust did a great job with it and it looks incredibly professional.

<img src="https://static.raymondcamden.com/images/screenshot.png" />

You begin by selecting a PDF and uploading. A nice progress bar is used as the file is sent to the server.


<img src="https://static.raymondcamden.com/images/screenshot1.png" />

Once uploaded, you switch to the Protect menu. You can select what options you wish to use (watermarking, copyright notice, or both) and enter a name to be used for the copyright. 

<img src="https://static.raymondcamden.com/images/screenshot2.png" />

Once you hit Protect, a very slick real-time progress updater shows you what's going on. When everything is done, it even displays a small preview of your PDF.

<img src="https://static.raymondcamden.com/images/screenshot3.png" />

What's even cooler is that the copyright notice is localized. Guust made use of a library that detects the language and supports a different copyright notice in three languages: English, French and Dutch. 

So - how did he do that? Like the <a href="http://www.raymondcamden.com/index.cfm/2012/5/24/Best-of-ColdFusion-10-HTML-Email-Utility">previous entry</a>, Guust made use of ColdFusion 10's ability to easily load in Java libraries via the javaSettings support in Application.cfc. He found a library that supported language detection and was able to easily add it into his ColdFusion code. 

And what about the real time progress updates? For those he made use of WebSockets. Specifically, "Point to Point" WebSockets which are unique to one user. Most people think of WebSockets in terms of multiple clients at once, but you can also use them just to communicate between the server and one unique client. 

Guust did make a few mistakes I'd like to call out. Not to pick on him, of course, but these are things I've seen many times in the past and I think it needs to be mentioned again.

First - his code made use of a temp directory for processing files. But his code forgot to check for the folder's existence first. Anytime your code makes use of a folder for storage it probably makes sense to check to see if it exists first - and if not - create it.

Second - his code made use of some hard-coded URLs. This meant the code broke down pretty quickly on my server. This is almost always a bad idea. Always strive for relative links where possible, and if you need to generate a URL on the fly, use CGI variables to help you construct the current location.

Finally - the other big issue he had was with WebSockets, but that wasn't his fault. We changed how data was sent to JavaScript functions between the public beta and the final release. If you played with the public beta, please keep this in mind.

Thanks Guust for an awesome entry. Remember to vote for this with your "Likes" at the ColdFusion Facebook page.