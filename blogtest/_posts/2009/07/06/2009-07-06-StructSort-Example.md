---
layout: post
title: "StructSort Example"
date: "2009-07-06T18:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/07/06/StructSort-Example
guid: 3424
---

This was discussed on my <a href="http://www.raymondcamden.com/forums">forums</a> a few days ago, but as I rarely see structSort "in the field", I thought I'd share a simple example.
<!--more-->
The user had a simple structure where every key was a name and the value was an age. For example:

<table>
<tr>
<th>name</th>
<th>score</th>
</tr>
<tr>
<td>bob</td><td>93</td>
</tr>
<tr>
<td>ted</td><td>90</td>
</tr>
<tr>
<td>jane</td><td>94</td>
</tr>
<tr>
<td>al</td><td>91</td>
</tr>
</table>

His goal was to display the names in order of their age. structSort can handle this very simply. The structSort argument takes 4 arguments:

<ul>
<li>First is the structure you are sorting.
<li>Second is the sort type. This can be numeric, text (default), or textnocase.
<li>Third is sortOrder, which is asc or desc (no true or false, ahem, are you listening Transfer?)
<li>Last is pathToSubElement. That one is a bit scary, so just pretend it doesn't exist for a few minutes.
</ul>

The result is an array of keys sorted in the right order. So taking the simple desire to sort by age, we can use:

<code>
&lt;cfset s = {% raw %}{bob=93,ted=90,jane=94,al=91}{% endraw %}&gt;
&lt;cfdump var="#s#"&gt;
&lt;cfset sorted = structSort(s, "numeric")&gt;
&lt;cfdump var="#sorted#"&gt;
</code>

<img src="https://static.raymondcamden.com/images/cfjedi//Picture 170.png">

And that's it. Well, you probably don't want to use dump to format your data. Since we have an array of keys as a result, here is how I'd actually display it:

<code>
&lt;cfset s = {% raw %}{bob=93,ted=90,jane=94,al=91}{% endraw %}&gt;
&lt;cfset sorted = structSort(s, "numeric")&gt;

&lt;cfloop index="name" array="#sorted#"&gt;
	&lt;cfoutput&gt;#name# is #s[name]# years young.&lt;br/&gt;&lt;/cfoutput&gt;
&lt;/cfloop&gt;
</code>

Notice I use the new index/array form of cfloop. If you are on CF7, you would loop from 1 to arrayLen(sorted). The results:

<blockquote>
<p>
TED is 90 years young.<br/>
AL is 91 years young.<br/>
BOB is 93 years young.<br/>
JANE is 94 years young.<br/>
</p>
</blockquote>

Ok, simple enough, right? What if you want to use that super-special fourth argument I told you was too scary? Well, it really isn't too scary. It comes in handy if you wan to sort structures that aren't as simple as the example above. Consider this data:

<code>
&lt;cfset s2 = {}&gt;
&lt;cfset s2.ray = {% raw %}{age=36,rank="General"}{% endraw %}&gt;
&lt;cfset s2.scott = {% raw %}{age=42,rank="Private"}{% endraw %}&gt;
&lt;cfset s2.todd = {% raw %}{age=29,rank="Major"}{% endraw %}&gt;
&lt;cfset s2.fred = {% raw %}{age=51,rank="Corporal"}{% endraw %}&gt;
</code>

In this example, instead of simple values, every key is itself a structure containing an age and rank value. This is where the fourth argument comes into play. We can now sort by age or rank:

<code>
&lt;cfset sortedByAge = structSort(s2, "numeric", "asc", "age")&gt;
&lt;cfdump var="#sortedByAge#" label="sorted by age"&gt;

&lt;cfset sortedByRank = structSort(s2, "textnocase", "asc", "rank")&gt;
&lt;cfdump var="#sortedByRank#" label="sorted by rank"&gt;
</code>

Which outputs:

<img src="https://static.raymondcamden.com/images/cfjedi//Picture 245.png">

I hope this helps. And yes - I know the rank sort isn't sorting by the proper military hierarchy. You would have to write custom code to handle that yourself.