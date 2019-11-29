---
layout: post
title: "Ask a Jedi: Ramping Up to CFMX N+1"
date: "2005-08-01T17:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/08/01/Ask-a-Jedi-Ramping-Up-to-CFMX-N1
guid: 661
---

paakay asks:

<blockquote>
I have 2 (hopefully good) questions. As a coldfusion author, when every new edition of cf comes out, what process do you go through to become familiar with the new features? Do you systematically attempt to try everything?
</blockquote>

This is a strictly personal response, but for me, the best thing to do is check the release notes. Typically these are very specific. Ie, we added foo() as a function. We changed goo() to return a small puppy instead of a boolean. Etc. Then I typically play with the new functions. It may sound silly, but let's say they just added the Now() function. The docs may say, Now() returns the current time, which is simple enough, but I'll drop it on a CFML page just to see it myself. I find that reinforcement helps me remember. Sometimes just seeing something in a real page of code
leads to other ideas as well. One of the things I've always enjoyed doing was pushing CF - trying wierd things - intentionally sending bad arguments to functions - etc. (In the old days, I even used to load up a hex editor and look for hidden functions. Now they are all stored in the ServiceFactory. -yawn-)