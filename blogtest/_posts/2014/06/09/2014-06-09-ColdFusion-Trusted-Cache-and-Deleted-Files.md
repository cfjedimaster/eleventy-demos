---
layout: post
title: "ColdFusion Trusted Cache and Deleted Files"
date: "2014-06-09T17:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2014/06/09/ColdFusion-Trusted-Cache-and-Deleted-Files
guid: 5241
---

<p>
Just a small warning to folks using trusted cache on their production ColdFusion sites. If you have it enabled, hit a particular file, and then delete it, ColdFusion will still serve the file up. That isn't too surprising I suppose, but you may not be aware of it. While I bet most of you know that, I bet a lot of you may make the mistake I made.
</p>

<p>
Instead of clearing the entire Trusted Cache, I always use the newer folder option, see here:
</p>

<p>
<img src="https://static.raymondcamden.com/images/ColdFusion_Administrator.png" />
</p>

<p>
This feature (which you can get via a ColdFusion Admin extension for older servers) lets you clear just one folder from the trusted cache. It is a kinder, gentler version of the "Nuke Everything From Orbit" button that clears the entire cache.
</p>

<p>
Except when I used this - it didn't work. It took me a few seconds (ok, minutes) to figure out why. The code behind this button gets all the files from the folder and clears them from trusted cache. Since the file I wanted to clear was deleted, it didn't work. The API for clearing the cache only supports files, not folders. (It should support both I'd say.) Obvious, right?
</p>