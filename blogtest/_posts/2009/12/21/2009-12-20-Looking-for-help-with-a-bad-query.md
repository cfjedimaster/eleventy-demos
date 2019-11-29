---
layout: post
title: "Looking for help with a bad query"
date: "2009-12-21T08:12:00+06:00"
categories: [development]
tags: []
banner_image: 
permalink: /2009/12/21/Looking-for-help-with-a-bad-query
guid: 3658
---

Did you know I have the smartest readers in the world? I'm not just saying that. You guys are truly intelligent. And beautiful too. Did I say that? All of my readers are intelligent <b>and</b> strikingly beautiful as well. I'm not just saying that because I <i>really</i> want some help with a query. Honest. Ok, maybe I am. 

Let me give some background here. I've noticed for a while now that when I post a comment to my blog, the code takes a good 4-5 seconds to respond. Normal page requests run much quicker. However - when a comment is posted I clear the cache for the "Recent Comments" list you see below. I extracted the SQL for it and ran it within MySQL's Query Browser and confirmed - it was a dog. For the lift of me I can't figure out why. 

The query simply asks for the last 5 comments. It joins against the entries table to get the entry title as well. Here is the SQL. The value next to date_add is dynamic as is the blog in the where clause. That value is set with a cfqueryparam.

<code>
select  e.id as entryID,
e.title,
c.id,
c.entryidfk,
c.name,
c.comment,
date_add(c.posted, interval -1 hour) as posted
from tblblogcomments c
inner join tblblogentries e on c.entryidfk = e.id
where	 blog = 'Default'
order by c.posted desc
limit 5
</code>

The issue seems to be the join. If I just get the last 5 comments it runs instantly. However, from what little SQL skills I have, a join like this shouldn't be so slow. I've got an index on comment.id and comment.entryidfk. Entry has an index on it's ID and the blog column. Here is the result of the EXPLAIN:

<img src="https://static.raymondcamden.com/images/Picture 77.png" />

Unfortunately nothing really here makes sense to me. This seems to only be an issue with a BlogCFC install with a lot of data as I don't see it on my test version. If folks are bored and want to recreate this locally, just download BlogCFC and fill it with some random data. (I'd be willing to give folks an export, but I'd need to prune out the email addresses from my commenters.) 

If worse comes to worse, I'm going to mod my own copy to get just the comment data and follow it up with a loop to get the entry data.