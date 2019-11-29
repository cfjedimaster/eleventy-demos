---
layout: post
title: "Ask a Jedi: Creating lowercased cookies in ColdFusion"
date: "2008-04-16T15:04:00+06:00"
categories: [coldfusion,javascript]
tags: []
banner_image: 
permalink: /2008/04/16/Ask-a-Jedi-Creating-lowercased-cookies-in-ColdFusion
guid: 2773
---

Chris asks:

<blockquote>
<p>
When creating a cookie with cfcookie, the cookie is created in uppercase characters.  Is there a way to make it lowercase?
</p>
</blockquote>

What he means is, if you do this:

<code>
&lt;cfcookie name="x" value="Foo"&gt;
</code>

And you examine your cookies, you will see that ColdFusion created the cookie and named it X. This may not seem like a big deal, but it gets important if you want to read the cookie in JavaScript.

I tried to get fancy and set a cookie like so:

<code>
&lt;cfset cookie["y"] = 2&gt;
</code>

But that made no difference. I did a quick Google and discovered a tech note from - wait for it - 2004:

<a href="http://kb.adobe.com/selfservice/viewContent.do?externalId=tn_18100">The cfcookie tag is unable to create or delete mixed case or lowercase cookies</a>

The solution they provide though still works today. You can use the cfheader tag to make the cookie yourself:

<code>
&lt;cfheader name="Set-Cookie" value="mycookie=z;expires=#DateFormat(CreateDate(2009,12,31), 'ddd, dd-mmm-yyyy')# #TimeFormat(CreateTime(00,00,00), 'HH:mm:ss')# GMT"&gt;
</code>

Things get weird though if you use both forms:

<code>
&lt;cfheader name="Set-Cookie" value="mycookie=z;expires=#DateFormat(CreateDate(2009,12,31), 'ddd, dd-mmm-yyyy')# #TimeFormat(CreateTime(00,00,00), 'HH:mm:ss')# GMT"&gt;
&lt;cfset cookie.mycookie = 'm'&gt;
</code>

I should have two cookies, one named mycookie, value z and another named MYCOOKIE, value is m. But when you view the cookie scope from ColdFusion, you see 2 keys with the exact same name (MYCOOKIE), both with a value of m.

So watch out if you are using ColdFusion to manipulate cookies that may also be manipulated via JavaScript.