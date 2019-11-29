---
layout: post
title: "CommandBox CLI and Package Manager for ColdFusion"
date: "2014-09-11T07:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2014/09/11/CommandBox-CLI-and-Package-Manager-for-ColdFusion
guid: 5305
---

<p>
I'm a few days late on this, but I wanted to be sure my readers knew about the release of <a href="http://www.ortussolutions.com/products/commandbox">CommandBox</a> by <a href="http://www.ortussolutions.com/">Ortus Solutions</a>, the same fine folks behind the ColdBox series of products. CommandBox provides probably the <strong>number one</strong> feature missing from ColdFusion - a command line and package manager.
</p>
<!--more-->
<p>
The CLI tool lets you quickly run CFML from the command line and build extensions for the command line with ColdFusion. Along with just running CF at the command line, CommandBox can quickly generate code for ColdBox and other products - essentially acting as a scaffolding tool from the command line. 
</p>

<p>
On top of being able to run CF from the CLI, CommandBox also provides package management. If you've done anything at all with Node then you realize how big of a deal this is. At a high level, it lets me develop code that requires other parts, let's say Alpha and Beta. Alpha can define what it needs. Beta can do the same. But from one command, I can simply ask for my code and the tool handles getting <i>all</i> the dependencies down the line. This makes installation of code a heck of a lot easier. You can browse the list of available packages at <a href="http://www.coldbox.org/forgebox">ForgeBox</a>.
</p>

<p>
As an example, via CommandBox I could install ColdBox like so: <code>forgebox install  coldbox-platform</code>. Nice and simple, and what I've grown accustomed to with Node.
</p>

<p>
All in all, a very cool product and something ColdFusion has needed for a <i>very</i> long time. You can watch Brad Wood demonstrate the product below.
</p>

<iframe src="//player.vimeo.com/video/97430752" width="500" height="281" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe> <p><a href="http://vimeo.com/97430752">CommandBox Demo</a> from <a href="http://vimeo.com/lmajano">Luis Majano</a> on <a href="https://vimeo.com">Vimeo</a>.</p>