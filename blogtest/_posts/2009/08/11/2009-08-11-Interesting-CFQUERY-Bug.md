---
layout: post
title: "Interesting CFQUERY Bug"
date: "2009-08-11T16:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/08/11/Interesting-CFQUERY-Bug
guid: 3484
---

Credit for this find goes to David McGuigan. He found the bug and reported it on a private listserv. I asked him to blog it, and he suggested I do instead. 

So apparently - and I'll admit to never having run into this - if you call a UDF from within a cfquery, and that query uses a different datasource, it "resets" the datasource of the outer cfquery.

That's a bit confusing, but consider the following example.

<code>
&lt;cfquery name="entries" datasource="blogdev" maxrows="2"&gt;
select	*
from	tblBlogEntries
&lt;cfif foo()&gt;
where	released = 1
&lt;/cfif&gt;
&lt;/cfquery&gt;
</code>

This query returns records from the table, tblBlogEntries, in the datasource blogdev. Note the call to a UDF named foo. The UDF obviously returns a boolean, and if it returns true, we add a where clause. You could imagine foo() being some kind of security check. Now imagine foo looked like so:

<code>
&lt;cffunction name="foo"&gt;
	&lt;cfset var q = ""&gt;
	&lt;cfquery name="q" datasource="cfbookclub"&gt;
	select	*
	from	authors
	&lt;/cfquery&gt;
	&lt;cfreturn false&gt;
&lt;/cffunction&gt;
</code>

See how foo() references a different datasource? This is enough to break the original cfquery and have it reference cfbookclub instead of blogdev. 

You could code around this. Simply call foo and store the result outside of the query. And as I said - I've never run into this issue myself. It's still something you may want to watch out for though.