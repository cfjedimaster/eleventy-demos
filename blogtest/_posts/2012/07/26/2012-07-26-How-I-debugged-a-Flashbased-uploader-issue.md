---
layout: post
title: "How I debugged a Flash-based uploader issue"
date: "2012-07-26T15:07:00+06:00"
categories: [coldfusion,development,flex]
tags: []
banner_image: 
permalink: /2012/07/26/How-I-debugged-a-Flashbased-uploader-issue
guid: 4686
---

Since I've been on a 'How I fix things' kick lately I thought I'd share a quick real world example. A reader wrote in stating that he had issues with ColdFusion's multi-file uploader. This is a Flash-based utility that allows you to upload any number of files. On the server side, you handle the file as you wish (copy it to a folder, upload it to S3, whatever), but you are responsible for outputting a JSON string back to the front end that is then interpreted by the Flash application.
<!--more-->
My reader was having an issue with the uploader where files were being processed correctly but the front end always reported it as an error. Since the files were handled ok the issue must have been in the communication back to the front end. So how did I debug this?

First off - the Flash network call was a POST but it was not rendered properly in Chrome dev tools. Chrome actually showed the POST but the response wasn't displayed:

<img src="https://static.raymondcamden.com/images/ScreenClip104.png" />

Firebug didn't even render the request. So I switched to a lower-level tool I like - <a href="http://www.charlesproxy.com/">Charles</a>. I've often used Charles (and <a href="http://kevinlangdon.com/serviceCapture/">ServiceCapture</a>) for Flash and Flex-based applications since it does a real good job of handling those applications.

Charles monitors pretty much every network request on your box so the first thing you want to do is click Proxy/Recording Settings , go to the Include tab and enter a new record for your testing site. This makes it a lot easier to keep track of the network requests you care about. 

<img src="https://static.raymondcamden.com/images/ScreenClip105.png" />

I then simply switched over to the browser, uploaded a file via the Flash app, and then popped back into Charles. I selected the individual request and then the Response tab. This is the real result and I bet you can see the error right away:

<img src="https://static.raymondcamden.com/images/ScreenClip106.png" />

Yep - extra HTML comments from the server side code (see note for ColdFusion folks below) breaking the JSON. In this case, it was something emitted from earlier in his code in a completely different file but executed during the request. 

From start to finish this was probably a 3-5 minute debug for me but something I know he had worked on for some time. As I've been saying recently at conferences, knowing the types of tools you have available to help debug issues is <b>priceless</b>. 

p.s. As a special note to ColdFusion users - the mistake above most likely came from accidentally using an HTML comment when a CFML comment was meant instead. It is an easy mistake to make (two dashes instead of three) and something you should watch out for.