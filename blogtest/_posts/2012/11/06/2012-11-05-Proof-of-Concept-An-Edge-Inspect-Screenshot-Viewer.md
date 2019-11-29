---
layout: post
title: "Proof of Concept - An Edge Inspect Screenshot Viewer"
date: "2012-11-06T11:11:00+06:00"
categories: [javascript,mobile]
tags: []
banner_image: 
permalink: /2012/11/06/Proof-of-Concept-An-Edge-Inspect-Screenshot-Viewer
guid: 4776
---

This falls into the category of "Possibly Useless", something I thrive on here at the blog, but I thought I'd share in case this actually <i>is</i> useful to someone out there. I've been presenting/tweeting/etc lately on <a href="http://html.adobe.com/edge/inspect/">Adobe Edge Inspect</a>. If you haven't tried it out yet, I encourage you to make the time. Edge Inspect makes it incredibly easy to test your web sites on multiple mobile devices at once. Simply set up your devices and open a web page on your desktop and watch as each device navigates to the same URL in sync with your clicks.
<!--more-->
Edge Inspect can also  gather screen shots from your devices. When Inspect does this, it creates one image (the screen shot obviously) and one text file for each connected device. Here's what my folder looks like now:

<img src="https://static.raymondcamden.com/images/screenshot34.png" />

And here is a quick example of the detail provided in the corresponding text file.

<script src="https://gist.github.com/4025995.js?file=gistfile1.txt"></script>

I thought it might be interesting to build a little web service that could provide a web-based way to browse this data. In order to do this, I needed a way to sync PNG and TXT files together into one logical unit. Each file uses a naming scheme of (date)_(time)_(devicename). Given that, I thought it would be simple to write some code that could parse out the date/time and name from each "pair" of files. Unfortunately, I found that in some cases, the time was off by a second. I imagine that is due to network issues in transferring the binary data to the host machine running Edge Inspect. I got around this by simply adding a bit of wiggle room - my logic would try to match the device name and a date/time value within 2 seconds. 

I created a simple Node.js application and used Express and Handlebars.js for my templating. I decided on a one page application that would use modal windows to display the screen shots. I'll share my code, but as before, remember I'm new to Node. Here's my app.js file. It's going to handle the command line processing (you have to tell it where your Edge Inspect screenshot folder lives) and responding to requests.

<script src="https://gist.github.com/4026043.js?file=gistfile1.js"></script>

My assumption here is that even those of you who don't know Node or Express can get the basics of what I'm doing, but if you have any questions, please ask. The real meat of the application is in inspectparser.js. This is where I do my file IO and file name parsing. Notice that I ended up doing a synchronous file read on the text files because I wasn't sure how to do a deferred in my Node.js code. I've seen a library that supposedly adds that as a feature, but I erred on the side of ease of use. If I really cared, I'd probably add some basic caching since there really isn't a need to reread a txt file once it has been parsed.

<script src="https://gist.github.com/4026059.js?file=gistfile1.js"></script>

Finally, let's take a quick look at the main home page. I'm making use of Bootstrap JS for the layout along with their Modal window support. Note that Express supports layout abstraction so that's in another template. I'm mainly sharing this as a way to give you an example of how Handlebars look within a Node/Express application. Personally I <i>really</i> like it.

<script src="https://gist.github.com/4026063.js?file=gistfile1.html"></script>

And finally, some screenshots of the app itself. 

<img src="https://static.raymondcamden.com/images/screenshot35.png" />

<img src="https://static.raymondcamden.com/images/screenshot36.png" />

Let me know what you think. I've attached the full source code below.<p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2012%{% endraw %}2Eraymondcamden{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Finspectviewer%{% endraw %}2Ezip'>Download attached file.</a></p>