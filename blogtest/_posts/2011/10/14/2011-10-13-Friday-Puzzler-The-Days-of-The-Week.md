---
layout: post
title: "Friday Puzzler: The Days of The Week"
date: "2011-10-14T10:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/10/14/Friday-Puzzler-The-Days-of-The-Week
guid: 4392
---

Here is a little puzzler that I think will be fun, and hopefully much simpler than my last one. For today's puzzler, you must use ColdFusion to create a function that returns the day of the week (numerical) for a date. I know what you're thinking - doesn't ColdFusion have that built in? It does. But your task is to recreate it. I have absolutely no guidelines for how you recreate it - except that you can't - obviously - use the same logic that someone else does. While the winner of these things are pretty much always picked arbitrarily, today's is going to be even more crazy. I want to see the most weird, stupid, insane, etc, ways to solve this problem. Go crazy. The only restriction is that you have to run your code via a test harness to ensure it works right. I've written one for you. It allows you to pass in your UDF and it confirms it works for a large sample of dates.

<p/>

<code>

&lt;cffunction name="testHarness"&gt;
	&lt;cfargument name="myfunc" required="true"&gt;
	&lt;cfset var dates = []&gt;
	&lt;cfset var x = ""&gt;
	&lt;cfset var result = {}&gt;
	
	&lt;!--- first make the dates ---&gt;
	&lt;cfloop index="x" from="1" to="100"&gt;
		&lt;cfset arrayAppend(dates, dateAdd("d", randRange(-1000,1000), now()))&gt;
	&lt;/cfloop&gt;	
	
	&lt;cfloop index="x" from="1" to="#arrayLen(dates)#"&gt;
		&lt;cfif dayOfWeek(dates[x]) neq myfunc(dates[x])&gt;
			&lt;cfset result.status = "fail"&gt;
			&lt;cfset result.message = "Your function said the DOW for #dateformat(dates[x])# was #myfunc(dates[x])# and it should be #dayofweek(dates[x])#"&gt;
			&lt;cfreturn result&gt;
		&lt;/cfif&gt;
	&lt;/cfloop&gt;
	
	&lt;cfset result.status = "pass"&gt;
	&lt;cfreturn result&gt;
&lt;/cffunction&gt;
</code>

<p/>

And as an example, check this one. It will fail - eventually.

<p/>

<code>
&lt;cfscript&gt;
function mycheatfunc(d) {
	if(dayofweek(d) == 7) return 8;
	return dayofweek(d);
}
&lt;/cfscript&gt;

&lt;cfset res = testHarness(mycheatfunc)&gt;
&lt;cfdump var="#res#" label="The Result"&gt;
</code>

<p/>

Unfortunately, I don't have anything to give away today - except the pride of being called King Nerd. So get cracking!