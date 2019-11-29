---
layout: post
title: "Stormy weather.... ColdFusion Builder 2 on Labs"
date: "2011-03-03T01:03:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2011/03/03/Storm-weather-ColdFusion-Builder-2-on-Labs
guid: 4143
---

Woot! I'm a bit late for this but I'll blame it on me being halfway around the world. Last night (this morning?) Adobe released the public beta of ColdFusion Builder 2, AKA Storm: <a href="http://labs.adobe.com/technologies/coldfusionbuilder2/">Adobe ColdFusion Builder 2</a>. You can download it now for Windows and Mac.

This is - I think - a very exciting release. It's been my primary IDE for a while now and it feels like a tremendous update to Builder. I'll be doing a few more blog entries once I get back to the colonies, but here is a quick peak at what my favorite feature in Storm is - Views.

I've said for a while now that extensions are the absolute coolest part of ColdFusion Builder. But one of the things you couldn't do with extensions is create a non blocking view. What do I mean? Consider <a href="http://varscoper.riaforge.org/">VarScoper</a>, the excellent tool created by  Mike Schierberl. When run as an extension, the report is on top of Builder and can't be put to the side. This means as you work to fix the problems varScoper finds you have to keep rerunning it to see your progress. Here is an example:

 
<img src="https://static.raymondcamden.com/images/ScreenClip34.png" />

In ColdFusion Builder 2 however we can make use of views. I'll detail this more later, but get this. I modified Mike's extension to switch to a view in <b>one minute</b> - and this one minute change allowed me to put the report in a view.


<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip35.png" />

And yes - you can click on the files to open them in the editor. I've attached my version of Mike's code to this blog entry. Download it now and give it  try!<p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2009%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fvs%{% endraw %}2Ezip'>Download attached file.</a></p>