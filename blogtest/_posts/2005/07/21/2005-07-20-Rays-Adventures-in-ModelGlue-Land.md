---
layout: post
title: "Ray's Adventures in Model-Glue Land"
date: "2005-07-21T08:07:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2005/07/21/Rays-Adventures-in-ModelGlue-Land
guid: 634
---

I've been interested in <a href="http://www.model-glue.com">Model-Glue</a> since it was first release, and I'm finally starting my first site on it - a complete rewrite of <a href="http://www.cflib.org">CFLib.org</a>. I thought it might be helpful to others if I share my development process along with the problems I run into. Bear in mind - I'm a MG newbie so I will probably do things the 'wrong' way, but I figured it might be helpful to other MG noobs if I shared. I'm also going to put the site online while it is in dev mode - but that may take a little while.

So - let's start with the first problem I ran into. To install MG, you can simply copy the ModelGlue folder from the zip to the root of your web site. You can then copy the "ModelGlueApplicationTemplate" to your web site to use as a bare-bones MG application.

So far so good. (More information can be found <a href="http://www.model-glue.com/quickstart/index.html#install">here</a>.) However - I don't like application resources to be under web root. MG has a set of folders: config, controller, model, and views that I felt needed to be moved out of web root. I also wanted to move Application.cfm out of web root as well. I did that, viewed my site, and promptly got this error:

Model-Glue: C:\projects\beta.cflib.org\wwwroot/config/ModelGlue.xml can't be found.

So - being the lazy person I am, I posted to the <a href="http://lists.topica.com/lists/modelglue">MG List</a> and promptly got a response from Sean saying I could fix this by simply adding: 

&lt;cfset ModelGlue_CONFIG_PATH = expandPath("..") & "/config/ModelGlue.xml" /&gt;

to my index.cfm file before the call to cfinclude the MG code. The sad thing is that this very line is described in index.cfm and I just missed it. Either way - I'm making progress!