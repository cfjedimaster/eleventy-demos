---
layout: post
title: "Did you know - Flex and ID3 tags"
date: "2007-01-02T09:01:00+06:00"
categories: [flex]
tags: []
banner_image: 
permalink: /2007/01/02/Did-you-know-Flex-and-ID3-tags
guid: 1744
---

Ok, so this will elicit a "duh" out of my Flex 2 experienced readers, but I was pleasantly surprised to find that Flex 2 (to be clear, ActionScript 3) can read the ID3 tags out of MP3 files. I knew that I could play MP3s in Flex, but I didn't realize I could also dig out the ID3 information.
<!--more-->
Like most things in Flex 2, it is incredibly easy. First you load a MP3:

<code>
sound = new Sound(new URLRequest("/music/80s/EURITHMIX-SWTDREMS.MP3"));
</code>

That's a relative URL there to an Apache virtual alias on my local server. Next you add an event listener:

<code>
sound.addEventListener(Event.ID3, onID3);
</code>

This basically says to run the onID3 function when the ID3 event fires. My demo onID3 method looked like so:

<code>
function onID3(event:Event):void {
	myid3info.text += sound.id3.songName + "\n";
	myid3info.text += sound.id3.artist + "\n";
}
</code>

Where myid3info was a simple text control. Flex supports all the typical properties (album, artist, song name, etc). More information may be found at the Livedocs <a href="http://livedocs.macromedia.com/flex/2/langref/flash/media/ID3Info.html">page</a>. 

I'd post a demo, but the last thing I need is a RIAA lawsuit. ;) FYI - I discovered this gem in the <a href="http://www.amazon.com/gp/product/0596526954?ie=UTF8&tag=raymondcamden-20&linkCode=as2&camp=1789&creative=9325&creativeASIN=0596526954">ActionScript 3.0 Cookbook</a><img src="http://www.assoc-amazon.com/e/ir?t=raymondcamden-20&l=as2&o=1&a=0596526954" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />.