---
layout: post
title: "Ask a Jedi: Sorting a 2D Array"
date: "2008-07-05T09:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/07/05/Ask-a-Jedi-Sorting-a-2D-Array
guid: 2916
---

Pat asks:

<blockquote>
<p>
Is there an easy way to 'sort' a two dimensional array ? I know you can use ArraySort() on a single dimensional array.

For example: I have a two dimensional array that has a reference number in element 1 (which refers to a supplier in a database), in element 2 is a calculated distance from a supplied postcode. The array is produced in the order that suppliers are retrieved from the database. However, it would be better to sort the array by distance before outputting the data.
</p>
</blockquote>
<!--more-->
As Pat mentions, there is indeed an arraySort function built into ColdFusion, but it sorts single dimension arrays only. One way of handling this is with a <a href="http://en.wikipedia.org/wiki/Bubble_sort">bubble sort</a> implementation. I found a good <a href="http://www.nathanstanford.name/cftips/index.cfm?fuseaction=home.cftip&issueid=16">example</a> of this on Nathan Stanford's site. Here is a quick example:

<code>

&lt;cfset data = arrayNew(2)&gt;
&lt;cfset data[1][1] = "Alpha"&gt;
&lt;cfset data[1][2] = 9&gt;
&lt;cfset data[2][1] = "Beta"&gt;
&lt;cfset data[2][2] = 1&gt;
&lt;cfset data[3][1] = "Gamma"&gt;
&lt;cfset data[3][2] = 12&gt;

&lt;cfdump var="#data#"&gt;

&lt;cfloop index="outer" from="1" to="#arrayLen(data)#"&gt;
	&lt;cfloop index="inner" from="1" to="#arrayLen(data)-1#"&gt;
		&lt;cfif data[inner][2] gt data[outer][2]&gt;
			&lt;cfset arraySwap(data,outer,inner)&gt;
		&lt;/cfif&gt;
	&lt;/cfloop&gt;
&lt;/cfloop&gt;

&lt;cfdump var="#data#"&gt;
</code>

You will notice the code is rather simple. We loop over the array with an outer and inner loop, doing comparisons as we run through the data. If you read the wikipedia article you will see that this sort isn't the best for large sets of data. Another option then would be to simply create the data into a query. You probably had the data in a query already. If not, you can make one with queryNew. At that point, the sorting becomes a trivial matter of using a query of query.