---
layout: post
title: "My Tech Stack (So Far) in 2020"
date: "2020-04-29"
categories: ["development"]
tags: []
banner_image: /images/banners/cups.jpg
permalink: /2020/04/29/my-tech-stack-so-far-in-2020
description: A look at my tools
---

From time to time I like to share my current tech stack, both in terms of what I use for development as well as what I use in production. It's been a while since I did this and a few days ago someone reached out and asked me about it:

<blockquote>
Hello Raymond, I've read your ColdFusion blog for a while now and found it quite helpful. Lately it seems like you have largely switched to Node and Vue for back end and front end development respectively. I wanted to ask why you picked Node and Vue rather than some of the other back end frameworks like Django, Spring, and Rails or front end frameworks Angular and React. My apologies if you have already made a post discussing this but I am very curious.
</blockquote>

Let me start with my local development platform.

## Operating System - Windows 10

I've been a Windows user for a few years now (and long ago of course). I started to get a bit dissatisfied with Apple a while ago and seeing WSL (Windows Subsystem for Linux) at a conference was all it took to push me back to it. It certainly is not perfect, but it works for me. I use the [Windows Insider Slow Ring](https://insider.windows.com/en-us/) version to preview new features and generally it's been stable. I also liked that it gave me more choices in hardware. And on that note...

## Laptop - Dell XPS 15

Initially my switch back to Windows was with the Surface Book (and then the Surface Book 2). The Surface Book is an incredible machine. I used it at some conference for a few minutes and immediately fell in love with the keyboard and just dug the machine in general. While I liked it, I realized I *never* used one of the core features - separating the screen from the keyboard. I'm one of those people where if I don't have my phone/tablet in a protector of some sort, I just don't use it. I'm paranoid I'm going to drop and shatter my device. (Oddly enough, I *did* drop my Surface Book, the complete unit, and had to send it in for repairs.) Given that it felt like I was paying for functionality I didn't want, I decided to go with Dell. Before I had switched to Macs, I was primarily a Dell person and while I've had trouble with their support in the past, I generally liked their hardware. 

The XPS 15 is an amazingly fast machine with a great screen. My only real complaint is the sound. While I don't expect a lot from a laptop, but sounds really muffled, especially when it's on my laptop. Of course headphones remove that problem. I've also got a Dell desktop that I use when I'm not on the road, but with Corona, I've been 100% (mostly) laptop based while the kids are around. I'm going to replace that desktop with a newer version later this year.

## Editor - Visual Studio Code

I've been using [Visual Studio Code](https://code.visualstudio.com/) since it first came out and honestly I'm kinda blown away by how good it is. As with Windows itself, I use the Insider version so I can get newer features sooner. In the two years (I think) I've used Insiders, I've only had to "revert" to the mainline Studio version once or twice which I think is a pretty amazing record. 

I was a huge [Adobe Brackets](http://brackets.io/) fan, but Adobe has left that to die unfortunately. They did have a recent release, but in general development has slowed to a crawl. (Looking at their blog, they had two releases in 2019. Two.) 

The only thing I miss about Brackets is that extension development was somewhat simpler. I do have a few extensions released for Code so it's not impossible to do at all, just not... easy. Speaking of extensions:

## Editor Extensions

The extensions I use tend to fluctuate a bit, and honestly, looking at my extension list now there's some I simply forgot I installed. I'll try to list the ones I actually know I use on a semi-regular basis.

* [BetterTOML](https://marketplace.visualstudio.com/items?itemName=bungcip.better-toml) - literally just for when I'm editing toml files related to Netlify.
* [coldfusion](https://marketplace.visualstudio.com/items?itemName=ilich8086.ColdFusion) - for when I want to pretend it's 2005 and I still write ColdFusion. Ok, that was snarky. I do still write ColdFusion from time to time and this extension provides basic language support. 
* [Escape HTML](https://marketplace.visualstudio.com/items?itemName=raymondcamden.htmlescape-vscode-extension) - my extension! It lets you select code and will output (in a new panel) the escaped HTML version. I use this in blogging.
* [Markdown All in One](https://marketplace.visualstudio.com/items?itemName=yzhang.markdown-all-in-one) - a great extension for folks who write a lot of Markdown.
* [Peacock](https://marketplace.visualstudio.com/items?itemName=johnpapa.vscode-peacock) - fun little extension that can automatically change the Window colors of your Code editor. Nice when you've got multiple windows open and need to differentiate between them.
* [Polacode](https://marketplace.visualstudio.com/items?itemName=pnp.polacode) - I don't use this often, but it provides screenshots of code. I'll use it if I'm building with Powerpoint, but lately I've been back on the Reveal.js bandwagon.
* [Spell Right](https://marketplace.visualstudio.com/items?itemName=ban.spellright) - for spell checking. I do a *lot* of technical writing in Code. Heck, probably more than I write code.
* [Vetur](https://marketplace.visualstudio.com/items?itemName=octref.vetur) - for Vue.js support.
* [VSCode Map Preview](https://marketplace.visualstudio.com/items?itemName=jumpinjackie.vscode-map-preview) - for GeoJSON support in Code.
* [Word Count](https://marketplace.visualstudio.com/items?itemName=ms-vscode.wordcount) - for - wait for it - word counts. Again, I do a heck of a lot of technical writing. 

## Browser - Microsoft Edge 

I was a Firefox user for some time (and have a huge amount of respect for Firefox) in general, but decided to give [Edge](https://www.microsoft.com/en-us/edge) a try when they switched to the Chromium engine. I was pleasantly surprised. It seems to be much nicer in terms of memory management than Chrome was (and yeah, I get that it's typically the fault of extensions, pages, etc, but still) and I just like it. Feel fresh. Ok, that's kinda lame and not very technical, but it is what it is. Initially I ran into a few bugs. For example, I couldn't paste in an image into a new tweet on TweetDeck, but that fixed itself over time. (Maybe it was an issue in TweetDeck, not Edge.) In general, everything just seems to work. 

Oh, and yeah, I use TweetDeck, with the Better TweetDeck extension, in "install from site" version. It's basically the desktop PWA so it has it's own chrome. I prefer that to it taking a tab in my browser.

## Command Line - Microsoft Terminal

I *love* the new [Windows Terminal](https://github.com/microsoft/terminal) program. I was initially excited about it because it added tabs, but it's a great little app for multiple reasons. I love how easy it is to configure it, I love having WSL tabs and cmd.exe tabs in the same window, it's just great. You can find other terminal programs with tabs, but none of them felt right to me.

<p>
<img data-src="https://static.raymondcamden.com/images/2020/04/stack1.png" alt="Windows terminal" class="lazyload imgborder imgcenter">
</p>

I used [Hyper](https://hyper.is/) for a while, but formatting issues creeped in that never seemed to get fixed. It basically became unusable to me. 

So that's what I use locally, what about in production, or, as they say - the cloud....

<p>
<img data-src="https://static.raymondcamden.com/images/2020/04/stack2.jpg" alt="The Cloud" class="lazyload imgborder imgcenter">
</p>

## Static Site Generator - Eleventy

I [first discovered](https://www.raymondcamden.com/2019/10/12/why-im-digging-eleventy) Eleventy back in October, and it didn't take long for me to really like it. To the point that I [switched](https://www.raymondcamden.com/2020/02/27/raymondcamdencom-now-powered-by-eleventy) my generator for this blog to Eleventy in February. I love the flexibility and that it's built on Node. You can read more about my thoughts on Eleventy at my [tag page](https://www.raymondcamden.com/tags/eleventy/) for it. Previous generators I've used have either been too constricting (Hugo) or used tech I didn't care for (Jekyll, and in that case it was Ruby). 

## JavaScript Library - Vue.js

Because React and Angular suck. I'm joking, honest! OK, actually, not really. I tried React and didn't like it. It just felt weird to me, although obviously it's a successful, powerful framework and is easily the most popular one. I used to like Angular quite a bit, but it's big 2.0 shift really felt like it was poorly handled. I like the update, but everything just seemed to get messy for a while and it was a turn off. 

If all of this sounds personal and arbitrary, it is. 

I fell in love with Vue for a few reasons. The biggest is that it felt like something I could use for progressive enhancement, or to be less fancy, to just add a bit of interactivity to a web page. 

So remember in the days before everything was an app? Remember when someone would have an existing web page and it just needed some interactivity? I do. It feels like you don't hear people talking about that anymore. It's all about the build process and single page applications. While that's important, it's also not the only way to use client-side scripting. 

Vue handles both "simple page interactivity" and "full on hard code SPA" beautifully. 

I also just dig Vue's syntax. Being able to use a template language in HTML feels natural. The way Vue sets up an application just feels natural. 

Much like how ColdFusion used to feel like a great platform for people who weren't "traditional" developers, Vue also feels very friendly to those of us who couldn't pass a Google interview coding test on our best day. 

## Hosting - Netlify

Simple - [Netlify](https://www.netlify.com/) is the gold standard for hosting static web sites. It's support of the JAMstack in general is incredible and I've yet to see anything that comes even close. You've got great GitHub integration, support for form processing, post processing of CSS, analytics, and serverless functions. 

I use Zeit, now [Vercel](https://vercel.com/) for some projects too, and in fact, I generally prefer to put my "toys" up there and save Netlify for my "real" projects.

I also use Amazon S3 and CloutFront for my images. That keeps my GitHub repo a bit smaller.

## Server Side Language - Node.js

Last but not least, is Node.js for the server. While I don't build "apps" anymore in Node (Express was great for this), it's my language of choice for any serverless functions I need, and heck, any scripts at all I use in my development. Since I do so much client-side scripting, being able to use the same syntax on the server just "flows" better for me. 

ColdFusion treated me well for over a decade, but for a long time I've not been happy with the direction Adobe is taking the product. [Lucee](https://lucee.org/) is a great open source alternative and [Ortus Solutions](https://www.ortussolutions.com/) have some amazing products for ColdFusion development, it just doesn't fit me as a developer anymore. I would not recommend people use ColdFusion for new projects, but certainly would understand someone learning it for maintenance work. 

For more information about my switch to Node, see my [article](https://www.raymondcamden.com/2018/08/10/nodejs-for-the-nonnodejs-developer) from 2018 on the topic.

## Misc

A few more things not really related to my job.

* I use an Pixel 3 XL for my phone as I was kinda bored with Apple devices. 
* But I use an Apple iPad for my tablet, which honestly only gets used when I exercise or fly (in other words, it's just a media viewer for me.)
* I use the heck out of [Plex](https://www.plex.tv/) for my locally owned legally acquired media. It has clients for *everything* including my smart TV.

<i>Header photo by <a href="https://unsplash.com/@viktortalashuk?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Viktor Talashuk</a> on Unsplash</i>