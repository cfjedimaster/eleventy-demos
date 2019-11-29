---
layout: post
title: "Issue with CFINDEX"
date: "2014-07-11T12:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2014/07/11/Issue-with-CFINDEX
guid: 5264
---

<p>
If you use cfindex to parse a directory of files, you should be aware of a serious issue that may hit you. As you know, you can ask cfindex to return a result structure that tells you how many files were added, removed, or deleted from an index. As an example, here is the result structure for a set of PDFs I added.
</p>
<!--more-->
<p>
<img src="https://static.raymondcamden.com/images/s117.png" />
</p>

<p>
Cool, right? Except that I had more than one PDF in the directory. So, something went wrong, right? But the issue is that there is no feedback about what went wrong. I did some digging into the logs and didn't find anything. I was truly at a loss as to what it could be. Every PDF opened up in Acrobat so they were definitely valid PDFs, and of course, my assumption was that if they weren't valid PDFs I would have certainly gotten some feedback.
</p>

<p>
I was wrong.
</p>

<p>
So, luckily, I got some help from Uday Ogra on the ColdFusion team. Turns out it was logged, just not in the log I expected. When I checked server.log, I saw this:
</p>

<blockquote>
WARNING: Could not index /lotsofpathstuff/pdftest/temp/I-9.pdf in SOLR. Check the exception for more details: An error occurred during EXTRACTTEXT operation in &lt;CFPDF&gt;.
</blockquote>

<p>
I quickly wrote a new CFM file that used cfpdf and the extracttext operation and confirmed that the error indeed made sense for the PDF in question. I opened the PDF in Acrobat, checked the document properties, and confirmed that it was blocked.
</p>

<p>
Ok, all of this makes sense then. But the issue is that there was no feedback given at the request time about a document failing or why it failed. Unfortunately, this to me is a feature killer. To be clear, I'm not talking about ColdFusion Solr integration as a whole, but if your business process involves indexing dynamic files then you can't rely on knowing exactly what files are failing. Of course, they won't always fail. In theory you could replace the "index the directory" operation with indexes of each and every file one by one. As you don't get an exception you would need to check the status to see if the numbers add up. That's a workaround, but a poor one in my opinion.
</p>

<p>
I filed a <a href="https://bugbase.adobe.com/index.cfm?event=bug&id=3787621">bug report</a> on this issue where I proposed that the result struct return an array of errors. Each item in the array (if any exist) would consist of the full path to the file in question as well as the exception thrown. Adam Cameron suggested an optional argument to throw an error, which to me is the preferred approach.
</p>

<p>
As a general FYI, "silent fail" is something that should never, ever, be done. I know a lot of times we say, "Hey, this is a guideline and exceptions exist, blah blah blah", but, no, sorry, I don't agree. Silent Fail is evil. It's the mushy green peas of development. Now - take that statement and argue with me in the comments. ;)
</p>

<p>
<img src="https://static.raymondcamden.com/images/SAM_3213.JPG" /><br/>
<i>Image credit: <a href="http://adashofflavour.blogspot.com/2010/08/mushy-peas.html">http://adashofflavour.blogspot.com/2010/08/mushy-peas.html</a></i>
</p>

<p>
p.s. Also note this other cfindex bug Scott Stroz found: <a href="https://bugbase.adobe.com/index.cfm?event=bug&id=3785874">https://bugbase.adobe.com/index.cfm?event=bug&id=3785874</a>
</p>