---
layout: post
title: "Ask a Jedi: Hard coded values - how to handle?"
date: "2011-03-01T10:03:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/03/01/Ask-a-Jedi-Hard-coded-values-how-to-handle
guid: 4142
---

Chris asked:

<blockquote>
Hi Ray. Sorry to bother you, but I can't find the answer I am looking for anywhere. The thing is. I have only just recently got into using CFC's and what with using Fusebox and all the different methods and opinions. It's a bit of a jungle trying to find the right path. My only question however, is, do I have to declare an argument for hardwired values, like the bit value below...

(code edited by ray...)<br/>
&lt;cfqueryparam value="#Arguments.firstName#" cfsqltype="cf_sql_varchar" maxlength="50" /&gt;,<br/>
&lt;cfqueryparam value="1" cfsqltype="cf_sql_bit" /&gt;
</blockquote>

Welcome to the wonderful world of CFCs and no longer having the "one right way" to do things. This is something I've talked about a <i>lot</i> on this blog and it's a common feature amongst other bloggers as well. As you already know, your code works. But your wondering if this is the best way to do it or if it should be an argument. I'm going to give you my opinion along with a few ideas to consider.
<!--more-->
First off - the code you have there is absolutely fine. You do not need to make 1 an attribute. However, by itself it may be confusing. Imagine the coder that looks at your query a few years from now. Their first thought may be that something is wrong here. Perhaps the hard coded value was used for debugging and forgotten in production. You could quickly add a comment that says something along the lines of: "This value is hard coded to 1 due to our business requirement that blah blah blah." 

Another option would be to consider making it a variable. In the code I edited out above his cfquery tag made use of variables.dsn, a variable that can be used amongst all the methods of the CFC. If any other method needs this particular hard coded value then it would make sense to create a variable for it. This would also allow you to give it a meaningful name, like topScore or globalMaxRequests or somesuch. 

You could also (and yeah, I did warn there wasn't one true way, so forgive me for rambling on) consider using an external configuration for this value. There are many ways of doing this - either via a simple XML configuration file or even a datebase of "Site Settings". This doesn't really gain anything, especially if "1" as a value never changes, but it seems like "never" in our field has a much shorter time frame than the real world. 

To summarize - I'd just consider two things when using a hard coded value like this:

<ul>
<li>Documentation - will it be clear to others why a hard coded value is used?
<li> Repetition - even if every value is 1, if there is any chance you will have to use it more than once and any slim chance in the future it may change - consider making it a variable you can change in one place.
</ul>

Hope this helps!