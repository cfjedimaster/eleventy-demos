---
layout: post
title: "Keeping Up with Browser Updates"
date: "2018-06-07"
categories: ["development"]
tags: ["development"]
banner_image: /images/banners/browsers.jpg
permalink: /2018/06/07/keeping-up-with-browser-updates
---

This is something I've been kicking around in my head for probably near two years now. I pitched it to a few publications and conferences and it never quite worked out, so I thought it would be nice to simply write up my thoughts here. As a web developer who has been in this biz since, pretty much, day one, I'm *incredibly* happy with how far the web has come and how great our platforms are now. That is certainly *not* to say that everything is ideal, but we've come a long way and I think that deserves to be celebrated.

One of the core ways our platforms have evolved is with our browsers. That's probably an obvious point to make, but specifically the *speed* of updates have been a tremendous benefit for both consumers and developers. I still remember the big, yearly or so, release of new browser versions as being a big deal. Now our browsers update (mostly) automatically and near constantly. For a good year or so now I couldn't honestly tell you what version of Chrome I was using. And that's with me trying to pay attention. Instead of a particular number now, when I think of browsers I tend to think more of their general support level and features and not a "X.0 release". 

Of course - this presents a bit of a problem. Given that our browsers may be updating multiple times in a month, versus a year, how can we see what's changed?

And to be clear, I'm not just talking about fancy new JavaScript APIs. Consumer-facing changes are also pretty crucial. For example, Chrome has been changing how it identifies secure versus non-secure sites in pretty significant ways. As another example, Firefox recently added a screenshot tool to their browser. Both of these things aren't code related at all but are certainly important. 

The question is - how well do these browsers present this information? In my opinion, there are a few basic things browser vendors should do. As I said, this is my opinion, but you're on my blog so you should be expecting it!

* The browser itself should lead you to this information. What I mean is - I shouldn't have to Google to find it. This is my first rule for a reason. If you "hope" your followers on Twitter see something than you have failed. Period. 
* The information should cover both consumer-facing changes as well as developer facing information.
* High level coverage is absolutely fine - remember these are release notes. It is also completely fine to link to blog posts that have deeper examples and docs. 

So basically - don't make me hunt, include both dev/non dev, and give me a high level summary where I can choose what topics I care about.

With that out of the way, let's take a look at how the major browsers handle it.

### Firefox

I'm starting with Firefox for two reasons. First - it has been my primary browser for a few months and secondly - it is the "gold standard" for me in terms of doing a good job.

Firefox provides a link to it's update information from their About Firefox window:

![Firefox About text](https://static.raymondcamden.com/images/2018/05/b1a.jpg)

That leads you here: [https://www.mozilla.org/en-US/firefox/60.0.2/releasenotes/](https://www.mozilla.org/en-US/firefox/60.0.2/releasenotes/)

<img src="https://static.raymondcamden.com/images/2018/05/b2.jpg" alt="Firefox Release Notes" class="imgborder">

First off - from a design perspective - this is a very clean, not-overwhelming page. By default it's focused on consumer changes, which makes sense. Also note the tab bar on top that lets you see changes for their mobile versions as well. 

It is a bit hard to see, and I think it should be more visible, but in the bottom right corner under "Other Resources" is the link to ["Developer Information"](https://developer.mozilla.org/en-US/Firefox/Releases/60). This is where you would find the other set of documentation you'll need. Note that they do a dang good job of grouping changes into various categories. This lets you skip stuff you may not care about:

<img src="https://static.raymondcamden.com/images/2018/05/b3.jpg" alt="Firefox Developer Changes" class="imgborder">

On both the consumer and developer facing pages, they also do a good job of linking to earlier versions in case you need to dig deeper into the past. And I know I said it earlier, but again, I love the design and organization of these pages. The only possible change I'd make would be highlighting the developer information link a bit more back on the initial page.

### Chrome

Ah, Chrome. For the past year or so I've given their developer advocates/engineers some trouble by *constantly* asking them to up their game here. I'm trying to stop as it's getting annoying (I'm sure). Chrome is the number one browser and has incredible market share, but I think they need to do a better job here. 

To begin with, the "About Chrome" page is pretty sparse, and in my opinion, wasting a lot of opportunity here.

<img src="https://static.raymondcamden.com/images/2018/05/b4.jpg" alt="Chrome's About Page" class="imgborder">

The one link on there related to help goes to consumer information, but not any release notes. Ok, so what else can we try? If you open up devtools and a new version was recently installed, you actually get an automatic additional panel with release notes. I don't have a screenshot of this, but it's fairly well done. In devtools you can also click the three dot menu, go to Help, and then get links to release notes:

<img src="https://static.raymondcamden.com/images/2018/05/b5.jpg" alt="Chrome's Devtools Menu" class="imgborder">

This currently links to [https://developers.google.com/web/updates/2018/04/devtools](https://developers.google.com/web/updates/2018/04/devtools) which is specific for the current version. If you click on "Updates" on top of that page, you end up here: [https://developers.google.com/web/updates/](https://developers.google.com/web/updates/).

<img src="https://static.raymondcamden.com/images/2018/05/b6.jpg" alt="Chrome's Update page" class="imgborder">

Ok, so technically this isn't a "version updates" type page and is more generic, but, I really like it. You've got an article specifically on changes in Chrome 67, but also callouts on a PWA change. It's a good mix. You can also filter on the "By Year" tab to do more historical browsing. 

Technically this is partially consumer facing stuff as well, but it doesn't necessarily feel like it is organized in such a way to make it easier to differentiate. It could also just be the current mix of articles I'm seeing. 

Finally... there is a dang good tool for tracking changes: [Chrome Platform Status](https://www.chromestatus.com/features). 

<img src="https://static.raymondcamden.com/images/2018/05/b7.jpg" alt="Chrome Platforum Status" class="imgborder">

This provides a quick way to look for specific features and filter to a particular version. I really wish this was linked to from that giant, empty, About Page, just to help discoverability. And I'd love to hear from my readers in the comments below if you were even aware of this page.

Oh, and Chrome... fix this:

<img src="https://static.raymondcamden.com/images/2018/05/b8.jpg" alt="Chrome Platforum Status" class="imgborder">

### Microsoft Edge

Before I begin, if I see one "Internet Explorer 6 did blah blah comment" I'm going go puke. It's time to move on from IE. Edge is... a pretty darn good browser. If Firefox had not made some huge strides lately, I could see me using it over Chrome. I do want to spend more time in Edge and I've recently 'dedicated' some sites to that browser as a way of forcing myself into it. 

If you click Edge's "three dot menu" (what are we calling this, by the way, not a hamburger menu but...?) you'll see a "What's New and Tips" link. That takes you here: [https://microsoftedgetips.microsoft.com/en-us/?source=menu](https://microsoftedgetips.microsoft.com/en-us/?source=menu)

<img src="https://static.raymondcamden.com/images/2018/05/b9.jpg" alt="Edge Devtools What's New Page" class="imgborder">

It's pushed down quite a bit by the hero banner on top, but you can see the focus is on consumer facing changes. 

If you open devtools and click the help icon there, you end up here: [https://docs.microsoft.com/en-us/microsoft-edge/devtools-guide?source=f12help](https://docs.microsoft.com/en-us/microsoft-edge/devtools-guide?source=f12help). This is the core documentation for their devtools, but the first submenu item is a "What's new" that takes you here: [https://docs.microsoft.com/en-us/microsoft-edge/devtools-guide/whats-new](https://docs.microsoft.com/en-us/microsoft-edge/devtools-guide/whats-new). You could bookmark that as a quick way of checking what's new. Also on this page is a "Dev Guide" and if you open that there's a what's new there too: [https://docs.microsoft.com/en-us/microsoft-edge/dev-guide/whats-new](https://docs.microsoft.com/en-us/microsoft-edge/dev-guide/whats-new).

<img src="https://static.raymondcamden.com/images/2018/05/b10.jpg" alt="Edge What's New Page" class="imgborder">

And if you're like and are a bit confused by "EdgeHTML", this is simply the name of the rendering engine for Edge (and other components). You can think of it like Blink for Chrome or Webkit for Safari.

Microsoft gets bonus points for using CodePen for their demos. I just noticed that and dang that's cool.

### Safari

So well... err... you see... I'm a Windows machine and while I've got a Mac, I haven't turned it on in over a month. So I can't talk to the "out of the box" type experience in terms of discoverability type issues, I can try to share what I've found by searching. When I searched for "safari browser whats new", the first link looked perfect:

<img src="https://static.raymondcamden.com/images/2018/05/b11.jpg" alt="Safari" class="imgborder">

Which takes you here: [https://developer.apple.com/library/archive/releasenotes/General/WhatsNewInSafari/Introduction/Introduction.html](https://developer.apple.com/library/archive/releasenotes/General/WhatsNewInSafari/Introduction/Introduction.html)

And the first thing you see is: "Important: This document is no longer being updated. For the latest information about Apple SDKs, visit the documentation website." *Sigh* But they do link to the right place: [https://developer.apple.com/safari/](https://developer.apple.com/safari/)

<img src="https://static.raymondcamden.com/images/2018/05/b12.jpg" alt="Safari Help" class="imgborder">

There's a good ["What's New"](https://developer.apple.com/safari/whats-new/) link there that appears to cover both consumer and dev information. 

Overall this looks good - but I'm not quite sure where I could find older information, like for Safari 11. 

### Wrap Up

I hope this little write up is helpful. I did not include other browsers like [Brave](https://brave.com/) (which is darn good, it is my default on iOS) but I'd be happy to see folks share information in the comments below. 

<i>Header photo by <a href="https://unsplash.com/photos/UAiUNEv3USM?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Roberto Lopez</a> on Unsplash</i>
