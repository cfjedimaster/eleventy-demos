---
layout: post
title: "Friday Puzzler: Finding a meeting time"
date: "2006-06-16T08:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/06/16/Friday-Puzzler-Finding-a-meeting-time
guid: 1338
---

Here is an interesting problem, and one I admit I'm not sure what the best answer is. You have two people who want to meet. However, both are quite busy and have a day full of meetings. Can you use ColdFusion to find a time where both are available? I've created a simple data set that contains a query of 4 rows. Person ID is the FK of the user. Name is the name. Start and End are the times of a meeting. Each row then is one meeting, or a busy time. Your solution needs to find a time where users 1 and 2 can meet up (on 6/16 obviously). Your solution should only search from 8AM to 6PM, and, potentially, handle a case where a meeting is impossible. 


Here is some code that will generate the data for you. By the way - notice how I commit one of the cardinal sins of UDFs - accessing outside data from a UDF. Also notice how I don't care - it was a handy way to manipulate the core query quickly and easily. Anyway, here is the code:

<code>
&lt;cfscript&gt;
function addEvent(personid, name, start, end) {
	queryAddRow(data);
	querySetCell(data, "personid", arguments.personid);
	querySetCell(data, "name", arguments.name);
	querySetCell(data, "start", arguments.start);
	querySetCell(data, "end", arguments.end);
}
&lt;/cfscript&gt;

&lt;cfset data = queryNew("personid,name,start,end")&gt;
&lt;cfset addEvent(1, "Ray", "6/16/06 8:00 AM", "6/16/06 10:00 AM")&gt;
&lt;cfset addEvent(1, "Ray", "6/16/06 2:00 PM", "6/16/06 4:00 PM")&gt;
&lt;cfset addEvent(2, "Lynn", "6/16/06 8:00 AM", "6/16/06 9:00 AM")&gt;
&lt;cfset addEvent(2, "Lynn", "6/16/06 10:00 AM", "6/16/06 12:00 PM")&gt;
</code>