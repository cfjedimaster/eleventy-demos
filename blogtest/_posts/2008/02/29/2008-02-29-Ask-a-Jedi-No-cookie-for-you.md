---
layout: post
title: "Ask a Jedi: No cookie for you!"
date: "2008-02-29T13:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/02/29/Ask-a-Jedi-No-cookie-for-you
guid: 2683
---

Pat asks:

<blockquote>
What's the best way to get around the old problem of cookie blocking? How do we keep variables current through a session, for example a shopping basket, when the user is paranoid enough to set 'accept NO cookies' ?

I'm well aware a disclaimer on the site saying 'you must have cookies enabled' would work. I'm also aware of #URLSessionFormat("xxxx")# but that creates a mess in the URL.
Are there any other ways of getting around this ? If not, what's the best way to set up Application.cfc to the best advantage when using URLSessionFormat ?
</blockquote>

I think the solution here is simple, and you already know it. If the user refuses to accept cookies, then you <b>must</b> maintain state via URL parameters. I'm not really sure I'd call URLSessionFormat ugly. It works, and the nice thing is that if a user does accept cookies then it knows to not add the additional items to links. The only bad thing about this feature is that you have to be extremely careful to use it <b>everywhere</b>, including both simple navigation links and form posts as well.

Are any of my readers supporting cookie-less visitors without using urlSessionFormat?