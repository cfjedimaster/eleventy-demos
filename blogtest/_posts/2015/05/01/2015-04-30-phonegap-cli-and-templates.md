---
layout: post
title: "PhoneGap CLI and Templates"
date: "2015-05-01T09:33:09+06:00"
categories: [development,mobile]
tags: [phonegap]
banner_image: 
permalink: /2015/05/01/phonegap-cli-and-templates
guid: 6098
---

A few days ago the PhoneGap team announced an update to the CLI: <a href="http://phonegap.com/blog/2015/04/28/phonegap-cli-5.0.0-0.27.0/">PhoneGap CLI 5.0.0 Released!</a>. To be honest, I don't typically make use of the PhoneGap CLI as I mostly use either Cordova or Ionic. However, I missed an earlier update that I think is pretty cool (and it is one I was able to help out with) - template support.

<!--more-->

When creating a PhoneGap project, you can request a template to be used instead of the default PhoneGap project. You've been able to copy from a directory for a while now (using --copy-from or --link-to), but this new feature lets you specify from a set of templates that might be useful for seeding a new project.

To see what templates exist, you execute: <code>phonegap template list</code> (you can also replace <code>template</code> with <code>recipe</code>):

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/05/shot1.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/05/shot1.png" alt="shot1" width="850" height="152" class="alignnone size-full wp-image-6099" /></a>

There are only four templates so far, but more will be coming in the future. I've said before that I'm <i>not</i> a fan of the default template used by both Cordova and PhoneGap, so I'm happy to see <code>blank</code> as an option. The jQuery Mobile template is one I built. To use a template, you simply use <code>--template name</code> when creating your application.

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/05/shot2.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/05/shot2.png" alt="shot2" width="850" height="69" class="alignnone size-full wp-image-6100" /></a>

My template includes the latest jQuery Mobile assets, and includes JavaScript code that will fire a method when both jQuery Mobile <i>and</i> PhoneGap is ready to run. If you're curious, you can see the repo here: <a href="https://github.com/cfjedimaster/jQuery-Mobile-Starter">https://github.com/cfjedimaster/jQuery-Mobile-Starter</a>.