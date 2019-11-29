---
layout: post
title: "Quick AIR Tip - including an icon with your application"
date: "2008-09-17T16:09:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2008/09/17/Quick-AIR-Tip-including-an-icon-with-your-application
guid: 3021
---

A few nights ago I was working on a personal AIR project and wanted to include an icon with it. This was - so I thought - rather easy. I found a nice icon, saved it into an assets folder, and then edited mything-app.xml:

<code>
&lt;icon&gt;
&lt;image16x16&gt;&lt;/image16x16&gt;
&lt;image32x32&gt;&lt;/image32x32&gt;
&lt;image48x48&gt;&lt;/image48x48&gt;		&lt;image128x128&gt;assets/strogg128.png&lt;/image128x128&gt;
&lt;/icon&gt;
</code>

Generating the AIR file though threw an odd error:

<img src="https://static.raymondcamden.com/images/Picture 120.png">

Um, yeah, that's nice and verbose, thanks. After some googling I knew it was icon related (and could confirm by rolling back my change to the XML file), but I couldn't figure out what was wrong. I tried moving the icon around, and tried different paths, but nothing worked. 

Finally, Mike Chambers helped me out and pointed out the issue. Turns out when I have picked an icon I had only set a 128x128 icon. I was too lazy to resize the icon. Well AIR didn't like that. It thought I had specified icons for all sizes, but had used blank values for the other three sizes. This is what made AIR throw a fit. Personally I think that's a bit silly. If the value exists, but is blank, it should be treated like a null, but whatever. It was certainly non obvious to me, and I appreciate Mike helping me out. The fix I used (at first, I did end up making smaller sized icons) was to simply surround the 3 XML entries for the other icons with a comment:

<code>
&lt;icon&gt;
&lt;!--
&lt;image16x16&gt;&lt;/image16x16&gt;
&lt;image32x32&gt;&lt;/image32x32&gt;
&lt;image48x48&gt;&lt;/image48x48&gt;
--&gt;		&lt;image128x128&gt;assets/strogg128.png&lt;/image128x128&gt;
&lt;/icon&gt;
</code>

Woot. That made it build. I did end up with an issue with my 48x48 icon. Maybe I resized my graphic wrong, but I ended up not being able to build until I kept that one commented out, but I figure supporting 3 of the 4 sizes is enough for an application that will have a grand total of one user.