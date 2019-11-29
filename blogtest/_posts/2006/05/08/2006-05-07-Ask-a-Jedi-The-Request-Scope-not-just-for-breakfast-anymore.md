---
layout: post
title: "Ask a Jedi: The Request Scope - not just for breakfast anymore!"
date: "2006-05-08T10:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/05/08/Ask-a-Jedi-The-Request-Scope-not-just-for-breakfast-anymore
guid: 1255
---

CJ had a good set of questions concerning the request scope:

<blockquote>
Ray - can you explain the request
scope?  Over the years, I've used it in various ways...but never fully
understood it.  Since it only lasts for the duration of the page
request...what's the biggest difference between &lt;cfset variables.myVar =
&quot;foo&quot; /&gt; and &lt;cfset request.myvar = &quot;foo&quot; /&gt;?

In
the past, in my Application.cfm, I would duplicate() the application scope into
the request scope so as to not have to worry about locking application vars
throught my code.  

Well, I've inherited an application that, in the
Application.cfm, is setting application variables, request variables, and even
local variables in various places.

So my question boils down to this...
Is
there still a reason to duplicate() the application scope into the request scope
(as opposed to just creating the vars in the request scope to begin with)?  Is
there a significant difference between setting variables into the request scope
and just setting them into the local scope (specifically in the
Application.cfm)?

I need to clean up this file, and I'd like to stop setting
variables in so many different scopes (I like consistency and would rather see
them set in one place...either application, request, or local).  Or might there
be a reason that they're being set in different scopes?
</blockquote>
<!--more-->
There are numerous questions here, so let me try to hit them up one at a time:

<blockquote>
Is there still a reason to duplicate() the application scope into the request scope (as opposed to just creating the vars in the request scope to begin with)? 
</blockquote>

I would say no. One of the reasons people would duplicate the Application scope in the "old days" is that you needed to cflock each and every instance of a shared-scope variable. You mentioned this above. This made using Application variables as simple settings a bit of a pain. By simply duplicating the data to the request scope you saved yourself a heck of a lot of typing later on. Thankfully the MX days have put excessive locking behind us. (You kids don't know how lucky you have it...)

<blockquote>
Is there a significant difference between setting variables into the request scope and just setting them into the local scope (specifically in the Application.cfm)?
</blockquote>

Not knowing the exact guts of CFML and how it's creating the local variables and request scope, I'd hesitate to say anything for sure, but my gut reaction is no. From a memory and performance level, it should be roughly the same. 

So when and where would you use the request scope? Obviously my readers will chime in with their ideas, but I typically use it for UDFs. I'll have a UDF file that looks something like this:

<code>
request.udf = structNew();
function doIt() {% raw %}{ return true; }{% endraw %}
request.udf.doIt = doIt;
</code>

This is included by my Application.cfc and then I call the udfs in my code like so:

<code>
&lt;cfset result = request.udf.doIt()&gt;
</code>

Why bother? Well one nice thing is that if you use custom tags, you have one main way of calling UDFs. If the UDFs were just in the variables scope, my custom tags would need to do this:

<code>
&lt;cfset result = caller.doIt()&gt;
</code>

Ugly, right? (And yes, I know I've done this before.) Not only is it ugly, it is potentially dangerous. If your custom tag ends up being called by another tag, the caller syntax won't work. Sure you could:

<code>
&lt;cfset result = caller.caller.doIt()&gt;
</code>

But that is even uglier. By just using the request scope, you have one place to load and use all your UDFs. Notice that I put the UDFs in a struct called "udf". That just helps me remember where stuff is, and I think it is a nice way to organize them. 

One last note - if you do end up using the request scope, double check that you aren't doing "too much." Ok, I know "too much" is super vague, but if you are setting a few hundred variables in the request scope on every hit, you should consider using the application scope instead. I know I don't put CFCs in the request scope, since creating them tend to be expensive. For UDFs I haven't noticed much of an impact. (My sites typically will have less than 10 UDFs so your mileage may vary.)

One final note: I would almost never recommend using Application.cfm/cfc to set local variables. Nothing is more confusing then debugging an issue where you can't understand why some variable exists and it ends up it was created in your root Application file. The Application.cfm/cfc file should only be creating application, session, client, or request variables.