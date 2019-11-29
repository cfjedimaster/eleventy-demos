---
layout: post
title: "Ask a Jedi: Elegant way of handling errors with cfQueryParam?"
date: "2009-07-10T08:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/07/10/Ask-a-Jedi-Elegant-way-of-handling-errors-with-cfQueryParam
guid: 3430
---

Doug asks:

<blockquote>
<p>
Hey Ray, do you think sometime you could discuss using cfqueryparam versus the need to have "elegant" ways of handling bad data?  It seems like a better solution would be to redirect the user back to a default page than to have a page crash because of bad data or a hacking attempt.
</p>
<p>
I guess my point is: isn't this code:
<p>
&lt;cfif isNumeric(url.this)&gt;
&lt;cfquery name="theQuery" datasource="ds"&gt;
SELECT this,
that FROM theTable WHERE this = url.this
&lt;/cfquery&gt;
&lt;cfelse&gt;
&lt;cflocation url="/SomePlaceSafe.cfm"&gt;
&lt;/cfif&gt;
</p>
<p>
more elegant than this code:
</p>
&lt;cfquery name="theQuery" datasource="#ds#"&gt;
SELECT this, that FROM theTable WHERE this =
&lt;cfqueryparam value="url.this" cfsqltype="cf_sql_integer" /&gt;
&lt;/cfquery&gt;
</p>
<p>
I've seen you complain about this before in your Twitter feed, so I figured you had an opinion about it.  (And for the sake of argument let's ignore claims that cfqueryparam actually improves performance with certain databases.)
</p>
</blockquote>

Interesting question, Doug. I'll try my best to answer it. First off, I think you make a mistake when you say that 'elegant' handling of the error is impossible with cfqueryparam. It certainly isn't. In fact, one could simply take your code examples and merge them:
<!--more-->
<code>
&lt;cfif isNumeric(url.this)&gt;
&lt;cfquery
name="theQuery" datasource="#ds#"&gt;
SELECT this, that FROM theTable WHERE this =
&lt;cfqueryparam value="#url.this#" cfsqltype="cf_sql_integer" /&gt;
&lt;/cfquery&gt;
&lt;cfelse&gt;
&lt;cflocation
url="/SomePlaceSafe.cfm"&gt;
&lt;/cfif&gt;
</code>

And in fact, this is actually exactly what I do. Well, normally I'm writing in Model-Glue and instead do the validation at the controller layer and the query in the model layer, but I think you get my point. You certainly <b>can</b> actually double up on the validation here. It may be overkill, but when it comes to URL parameters and other things coming in from the remote client, you can't be too careful. (We all learned this last week with the FCK Editor issue, right?) Also note that both of those checks in the code above even aren't truly enough. 3.14159 is a numeric value, right? But I'm pretty sure that will either fail in the cfqueryparam or change to 3. -3 is also an integer value, but if you are using autonumber keys then you will not have any negative values. I'll often do something like this:

<code>
&lt;cfif structKeyExists(url,"this") and isNumeric(url.this) and url.this gts 1 and round(url.this) eq url.this&gt;
</code>

And if you want to get truly evil, you could also check for values greater than MAXINT (the largest number the underlying Java code can handle before flipping over).

So where exactly to use validation is a big issue. As I said, I'm normally going to do it in the controller. I've done it in beans before as well. Frankly, I'm still learning what works best for me, but the main point is, you can get both the security/performance benefit of cfqueryparam and still gracefully handle input validation yourself as well. Shoot, even if you are lazy you could get by with an onError in your Application.cfc and notice all errors thrown by queryparam and log them as (possible) url hack attempts before pushing the user to the safe place.