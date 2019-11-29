---
layout: post
title: "Ask a Jedi: Showing new content to a user?"
date: "2008-11-13T11:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/11/13/Ask-a-Jedi-Showing-new-content-to-a-user
guid: 3100
---

Jon asks:

<blockquote>
<p>
Hi, I am a frequent visitor to this site in my hours of
need. Fairly new to the world of development (9 months) and I am still fairly inadequate as you could probably guess.
</p>
<p>
Anyway, my request is a tutorial or advice on how to work out the threads / comments on a forum that a forum user
hasn't read yet or that were posted since the last time he logged in and marking them as such.
</p>
</blockquote>

This is a fairly simple question with some interesting twists as well. But I'll start by saying, Jon, don't feel inadequate. I've been doing web development since 1995 and I still feel like I have an incredible amount of stuff to learn. Of course, if I knew it all, the job wouldn't be fun, right?
<!--more-->
Ok, so on to your main question. It is fairly simple to create a way to flag new content. The way I think most folks do this is by recording a lastLogin value. If you know when the user last logged in then you know what content has been updated since then. You can then provide a nice list on login or add a <b>New!</b> tag next to content.

One thing you have to watch out for though is what to do on login. If you set lastLogin to the current date and time on login, then you've lost the previous value. Typically what I'll do is this (pseudo-code!):

On Good Login:<br />
Get their lastLogin value and store it in the session.<br />
Set lastLogin to the current time and persist the value.

Hopefully that makes sense. If Bob logs in on Monday, his user record will have that value stored in the back end. When he logs in on Tuesday, you want the Monday value for display purposes, but want to update his record with the Tuesday time.

This method will be slightly off since, if I log in on Monday at 9AM, and I see and read a post written at 9:05AM, then when I come back on Tuesday that post is marked new even though I had already read it.

You could store the last logout value. That's easy enough to do when the user logs out, but you want to make sure you use the onSessionEnd value (see the docs for Application.cfc) to support folks who forget to logout. That would give you best timestamp for what is new to the user.

Another idea is to just make it simple. Don't care at all about login and logout and just flag all content updated in the past 24 hours. This may actually be better as it gives folks who use your site often a better idea of what content is fresh. I'd still store a lastLogin/logout value in the database for statics though.