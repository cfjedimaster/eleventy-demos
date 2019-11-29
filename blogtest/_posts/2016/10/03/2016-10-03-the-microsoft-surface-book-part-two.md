---
layout: post
title: "The Microsoft Surface Book - Part Two"
date: "2016-10-03T09:09:00-07:00"
categories: [development]
tags: [windows]
banner_image: /images/banners/win10a.jpg
permalink: /2016/10/03/the-microsoft-surface-book-part-two
---

Last week I wrote up my first thoughts on the Surface Book ([The Microsoft Surface Book - Part One](https://www.raymondcamden.com/2016/09/26/the-microsoft-surface-book-part-one/)) and today I'm going to share more of my thoughts - this time more focused on Windows. I suppose I should change the title of the blog post as this is less about the hardware and more about the OS, but as I'm exploring all of this on the SB, I figure I'd keep up the theme at least. Also, I'll be talking a bit about hardware as well (external hardware) so it won't be all software based. Note - I'm going to avoid talking about anything really developer related until my next post. 

As I said in the first entry, Microsoft was gracious enough to let me borrow this hardware so a big thank you to them!

<!--more-->

Before I start talking about Windows, I'd like to do what I do previously and give a bit of context to my experience with Windows and how I felt about it before I left a few years ago. My first computer was an Apple 2, but my main computer in college and for years after were various different PCs. I was a huge Gateway fan (anyone else remember the cow boxes?) and would generally upgrade my PC every year and a half or so. (I justified the expense by using it as a tax write off.)

My last primary Windows OS was Windows 7 and it was fine. Not great, not awe inspiring, not without warts, but it worked and I got crap done and as I spend a heck of a lot of time behind a computer, that's all I really want. I'm hard pressed to really come up with any real issue with Windows that truly bothered me. I know sometimes I had to fight to get the right driver for something installed, but that was maybe once or twice a year. Yes, I had BSODs, but I've had that since day one with every machine I've owned. (On the Mac I'll get gray screens from time to time.) 

For the most part my move to OSX was just to try something new. In some ways OSX felt like a "dumbed down" OS, but I kinda dug the simplicity of it. Over the past few years it's stayed the same and that's fine too. Things got a bit shinier. But I'd be hard pressed to really tell you how different my current macOS is compared to the OSX I got five of so years ago.

In the meantime, apparently a lot was happening with Windows, and a lot of people didn't like it. Apparently the Start Menu morphed into some giant overlay that stood in your way and hid the desktop. I can totally see how that would tick people off. But I guess I missed all of that by going from 7 to 10. I'll talk a bit more about the Start menu in a second, but the point is, going from 7 to 10 doesn't feel like a huge change to me. Everything is where it used to be and the UI isn't radically different, but what *has* changed seems to be an improvement so far. 

Starting up
---

One of the first things I've fallen in love with is the login UI. Called "Hello", the new login screen allows for a password, PIN, and the real kicker, facial recognition.

![The new login](https://static.raymondcamden.com/images/2016/10/win1.jpg)

Basically you sit in front of your machine, look at it, and you login. I cannot stress how nice this is. I'm maybe 50/50 now between my MBP and my SB, and my God, every time I type in a password on my MBP I get a little bit annoyed. Of course, the latest version of macOS supports this... if you spend a couple hundred dollars on Apple's watch. Lord forbid they allow me to use the multi-hundred dollar iPhone 7 I have with me. No - that would be crazy. I need not one - but two Apple devices to login quickly. No thank you. I don't even use the facial recognition feature 100% of the time with Windows (due tu my external monitor) but I can't believe Apple didn't reconsider requiring the Watch for login.

Apps
---

One of the first things I did with Windows was to grab all the programs I use on OSX and see how well they worked. Again, I'm holding off on discussing developer stuff (and that new Bash shell) till my next entry, but in general, but here's a quick list of what I installed and noticeable differences/issues:

1) The very first thing I went for was Dropbox. I'm a longtime Dropbox user and I pay for the 1TB storage level. It's begun to act up on OSX but I figured that was just temporary. Unfortunately, it's not running well at all Windows either. Maybe I hit some threshold of files, but I can't get it to work properly on OSX *or* Windows now. Specifically with "Selective Sync". I use Dropbox's Camera backup feature and I don't need those camera pictures on my laptop. Right now I've had this window for a good 15 minutes:

![Dropbox for the fail](https://static.raymondcamden.com/images/2016/10/win2.png)

So I did have a *huge* amount of crap under Dropbox and I've probably removed 50% of it, but at this point Dropbox is pretty much dead to me. My subscription ends in December and I plan on killing it then. 

On the flip side, I'm a subscriber to Office 365 and OneDrive gives you a 1TB as well, so my plan is to move my storage there. Of course, OneDrive decided to have service issues the day I tried to move, so it's been a slow process, but that's the general plan. 

In the end, the biggest issue with both OneDrive and Dropbox is that they don't allow you to ignore files at the root level, specifically stuff like `npm_modules` and `platforms` (for hybrid mobile dev). For Dropbox you can ignore on a per folder basis, but doing so for every Node app would be overkill. I don't believe OneDrive supports this at all yet. I don't have a great answer for this issue yet. 

I love being able to build random crap and know that it gets backed up. I also don't want to use GitHub for my 'random crap' since it is - well - random crap. I just don't know now what I'll do about this.

2) Next I grabbed Chrome and Firefox. My plan though is to make more use of Edge. Edge seems fine now. I can't really tell you what it offers over Chrome or Firefox. It has good developer tools and good UI though. One thing I found right away is that Chrome looks "washed out" on Windows. I don't know why - but the entire UI is a bit dim. It's more an issue on my monitor than on the SB screen, but it is enough to bug me a bit. 

Here's a screen shot with Edge in the back and Chrome in front. Honestly, it probably doesn't look like much of a difference in the picture below, but to my eyes, it is noticeable and as I said, enough to make me prefer Edge. 

![Edge and Chrome](https://static.raymondcamden.com/images/2016/10/win3.png)

Oh, and I'm also seeing some memory issues with Chrome, but that's not Windows specific. I find that after coming back to Chrome after a few hours away, it can sometimes be pretty slow to come back to life.

If you're curious, Edge is doing a pretty good job at standards compliance as well. Here is what [HTML5Test](https://html5test.com/compare/browser/chrome-52/edge-14/firefox-48/safari-9.1.html) had to say:

![Pretty good!](https://static.raymondcamden.com/images/2016/10/win4.png)

3) I use Evernote for pretty much every single piece of information I care about that isn't file based. I'm an Evernote fiend. Since my memory is pretty crap, I try to copy everything I can to it. About all I can say about the Windows client is that it is ugly. The Mac version has gone through a few cycles of having ugly UI as well so maybe this is just temporary, but I don't care for it. It won't move me to anything else though. I've tried OneNote before, but I don't like how it organizes information.

4) Oh, speaking of OneNote, as I said above I'm an Office 365 user. So I grabbed all that too. I've used OpenOffice in the past and it is fine, but my work with publishers typically requires me to use Word, and I'm fine with that. I use Powerpoint as well and I've got to open XLS sheets every now and then.  

5) I really like [Fantastical 2](https://flexibits.com/fantastical) for the Mac, so I started to look around for something similar on Windows, but then thought - why not try the built-in Calendar app? The last time I tried this on Windows (I've got a Surface 3 I purchased about six months ago) it wouldn't connect to Google accounts, but apparently that's been fixed. I'm sure Fantastical has a lot more features, but in terms of what I actually use, Calendar looks just fine, and is pretty to boot.

![Calendar](https://static.raymondcamden.com/images/2016/10/win5.png)

The mail client is OK too, but I just use GMail in the browser.

6) Other things I installed were Slack (no real difference), Amazon Music (I use Amazon to store 20K+ MP3s and their desktop and mobile clients are pretty darn good), and of course - a bunch of stuff for my job, but as I said, that's for the next post.

Windows has an app store just like the Mac does and it works. That's all I can say about it. Honestly, I can see these app stores being real helpful to folks who use mobile devices more than desktops. They are used to going to an app store to find programs instead of downloading things from random URLs. Personally I don't care. 

The Start Menu of Doom
---

So as I said, apparently the Start menu had a bit of "drama" over the years. To me, it looks pretty cool. I like the tile UI (and in general, I've liked Microsoft's visual themes the last few years), but honestly, I never spend any time here. 

![I'm fine with this.](https://static.raymondcamden.com/images/2016/10/win6.png)

I hit my Windows key, and start typing, and the Start Menu finds my application perfectly nearly every time. In this way, it works the same as the Spotlight launcher in macOS and the same as Alfred did before Apple basically stole their idea. 

Along with matching apps, it also does a scary good job of finding various settings. Like for example, I had to configure how the SB reacted when the lid closed, and you can literally type "close" and the Start menu will suggest the relevant setting:

![Intelligent help.](https://static.raymondcamden.com/images/2016/10/win7.png)

I have clicked around a bit in the Start menu, but I just don't see myself every really using it. The Cortana speech integration is nice, but so far I've only asked it for the weather. (I'm a bit of a weather nut.) I like the fact that it can be started by simply saying "Hey Cortana", just be sure you don't set that up with multiple Windows 10 devices in the same room. (Yes, I did that, and yes, it was kind of funny.)

Hardware issues
---

One of the first things I wanted to do with my SB was hook it up to an external monitor. I had a 28 inch Mac display that was nice... but Thunderbolt. Sigh. So I went out and picked up a new monitor. Specifically the 28 inch Samsung 4K UDH monitor. Windows found it immediately - but didn't use the right resolution. So I fixed it. And then it broke again. Then it worked. Then I rebooted and Windows was never able to get the right resolution back on the monitor. I have no idea why. I was using a mini-display port to HDMI dongle and I thought perhaps that was the issue. I know HDMI had a max resolution much less than what the Samsung could do so I figured that could be an issue. 

I first bought a mini-display port to mini-display port cable and quickly discovered my Samsung had a 'regular' display port connector. Sigh.

I then bought a mini-display port to regular display port and all was well. I had to spend some time working on the display settings to make it crisp enough for my eyes, but it's working well so far.

![The monitor](https://static.raymondcamden.com/images/2016/10/win8.jpg)

As I said before, please excuse my non-professional product shots.

One odd thing is that I had to configure Windows to *not* go to sleep when I closed the lid and an external monitor was used. I don't remember if I had to worry about that on my Mac, but it was just one setting to tweak and it was corrected.

I also picked up the [Surface Dock](https://www.microsoft.com/surface/en-us/accessories/surface-dock). This is a dock specifically built for the Surface (I bet you couldn't guess that). It provides power and multiple USB connectors for your various input devices. It also has an audio out which is nice as the audio out on the SB is in a weird place. I've got my video going out from there as well. It feels a bit pricey at $199 (I paid for this by the way, not Microsoft, which along with the monitor purchase should give you an idea as to how much I like the device) but it works. The only real issue so far is that I don't have a webcam for facial recognition and I need to plug in my microphone eventually, but if you plan on using the SB at a desk, I recommend it.

![The dock](https://static.raymondcamden.com/images/2016/10/win9.jpg)

Let's play a game!
---

I've been a gamer for probably thirty plus years now. I did most of my gaming on PCs as a young adult, but switched over to primarily console playing a decade or so ago. I still play computer games, but normally just as a way to pass time when I'm on a business trip. 

I was pretty curious to see how well games would play on the SB but so far it has been hit or miss. I tried Forza, but it was somewhat slow and complained about memory issues. The SB model I have does have a dedicated GPU, but perhaps it didn't see it. Pinball FX2 was cool, but Windows kept asking me if I wanted to enable Sticky Keys so I had to disable that (again, a quick Start-menu search). 

I also tested Diablo 3, Civ 5, and Oblivion. All worked as expected.

I'm not sure if I'll start playing more games on the SB, but I'm definitely curious to try.

Wrap up
---

So, all in all, I want my OS to not bug me when I'm getting stuff done. So far, Windows seems to be just fine with that. The UI is crisp, there aren't any real surprises, and I don't imagine I'll spend a lot of time thinking about it which is exactly what I want.

I can say the developer experience is a whole other story, but you'll have to wait a few more days for that. As before, if you've got any questions, please leave me a comment below!