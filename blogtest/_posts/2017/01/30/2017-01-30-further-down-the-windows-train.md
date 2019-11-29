---
layout: post
title: "Further Down the Windows Train..."
date: "2017-01-30T10:32:00-07:00"
categories: [development]
tags: [windows]
banner_image: 
permalink: /2017/01/30/further-down-the-windows-train
---

About three months ago I [wrote up](https://www.raymondcamden.com/2016/10/28/finalish-thoughts-on-the-microsoft-surface-as-well-as-apple) my "finalish"
thoughts on the Surface Book (which, as a reminder, Microsoft provided) and Windows. As was obvious by the title, I had planned
to come back later and talk more about how the 'transition' is going, how the SB is holding up, and more. By my calendar
it is officially "Later" so here's an update.

Surface Book
---

The Surface Book has 100% replaced my MacBook as my primary laptop. I gave my first presentation on it about two weeks ago,
but I have to be honest and say that until I've done a few more, my plan is to travel with the MBP just in case. This is less
a fear of hardware issues and more a general worry that I want nothing, ever, to interfere with me giving a good presentation. I've got
a bunch of presentations [coming up](https://www.raymondcamden.com/speaking/) so I'll be able to quickly see how well the 
hardware works in front of a crowd. I've got two dongles for the mini display out (one for VGA and one for HDMI) so I should be
covered.

I still have two lingering issues with the Surface Book. The first is the track pad. There's nothing wrong with it, but it's different
from the MBP. For some reason, I adapted rather quickly to the new keyboard layout, but it has taken me longer to get used to the
trackpad on the SB. It's hard to describe, but if I had to, I'd say that the issue is that I need to provide about 5% more 'force' when
I move my fingers on it. My muscle memory for using the trackpad is taking longer to adapt than the my muscle memory for
the keyboard. (In fact, now I struggle to use the MBP keyboard.) At home I'm using a keyboard so I find that when I travel and use
the SB all day, every day, it becomes a non-issue. 

The second issue is that - lately - I've seen it fail to come back from sleep and I have to power cycle it. I've disabled sleep
when it is connected to a power supply for now and I'm fine with that. Frankly, "sleep" has been an issue with every single device 
I've ever owned. I figure after the next Windows update I'll try it again and see if it's corrected, but I'm just not concerned about it now. 

As I've said before - I'm convinced this is my laptop line for the next decade. In a year or two when I'm ready to upgrade, I'll be getting 
a SB 2 (or 3). I have no interest in the new Macbook. At all. 

Windows
---

I don't have much to report here. I settled on using [ConEmu](https://conemu.github.io/) for my console tool with 
[cmder](http://cmder.net/) as the actual shell. I'm still not using Bash for the reasons I said before 
(having to reinstall Android), and because (afaik), I can't run Bash in ConEmu (no, wait, I can, just found out I can! ;) 

I still find npm tasks to be slower than on OSX. As an example, and this isn't terribly scientific, I ran <code>ionic start jan30</code> on my Mac and Windows machine. The ionic CLI
uses Node/npm to execute. It took Windows 30 seconds longer to complete than the Mac. 

Ok - so I stopped writing this blog post and did some testing. In Bash, outside of ConEmu, I noticed things ran a bit quicker, cutting the difference
to about 20 seconds. Still a pretty noticeable change. 

I then tried turning off my AntiVirus real time protection. Back when I first got my SurfaceBook, I seem to remember this being a
suggestion (not *completely* mind you!) and I can verify that the Ionic CLI ran a heck of a lot quicker. In my test (yes, one test), it
was 5 seconds slower than the Mac, which is something I probably wouldn't even notice. So now my task is to figure out
how to keep real time scanning on but have it *not* impact npm tasks. (And I just looked - I'm using McAfee LiveSafe and it looks
like I can't tell it to ignore certain paths, just *specific* paths. Not sure what to do now.)

The other issue I had was with Skitch, an app no longer produced that I used the *heck* out of on my Mac. It takes screenshots
and lets you add annotations. This was a great tool for blog posts. Turns out though that this was wrapped 
into Evernote, I just didn't know it! 

Dell Hell
---

Ok, not hell, but I'm back on a Dell. I bought my first new desktop in probably near 5 years. I got a Dell XPS with a
high end graphics card as I may try PC gaming again. And because, well I like the shiny. It's a pretty darn fast machine and
I love the storage (500 gig SSD + 2 TB old style). I'm running [Plex](https://www.plex.tv/) on it for my media which is a really cool
service for sharing pictures, video, and music in your house.

p.s. I kinda feel like this blog post isn't terribly helpful. To be honest, life has been pretty busy lately and what's been going
on in our world has been crazy. My ability to focus is a bit of whack. Sorry about that. If folks have any questions about
my experience moving (back) to Windows that I haven't covered yet, please let me know!