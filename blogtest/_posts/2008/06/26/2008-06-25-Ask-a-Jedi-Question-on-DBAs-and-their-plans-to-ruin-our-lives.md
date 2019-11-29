---
layout: post
title: "Ask a Jedi: Question on DBA's and their plans to ruin our lives..."
date: "2008-06-26T10:06:00+06:00"
categories: [coldfusion,development]
tags: []
banner_image: 
permalink: /2008/06/26/Ask-a-Jedi-Question-on-DBAs-and-their-plans-to-ruin-our-lives
guid: 2900
---

Ok, so maybe DBAs really aren't out to get us, but I know from time to time I've butted heads with a few DBAs and I'm sure others have as well. Here is an interesting story from someone dealing with something similar. 
A reader asks:

<blockquote>
<p>
An associate of mine sent me the following and I wasn't sure how to respond, since I'd never heard of such a thing and so figured I might bug you for your take:

"Our DBA has instituted a new policy to protect his databases against possible corruption by SQL Injection attacks: from now on, ALL applications must use one datasource for all writes and another for
all reads.  Those datasources are limited to writes and reads
respectively both in ColdFusion Administrator and at the database level.  We've argued that we religiously use
stored procedures or cfqueryparam in all of our database calls, but his response is that developers can't be trusted to practice these techniques consistently.

Our response is to try to think about how much work it will require to modify all existing applications to observe this practice and to make it a part of our development process for all future efforts.

But we're also preparing to push back a little and argue

A) that this policy is silly and that a read and a write datasource offers negligible additional security over a datasource that allows both reads and writes,

B) that it will take x number of hours to modify all of our existing code,

C) that this is NOT an industry standard practice and that we'd like to see some documentation,

and

D) that most if not all off the shelf and open source software does not distinguish between read and write datasources and so any applications we try to bring in from the outside would have to be modified accordingly."

And that's my question to you, Ray: would you happen to know if C and D are pretty accurate statements and, more generally, have you ever heard of read-only and write-only datasources being used as a defense against SQL injection attacks?
</p>
</blockquote>
<!--more-->
Well first off - I do not pretend to be a database expert of any level. Folks know my open source applications use rather simple queries and I don't really have Jedi SQL skills. That being said - I tend to agree that this policy seems rather draconian. Last time I checked, a database server was meant to - well - serve. 

If I have to use one DSN for queries that do writes and another for reads, this doesn't make the Write dsn any safer. I can still write bad sql that is vulnerable to sql injection attacks. I'd say all the DBA has done is added more work to your plate without making anything any more secure than it is now.

I could see using the restrictions in the CF Admin to block things like drop, etc, that would be dangerous. You could limit the connection (and at the DB user level) to only allow select, update, insert, and delete, and that would help a bit. 

I think your time would be <i>much</i> better spent doing a review to ensure your queries are using cfqueryparam and aren't vulnerable to other attacks. So for example, if you use cfqueryparam it in a query that gets the bank account for user X, but don't verify that the current user is X, no use of cfqueryparam will help you. 

As for your point C - I've never heard that before, and I'll let my readers chime in. It could certainly be that we (my reader and myself) have just never heard of this practice.

p.s. In case it isn't obvious... I know DBAs aren't out to get us. I love DBAs. They can take my slow, ugly SQL and make it scream. It's a joke folks. I'm sure most DBAs don't mind though. Except maybe Oracle DBAs. They really are out to get us!