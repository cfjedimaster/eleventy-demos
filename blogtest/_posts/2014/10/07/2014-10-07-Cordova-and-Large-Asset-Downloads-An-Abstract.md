---
layout: post
title: "Cordova and Large Asset Downloads - An Abstract"
date: "2014-10-07T17:10:00+06:00"
categories: [development,mobile]
tags: []
banner_image: 
permalink: /2014/10/07/Cordova-and-Large-Asset-Downloads-An-Abstract
guid: 5327
---

<p>
Doing something a bit different today. A PhoneGap user contacted me yesterday with an interesting problem. He and I discussed it over a quick Google Hangout, and I thought I'd write up some thoughts about our discussion. Ultimately I want to build a proof of concept around this idea, but I thought I'd start first with an explanation, sans code, to see what people thought.
</p>

<p>
The problem, at a high level, involves downloading data files to a PhoneGap/Cordova application <i>after</i> the user has installed it. These would not be required downloads. Think more of things like DLC, or additional songs for a game, optional items.  His question was how an application could be architected to support such a system. Here is what I told him. (And as always, I welcome other opinions in the comments below.)
</p>
<!--more-->
<p>
The first thing I mentioned is that he would need some form of application server in order to handle hosting the resources. This application server needs to be able to respond to a request asking what resources are available. How the server responds isn't really important. A JSON-encoded array of URLs, with perhaps some meta information about each resource, would be sufficient. "Application Server" need not be anything complex. In fact, you could build something with <a href="http://www.parse.com">Parse.com</a> to handle the entire process. But at the end of the day you need that "responder" that can list what resources are available for download.
</p>

<p>
On the client side, you then need to be able to <i>ask</i> that server for a list. Obviously this is nothing more than an XHR request. You could add a layer of complexity to the process by supporting a filter. For example, if the server has 10 resources available and the client has downloaded 5 of them, maybe there is some way for the client to send that information to the server so that server only responds with what is new. Again, how complex you build this is up to you. I'd imagine that a simple list, even of 100-200 items, would transfer so fast (even on mobile) that you wouldn't need to worry about filtering. 
</p>

<p>
So - you've got two parts now, server side and client side. Fetching the resources isn't terribly difficult using the <a href="http://plugins.cordova.io/#/package/org.apache.cordova.file-transfer">File Transfer</a> plugin. Handling a bunch of these so you don't intefere with normal application usage is another matter. In a SPA, you could simply fire off a method to do these while the user carries on their merry way. In theory then these resources just become available when they get downloaded. If you grab one at a time you can even gracefully handle the application being killed off half way through. (To be clear, I need to test that. If I download a file called foo.jpg and it doesn't finish because the application is killed, does that file exist on the file system but in a corrupt state? I'll find out!)
</p>

<p>
That's the issue at a high level. The user who spoke with me asked me to take a look at this with jQuery Mobile, and I know I'm all about AngularJS and Ionic now, but I'm going to give it a shot there first to see if I can get a proof of concept working. What about you? Have you built something like this? Do you have any advice?
</p>