---
layout: post
title: "Tip: Using Ionic - without Ionic"
date: "2014-09-23T18:09:00+06:00"
categories: [html5,javascript,mobile]
tags: []
banner_image: 
permalink: /2014/09/23/Tip-Using-Ionic-without-Ionic
guid: 5314
---

<p>
Pardon the cryptic title. Earlier this morning I was working on a demo (the result of which is documented <a href="http://www.raymondcamden.com/2014/9/23/Simple-photo-filters-with-VintageJS-and-Cordova">here</a>) that I knew was going to be rather simple. Therefore I decided to skip using Ionic since AngularJS would have been overkill for what I was producing. I was ok with that, but what I <i>really</i> didn't like was losing live reload and logging in my terminal. Turns out there is a rather obvious way to get that.
</p>
<!--more-->
<p>
When you create an Ionic application, you have the option of specifying a folder to use for your source directory. So all I did was simply use my default Cordova assets (not the CLI's default with the robot, <i>my</i> default) as the source. As I said, this is probably obvious, but the Ionic CLI had no issues sourcing a project with assets that did not make use of the Ionic framework itself.
</p>

<p>
I then simply ran <code>ionic emulate ios -l -c</code> to get live reload and console logging in Terminal and went along my merry way. I'm not getting the full benefits of the uber cool Ionic Framework with all its bells and whistles, but I did get the cool benefits at the command line and that worked well enough for me. 
</p>

<p>
The only real side effect of this that I can see is that I get plugins I may not need and a after_prepare hook that does nothing. I could easily clean this up if I wanted to but for my proof of concept demo I didn't need to.
</p>