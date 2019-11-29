---
layout: post
title: "Ask a Jedi: Using query data in cflayoutarea"
date: "2008-08-01T08:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/08/01/Ask-a-Jedi-Using-query-data-in-cflayoutarea
guid: 2951
---

Ken asks:

<blockquote>
<p>
How can you access cfquery data from within a cflayoutarea using the source attribute ?

Eg.<br />
&lt;cflayout name="tabReferee" type="tab" align="center"&gt;<br>
&nbsp;&nbsp;&lt;cfoutput query="myQ"&gt;<br>
&nbsp;&nbsp;&nbsp;&lt;cflayoutarea name="tab#currentrow#" title="Title" source="frm_referees.cfm" /&gt;<br>
&nbsp;&nbsp;&lt;/cfoutput&gt;<br>
&lt;/cflayout&gt;<br>

Now let's assume there is a record id column in the query ("rid").

How do I access this column from within the frm_referees.cfm page?
</p>
</blockquote>
<!--more-->
As you probably discovered, if you tried to use rid in the frm_referees.cfm page, you get an error. Why? ColdFusion uses Ajax to load the content. That means the section is loaded after the page is delivered to the browser. A whole other reqest is run by using JavaScript to request frm_referees.cfm. 

So to pass just an id value, the solution is to pass it in the url:

<code>
&lt;cflayoutarea name="tab#currentrow#" title="Title"  source="frm_referees.cfm?id=#id#" /&gt;
</code>

You can pass other values as well, but you want to ensure the URL doesn't get too long for the browser, and you want to be sure to use urlEncodedFormat() for non-numeric values.

If you did have a lot of values, then you may have to run the query again. Not the complete query of course. Just a query to get information for one row. You could modify your initial query than just to get the ID value. That will make your code a bit more efficient.