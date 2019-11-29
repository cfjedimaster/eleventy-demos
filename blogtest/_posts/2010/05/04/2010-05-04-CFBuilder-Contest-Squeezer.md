---
layout: post
title: "CFBuilder Contest: Squeezer"
date: "2010-05-04T13:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/05/04/CFBuilder-Contest-Squeezer
guid: 3802
---

<img src="https://static.raymondcamden.com/images/cfjedi/cf_builder_appicon.jpg" align="left" style="margin-right:5px" title="ColdFusion Builder FTW!" /> Welcome to the first entry in the ColdFusion Builder Contest. We didn't get a lot of entries for this contest, but every entry is <b>really</b> darn cool, so I'm very excited to be able to share the first of the entries with you today. Our first entry is <b>Squeezer</b> and comes to us from Guust Nieuwenhuis. 
<br clear="left" />

<p>
<!--more-->
Squeezer is an extension that provides support for optimization/compression/minification of JavaScript and CSS files. One of the things I learned in Peter Farrell's client side optimization class is that these techniques are not considered to be as effective as they once were. (And please forgive me if I got that detail wrong!) The point Peter made was that the thought was that the benefit you gained was not outweighed by the possible difficulty you have in debugging. That being said, I do think people still have a need for tools like this - perhaps as part of a deployment script (as suggested by Lance Staples, one of my coworkers). If you do need this type of tool though, Squeezer makes it as easy as "right click, Squeeze", which is about as easy as you can get it.

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/Screen shot 2010-05-04 at 9.28.57 AM.png" title="Install Screen" />

<p>

After installing Squeezer, you will have a new right click menu on JavaScript and CSS files. This is achieved by using filters in the IDE configuration file. CFBuilder extensions can be set to only work on specific files/folders/names. While you can check for this on the code side, it is much better to simply filter out from even showing up to the user. One big bug here - the filter will allow you to select multiple files. If you do this, things will appear to work but the compression never fires. As far as I know, you can't specify that a menu will only show up on one selected item. In fact, if you begin your file selection on a valid file, you can select additional files that do <b>not</b> match the filter. This is not a bug in his code, but rather a limitation of CFBuilder. (I'll go file a bug report on this later today.) What I'd probably recommend is a) writing your extension to correctly notice N files instead of just one and b) double checking to ensure the extension matches what you want. By the way - you will probably see me repeat this advice over all the contest entries. It's something I know that my own extensions need to do better as well.

<p>

Once installed, you have the option of running Google's <a href="http://code.google.com/closure/compiler/">Closure Compiler</a> or Yahoo's <a href="http://developer.yahoo.com/yui/compressor/">Compressor</a>. Both of these can be used on JS files. While the Yahoo tool focuses on compression, Google's tool actually tries to rewrite your JavaScript for optimization. The Google Closure Compiler never worked for me, though. It changed my files into: com.google.javascript.jscomp.Compiler@faf3284. It goes without saying - backup before you test this. I had much better luck though with the Yahoo version. 

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/Screen shot 2010-05-04 at 9.36.04 AM.png" title="Yahoo Compressor" />

<p>

As you can see, you have many options for how to process the files. To be honest, I'm not sure what some of these are, but I love the fact that you have the option to Save As. I mainly just took the defaults though and let it overwrite the file as is. 

<p>

The results - again when it worked right and when I used it files that were <i>not</i> already minimized - were respectable. A good 50% cut on some files. 

<p>

As to the code - first and foremost - he remembered the cardinal rule of CFBuilder extensions - disable debugging:

<p>

<code>
&lt;cffunction name="onRequestStart" returnRequest="boolean" output="false"&gt;
	&lt;cfsetting showdebugoutput="false" enablecfoutputonly="false" /&gt;
&lt;/cffunction&gt;
</code>

<p>

I'm not quite sure what returnRequest is meant to be, but the important thing is he turned off debugging. Do <i>not</i> forget this. 

<p>

Another interesting aspect is how he handles storing the data. One issue you run into with CFBuilder extensions is how to properly keep state over multiple requests. You can <i>kinda</i> use the Session scope at times but it is a bit wonky. He gets around this by simply using the Application scope. He stores his information in the Application scope under a numeric ID. He then passes that value over the URL from step to step so he can get it again later. This is a technique I kind of like and I may "innovate" into my own extensions. 

<p>

Another nice feature - he makes use of <a href="http://javaloader.riaforge.org">JavaLoader</a>, Mark Mandel's open source project that lets you make use of Java libraries without having to modify your class path or restart ColdFusion. Luckily this feature will get rolled into ColdFusion 10. (Because Adobe has said they will be integrating all of Mark's open source projects into ColdFusion. Yes, that's a joke. Kinda.) 

<p>

All in all - a very handy little extension. You can grab it yourself via the download link below. (<b>Edit: I've removed the download as it is now available at <a href="http://squeezer.riaforge.org/">http://squeezer.riaforge.org/</a>.</b>) Thank you, Guust! (Quick reminder - don't forget that you should <b>not</b> extract the zip. CFBuilder will do it as part of the installation.)