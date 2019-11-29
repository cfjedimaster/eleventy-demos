---
layout: post
title: "ColdFusion 10 WebSockets, Selectors, and canSendMessage"
date: "2012-10-04T18:10:00+06:00"
categories: [coldfusion,html5]
tags: []
banner_image: 
permalink: /2012/10/04/ColdFusion-10-WebSockets-Selectors-and-canSendMessage
guid: 4752
---

Here is an interesting little "feature" I ran into last week while preparing for my presentation on WebSockets in ColdFusion 10. One of the features I demonstrated is called selectors. It allows you to subscribe to a channel but only receive messages that pass a boolean test. In my demo application, I listened to a channel that broadcasted the change in stocks. I used a selector to say, in code, "I only care about stocks that have a change greater than 10." This worked perfectly. 

I was doing some fiddling around though when I noticed something odd. I added a CFC handler for the channel. Part of that handler had this boilerplate code in it:

<script src="https://gist.github.com/3836620.js?file=gistfile1.cfm"></script>

canSendMessage is fired before a message is sent to any listening client. It gives you the ability to allow/deny the message to be received. This is <b>not</b> the same as allowPublish, which is run before the publisher (the person making the message) is allowed to broadcast on the system.

In my mind, the selector would have fired <i>before</i> canSendMessage. If that selector failed, then it should be as if the message never was published, at least to me, the listener. 

But that wasn't the case. Because I had a simple return true in the handler, my demo application began seeing <i>all</i> of the messages, even those that would have failed the selector test.

So - I think this is actually a good thing... if you know it's going to happen that is. The selector data is passed to the handler. You can simply run it yourself manually. Or, you could do something else entirely. I'm not sure what. You could - possibly - log the times a message gets blocked/passed due to selectors and use it as a metric of some sort.

Anyway - just keep this in mind!