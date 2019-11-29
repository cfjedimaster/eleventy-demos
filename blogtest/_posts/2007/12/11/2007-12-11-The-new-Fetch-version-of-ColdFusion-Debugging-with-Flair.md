---
layout: post
title: "The new, Fetch version of ColdFusion Debugging (with Flair)"
date: "2007-12-11T12:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/12/11/The-new-Fetch-version-of-ColdFusion-Debugging-with-Flair
guid: 2530
---

I've done a lot of playing around with ColdFusion's debug and exception templates. As I like to remind people - these templates are all CFML and open source. You can play with them to your hearts content. You should be careful obviously, especially if you modify the exception template. This "play" is what led to the <a href="http://coldfire.riaforge.org">ColdFire</a> project.

Earlier today a reader said they asked Adobe to consider modifying the default debug and exception templates and how they handle queries. Specifically, they wanted to replace the ? for bound parameters with the real values. This makes complex queries with lots of bound parameters much easier to read. I quickly wrote up a mod to the debug template, default.cfm. To use this file, save it in your debug folder and select it from the ColdFusion Administrator. It works the exact same as the classic debugging, except it will attempt to replace bound parameters. Enjoy. I'll mod the exception template a bit later today given enough free time.

As a reminder - if you use ColdFire, this is baked in as well.

There are two movie references in this title. A free copy of CFWACK Book two to the first person to name them. (With the understanding I have to find time to get to the UPS store, and it may take me a week or so, and with Christmas, you may not get it to January.)<p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5Cwww%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fdeluxe%{% endraw %}2Ecfm%2Ezip'>Download attached file.</a></p>