---
layout: post
title: "New ColdFusion Builder Extension: GistCreator"
date: "2012-05-29T18:05:00+06:00"
categories: [coldfusion,development]
tags: []
banner_image: 
permalink: /2012/05/29/New-ColdFusion-Builder-Extension-GistCreator
guid: 4633
---

A few months back I switched to using Gists (<a href="https://gist.github.com/">https://gist.github.com/</a>) for my code samples. For the most part it just worked fine. I did have to do a bit of <a href="http://www.raymondcamden.com/index.cfm/2012/4/14/Dynamically-replacing-Gists-with-raw-content-for-jQuery-Mobile">work</a> to get it right under jQuery Mobile, but outside of that I'm happy with the change. 

Now that I've made the switch, I find myself making a heck of a lot of gists. I tweeted earlier today that it would be cool if my editor would make it easier to create them. Right now I spend my time using Sublime Text 2, ColdFusion Builder, and, um, another editor. @bittersweetryan pointed out an <a href="https://github.com/condemil/Gist">excellent plugin</a> for Sublime. That worked great. But I thought it would be fun to build an extension for CFBuilder as well. So I did it. Because I do that now. I love my job. <b><i>A lot.</i></b>

<a href="http://gistcreator.riaforge.org/">GistCreator</a> works with both files and in the editor. To create a Gist out of a file, just right-click:

<img src="https://static.raymondcamden.com/images/ScreenClip91.png" />

Or - you can select text in the editor and create a Gist out of it:

<img src="https://static.raymondcamden.com/images/ScreenClip92.png" />

You can also just right click in a file, and if nothing is selected, the entire file is sent.

Once done - the extension returns the URL:

<img src="https://static.raymondcamden.com/images/ScreenClip93.png" />

And that's it. Right now the extension only creates public Gists and doesn't allow you to name them, but it should work fine for now. Also, it is a bit brittle. If your authentication changes then the extension will not handle it well. As always, I'm open to folks checking it out and adding features. 

Fork it here: <a href="https://github.com/cfjedimaster/GistCreator">https://github.com/cfjedimaster/GistCreator</a>