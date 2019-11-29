---
layout: post
title: "Handling broken images in Flex 2"
date: "2006-11-21T16:11:00+06:00"
categories: [flex]
tags: []
banner_image: 
permalink: /2006/11/21/Handling-broken-images-in-Flex-2
guid: 1666
---

A friend had a simple question:

<blockquote>
If I use the mx:Image tag to load an image and get a 404, how do I handle that?
</blockquote>

I jokingly said that the tag should support an onLoad type event so you could check the http status codes. Turn out I wasn't far from the truth. Mike Kollen (The Uber Flex Instructor) sent me this simple block of code as an example of how to handle it:

<code>
&lt;mx:Image source="assets/f{% raw %}{dgMovies.selectedItem.FILMID}{% endraw %}.gif" ioError="ioError()" id="movieImage" width="110" /&gt;

private function ioError():void { 
  movieImage.source = "assets/no_image.gif";
}
</code>

Talk about simple. Half of my battles with Flex are simply learning how to do stuff - and luckily when I do learn - it typically turns out to be easy to implement.