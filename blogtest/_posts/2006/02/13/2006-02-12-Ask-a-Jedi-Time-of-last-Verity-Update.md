---
layout: post
title: "Ask a Jedi: Time of last Verity update"
date: "2006-02-13T09:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/02/13/Ask-a-Jedi-Time-of-last-Verity-Update
guid: 1095
---

Michael asks:

<blockquote>
Is there a way to tell when the last Verity Search Index Update was done from within an application?
</blockquote>

As far as I know, the official answer is no. Since the index is file-based, you may be able to determine it by looking at the collection data, but I'm not sure I'd trust that 100%. However - there are two alternatives:

<ol>
<li>My Verity indexes are almost always database-based. Therefore, I know that when I update a record, I update the Verity collection. I can then use that information to determine when I last updated my Verity collection.
<li>And of course - there is the manual solution. Simply record to the database the time you last updated the Verity collection. This brings up another interesting problem, and perhaps a good blog post - what is the best way to store "junk", by junk I mean information that doesn't really belong in a table anywhere. In other words, miscellaneous type information.
</ol>