---
layout: post
title: "Ask a Jedi: Backing up DSNs"
date: "2006-05-29T18:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/05/29/Ask-a-Jedi-Backing-up-DSNs
guid: 1301
---

Michael asks:

<blockquote>
I have a question that you might know... do
you know of a way to back up the datasource on a cfmx 6.1 server?  I'm building a new box for my testing server and I have a ton of DSN's setup in the CF Admin
and I REALLY don't want to have to re-enter all of them when it comes time to re-install cfmx on my new test server.  Any help would be greatly appreciated!
</blockquote>

Did you ever check out the ColdFusion Archive (CAR) feature? While it is only an Enterprise feature, it lets you back up <i>all</i> the settings on your ColdFusion box. Along with backing up DSNs, you can back up mappings, custom tag paths, and every other setting you want. You can also package up files with the CAR as well. This is exactly what I do before a reinstall. I just wish it was a bit easier. Not that it is hard - but it is a bit of a pain to go in and select the items you want. I'd love a simple, "Back up all settings" option. 

Anyway, once you have your CAR, you can do your reinstall and then simply deploy your CAR file. I've done this recently while playing with Mystic and it worked like a charm.