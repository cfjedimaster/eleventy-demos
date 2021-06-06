---
layout: post
title: "Keeping Count of User Visits"
date: "2021-02-23"
categories: ["javascript"]
tags: ["javascript"]
banner_image: /images/banners/counting.jpg
permalink: /2021/02/23/keeping-count-of-user-visits
description: Using client-side storage to keep track of user visits to a site.
---

Yesterday I was complaining about something on Twitter because, as far as I can tell, that's the main use case:

<blockquote class="twitter-tweet" data-theme="dark"><p lang="en" dir="ltr">If I wrote a simple blog post showing how to wait until a user&#39;s 3rd or 5th visit to your site before you prompt for goddamn notifications, will any of you stop doing it on my first visit?<br><br>No? Didn&#39;t think so.<a href="https://twitter.com/hashtag/sigh?src=hash&amp;ref_src=twsrc%5Etfw">#sigh</a></p>&mdash; Raymond Camden 🥑 (@raymondcamden) <a href="https://twitter.com/raymondcamden/status/1363986645423329280?ref_src=twsrc%5Etfw">February 22, 2021</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

In case it isn't obvious, I'm talking about the *incredibly* annoying behavior of sites prompting you to accept notifications (or join a mailing list) on your first visit to a site. At least for me, 99.99% of the time these notifications block what I'm trying to do - actually read something on your site.

That being said, I do see how it could make sense to ask this of a "return" visitor, someone who has demonstrated an active interest in your site by returning more than once. After my (admitidly) snarky tweet above, I followed it up with:

<blockquote class="twitter-tweet" data-conversation="none" data-theme="dark"><p lang="en" dir="ltr">Actually - that leads to an interesting idea. If you want to know the Nth &quot;visit&quot;, you need to (well could) use a combination of Local and Session storage. That way you don&#39;t prompt on the 3rd *page view* of the 1st visit.<br><br>Blog post!</p>&mdash; Raymond Camden 🥑 (@raymondcamden) <a href="https://twitter.com/raymondcamden/status/1363987743353704449?ref_src=twsrc%5Etfw">February 22, 2021</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

Ok, so what exactly am I talking about here? [LocalStorage](https://developer.mozilla.org/en-US/docs/Web/API/Storage) is an incredibly easy way to store data on the client. Most people talk about the persistant version, but there's a session based version as well with the exact same API. This is "persistent" as anything else on the client-side, but is trivial enough to use as long as you're ok with the knowledge there's no 100% gaurantee. 

While easy to use, it brings up an interesting problem. It would be simple to track every page visit. Here's an example:

```js
let hits = localStorage.getItem('hits');
if(!hits) hits = 0;
else hits = parseInt(hits, 10);

hits++;

localStorage.setItem('hits', hits);
```

If you've never worked with LocalStorage before, I bet you can still understand that example. The only aspect that may confuse you is the `parseInt`. All values in LocalStorage (and SessionStorage) are strings, so you want to be sure to convert it to a number before doing any math on it.

This "works" but isn't really tracking a visit to a site but rather a page view. What we really want is to know the number of times you had a "session" with the site itself. In order to do that, we can use a combination of local and session storage together.

Basically:

* If I don't see a value in session (temporary) storage...
* It's a new site visit! Increment a local storage (persistent) value

Here it is in code:

```js
let sessionActive = window.sessionStorage.getItem('active');
let numberOfSessions = window.localStorage.getItem('numberOfSessions');

if(!sessionActive) {
	console.log('new session');
	if(!numberOfSessions) numberOfSessions = 0;
	numberOfSessions = parseInt(numberOfSessions, 10) + 1;
	window.localStorage.setItem('numberOfSessions', numberOfSessions);
	window.sessionStorage.setItem('active',1);
}

console.log(`You have had ${numberOfSessions} sessions`);
```

This is basically what I just described in text above. If a session value doesn't exist, it means our session has just started and we can update our persistent value keeping track of the number of times we've had a session with the site. And yes, I was lazy and didn't do the fancy thing where if `numberOfSessions` is 1 I drop the "s" at the end of the output. 

This is not fullproof. Someone can block or edit the LocalStorage values, but if you use this as a way to *not* prompt someone with an annoying prompt and you end up never annoying them, that's a win, right? Anyway, here's the code in a CodePen. Note that I'm using `console.log` to print a message that won't be visible in the embed. If you click the link to open the code in a new tab and see the console there.

<p class="codepen" data-height="350" data-theme-id="dark" data-default-tab="js" data-user="cfjedimaster" data-slug-hash="poNdrVp" style="height: 350px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Session Test">
  <span>See the Pen <a href="https://codepen.io/cfjedimaster/pen/poNdrVp">
  Session Test</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

<span>Photo by <a href="https://unsplash.com/@crissyjarvis?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Crissy Jarvis</a> on <a href="https://unsplash.com/s/photos/counting?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Unsplash</a></span>