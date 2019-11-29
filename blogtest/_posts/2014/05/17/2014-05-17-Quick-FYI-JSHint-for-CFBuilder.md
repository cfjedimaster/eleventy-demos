---
layout: post
title: "Quick FYI - JSHint for CFBuilder"
date: "2014-05-17T15:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2014/05/17/Quick-FYI-JSHint-for-CFBuilder
guid: 5225
---

<p>
I'm still using <a href="http://brackets.io">Brackets</a> as my primary editor, but as I use CFBuilder more and more I run into things that I think may be helpful to others. Today - it is adding JSHint support. I'm a <i>huge</i> fan of JSHint so I did a quick Google to see if there was an Eclipse plugin for it.
</p>
<!--more-->
<p>
Turns out - there was: <a href="http://github.eclipsesource.com/jshint-eclipse/">jshint-eclipse</a>. Screen shot stolen from the web site:
</p>

<p>
<img src="https://static.raymondcamden.com/images/screenshot88.png" />
</p>

<p>
<strong>However</strong>, to install this in ColdFusion Builder, you may want to be careful when using the Update functionality. The update URL for CFB is currently broken and will throw an error. It tends to return quite a bit too. When you select the option to install new software, you should click past the initial error and then select "Kepler Repository" in the Work with drop down.
</p>

<p>
<img src="https://static.raymondcamden.com/images/s114.png" />
</p>

<p>
The error you see comes from the fact that the CFB update site wasn't set up properly yet. This is being fixed now. As in - very soon. Maybe even by the time you read this. Anyway, I followed the directions at the <a href="http://github.eclipsesource.com/jshint-eclipse/install.html">install</a> page for jshint-eclipse and grabbed "Eclipse Marketplace", mainly because it looked kinda slick. That worked great. 
</p>

<p>
One more tip though. The plugin will display errors in the Problems panel, and for me, this was showing issues for <strong>all</strong> my JavaScript files in the project. Man, do I have a lot of problems. 
</p>

<p>
There is a little downward caret on the upper right side of the panel that lets you filter to the current selection, which is not selected text in the current file, but the selected file.
</p>

<p>
<img src="https://static.raymondcamden.com/images/Screen Shot 2014-05-17 at 1.29.23 PM.png" />
</p>

<p>
Hope this helps!
</p>