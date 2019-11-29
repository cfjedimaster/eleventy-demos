---
layout: post
title: "A few simple (and harmless) ColdFusion mistakes"
date: "2011-06-13T14:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/06/13/A-few-simple-and-harmless-ColdFusion-mistakes
guid: 4264
---

This has been sitting in my "To Do" pile for a while and this morning <a href="http://www.boyzoid.com">Scott Stroz</a> added a suggestion to help me complete this post. What are a few mistakes that ColdFusion programmers tend to make that are - for the most part - harmless? Here's a quick list, along with fixes, and as always, if my readers have some other suggestions, leave a comment.
<!--more-->
<p/>

<b>1) Overusing Pound Signs</b><br/>
One of the more common mistakes folks new to ColdFusion make is knowing when they need to use pound signs. So for example:

<p>

<code>
&lt;cfset person = {}&gt;
&lt;cfset name = "Ray"&gt;
&lt;cfset person.name = #name#&gt;
</code>

<p>

The last line assigns the name variable to a structure key. The pound signs there is certainly valid CFML, but is also unnecessary. There are only two cases where you need pounds:

<p>

a) Within CFOUTPUT to tell ColdFusion to evaluate it as a variable<br/>
b) Within a string variable to tell ColdFusion to evaluate it as a variable

<p>

That second one may be a bit confusing - here is what I mean:

<p>

<code>
&lt;cfset greeting = "Hello, #name#"&gt;
</code>

<p>

<hr/>

<p>

<b>2) Using "throw away" variables</b>

<p>

There are a few functions in ColdFusion that return a value that you don't really need. One of the best examples is arrayAppend. So you'll commonly see ColdFusion developers write the following:

<p>

<code>
&lt;cfset p = []&gt;
&lt;cfset temp = arrayAppend(p, "foo")&gt;
&lt;cfset temp = arrayAppend(p, "goo")&gt;
</code>

<p>

In the code block above, the temp variable is created and not used. The developer mistakenly thought they had to have "something" to catch the result. However, you don't. This works just as well:

<p>

<code>
&lt;cfset p = []&gt;
&lt;cfset arrayAppend(p, "foo")&gt;
&lt;cfset arrayAppend(p, "goo")&gt;
</code>

<p>

<hr/>

<p>

<b>3) Using a name for a cfquery when you don't have a result set</b>

<p>

Ok, so the first two tips were definitely harmless, but I think most folks agree they were also mistakes. This one I might get some push back on. When working with queries that do not return a result set, like an insert, update, or delete query, you do not need to use a name for the query tag. So for example:

<p>

<code>
&lt;cfquery&gt;
delete from foo
where id = &lt;cfqueryparam cfsqltype="cf_sql_integer" value="#arguments.id#"&gt;
&lt;/cfquery&gt;
</code>

<p>

In the above query I left off the name since I'm not going to be working with any set of records returned from the query. (I also left off the datasource. Don't forget you can do that in ColdFusion 9!) Some may argue there's no harm in using the name. I agree. But if you are moving your queries into CFCs, then this is just one more thing you have to var scope. Less var scoping means less work!

<p>

<hr/>

<p>

<b>4) Use of Evaluate when Struct functions are fine</b>

<p>

This is one of my favorite ones and is the one Stroz reminded me of. One thing you often see ColdFusion developers doing is using evaluate to get a dynamic form field. So for example:

<p>

<code>
&lt;cfset key = "firstname"&gt;
&lt;cfset value = evaluate("form.#key#")&gt;
</code>

<p>

This works perfectly fine, and isn't even that slow (a common warning used about the evaluate function), but it also isn't necessary. All of ColdFusion's built in scopes can be treated like a structure, and a structure provides an incredible simple way to get a key - bracket notation:

<p>

<code>
&lt;cfset key = "firstname"&gt;
&lt;cfset value = form[key]&gt;
</code>