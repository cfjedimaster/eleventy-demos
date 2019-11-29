---
layout: post
title: "ColdFusion WebSocket Tip - saving custom client metadata"
date: "2012-09-28T11:09:00+06:00"
categories: [coldfusion,javascript]
tags: []
banner_image: 
permalink: /2012/09/28/ColdFusion-WebSocket-Tip-saving-custom-client-metadata
guid: 4744
---

With the help of ColdFusion engineer Awdhesh Kumar, I've discovered an important tip with ColdFusion 10 WebSockets I'd like to share. I will admit that I'm still trying to wrap my brain around the details somewhat, but this tip works well and may be useful for others.
<!--more-->
Many of the JavaScript APIs that integrate with ColdFusion 10 WebSockets allow for metadata. For example, the publish API allows for an ad hoc message of any form as well as a set of custom headers. 

One way I use this feature is in my demo chat applications. The subscribe API also allows for custom headers so I pass along the user's desired username (or chatroom) name when they subscribe.

myWS.subscribe(subscribedChannel, {% raw %}{username:name}{% endraw %})

This allows me to use custom logic in the CFC handler to ensure that no two people have the same username:

<script src="https://gist.github.com/3800284.js?file=gistfile1.cfm"></script>

The logic here is rather simple. The username value I passed in via JavaScript is available at the root level of the subscriberInfo argument passed to the CFC handler. This data persists in the result from wsGetSubscribers. I can just look at that data, and if there is a match, deny the subscription.

Simple, right? But - it turns out that the custom data I see in the subscriber packet returned from wsGetSubscribers <b>is not</b> present in other CFC handlers. 

As an example, I wanted to use beforePublish to check the username of the person making the broadcast. This method is passed a publisherInfo struct, which I assumed was the same struct as what I saw returned from wsGetSubscribers. This is <b>not</b> true. As it stands, you do not have to subscribe to a channel to broadcast!

Awdhesh helped me see the difference here, although it took a little while to sink in. Luckily, there is a very simple fix. 

In your allowSubscribe handler, you can write custom data to the subscriberInfo.connectionInfo structure. As an example, I did this:

<script src="https://gist.github.com/3800323.js?file=gistfile1.cfm"></script>

In this example I've both set a hard coded value and copied a value from the subscriber metadata. Obviously you can do whatever you want here. Later on in my publisher info I'll have access to the same data.

Hope this helps!