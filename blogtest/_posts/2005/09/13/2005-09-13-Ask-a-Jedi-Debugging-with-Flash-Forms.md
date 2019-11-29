---
layout: post
title: "Ask a Jedi: Debugging with Flash Forms"
date: "2005-09-13T16:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/09/13/Ask-a-Jedi-Debugging-with-Flash-Forms
guid: 771
---

This one came in today, and since I just answered a Flash Form question, I tghought I'd add it:

<blockquote>
Ray, is there a way to turn on debugging for flash forms so I can see actionscript errors instead of the form just not compiling and showing a blank page?
</blockquote>

If you go to your CF Admin, Debugging and Logging, Debugging Settings, you will see this option: 

<b>Flash Form Compile Errors and Messages</b>
(Development use only) Selecting this option causes ColdFusion to display ActionScript errors in the browser when compiling Flash forms, and affects the display time of the page. 

You will want to turn this on - but obviously only on your development machine.

You can also get at the full MXML used to generate the form. A blog posted a good entry on how to get to it, but the blog seems to be down for now. In case it returns, here is the <a href="http://www.newsight.de/2005/09/12/how-i-get-the-source-of-a-compiled-flashform/">url</a>.