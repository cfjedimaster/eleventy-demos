---
layout: post
title: "Better example of PhoneGap, Parse, and uploading files"
date: "2013-07-23T10:07:00+06:00"
categories: [html5,javascript,mobile]
tags: []
banner_image: 
permalink: /2013/07/23/better-example-of-phonegap-parse-and-uploading-files
guid: 4989
---

A few days back I <a href="http://www.raymondcamden.com/index.cfm/2013/7/10/Quick-note-for-Parse-and-JavaScript-Users">posted</a> about how Parse's JavaScript API now makes it easy to upload files via their SDK. The demo I built was very quick and simple, and while it made use of PhoneGap, it wasn't a great example of the technologies together. Before I spoke on Parse at PhoneGap Day (apparently videos will be posted soon, I'll share when they are) I whipped up a slightly nicer example. Let's take a look.
<!--more-->
My example is (I'm sorry) another example of a Note taking app. However this time I've added the ability to attach pictures to a note. The home screen is a listing of your current notes, sorted by date.


<img src="https://static.raymondcamden.com/images/iOS Simulator Screen shot Jul 23, 2013 9.07.24 AM.png" />

Clicking the plus symbol takes you to a form allowing you to write a new note.

<img src="https://static.raymondcamden.com/images/iOS Simulator Screen shot Jul 23, 2013 9.08.19 AM.png" />

At this point you can select to take a picture. Now - for testing purposes in my iOS Simulator, I set the source to the local file system. In a real world app you would ask for the camera itself (or allow the user to select), but I wanted something quick and dirty.

Once you click Save, we then create a new Note object at Parse. The code has to determine if you've taken a picture or not and if you have, it will handle the upload for you. Now let's look at the code.

First - the home page. I'm using jQuery Mobile for the application and have placed both "pages" in the core index.html. Since there seems to be some confusion about this, let me be absolutely clear. jQuery Mobile does <strong>not</strong> make you use one html page. Period. In a case like this where I have a small app (2 pages), then it made sense for me to include them in one html file. That was 100% a personal choice and not anything jQuery Mobile forced me to do.

<script src="https://gist.github.com/cfjedimaster/6062717.js"></script>

The HTML here is pretty bare since almost all of the content is dynamic. Now let's take a look at app.js.

<script src="https://gist.github.com/cfjedimaster/6062742.js"></script>

First take a look at the pageshow event for #home. This is where we get data from Parse. This is done via a simple query that orders by object creation. I limit the count to 10 and if I wanted to could add paging. 

The addNote logic is a bit more complex. Saving Parse data is asynchronous so if we need to store a file we have two, not one, async calls to make. Hence the big IF block that checks if we've got an existing selected image. To be honest this could be done a bit nicer perhaps. For example, the initial creation of the Note object could definitely be taken out of the IF clause, as well as the line where I set the text property. But in general I think you get the idea.

Anyway, I hope this is useful for folks. I've zipped up a copy of this application and attached it to the blog entry.<p><a href='/enclosures/wwwforblog.zip'>Download attached file.</a></p>