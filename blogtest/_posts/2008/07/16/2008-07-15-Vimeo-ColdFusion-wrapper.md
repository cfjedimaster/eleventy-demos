---
layout: post
title: "Vimeo ColdFusion wrapper"
date: "2008-07-16T08:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/07/16/Vimeo-ColdFusion-wrapper
guid: 2935
---

Last night at our local <a href="http://www.acadiana-aug.org">user group</a> I was introduced to <a href="http://www.vimeo.com">Vimeo</a>. It looks to be a slicker looking clone of YouTube. The video controls are nicer and you can get a HD version of the video as well. (If the submitter provides one of course.) For a good example, ok, a crazy example, check out this video:

<a href="http://www.vimeo.com/1223566">GORBACHOV: THE MUSIC VIDEO - BIGGER AND RUSSIANER</a>

Warning - this video is PG13 and a bit on the edge of work safe. But it's funny as heck. Any video with zombies and a storm of blue jeans has to be cool.

Anyway - Vimeo has a few APIs you can use as a developer. Anything involving updating data requires you to send the user to their site, but for generic 'read' support, their API is rather simple. I've worked up a quick CFC that will let you get user and group information as well as generate embed code. It is attached to this blog entry. The API is so simple there really isn't anything cool in my code at all.

<a href='https://static.raymondcamden.com/enclosures/vimeo.zip'>Download attached file.</a>