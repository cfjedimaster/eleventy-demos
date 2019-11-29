---
layout: post
title: "Eliza - Because I wanted to waste time!"
date: "2005-09-16T10:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/09/16/Eliza-Because-I-wanted-to-waste-time
guid: 782
---

Those old timers out there will remember an old computer program called <a href="http://en.wikipedia.org/wiki/Eliza">Eliza</a>. Eliza was basically a dumb, but sometimes effective, AI type program. You could ask it questions and Eliza would parrot them back. Eliza has been around since 1966 if you can believe it. Anyway, for a long time now I've been wanting to port it to ColdFusion. However, most of the example source code programs I found were extremely hard to read. (Or maybe ColdFusion is making me spoiled. ;) Last night I finally got around to writing a simple implementation.

The logic is simple. You take a string, which is what the human is saying, and look for keywords. If a keyword match is found, you pick a random respond and add what the user said after the keyword. 

So for example, if the user says: "I can't swim", Eliza may say, "How do you know you can't swim". Nothing terribly sophisticated about it, but sometimes it actually works rather well. 

For my version of Eliza, the data is all XML based, making it a lot easier to update the keywords and add additional responses. You can download the code <a href="http://ray.camdenfamily.com/downloads/eliza.zip">here</a>. 

Even better - if you are using the Google IM client, or any Jabber client, you can talk to Eliza right now. Simply add the contact, "elizacamden@gmail.com", and talk away. Have a cool conversation with her? Paste it into the comments.