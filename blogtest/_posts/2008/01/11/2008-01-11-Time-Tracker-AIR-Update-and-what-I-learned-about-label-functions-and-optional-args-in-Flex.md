---
layout: post
title: "Time Tracker AIR Update, and what I learned about label functions and optional args in Flex"
date: "2008-01-11T13:01:00+06:00"
categories: [flex]
tags: []
banner_image: 
permalink: /2008/01/11/Time-Tracker-AIR-Update-and-what-I-learned-about-label-functions-and-optional-args-in-Flex
guid: 2587
---

I've got a big update to the my little Time Tracker AIR application, thanks mostly to <a href="http://www.kylehayes.info/blog/">Kyle Hayes</a>. He gave some UI loving to the app - see below:

<img src="https://static.raymondcamden.com/images/Picture 41.png">

I've done a bit more cleanup. One of the things I fixed was my duplicate labelFormatter. The labelFunction feature is one of the neatest things in Flex. When it comes to a control that takes a set of data, you can say, "When displaying X, call this function." Your function can then do stuff like, "If the row of data has a price more than 100, mark it (Expensive!)". You get the idea. What was bugging me though was that I wanted to use the same labelFunction for my DataGrid and my ComboBox. But the DataGrid passes 2 arguments to it's label function, and the ComboBox passes one. I wrote two functions which both did the exact same thing. Turns out (and I found this online but forgot to bookmark where) there is a simpler solution - just mark the section argument as optional. Here is an example from my code:

<code>
private function projectLabel(item:Object,col:DataGridColumn=null):String {
	return item.project + " (" + item.client + ")";
}
</code>

In this code block, the second column has an optional value. It is optional because we define a default value to use in case one isn't passed. 

Anyway, most of my changes are pretty small. I switched to using States to handle "loading" versus 'real' application. I also made the Hour panel notice if you have no active projects. (Need to double check that I have the active flag in there.)

I'm still struggling with the dates though, and I've had some folks help me out on my other <a href="http://www.coldfusionjedi.com/index.cfm/2008/1/10/Two-SQLite-tool-recommendations">post</a>, so hopefully that will get corrected soon.

So now I'm going to turn my attention to a reports page. I've only played with Flex charts a bit, but I'm looking forward to it. I'd especially love to be able to find out which client/project paid me the most money, something that isn't possible with the current system I use.

I know I keep saying the following, but I should repeat it anyway. I'm really loving AIR and Flex. But please consider my code to be anything <i>but</i> best practice.<p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5Cwww%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2FArchive17%{% endraw %}2Ezip'>Download attached file.</a></p>