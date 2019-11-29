---
layout: post
title: "Chrome, console, and URLs - watch out"
date: "2015-08-20T15:02:36+06:00"
categories: [development,javascript]
tags: []
banner_image: 
permalink: /2015/08/20/chrome-console-and-urls-watch-out
guid: 6684
---

Ok, this isn't necessarily a huge bug, but it surprised me and was very subtle so I want to make sure folks know about it. Honestly, I don't care if Google corrects this (I can think of other dev tools things I wanted tweaked), but as I said, I want to make some noise in case other people run into it as well.

<!--more-->

Today I was working on some client-side code that involved a URL value. In my testing, I needed to change the URL slightly based on a regex. So I did this:

<pre><code class="language-javascript">var nextUrl = result.meta.next_link;
console.log('next url is '+nextUrl);
nextUrl = nextUrl.replace(/&callback=.*?\&/, "");
console.log('next url is '+nextUrl);</code></pre>

I then opened up my dev tools and saw this:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/08/shot110.png" alt="shot1" width="750" height="25" class="aligncenter size-full wp-image-6685" />

It may be a bit small in the screen shot, but what my eyes saw were two URLs of the exact same size. Looking in the middle, you can definitely see a difference, but since I was removing stuff and saw two strings of the same length, I assumed my regex was wrong. (Which, let's be honest, we all expect our regexes to be wrong at first.) 

Then I noticed the oddities in the middle of the string. When I moved my mouse over the URL and waited, a tooltip showed up with the complete URL. Apparently, Chrome's dev tools decided to help out here and change my display.

Now - I don't want to say that's always a bad idea. I've noticed that if you have a large array and dir it, Chrome will break the dump into pages. That's helpful. But I think this is a case of going a bit too far. If I print a string, even a long one, I probably know what I'm doing, and Chrome shouldn't mess with it. As it stands, it is inconsistent. I can print out any other long string just fine, it is just URLs that are shortened.  

I did a quick Google (hey, I can complain about them and use them at the same time, right? ;) and found this Stack Overflow post: <a href="http://stackoverflow.com/questions/19184313/disable-url-shortening-formatting-in-chromes-console">Disable URL Shortening/ Formatting in Chrome's Console</a>. The SO post mentions using console.dir to print it out, and that does indeed seem to work. I also did <code>nextUrl.replace("https://","")</code> and that worked as well.