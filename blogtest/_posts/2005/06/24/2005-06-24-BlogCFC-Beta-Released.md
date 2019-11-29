---
layout: post
title: "BlogCFC Beta Released"
date: "2005-06-24T12:06:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2005/06/24/BlogCFC-Beta-Released
guid: 604
---

The beta of the newest version of BlogCFC has been released. There are some <b>very</b> significant changes in this release so you should only use this if you like living on the edge! (Ok, so that's a bit dramatic, but you get the idea.)

First - the link: <a href="http://ray.camdenfamily.com/blogbeta.zip">blogbeta.zip</a>.

Now - the notes:
<ul>
<li>The zip file isn't my normal build - it has all the subversion junk in it. Just ignore.
<li>BlogCFC now uses SES URLs in the form of, root/index.cfm/YYYY/MM/TITLE. Your blog entry title is transformed to a string with numbers, letters, and spaces turned into dashes. This value is stored in the alias field. When generating links to entries, we check to see if we have an alias. If we do, we use the new format. This means your old content will use the old links, and new, or edited content, will use the new format. I may include an update in the install folder later on. 
<li>The new link style should be applied anywhere that there is a direct link to an entry. Again though - only for new and updated entries.
<li>This new format means you can't have a title with the same name in one month. Well, the same translated name. I could add DAYOFMONTH to the new format, but I figure we will wait and see. What's nice is that the code to make the link is abstracted into a method, so this will be easy to fix.
<li>There are NO documentation updates. There WILL be documentation updates. As I said, this release is for those people who feel lucky.
<li>So - a few revs back I added "Blog Subscriptions". This allows folks to subscribe to your blog and get email when a new entry is released. For some dumb reason, I forgot to include an actual link to the entry in the email. I blame George Bush and Karl Rove for this. Because I can.
<li>There are some other minor changes as well. Also, the simplecontenteditor is really included this time, but not used anywhere.