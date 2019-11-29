---
layout: post
title: "What is the impact of enabling CLOB/BLOB for a ColdFusion DSN?"
date: "2013-07-12T10:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2013/07/12/What-is-the-impact-of-enabling-CLOBBLOB-for-a-ColdFusion-DSN
guid: 4982
---

Yesterday Adam R sent me an interesting question:

<blockquote>
I'm hitting a wall in my google-fu regarding blob/clob settings in CF datasources. Is there any reason you know of why we shouldn't be enabling them (not suitable for production, performance, etc.?)? The byte buffer setting is just too arbitrary for our needs so it seems like we should just be clicking those check boxes. A lot of CF tuning information says disable them if you don't need them but none say why.
</blockquote>
<!--more-->
This was a great question, but unfortunately, I had absolutely no idea what the answer was. Luckily, I've got smart friends, so I turned to them. First up with an answer was Dave Watts:

<blockquote>
Historically, there's been overhead required by the database
connection to handle LOB fields, and if you're not using those fields
for a given query you'd still be paying that overhead. I don't know if
that's still actually true for modern JDBC drivers, but I wouldn't be
at all surprised if it were. Back in the CF 5 days, Allaire Consulting
specifically recommended at one point to create one datasource without
LOB support enabled, and use that for queries that don't need to touch
those fields.

LOB fields aren't stored in the normal database storage mechanism.
Instead, the database table stores a pointer to another location,
which is where the LOB is actually stored.
</blockquote>

Seems logical to me. Then <a href="http://www.carehart.org">Charlie Arehart</a> chimed in:

<blockquote>
My recollection was that it caused a different kind of call from CF to the server (via JDBC), but I have not explored it.

One could determine it themselves any number of ways. For instance, if you enable the logging option (in the advanced settings of a DSN) that will create<strong>quite</strong> verbose logging of each query (like hundreds of lines per query, so don't leave it on in production). 

Or, from the DB perspective, one could use a tool that tracks the details of the query as received. For instance, in SQL Server, one can use SQL Profiler to see the details of the communications.

It would be good to hear a more authoritative conclusion to why some have learned that turning it off can help. 

I suspect it could be one of those things where there's not a definitive answer that always applies. For instance, I'm sure many here have heard some say that turning OFF the maintain connections can help in some situations. Yet that flies in the face of the notion that "creating connections are expensive, and each request (or query) creating a connection would add up fast". Still, some swear that using the connection pool was worse than not doing it.

Personally, I would much prefer that such recommendations come with that more detailed explanation of how they really "help". I see way too many such "tips" that "work" for one person and so get spread as "the answer" for everyone, when in fact it makes things worse for some people, all because no one really took the time to really understand/document/pass on why it was "better".

Of course, to offer that info requires writing, and reading, and few people seem to have patience for that. I suspect only very few here have even read to this final sentence. :-)
</blockquote>
 
Wise points as always from Mr. Arehart. (I call him that since he is <i>way</i> older than I am. Honest.) 

Anyway, I hope this helps others, and of course, if folks disagree or have something to  add, please do so!