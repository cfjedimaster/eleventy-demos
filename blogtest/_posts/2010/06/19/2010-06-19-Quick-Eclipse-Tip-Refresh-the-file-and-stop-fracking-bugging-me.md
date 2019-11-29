---
layout: post
title: "Quick Eclipse Tip - \"Refresh the file and stop fracking bugging me\""
date: "2010-06-19T11:06:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2010/06/19/Quick-Eclipse-Tip-Refresh-the-file-and-stop-fracking-bugging-me
guid: 3852
---

Ok, I love the Eclipse platform, but it has a few... eccentricities that annoy the heck out of me. One of them involves how uppity Eclipse gets if a file is modified by another process. Instead of simply refreshing the file, Eclipse will give you a snooty message and demand you refresh the file. I complained about this on Twitter (is there any other reason to use Twitter) and <a href="http://stevegood.org/">Steve Good</a> let me know that you can set Eclipse to automatically refresh. Turns out he was exactly right:

<p>

<img src="https://static.raymondcamden.com/images/refresh.png" title="Thank you Eclipse for making the obvious not be the default." />

<p>

Woot. A few notes. First - in my testing, this did not pick up new folders. It did pick up new files in the folders. Secondly - if you have a file open and it's modified, you will not lose the file. In other words, you still get the normal "This file was modified - do you want to load" message. That's a good thing of course. What you <i>won't</i> get is a complaint if you open the file after it was modified by something else.

<p>

Anyway - hope this helps other and thanks Steve!