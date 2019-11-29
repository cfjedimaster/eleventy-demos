---
layout: post
title: "Minor BlogCFC Update (and call for help)"
date: "2005-11-22T09:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/11/22/Minor-BlogCFC-Update-and-call-for-help
guid: 930
---

So, a few days ago I <a href="http://ray.camdenfamily.com/index.cfm/2005/11/20/BlogCFC-Bug-with-MySQLAccess">blogged</a> about an issue with BlogCFC and MySQL/Access. I was able to reproduce it, but for the life of me, I couldn't figure out why the bug occured. I was able to fix it though, so I've updated the zip. Changes include:

<ul>
<li>Fix for MySQL/Access. More on the issue below.
<li>Updated the TrackBack spam list. I <b>highly</b> encourage you to copy this setting even if you don't need the MySQL/Access fix. If all BlogCFC users have a strong TB spam list, it may encourage TB spammers to ignore the platform.
</ul>

As always, you can download BlogCFC from the <a href="http://ray.camdenfamily.com/projects/blogcfc">project page</a>.
<!--more-->
So - more on the bug. The bug was very odd. Basically org.hastings.utils.cfc would throw an error on this line: (I've added a few spaces in it to make it break nicely.) 

<code>
return variables.aDateFormat.getDateInstance( variables.aDateFormat[arguments.style], variables.thisLocale).format(utcDate);
</code>

The error stated the value of utcDate wasn't a valid date. Now - this is what I don't get. This CFC hasn't been touched in ages, probably over a year. The date values in the database hasn't changed since BlogCFC was released. Yet there it was - throwing errors. Now - I can say that <i>my</i> dev platform has changed. I used to run the "Simple" CF, ie, install, hook up to Apache, that's it. I've recently switched to CF installed in JRun. So maybe that was the key - but the question is - why hasn't anyone else complained? 

Oh - and it gets better. The error was only thrown when you got categories. Let me make this a bit simpler and just paste in the email I sent when I originally asked for help. It may clear things up a bit. What follows is straight from an email, so forgive the fact that it may not match this entry well.

Now here is something that is baffling. BlogCFC has one uber-function to get blog entries. Depending on various filters, I modify the query a bit. For some reason, whenever I tell BlogCFC to get data and filter by a category, I get an error when I try to date format the data. (I'm not using CF's built in dateFormat though.)

I dumped the result of a simple, getEntries, versus a getEntries based on category. In both cases, while the entries were a bit different, the data was, essentially, the same.

On a whim I decided to dump the metadata on the query. For a normal getEntries, the posted column was datetime. For the getEntries/category filter, the value of the column was varchar!

Well - there ya go. Thing is - I can't understand why the query would change the posted column. Here is a sample of the query when doing a normal getEntries:

<code>
select    tblblogentries.id, tblblogentries.title,
tblblogentries.alias,
date_add(posted, interval -1 hour) as posted,
tblblogentries.username, tblblogentries.allowcomments,
tblblogentries.enclosure, tblblogentries.filesize, tblblogentries.mimetype
, tblblogentries.body, tblblogentries.morebody
from    tblblogentries
           
           
where        1=1
and blog = ?
order by     tblblogentries.posted desc
limit 4
</code>

Now here is the query with a category filter:

<code>
select    tblblogentries.id, tblblogentries.title,
tblblogentries.alias,
date_add(posted, interval -1 hour) as posted,
tblblogentries.username, tblblogentries.allowcomments,
tblblogentries.enclosure, tblblogentries.filesize, tblblogentries.mimetype
, tblblogentries.body, tblblogentries.morebody

from    tblblogentries
,tblblogentriescategories
           
where        1=1
and blog = ?
and tblblogentriescategories.entryidfk = tblblogentries.id
and tblblogentriescategories.categoryidfk = ?
           
order by     tblblogentries.posted desc
limit 4
</code>

So - anyone have a bright idea?