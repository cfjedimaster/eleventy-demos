---
layout: post
title: "Deciding what client-side storage system to use"
date: "2016-07-08T08:30:00-07:00"
categories: [development,javascript]
tags: []
banner_image: 
permalink: /2016/07/08/deciding-what-client-side-storage-system-to-use
---

This isn't a new topic for this blog, but as a good buddy of mine asked me about this yesterday, and we ended up having a good conversation about it on IM, I thought it would be nice to write up what we discussed so I could share it with others. The conversation started with a simple question:

<blockquote>
Are you a proponent of local and session storage for hybrid apps, since web sql is deprecated?
</blockquote>

Let's begin by thinking about the kind of data you need to store in your application. (And I'm going to begin by considering all web apps, not just hybrid mobile apps.) In general, I break down storage into two types:

<ol>
<li>The first type of data is what I call "known data sets". That is *not* a great term, but it basically means the data is consistent and doesn't expand infinitely. An example would be remembering the user's login name so that you can pre-fill the value the next time they login. Another example would be their preferences, things like what menu items should be shown and how they like to use the site. Another example would be a shopping cart. While this is - technically - dynamic - it is still a known quantity - an array of product items and quantities.</li>
<li>The second type is what I call "unknown data sets", and again, this is a *really* bad term. This isn't random data you know nothing about of course, but rather data that can grow in a matter you can't really estimate. An example of this would be a To Do list. Another example would be a note system like Evernote. Another aspect of this data is that due to it's unknown size and content, typically search is a required feature to work with the data.</li>
</ol>

These are broad, fuzzy categories and obviously you can probably think of examples that would fit in either block, but this is the "mental map" I use to help me decide how I'm going to store data in a web application.

Within these two categories, I consider these technologies:

<ol>
<li>"Known Data Sets": Cookies, WebStorage (covers both Local and Session storage)</li>
<li>"Unknown Data Sets": WebSQL, IndexedDB, and for mobile only, the File system</li>
</ol>

So for the first group, I almost always prefer WebStorage to cookies. The API is a heck of a lot easier to use. Less people block it. (In fact, you can't block WebStorage. You can - of course - delete or modify the data by hand.) In general I'd only do maintenance work with cookies. I can't imagine every adding cookies to an existing site. 

The second group is a bit trickier. WebSQL is deprecated. You aren't supposed to use it anymore. IndexedDB (IDB) is "proper" way to store deep, complex data and should always be used. Except... IDB can be difficult to use. I've heard the exact opposite too, but at least for me, coming from a background of building server-side apps with ColdFusion, SQL was pretty familiar to me. IDB is also *incredibly* bad on iOS. You can read my original article on ([IndexedDB on iOS 8 - Broken Bad](https://www.raymondcamden.com/2014/09/25/IndexedDB-on-iOS-8-Broken-Bad/). Things are definitely improving in the most recent versions, but for a long time, WebSQL worked much better on mobile than IDB did. 

So what would I choose?

On hybrid, I'd probably lean towards using SQLite. This is plugin-based so it is a known quantity and you don't have to worry (too much) about weirdness with the browser on the device and as I said - it may be more familiar and easier for folks than IDB. 

On the desktop, I'd probably lean more towards IDB. Support is pretty solid and as long as you have good fallback, you're fine with older browsers. 

Of course, an even easier solution would be to consider [PouchDB](https://pouchdb.com/), which abstracts away these details and picks the "best solution" for your current browser. I haven't used it a lot as the biggest feature of it is "sync", and generally I'm more concerned about just the local storage, but from everything I've seen it is a damn good solution and incredibly well supported.

Want to learn more? (Warning - advertisment!) You can purchase a <a href="http://shop.oreilly.com/product/0636920043638.do">2+ hour video series</a> on the topic I created for O'Reilly or purchase <a href="https://www.amazon.com/Client-Side-Data-Storage-Keeping-Local/dp/1491935111?ie=UTF8&creativeASIN=1491935111&linkCode=w00&linkId=URSVDLKI2FLVLMFM&ref_=as_sl_pc_qf_sp_asin_til&tag=raymondcamd06-20">the book</a> I wrote on the topic. (Or both. ;)

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2016/01/lrg.jpg" style="max-width:333px">