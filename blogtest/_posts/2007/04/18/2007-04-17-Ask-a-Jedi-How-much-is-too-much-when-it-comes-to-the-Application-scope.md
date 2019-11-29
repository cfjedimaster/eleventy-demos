---
layout: post
title: "Ask a Jedi: How much is too much when it comes to the Application scope?"
date: "2007-04-18T10:04:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/04/18/Ask-a-Jedi-How-much-is-too-much-when-it-comes-to-the-Application-scope
guid: 1967
---

Matt S. had an interesting question I thought I'd share with my readers:

<blockquote>
I work on an online learning app thats written in ColdFusion w/ MSSQL server.

It was poorly designed and is suffering from severe bloating due to lack of scalability. The app currently has 1999 keys in its Application Scope! Its used for all sorts of crazy stuff, mostly content to customize the app for different clients, a bunch of CFC's etc.

MY QUESTION... how much is too much to put into the 
application scope before weirdness starts to creep in? Is it merely a memory limit?

We of course think this is a bad practice, but... we need some fire power to "prove" to the non-programmer manager type people that this is not scalable and we are reaching the limits of the application scope.
</blockquote>
<!--more-->
So like most things performance related, there isn't one answer. But here are my thoughts on the matter, and readers can (and will) chime in as well.

1) Yes, it is "just" a memory limit. You should be able to pile crap on the Application scope until you run out of RAM. 

2) Of course, just because you can doesn't mean you should. While there was no general rule that says, More then X items in the application scope is too much, I'd be willing to bet most folks would agree that 1999 items is a bit much.

3) To see the impact of the application scope usage, you may want to look at FusionReactor or SeeFusion. Both of these tools (if I remember right) let you see RAM usage overall. I don't think they get specific to the Application scope though.

In general I'd recommend this: Do an audit on everything being stored in the Application scope and figure out if these items really do need to be in there. Be tough. Somehow you (by you I mean your team) let too much stuff slip in and now is the time to be cruel and cut back a bit. You may need to rebuild parts of your application as well.

This is a bit related to something I told a client a few weeks back (and something I blogged about a while ago but can't find now). If you accidentally send too many cookies to a browser, the browser is going to simply ignore the ones that are not allowed. This can lead to some <b>very</b> hard to debug issues. So I told the client to simply make a master list of what cookies were allowed. No one would be allowed to add a new cookie unless they check with the "Code Boss" first and then added their cookie to the list.

In your situation it may make sense to have the same restriction on the Application scope. No one adds anything unless they check first to ensure that it really does need to be added.