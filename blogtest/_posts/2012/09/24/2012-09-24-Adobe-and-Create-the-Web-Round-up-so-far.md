---
layout: post
title: "Adobe and Create the Web - Round up so far"
date: "2012-09-24T15:09:00+06:00"
categories: [development,html5,mobile]
tags: []
banner_image: 
permalink: /2012/09/24/Adobe-and-Create-the-Web-Round-up-so-far
guid: 4740
---

I just got done watching the Create the Web live stream of the keynote. (Unfortunately I couldn't be in SF this week so I had to watch it remotely.) We will soon be posting a link to the recording for those who missed it. I thought I'd take some time to write up some of the links and announcements from today as well as my thoughts. If I miss anything, or if you have comments and questions, please let me know. I'll try to make this as sensible and organized as possible.
<!--more-->
<h2>Sites</h2>

First off - the primary place for most information related to this event and our web efforts in general is <a href="http://html.adobe.com/">html.adobe.com</a>. I encourage you to peruse the site for full details about what I'm covering below. I'd also encourage you to bookmark the site in general. It's really the best place to find out what we're doing and why.

Along with that you want to bookmark the <a href="http://www.adobe.com/devnet/html5.html">HTML section</a> of the Adobe Developer Connection. Not to sound like a broken record, but the ADC is probably the most underappreciated developer site out there. It isn't just Adobians talking about Adobe-products, but articles, tutorials, and other resources related to everything web developers care about. 

<h2>CSS Filters</h2>

You guys know I'm something of a noob when it comes to CSS. I can barely design a non-table layout. That being said, I've got a great appreciation for CSS and especially our efforts to improve what you can do with it. At the event today we talked about CSS Filters (which work in iOS6 btw!) and announced the launch of a web based tool that lets you work with them: <a href="http://html.adobe.com/webstandards/csscustomfilters/cssfilterlab/">CSS Filter Lab</a> If you've never seen what these filters can do, please take some time to play with the tool and check out the effects. Even better, you get immediate access to the source code. <i>Even</i> better, if you have some skills with this tool you can contribute your own modifications back!

<img src="https://static.raymondcamden.com/images/ScreenClip126.png" />

In case you're curious about CSS Filter support, check the <a href="http://t.co/6BaBgFWG">CanIUse.com report</a>.

Oh - and when you edit those filters in the lab tool - check out the syntax checking support. Built entirely in JavaScript. The <i>entire</i> lab itself is available for forking at Github: <a href="https://github.com/adobe/cssfilterlab">https://github.com/adobe/cssfilterlab</a>

<h2>Dreamweaver CS6</h2>

Just a small note on this one - Dreamweaver CS6 gets an update today for improved HTML5 support as well as Adobe Edge Animate support. Apparently it has retina support as well, but as my retina-enabled Mac is in the shop, I can't test this. 

<h2>Adobe Edge Tools and Services</h2>

Speaking of "Edge", what was formerly Edge is now Adobe Edge Animate, and you can see that we've created an entirely family of "Edge" products.

<img src="https://static.raymondcamden.com/images/ScreenClip127.png" />

Adobe Edge Animate is now released at version 1.0 - and it is free - details here: <a href="http://html.adobe.com/edge/animate/">http://html.adobe.com/edge/animate/</a> If you've yet to play with this tool, check it out. Not only does it make great animations, the code it produces is <i>damn</i> clean. Last time this was demoed at our local user group it got a great reaction. 

Just to be clear - that price - it's free. 

<h2>Adobe Edge Reflow</h2>

Responsive web design is kind of a big thing now. If you aren't hearing about it from your clients, you better bet you will soon. We are working on a new tool ('working on' - so it isn't quite available yet) called Adobe Edge Reflow that will make it a lot easier to use. Paul demoed how quickly he could design a site that responded to different sizes all within a tool that made it easy to use. You can see screen shots and more details here: <a href="http://html.adobe.com/edge/reflow/">http://html.adobe.com/edge/reflow/</a>

Oh - and you can follow <a href="http://twitter.com/reflow">reflow</a>.

<h2>Fonts</h2>

The first font-related announcement was <a href="http://html.adobe.com/edge/webfonts/">Adobe Edge Web Fonts</a>. This is a collection of 500+ web fonts that you can use for free and without registration. If you can cut and paste code, you can use these fonts. The page I linked to actually provides the code and a live preview:

<img src="https://static.raymondcamden.com/images/ScreenClip128.png" />

How can you <i>not</i> use a font called Hobo Std? It practically begs you to use it. 

Next up was a new open source font, <a href="https://github.com/adobe/Source-Code-Pro">Source Code Pro</a>. This is a pretty slick font for code editors. It goes a long way to ensure that common issues like the lower-case l characters versus 1 or "Oh" versus "Zero" are not an issue. If you have trouble installing, you can get the downloads here: <a href="https://github.com/adobe/Source-Code-Pro/downloads">https://github.com/adobe/Source-Code-Pro/downloads</a> I recommend doing it this way - mainly because when I did it the other way I screwed up. Here is a sample:

<img src="https://static.raymondcamden.com/images/ScreenClip129.png" />

The other news was that <a href="http://html.adobe.com/edge/typekit/">Typekit</a> is working with Monotype Imaging to add a lot more (1000) fonts to the core Typekit library. I'll be 100% honest and say I have no idea who they are, but apparently they are a Big Deal for font folks. 

<h2>Adobe Edge Code</h2>

Next up was the announcement of <a href="http://html.adobe.com/edge/code/">Adobe Edge Code</a>. This is a branded version of our open source <a href="https://github.com/adobe/brackets">Brackets</a> editor. You can find a new forum just on this product <a href="http://forums.adobe.com/community/edge_code_preview">here</a> as well as a FAQ about how <a href="http://forums.adobe.com/message/4712518#4712518">Brackets differs from Edge Code</a>.  

Brian Rinaldi has a great article on Edge Code over at the ADC: <a href="http://www.adobe.com/devnet/edge-code/articles/code-editing-with-edge-code.html">HTML, CSS, and JavaScript Code Editing with Edge Code</a>

Adobe Edge Code ships with that sexy new Source Code Pro and also includes a very cool extension that wraps up our new fonts. Here's a screen shot of it in action:

<img src="https://static.raymondcamden.com/images/ScreenClip130.png" />

You can download Adobe Edge Code today. Oh, it's free too. 

<h2>Adobe Edge Inspect</h2>

I've raved about Shadow here many times before, and every time we demo Shadow people freak out. Why? Because debugging mobile apps is about as fun as pushing dull needles into your eyes. Or herding cats. Drunk, angry cats who - ok, you get the idea. Shadow has left the beta phase and is now released as a final product with the name Edge Inspect: <a href="http://html.adobe.com/edge/inspect/">http://html.adobe.com/edge/inspect/</a>

Oh, and this is free too. So just to be clear, the absolute best tool to help you debug mobile applications is free. 

<h2>PhoneGap Build</h2>

PhoneGap Build has left the beta tag behind like a bad haircut. You can sign up for free <a href="https://build.phonegap.com/apps">here</a>. If you've never seen PhoneGap Build before, you can read my new article on it here: <a href="http://www.adobe.com/devnet/phonegap/articles/phonegap-build-levels-up.html">PhoneGap Build Levels Up</a>

If you don't want to read my overly obtuse stuffy text, I'll tell you that one of the newest revealed features is support for private GitHub repos. People have been asking for that for a while now and it is now available. 

If you use Brackets and PhoneGap Build, you can now use a brand new extension that allows you to interact with the service directly in Brackets. You can download the extension here: <a href="https://github.com/adobe/brackets-phonegap">https://github.com/adobe/brackets-phonegap</a>. Christian Cantrell has a nice video demoing the extension:

<iframe width="560" height="315" src="http://www.youtube.com/embed/nn7kx7p_T3w" frameborder="0" allowfullscreen></iframe>

<h2>Overall</h2>

Ok, time for the emotional, highly biased portion of the blog post. (As if I wasn't heavily biased before. ;) Frankly, <b>this</b> is exactly why I wanted to join Adobe. <b>This</b> is what makes me excited about the web. <b>This</b> is the just the beginning. I hope that you guys are as excited about these announcements as I am. I love the web. I love building things. Tools that make it easier for me to create are - frankly - tools that make my life better. This is - if I may be so bold - the beginning of our sharks with laser beams.

<img src="https://static.raymondcamden.com/images/fricken shark.jpg" />

p.s. You can now watch the recording of the keynote at <a href="http://html.adobe.com/events/">http://html.adobe.com/events/</a>.