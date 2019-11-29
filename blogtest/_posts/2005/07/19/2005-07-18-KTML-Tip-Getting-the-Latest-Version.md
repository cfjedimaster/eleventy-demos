---
layout: post
title: "KTML Tip - Getting the Latest Version"
date: "2005-07-19T08:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/07/19/KTML-Tip-Getting-the-Latest-Version
guid: 631
---

My company used to employ the <a href="http://www.siteobjects.com/pages/soeditor.cfm">SiteObjects Editor</a> inside our CMS, <a href="http://www.mindseyeelement.com">Element</a>. This product had a number of issues, and the development has been stuck at 2.5 for quite some time. A client asked us to look at <a href="http://www.interaktonline.com/Products/KTML/Overview/">KTML</a>, and we were so impressed with it we decided to use it as the primary rich text editor for our CMS.

In general - the process of moving to KTML from SOE was a smooth one. The main problems we have had involve the fact that KTML assumes you want to use it from Dreamweaver. The notion of using it strictly as a custom tag works of course, but the docs don't help much on this. (Luckily the support at Interakt is pretty darn good.)

So - my latest problem was a bit wierd. When I first integrated KTML, I ran into an issue where I couldn't even find the files. The download contains an MXP (I believe) file that requires you to install it with the Macromedia Exchange doohicky. However, they also had demo files, and the demo files contained the extracted KTML code.

While at CFUNITED, KTML was updated to version 3.6.0. I followed the same procedure I had before. Since it was a minor update, I didn't really look around to confirm the code was updated. Turns out - the code used in the demos for the product were still on the old version.

I had Dreamweaver installed on my laptop. So I quickly worked up a page with a text area, got Server something or another set up, and then was able to apply KTML to it. A total and complete pain in the rear (grin), but I've already asked Interakt to look into making this easier, and I'm sure they will. (And thank goodness their support folk helped me since I had no idea what to do in Dreamweaver. ;)

So - I'm kind of rambling here - but if you are looking for a rich text editor, I'd consider taking a look at KTML. They do have a stripped down free version, but even the high end version isn't bad (75$). (I'm a big fan of free software - but I don't understand folks who will spend N times more time and trouble using a free package when something that costs just a little bit of money is so easy to use.)