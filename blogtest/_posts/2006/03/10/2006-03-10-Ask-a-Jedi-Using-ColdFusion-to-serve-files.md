---
layout: post
title: "Ask a Jedi: Using ColdFusion to serve files"
date: "2006-03-10T14:03:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/03/10/Ask-a-Jedi-Using-ColdFusion-to-serve-files
guid: 1145
---

Alex asks:

<blockquote>
How can I allow registered users to download a PDF file?
The main issue is I don't want the PDF file to be on the webroot 
in other words, I don't want a user to be able to link directly to 
the PDF.

I'm assuming I'll have to use CFFILE to serve them the PDF.
This seems like a pretty common feature but I've had problems finding
a tutorial. 
</blockquote>

It is extremely simple. Assume you have already done your security check. You know the user is registered and they have access to the file. To send them the file, you can use this code:

<code>
&lt;cfheader name="Content-disposition" value="attachment;filename=#dafile#"&gt;	
&lt;cfcontent file="#dafile#" type="application/pdf"&gt;
</code>

So what is going on here? First, we use cfheader to tell the browser that a file is coming out via the request. The variable, dafile, would be whatever filename you are serving up to your user. (Make sure it is the full path.) Next we simply use cfcontent to actually send the file. Again, you pass in the full path of the file being served. The type value is simply the mime type for PDF files. I typically find my mime types <a href="http://www.w3schools.com/media/media_mimeref.asp">here</a> since my memory is pretty sketchy on such things. (I'd rather stuff my head with Star Wars trivia than mime types.)

One word of caution. I've used this technique for "small-ish" files. I've heard that for very large files this will perform badly. I'd probably use another method if your file was over 10 megs or so.