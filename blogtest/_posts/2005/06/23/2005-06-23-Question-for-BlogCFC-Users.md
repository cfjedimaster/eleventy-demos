---
layout: post
title: "Question for BlogCFC Users"
date: "2005-06-23T17:06:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2005/06/23/Question-for-BlogCFC-Users
guid: 603
---

In my last <a href="http://ray.camdenfamily.com/index.cfm?mode=entry&entry=A9DD4434-E9B2-6491-A9B9CABBB23F20E2">post</a>, Mike D brings up some additional points about what I could do to make BlogCFC more search engine friendly.

One idea was to get rid of the UUIDs. I'm not convinced that it will be worth the trouble, so I'm tabling that for now (sorry Mikey!).

The other idea was to add SES URLs. Now, for a while now I've told people they can do this easily enough themselves using Apache Rewrite (or the IIS equivalent). I spoke a bit with Rob on this matter, and he suggested that some users simply may not want to go through the trouble. 

So, I'm considering adding them in. It will be a bit of a pain though to test with both IIS and Apache, but I can handle it. 

So now my question is this: I can add SES URLs and simply enforce a format that I think is best. I'm thinking this:

(And note - for both proposals, the SES URL is ONLY for direct links to entries. So only the links to entries in index.cfm, and the RSS links, would change.)

http://ray.camdenfamily.com/index.cfm/XXXXXXXX-etc/Title_Of_The_Blog_Post

This format is simple and would be the easiest to add. Rob suggested, however, that I let folks have a bit of freedom with the URL. I would create a simple meta syntax you would edit in the ini file. So if you wanted YYYY/MMMM/UUID/TITLE for example, you would... well type what I just typed. 

Another option - did I say there were 2? I lied. Some people would love to get rid of the UUID. One format Rob pointed out to me was...

YYYY/MMMM/TITLE_WITH_UNDERSCORES

Now, there is one problem with this format. If you have 2 entries on the same day with the same title , we can only serve up one. Now, I'm fine with that. I can document it and warn folks about it. It does make a nice, small URL. In fact, I think I'm leaning towards that format and not letting it be configurable.

So - thoughts? Since I leave in a few days for CFUNITED, and then vacation, let's make it quick folks. ;)