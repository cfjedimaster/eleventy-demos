---
layout: post
title: "BlogCFC Refreshed"
date: "2005-09-28T10:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/09/28/BlogCFC-Refreshed
guid: 815
---

Ok, so I <i>really</i> need to get to work on my DRK application, but last night I updated the BlogCFC Alpha again. Changes are...

<ul>
<li>Trackback cleanup. Now it looks a lot more like comments. Emails are sent when a trackback is added. When a user submits a trackback using the form, they get a nice response instead of the XML packet. Various other cleanups as well.
<li>Print format. This will be supported only for CFMX7 users of course. I will ensure that the option simply doesn't show up for CFMX6 or BlueDragon.
<li>This was an idea sent in to me. When using more links, we use an internal anchor now so you jump to where you were reading. 
<li>The subscriber bug is fixed. This is the bug where I forgot to mark a subscribed users to a particular bug. If folks need this fix now, it is on the forums. 
<li>Various other small fixes here and there.
</ul>

What's next? I think I may start the wrap up process. I've added a lot of code recently so I want to look around and make sure I didn't make any dumb mistakes. I may put off the XHTML update for now. One feature I definitely want in for the beta is search term logging. This is simple to add so I don't see why not. As I said before, the beta will be downloadable so people can play and find bugs.