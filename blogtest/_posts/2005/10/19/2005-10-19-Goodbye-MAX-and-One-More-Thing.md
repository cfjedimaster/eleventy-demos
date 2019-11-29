---
layout: post
title: "Goodbye MAX, and One More Thing..."
date: "2005-10-19T15:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/10/19/Goodbye-MAX-and-One-More-Thing
guid: 860
---

At my final session at MAX today I decided to give people a little sneak peek into something I've been working on. Ever since the demo of New Atlanta's CF Profiler at CFUNITED, I've been working on something simular within the CFMX framework. I had always wanted to take a look at the debug templates (which are open sourced by the way, did you know that?), and in fact, I released a small example of this a few agos with my <a href="http://www.raymondcamden.com/index.cfm/2005/10/4/CFC-Debugging">CFC debugger</a> mod. 

Today I am happy to announce Starfish. Starfish is the name of a new debugger I am working on, and yes, the name "Starfish" has zero connection with the actual product. I needed a name, so, there ya go.

So what does Starfish do? The first part of Starfish is the debugging template. This gets saved in your web-inf/debug folder. This adds "profiler.cfm" as an option in your CF Admin. When you select the profiler, no debug input is shown on screen. <i>However</i>, as you click around, or as your automated script does, debug information is being stored in RAM. That is the essential problem I had with the built-in debugging. It gives you a great deal of information - but only while you are on the page itself. All my code does is package it up a bit and store in the Server scope.

The second part of Starfish is the admin interface. Here is a screen shot (click on it for a bigger shot):

<a href="http://www.coldfusionjedi.com/images/starfish_big.jpg"><img src="https://static.raymondcamden.com/images/cfjedi/starfish_small.jpg"></a>

What we have here are three things (although one isn't in the screen shot, it was added later). First you have a list of templates along with the number of times it has been run, with min, max, and average execution times. Since this is a flash grid you can sort. When you click on a template, a graph loads showing how the template has performed. Typically, you will see a high initial value followed by much smaller values. If not - something may be wrong.

The second tab shows CFC calls. They are listed about by CFC and method, and again you see min, max and average times.

The last tab (which again, isn't on the screen shot), shows all SQL Queries. Clicking on a row will show the full SQL of the query. Even better - know how in the normal debugger, queryparam values are shown with a question mark? Before storing the sql, I actually copy those values back in so you can read the SQL a bit easier.

So - when will this be released? I want to do a bit more polishing, and add a Print/Excel button to the reports. My <i>hope</i> is to get this out in a 'Version 0' mode next Monday so folks can start commenting and add requests.

And with that - it's off to the airport!