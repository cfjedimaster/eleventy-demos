---
layout: post
title: "Ask a Jedi: Mixing ColdFusion Ajax and CFCALENDAR"
date: "2008-06-23T11:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/06/23/Ask-a-Jedi-Mixing-ColdFusion-Ajax-and-CFCALENDAR
guid: 2896
---

Michael asks:

<blockquote>
<p>
Ray, huge fan, long time...I have a ? for you. I am diving into CFCALENDAR and want to know how to use the SelectedDate attribute to query and display results from a DB. Right now i have a very simple calendar setup with a cfinput to BIND to
cal.SelectedDate. Upon clicking on new dates, the bind works and displays the correct date. How can i use this information to populate a query and/or display data relevant to the date chosen?
</p>
</blockquote>
<!--more-->
Interestingly enough - I was never able to get a bind to work correctly with the cfcalendar tag. I did get onChange to work. You can use onChange with cfcalendar to fire ActionScript code when a user selects a date. Since ActionScript can call JavaScript, that is the route I took. I blogged about this <a href="http://www.raymondcamden.com/index.cfm/2007/10/19/Ask-a-Jedi-Loading-a-Page-with-CFCALENDAR">last year</a>, and for this blog entry I'm going to use some of the code Todd Sharp suggested in the comments.

Here is the calendar code I used:

<code>
&lt;cfform name="myform" form="html"&gt;
&lt;cfcalendar name="cal" onChange="if(cal.selectedDate) getURL('javascript:loadit(\''+cal.selectedDate.getFullYear()+'\',\''+cal.selectedDate.getMonth()+'\',\''+cal.selectedDate.getDate()+'\')')"&gt;
&lt;/cfform&gt;
</code>

Note the onChange. It's way complex, but mainly because of all the single quotes. Basically though it says - if a date is selected (onChange fires when you deselect as well), then call a JavaScript function, loadit, and pass in the year, month, and and date. If you just use selectedDate you get an uglier date string. This is easier to work with. My loadit function looks like so:

<code>
&lt;script&gt;
function loadit(y,m,d) {
	ColdFusion.navigate('showdata.cfm?year='+y+'&m='+m+'&d='+d,'dataarea');
}
&lt;/script&gt;
</code>

This uses the ColdFusion.navigate function to tell showdata.cfm to load with the right values. The dataarea area is defined like so:

<code>
&lt;cfdiv id="dataarea" /&gt;
</code>

All showdate.cfm would then is run a SQL command (hopefully via a CFC) to load records based on the URL parameters you send in. 

Don't forget to validate the URL parameters. Don't assume it's a valid date. You probably also want to add some 'common sense' validation and prevent dates that are outside the range of your data. If you are doing a movie site, it makes no sense to use dates in the 1800s, or dates in the 23rd century.