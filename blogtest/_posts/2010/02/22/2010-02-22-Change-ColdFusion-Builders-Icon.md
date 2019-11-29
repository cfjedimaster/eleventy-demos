---
layout: post
title: "Change ColdFusion Builder's Icon"
date: "2010-02-22T12:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/02/22/Change-ColdFusion-Builders-Icon
guid: 3730
---

So while I love ColdFusion Builder, I'm not a big fan of the logo. To me, it looks <i>way</i> too close to the ColdFusion Server logo, and while I can live with it, Eclipse makes it pretty darn easy to change. All you have to do is fine the CFBuilder.ini file. On the Mac, you would right click on CFBuilder.app and do "Show Package Contents". On the PC, you would sell your laptop and buy a Mac. Once you've got the file, just find this line:

<code>
-Xdock:icon=../Resources/cf.icns
</code>

and change it to whatever you want. So for example, I changed mine to:

<code>
-Xdock:icon=/Users/ray/Pictures/studio.icns
</code>

And now I can run it in "Old School" mode:

<img src="https://static.raymondcamden.com/images/mydock.png" title="Studio Forever, Baby" />

You can download the ICNS file I used below. I also tried CFDude:

<img src="https://static.raymondcamden.com/images/cfjedi/Screen shot 2010-02-22 at 9.51.56 AM.png" title="I'm too sexy for this dock." />

But the icon was a bit too small. Note - when you start CFBuilder, you will see the original icon for a second or two. After it goes done loading though the new icon will be used.<p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2009%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fstudio%{% endraw %}2Ezip'>Download attached file.</a></p>