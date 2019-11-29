---
layout: post
title: "Flex, Secured Web Services Tip"
date: "2005-10-10T17:10:00+06:00"
categories: [flex]
tags: []
banner_image: 
permalink: /2005/10/10/Flex-Secured-Web-Services-Tip
guid: 844
---

So, I'm still something of a Flex newbie, so forgive me if this is a FAQ, but I ran into a problem last week that took quite a bit of time to fix. 

I wanted to call a secured web service in Flex. In ColdFusion, you can simply provide the username and password in the cfinvoke tag, which is nice. I didn't see anything like that in Flex. 

After a bit of struggle, I realized I needed to use a named web service (i.e., a web service named in my config file) since I didn't want the client to have to prompt for the username and password. (It was a static u/p that all clients would use to access the same web service.)

I fumbled around a bit, and finally hit a brick wall. <a href="http://weblogs.macromedia.com/mchotin/">Matt Chotin</a> over at flexcoders suggested I turn on debugging. I wasn't even aware of this setting:

<code>
&lt;web-service-proxy-debug&gt;true&lt;/web-service-proxy-debug&gt;
</code>

But as soon I started using it, something became a bit more clear. The log showed that my username and password were being sent to the remote web service, but that I was still getting an unauthorized exception. Once again Matt helped out. He noticed that the remote web service was using multiple types of security along with BASIC. He suggested turning off the other ones. As soon as I had that change done by the remote vendor, Flex had no problem communicating with the web service.