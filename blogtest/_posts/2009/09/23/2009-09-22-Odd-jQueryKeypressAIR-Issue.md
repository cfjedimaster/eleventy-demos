---
layout: post
title: "Odd jQuery/Keypress/AIR Issue"
date: "2009-09-23T10:09:00+06:00"
categories: [jquery]
tags: []
banner_image: 
permalink: /2009/09/23/Odd-jQueryKeypressAIR-Issue
guid: 3537
---

I'm looking for some help here folks. I'm working on a new blog series for <a href="http://www.insideria.com">InsideRIA</a> (don't forget folks, most of my RIA stuff is there) involving jQuery and AIR. I've done a few entries already on using Aptana to build an application and now I want to dig a bit deeper into jQuery/AIR integration. I've built a simple application that's going to be the starting point for the new series. Right now it is <i>barely</i> AIR. By that I mean it doesn't use any of the APIs at all. Outside of running as an application, it's just a HTML window. That being said, while working on the application I noticed something truly odd I wanted to share with folks.
<!--more-->
My application is a simple Hangman game. (I've included a zip if you want to try it out.) In order to play the game, I monitor key strokes so the user can guess at the word. Here is how I've done it:

<code>
//now begin listening for key clicks
$("BODY").keypress(function(e) {
	//only care if between A and z
	if(e.which &gt;= 65 && e.which &lt;= 122) {
		var c = String.fromCharCode(e.which)
		handleGuess(c)
	}
})
</code>

Simple enough, right? In my first draft, I had one hard coded word, "hangman", and as I tested, I simply typed a few letters at a time and watched the game progress. I did not support capital letters though. So if you entered H, it would have been treated as a mistake. No big deal, I figured I'd just fix it later (and in the version you have below it is fixed). Here is where things got wonky.

When I ran my code via Aptana, it worked fine. When I exported to a real AIR application, the value of C was <i>always</i> uppercase. So if you typed in "h" it was treated as "H". Something about the fact that it was running as a real AIR application screwed up the case of the keyboard entry. The exact same code run via Preview (adl at the command line if I remember right) worked fine. The exact same code as vanilla HTML also worked fine. 

So does anyone know what this could be? FYI, for my fix, I simply converted c to uppercase, which frankly looks nicer anyway. I'll have a lot more detail about the application later this week at InsideRIA.

<b>Edit:</b> After talking to Andrew Powell I did some more digging. Get this. I added an alert to show e.which. In ADL/preview mode, when I type "l" or "L" I see 2 different numbers. That is expected. I then build out the AIR app, run it, and when I test, e.which is the same no matter what case. So the bug occurs at either the jQuery level or the AIR level.<p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2009%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2FHangman%{% endraw %}2Ezip'>Download attached file.</a></p>