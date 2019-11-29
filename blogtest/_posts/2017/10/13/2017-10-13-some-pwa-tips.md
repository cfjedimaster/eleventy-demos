---
layout: post
title: "Some Progressive Web App Tips"
date: "2017-10-13T07:55:00-07:00"
categories: [development,javascript]
tags: [javascript]
banner_image: 
permalink: /2017/10/13/some-pwa-tips
---

Yesterday I [blogged](https://www.raymondcamden.com/2017/10/12/turning-my-no-mans-sky-app-into-a-pwa/) about my experience turning a simple front-end application into a PWA. Since then I've had some things come up that I wanted to share related to PWA (Progessive Web Apps). This is a bit of a random collection of items but I hope it's helpful.

Web App Install Banner Stuff
===

As a reminder, the [Web App Install Banner] feature is the Chrome thing where the browser will prompt the user to install your web app. I mentioned yesterday I had trouble getting this to trigger in my app, even though I had (as far as I know) did everything I needed to.

First off - even though I couldn't get that prompt to occur, if I manually added the site via "Add to Home screen", the app *was* saved correctly and recognized as a PWA. I'd share a screen shot of this but I assume you can trust me on this. 

I asked some questions related to PWA on a private Google Developer expert channel and a Googler, [Paul Kinlan](https://paul.kinlan.me/), shared some details.

First, if the app was ever installed before, of if it was ever declined before, than the user won't be prompted again. That didn't cover my case, but it is important to remember. 

Second, there is a Chrome flag which bypasses this:

	chrome://flags/#bypass-app-banner-engagement-checks

In theory when you enable this, you can then use the "Add to Homescreen" link in DevTools to force it. *However*, it does not force the prompt, it just "resets" it so that when you refresh the app, it's as if you never declined it or installed it before. I'm having trouble with remote debug and Android adb on my desktop so I've not yet confirmed this, but as I said, on a manual home screen save, everything is kosher with my app so I think I'm good. 

*Edit:* So a few minutes after I released this blog post, I realized that I needed to set that Chrome flag on the device. Duh. I did that, restarted Chrome on my Android device, and instantly got the app installer banner. Woot!

Lighthouse Audits
===

One of the thing I keep repeating when I talk about PWAs is to not get too caught up in feeling like you have to implement everything immediately. That being said, there is a *great* way to test your PWA support and track your progress. 

[Lighthouse](https://developers.google.com/web/tools/lighthouse/) is a tool that checks various aspects of your site. It isn't just for PWAs but can cover performance, best practices, and accessibility as well. Best of all, it's included in DevTools now by default so you can run it directly in Chrome. Here is an example of it on my app:

![Shot](https://static.raymondcamden.com/images/2017/10/pwa13_1.jpg)

As you can see, I failed a few things in regards to splash screen support, which is what I expected, but otherwise got a great score. Not shown in the screen shot above is a simple download button. This exports a JSON file. It wasn't obvious to me, but Paul Irish (another Googler) let me know that you can drag and drop the file directly into DevTools to load it again.

You can also find an online viewer here: https://googlechrome.github.io/lighthouse/viewer/. This lets you export HTML and print too. 

Don't forget about [Sonar](https://sonarwhal.com/) though, a Microsoft project which provides some damn nice tools for testing your site as well. 

Localhost Warning
===

So.... yeah, this was a fun mistake, and apparently I'm not the only one to do it. While preparing for my PWA talk last week (I'll be sharing the video URL and assets as soon as I get it), I ran into an interesting problem. I had gotten offline caching working well with a service cache in one app. I then moved to another app and noticed that my new HTML wasn't loading. Instead, all of the content from the other app loaded instead. Why?

I use [httpster](https://github.com/SimbCo/httpster) to quickly run web servers via the CLI. So I go into a folder, alpha, type httpster, and then open my browser to http://localhost:3333. When done, I kill it, go into another folder, and run it again.

Server workers have a concept of 'scope' which means "These are the domains and paths I control." When you first learn about this, you are encouraged to put your service worker JavaScript in the root directory of your web app as opposed to a "js" folder. That way the service worker can respond to HTML, CSS, and other requests for the entire site.

So - in my case - it worked as expected. I had built a PWA under a folder, told it to cache everything and not check the network if an asset was in cache, and when I switched to another folder, *but used the same URL*, it worked exactly as expected. 

To fix it, I used the "Unregister" command in DevTools:

![Shot](https://static.raymondcamden.com/images/2017/10/pwa13_2.jpg)

There's a few ways to avoid this. One, I could have installed my serviceworker at the same folder level and not root, so 

	navigator.serviceWorker.register('serviceworker.js')

instead of what I did:

	navigator.serviceWorker.register('/serviceworker.js')

Another option, and this would make sense for "real" project work, would be to just DNS aliases in your local HOSTS file. However, be careful here. Chrome has certain rules for when https can be skipped when using certain features, service workers included. I thought the rule was basically http://localhost or something under https. 

Lars Knudsen let me know though that you can avoid this with an alias that includes localhost in the URL. So while I'd normally do something like this in HOSTS:

	127.0.0.1	mygoogle.dev

You can do this instead:

	127.0.0.1	mygoogle.localhost

Details about Chrome's implementation of this rule may be found here: [Prefer Secure Origins For Powerful New Features](https://www.chromium.org/Home/chromium-security/prefer-secure-origins-for-powerful-new-features)

Again - thank you, Lars! Oh, and remember, even if you aren't doing anything PWA related, this would still be helpful when using other features. Geolocation, for example, is now a restricted feature.

More to Come
===

I hope this is helpful. I'll keep sharing posts like this as I dig deeper.