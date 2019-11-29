---
layout: post
title: "A PhoneGap Discussion around files, API calls, and security"
date: "2013-12-23T10:12:00+06:00"
categories: [mobile]
tags: []
banner_image: 
permalink: /2013/12/23/A-PhoneGap-Discussion-around-files-API-calls-and-security
guid: 5110
---

<p>
Pardon the somewhat opaque title, but I received an interesting email a few days ago that I wanted to discuss on the blog. It is one of those interesting emails that defies having a simple explanation so forgive me if the title isn't 100% accurate. This is also something I'd love to get some feedback on as I don't believe I'll have the best, or only, answer here. Ok, let's look at the question.
</p>
<!--more-->
<blockquote>
I hope this message finds you well.  I am trying to develop a simple phonegap application for ios that has a repository of XML files online which is parsed with jquery to populate the respective fields (again with jquery) on a page.  I have been asked to make it such that this can be done offline.  From my reading, I believe this means the file API needs to be utilised (to download and store the XML files on the device).

<p/>

I have also been asked to make it such that the downloaded files are updateable. I understand this is possible with the file API, but in order to save bandwidth on the server and client side (the full collection of files will likely be a couple gigabytes in size), I am hoping to check whether each file has been changed and only download updated versions.

<p/>

The complicated part is that the XML files need to be protected to some degree due to the nature of the content.  I have set up a protected directory on the server for this purpose (minimal security, but it should be enough).  However, because of the simple layer of protection, it requires that each request for a file's metadata be accompanied by a authentication cycle, which can put a fair amount of strain on the server with the sheer number of requests that will be made.

<p/>

My question is whether there is a way to accumulate all the metadata requests into a single batch so that there need not be hundreds of requests to the server for a single update process.  I would also need to keep track of those files that need to be downloaded.
</blockquote>

<p>
Let me try to address this email bit by bit, starting with the first section: "I am trying to develop a simple phonegap application for ios that has a repository of XML files online which is parsed with jquery to populate the respective fields (again with jquery) on a page.  I have been asked to make it such that this can be done offline.  From my reading, I believe this means the file API needs to be utilised (to download and store the XML files on the device)."
</p>

<p>
To be clear, the <a href="http://cordova.apache.org/docs/en/3.3.0/cordova_file_file.md.html#FileTransfer">File Transfer API</a> <i>could</i> be used for this, and gives you nice benefits like progress tracking, but you don't <i>have</i> to use it if downloading text files. You could use jQuery's AJAX calls perhaps more easily. That's what I'd probably recommend initially. 
</p>

<p>
But then you get into this: "I have also been asked to make it such that the downloaded files are updateable. I understand this is possible with the file API, but in order to save bandwidth on the server and client side (the full collection of files will likely be a couple gigabytes in size), I am hoping to check whether each file has been changed and only download updated versions."
</p>

<p>
Before we even talk about updates, let's talk size. I know I've got an Android device that isn't terribly old and runs PhoneGap great, but it would certainly choke on an app downloading a couple of gigs. You want to be <strong>real</strong> sure about your users before you do this. I don't believe you have access to the free space available, but in theory a plugin could be built to get this for you. Again though, you want to be real, real careful here before you take a few gigs of the user's device. It sounds like you are building something "Enterprisey" though so you may have more control over your users.
</p>

<p>
You go on to say this: "My question is whether there is a way to accumulate all the metadata requests into a single batch so that there need not be hundreds of requests to the server for a single update process.  I would also need to keep track of those files that need to be downloaded."
</p>

<p>
So the answer is absolutely yes. You may have built a simple API (because we all try to be as simple as possible, right?) called getMDForFile, that returns the metadata for a file. I'd add to this an API called: getBatchMDForFile (or Files), that allows you to send in a list of files and return a batch set of metadata. Don't forget to use HTTPS for these calls!
</p>

<p>
I'd also recommend another solution. While you may have metadata about each file, it seems like it would be easier to store this data in a database. On the mobile app, you can remember the last time the user downloaded their data. Call that date X. Your API can have a method that says, based on some date, see if anything has been updated since then. In one simple SQL call (or NoSQL of course), you can then get a list of changes and from that know what you have to fetch to get your local client in sync. 
</p>

<p>
I will add that you may want to be careful with this approach in general. You mentioned that the data is sensitive. What happens if the user quits the company? Remember they have access to the device and can dig up the files if they want. I know some companies enforce a remote wipe policy for their devices so you may want to ensure you have that in place too. 
</p>