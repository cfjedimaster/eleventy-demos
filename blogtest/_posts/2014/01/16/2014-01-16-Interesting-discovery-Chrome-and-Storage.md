---
layout: post
title: "Interesting discovery - Chrome and Storage"
date: "2014-01-16T15:01:00+06:00"
categories: [development,javascript]
tags: []
banner_image: 
permalink: /2014/01/16/Interesting-discovery-Chrome-and-Storage
guid: 5128
---

<p>
I ran into this today while looking at Chrome's <a href="https://developers.google.com/chrome/whitepapers/storage?csw=1">docs</a> for storage APIs. If you enter chrome://settings/cookies into the address bar (sorry, "omnibox" just seems like a 1980s X-Man name) Chrome will give you a report of storage data for every site that has made use of <i>any</i> form of storage within your browser. This report covers cookies (obviously), local storage, WebSQL, IndexedDB, and AppCache. 
</p>
<!--more-->
<p>
Be warned that when you first enter the URL, your browser may seem to hang. For me it took a good 30 seconds before anything was rendered. Also, if I did anything to filter the report and then tried to revert back to the full report, I had the same drag. (And to be clear, this impacted the <strong>entire</strong> browser. I'm testing while I write this and my textarea for the blog was unusuable at times.) 
</p>

<p>
<img src="https://static.raymondcamden.com/images/s16.png" />
</p>

<p>
In case you're wondering, the 'floating window' effect isn't me being fancy with the screen shot. For some reason Chrome renders the report this way in the tab. As you can see, it reports each URL as well as the types of data being used. The search field in the upper right says "Search cookies", but this isn't searching the cookies, rather it is searching the domains. Clicking on a particular domain gives you a break down per each storage instance. Here is an example.
</p>

<p>
<img src="https://static.raymondcamden.com/images/s28.png" />
</p>

<p>
Note how each cookie is listed as well as multiple instances of "Indexed database." Each instance represents a different port, <strong>not</strong> a different database. Clicking on one reveals more details.
</p>

<p>
<img src="https://static.raymondcamden.com/images/s33.png" />
</p>

<p>
Unfortunately you aren't given a breakdown per each indexedDB in your domain, so for a testing domain (like 127.0.0.1) it may not be as useful. Obviously if you test against something like myhotwebapp.dev, then you can see how much data is being used. It won't break it down to individual database instances, but it would let you know how much your app is using in general. 
</p>

<p>
A while ago I built a Chrome extension (<a href="https://chrome.google.com/webstore/detail/localstorage-monitor/bpidlidmmmnapeldonddkjmmjkpeiabi?hl=en">LocalStorage Monitor</a>) that alerts me to when a site is using LocalStorage. I did this less for privacy and more for curiosity sake. I've been wanting to have something similar for IndexedDB. I was happy to see that this Chrome report let me look around to see who is using the feature and surprisingly - a few sites were. I was really surprised by <a href="http://www.zapier.com">zapier.com</a>, which was using nearly 5 megs of data. From what I can see they are doing quite a bit of caching with IndexedDB.
</p>

<p>
<img src="https://static.raymondcamden.com/images/s42.png" />
</p>

<p>
Have any of my readers explored this report yet?
</p>