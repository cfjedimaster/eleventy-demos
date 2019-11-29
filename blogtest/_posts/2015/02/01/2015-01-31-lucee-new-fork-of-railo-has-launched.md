---
layout: post
title: "Lucee, new fork of Railo, has launched"
date: "2015-02-01T08:43:32+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2015/02/01/lucee-new-fork-of-railo-has-launched
guid: 5629
---

This is definitely not <i>new</i> news, but I wanted to share it with folks who may have missed the myriad other posts as well. As the title says, Lucee was launched as a fork of the Railo project. I haven't used Railo much (typically only when a client requires it), so I don't follow that "world" much, but if you want to know more about the why of it I encourage you to read <a href="http://blog.adamcameron.me/2015/01/lucee.html#more">Adam's announcement post</a> where he has a FAQ about the launch of the whole thing. 

<!--more-->

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/02/lucee-logo.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/02/lucee-logo.png" alt="lucee-logo" width="146" height="81" class="alignnone size-full wp-image-5630" /></a>

You can find out more, and download the bits, at the main site: <a href="http://lucee.org/">http://lucee.org/</a>.

I played with it for a grand total of 10 minutes, just to see how well it works. You can currently download an "Express" edition that allows for unzip and run. If you are like me and a bit unfamiliar with how Railo did things, here are some tips:

First, the port that Lucee will run on is 8888. I'm sure this is documented in some XML file some place but it took me a few minutes to find it. I already logged an ER with them to make the startup script actually <i>say</i> this when it runs.

Second, you can find docs at localhost:8888/lucee/doc/. 

If you want to write CFMs and test them, go to the installation folder, then webapps/ROOT. This works just like Adobe ColdFusion - write a CFM, save it, open it in your browser.

So that all involves running it locally, how about finding out more about the project?

As I said above, the main site is: 

The forum for Lucee may be found here: <a href="http://discourse.lucee.org/">http://discourse.lucee.org/</a>

The source (and bug tracker) for Lucee may be found here: <a href="https://bitbucket.org/lucee/lucee">https://bitbucket.org/lucee/lucee</a>

The wiki for Lucee may be found here: <a href="https://bitbucket.org/lucee/lucee/wiki/Home">https://bitbucket.org/lucee/lucee/wiki/Home</a>

All in all, an interesting development. Any of my readers playing around with this yet?