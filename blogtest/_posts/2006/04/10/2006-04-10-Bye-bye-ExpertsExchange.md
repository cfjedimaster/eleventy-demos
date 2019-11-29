---
layout: post
title: "Bye bye Experts-Exchange"
date: "2006-04-10T16:04:00+06:00"
categories: [development]
tags: []
banner_image: 
permalink: /2006/04/10/Bye-bye-ExpertsExchange
guid: 1199
---

So I typically don't have much use for the more advanced Google search tips. I almost always find exactly what I want with a simple query. However - something has been bugging me for a while now and I finally got off my butt to learn how to correct it.

If you have done any searching for technical type matters (like the one I just did: <a href="http://www.google.com/search?sourceid=navclient-ff&ie=UTF-8&rls=GGGL,GGGL:2005-09,GGGL:en&q=javascript+radio">javascript radio</a>), than you have probably ran across Experts-Exchange. This is a site that provides technical answers, but you have to sign up before you see the result. I don't know why but this bugs the hell out of me. The entire domain, as far as I am concerned, is completely useless. As it stands, I can't even get the "View Solution" button to work right now.

Turns out there is a trivial way to hide this site from your results. I just added:

<code>
-site:experts-exchange.com
</code>

And when I <a href="http://www.google.com/search?sourceid=navclient-ff&ie=UTF-8&rls=GGGL,GGGL:2005-09,GGGL:en&q=javascript+radio+-site%3Aexperts-exchange.com">searched again</a>, it was removed from the results.

Now if I can just find a way to make that the default, I'd be even happier. There must be a way to tweak the Google Toolbar for Firefox to get the same results.