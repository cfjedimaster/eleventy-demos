---
layout: post
title: "Flex for Mobile - VPN? Secure connections?"
date: "2011-09-07T16:09:00+06:00"
categories: [flex,mobile]
tags: []
banner_image: 
permalink: /2011/09/07/Flex-for-Mobile-VPN-Secure-connections
guid: 4357
---

Mike asked:

<blockquote>
Quick question regarding Flex 4.5 and mobile. Do you know if there is any type of vpn type of solution?

We are in the process of evaluating some things and the question came up about security and flex. So basically if a mobile app was created for say some internal employees and we needed to have the data they access and submit to be inside the firewall is there a way to connect via vpn into the network or would we need some type of 3rd party vpn software on the device itself?

Also one last question on security, when you build a mobile app what is the best practice with flex to security data, would it be with some type of ssl?
</blockquote>

So this is an area that I have <b>not</b> dived into so take what I say with a grain of salt. I talked it over with <a href="http://gregsramblings.com/">Greg Wilson</a> and his advice was along these lines:

1) There are already VPN apps for mobile applications. Your application could simply try to access the VPN only URL (let's say 10.0.0.1) and gracefully handle it when the connection can't be made. It could even explicitly tell your employee "Hey run the VPN app first, dude!"

2) In terms of using SSL, when you define your URL in your remote object tag, you can simply provide a https url instead of a http url. Obviously your back end server has to be set up to support that, but on the client side it should be as easy as it is for the web.

Hope this helps - and if someone out there has some practical experience in this area I'd gladly take their comments!