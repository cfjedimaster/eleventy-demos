---
layout: post
title: "Ask a Jedi: Handling a recurring billing date"
date: "2010-02-09T18:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/02/09/Ask-a-Jedi-Handling-a-recurring-billing-date
guid: 3714
---

Ellis asks:
<p>
<blockquote>
I ran into a problem with my app last week and it had me stumped for three days. I think I worked out all the kinks, but I wanted to see if you could take a glance at my code to make sure I'm on the right path. Main issue is with billing dates. When a user signs up on the app they get a billing recurring date which the same day that they sign up on ie 1/31/2010. An error was thrown 2/30/2010 because the date doesn't exist.
</blockquote>
<!--more-->
<p>

I took a look at Ellis' solution, and while it worked, it was quite complex and long and I suggested a much simpler solution that I thought my other readers may enjoy. Obviously there are multiple ways of handling this situation, but I recommended the following pseudo-code as a solution:

<p>

<blockquote>
Given that a user wants to be billed on date X, and given it is Month M, Year N, what is the best possible match? If M/X/N exists, then use it. If the month doesn't have X days, then use the last day of the month.  
</blockquote>

<p>

I wrote this logic as the following simple UDF:

<p>

<code>
&lt;cfscript&gt;
function getBillingDate(month,year,day) {
       var baseDate = createDate(arguments.year, arguments.month, 1);
       if(daysInMonth(baseDate) lt arguments.day) return
createDate(arguments.year, arguments.month, daysInMonth(baseDate));
       return createDate(arguments.year, arguments.month, arguments.day);
}
&lt;/cfscript&gt;
</code>

<p>

As you can see, it creates a date based on the passed in year and month. It uses 1 for the day of the month. Once we have that, I simply compare the days in the month to the desired day. If the days in the month is less than the desired date, I use the total number of days in the month. Otherwise - I use the desired date. 

<p>

To ensure it actually worked, I whipped up a quick test. It runs through five years and a set of desired dates. I intentionally chose dates towards the end of the month to test my logic.

<p>

<code>
&lt;cfset tests = [1,10,15,30,31]&gt;

&lt;cfloop index="year" list="2000,2001,2002,2003,2004"&gt;
       &lt;cfloop index="month" from="1" to="12"&gt;
               &lt;cfloop index="testDate" array="#tests#"&gt;
                       &lt;cfoutput&gt;
                       Attempted billing day of #testDate# for #month#/#year# :
#getBillingDate(month,year, testDate)#&lt;br/&gt;
                       &lt;/cfoutput&gt;
               &lt;/cfloop&gt;
               &lt;br/&gt;&lt;br/&gt;
       &lt;/cfloop&gt;
       &lt;br/&gt;&lt;br/&gt;
&lt;/cfloop&gt;
</code>

I won't bore people with the output from this, but I confirmed it correctly handled February, and also noticed leap years when it could get a bit closer to 30 and 31. 

<p>

I'm sure there are probably a thousand other ways to handle this, but hopefully this will help others.