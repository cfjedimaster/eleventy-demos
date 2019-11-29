---
layout: post
title: "Avoid Ratchet for PhoneGap/Cordova development"
date: "2015-03-21T07:22:45+06:00"
categories: [development,mobile]
tags: []
banner_image: 
permalink: /2015/03/21/avoid-ratchet-for-phonegapcordova-development
guid: 5846
---

I'm writing this rather quickly (and a bit angrily, which is a recipe for disaster ;) but if you are building hybrid apps I'd suggest you avoid using <a href="http://goratchet.com/">Ratchet</a>. I've used it for testing before but never for a real application. I thought it might be nice to use it for my last example in my <a href="http://manning.com/camden/">Cordova book</a>. I built up my sample app, tested in the browser, and everything was kosher. 

<!--more-->

Then I tested in the simulator and discovered that push.js, the technology they use to convert links into XHR calls, does not work with file URIs, which is used by PhoneGap and Cordova. I did some Googling, and apparently it is a simple fix in the framework, but I tend to avoid modifying my frameworks to make things work. I worry that I'll update the framework six months down the line and either forget about my mod or my mod will no longer work. 

To be clear, you <i>can</i> use the "display" portion of Ratchet just fine, if you combine it with something else to handle MVC, loading, etc.

For folks curious why I didn't just use Ionic, I had thought it was a bit much to add to my book since using Ionic requires knowledge about Angular as well. Plus, my publisher already has an <a href="http://www.manning.com/wilken/">Ionic book</a> in development. I've now decided to get over my fears and introduce folks to Ionic anyway. As it stands, the more people who get introduced to the awesomeness of Ionic the better!

p.s. It may be that there <i>is</i> a super simple workaround for this that does <strong>not</strong> involve modifying the framework itself. If so, and I say here often, I'll be happy to be wrong! Please correct me.

p.s.s. @jcesarmobile on Twitter shared a link to the "one line fix", <a href="https://github.com/ryanstewart/phonegap-ratchet-demo">https://github.com/ryanstewart/phonegap-ratchet-demo</a>, and it really is a small fix, but, I stand by what I said earlier in this post that it isn't something I feel safe recommending.

p.s.s.s @jcesarmobile also pointed out that there is a <a href="https://github.com/twbs/ratchet/pull/750">PR</a> already submitted to fix this issue! That's good. What's not so good is that the last release of Ratchet was nearly a year ago. My confidence that this will get released isn't necessarily high. I've reached out to one of the devs for Ratchet on Twitter to see if there is any kind of time frame for an update.