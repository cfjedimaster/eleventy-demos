---
layout: post
title: "Installing Fusebox"
date: "2007-02-05T16:02:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2007/02/05/Installing-Fusebox
guid: 1820
---

A quick editorial note. I mentioned last week that I would be playing with Fusebox and trying to learn the basics. In case anyone comes in via Google I wanted to be clear that these are my experiences as I learn. So please be sure to read the comments. 

So for my first entry I thought I'd demonstrate the process you follow to install Fusebox. Since this is rather easy, it won't be a long post.
<!--more-->
You begin by downloading the Fusebox install files. You can find this on the <a href="http://www.fusebox.org/index.cfm?fuseaction=downloads.listDownloads">Downloads</a> page. In case it isn't obvious, you want the download named:

<a href="http://www.fusebox.org/downloads/downloadablefiles/fusebox510.corefiles.cfmx.zip">official FB5.1/CFMX core files (v5.1.0)</a>

I don't know why, but the naming scheme kinda threw me for a second. I didn't know that FB was supported in CF, BlueDragon, and Railo, so that's good news if you aren't using Adobe CF. 

Unpack the zip, and like Model-Glue, you have two choices. Either extract to your web root, or create a CF mapping. I know folks under ISPs can't use mappings (sometimes), but I don't have that problem so thats the route I took.

As a quick aside, I was looking for install instructions at Fusebox.org, and it isn't on the <a href="http://www.fusebox.org/index.cfm?fuseaction=documentation.TheBasics">Documentation</a> page. You can only find it in the zip. (Look for the README.txt file.) Not a big huge deal, but with an easy install I think they should brag about it. Even if it wasn't easy, I think it should be documented on the web site anyway so folks have an idea what to expect.

Next you need (or may need) a basic Fusebox application template. The Fusebox folks call this the skeleton and it too can be downloaded from the site. Grab this file:

<a href="http://www.fusebox.org/downloads/downloadablefiles/fusebox510.skeleton.cfmx.zip">Basic FB5.1/CFMX skeleton application (v5.1.0)</a>

Extract this zip into your new web site (or folder), and you are good to go. 

And that's it. Nice. As easy as Model-Glue. You can see my skeleton (and yes, I kept it named that because I'm a dork) over here:

<a href="http://ray.camdenfamily.com/skeleton">http://ray.camdenfamily.com/skeleton</a>

At this point I've confirmed the application runs and I'm calling it a day. Next I'm going to continue on through the documentation and see if I can understand all the files in the skeleton.