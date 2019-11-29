---
layout: post
title: "Case sensitivity and ColdFusion 10 WebSockets"
date: "2012-06-05T10:06:00+06:00"
categories: [coldfusion,html5,javascript]
tags: []
banner_image: 
permalink: /2012/06/05/Case-sensitivity-and-ColdFusion-10-WebSockets
guid: 4640
---

During my presentation yesterday, a user asked about case sensitivity and WebSockets. The short answer is - they are not. Given a ColdFusion application that defines a channel called "news", you can ignore case everywhere. That includes:

<ul>
<li>The cfwebsocket tag subscribeTo argument</li>
<li>The JavaScript object's publish and getSubscriberCount methods</li>
<li>Server-side functions like wsGetAllSubscribers and wsPublish</li>
<li>Subchannels. You can subscribe to news.sports and then broadcast to NEWS.SPORTS and the right people get the message.
</ul>

There are a few more things I could test, but I think it is pretty clear that case sensitivity is not an issue.

There is one small nitpick to this. When you define the name of the JavaScript variable in the cfwebsocket tag, <i>that</i> string is case-sensitive. That makes sense as JavaScript variables are case sensitivite. But it looks like all WebSocket channels are going to be case insensitive.