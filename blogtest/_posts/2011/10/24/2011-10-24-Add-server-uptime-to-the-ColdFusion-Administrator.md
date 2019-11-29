---
layout: post
title: "Add server uptime to the ColdFusion Administrator"
date: "2011-10-24T15:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/10/24/Add-server-uptime-to-the-ColdFusion-Administrator
guid: 4406
---

On a private list, Ryan Guill asked if it was possible to get the ColdFusion's server uptime in the administrator. You can see this now in the Server Monitor as well as the Server Manager. Here's a quick screen shot of a few of my servers.
<!--more-->
<p>

<img src="https://static.raymondcamden.com/images/ScreenClip207.png" />

<p>

But if you want to put it in the CF Admin itself, it's pretty simple using the Admin API. The servermonitoring CFC has a method called getHeartBeat. This method returns a set of values about the server one of which is the uptime in milliseconds.  Here's a quick snippet that shows this inaction.

<p>

<code>

&lt;cfset admin = createObject("component", "CFIDE.adminapi.administrator")&gt;
&lt;cfset admin.login("admin")&gt;
&lt;cfset sm = createObject("component", "CFIDE.adminapi.servermonitoring")&gt;
&lt;cfset hb = sm.getHeartBeat()&gt;

&lt;!--- miliseconds ---&gt;
&lt;cfset uptime = hb.serveruptime&gt;
</code>

<p>

And that's basically it depending on how you want to display it. So how do you get this in the admin? I've talked about this before, but the first thing you do is open custommenu.xml in your CFADMIN folder:

<p>

<code>
&lt;submenu label="Custom"&gt;
	&lt;menuitem href="uptime.cfm" target="content"&gt;Uptime&lt;/menuitem&gt;
&lt;/submenu&gt;
</code>

<p>

And here is uptime.cfm. I added the common header/footer elements used by CF Admin files and made use of <a href="http://cflib.org/udf/duration">Duration</a> from CFLib.

<p>

<code>

&lt;cfscript&gt;
/**
 * Duration(dateObj1, dateObj2)
Takes two date objects and returns a structure containing the duration of days, hours, and minutes.
 * v2 mod by James Moberg to support seconds.
 * 
 * @param dateObj1  	 CF Date Object to compare (Required)
 * @param dateObj2  	 CF Date Object to compare (Required)
 * @return Returns a structure containing the keys Days, Hours, and Minutes with their associated values. 
 * @author Chris Wigginton (&#99;&#119;&#105;&#103;&#103;&#105;&#110;&#116;&#111;&#110;&#64;&#109;&#97;&#99;&#114;&#111;&#109;&#101;&#100;&#105;&#97;&#46;&#99;&#111;&#109;) 
 * @version 2, September 29, 2011 
 */
function Duration(dateObj1, dateObj2){
       var dateStorage = dateObj2;
       var DayHours = 0;
       var DayMinutes = 0;
       var HourMinutes = 0;
       var timeStruct = structNew();

       if (DateCompare(dateObj1, dateObj2) IS 1)       {
                       dateObj2 = dateObj1;
                       dateObj1 = dateStorage;
       }

       timeStruct.days = DateDiff("d",dateObj1,dateObj2);
       DayHours = timeStruct.days * 24;
       timeStruct.hours = DateDiff("h",dateObj1,dateObj2);
       timeStruct.hours = timeStruct.hours - DayHours;

       DayMinutes = timeStruct.days * 1440;
       HourMinutes = timeStruct.hours * 60;
       timeStruct.minutes = DateDiff("n",dateObj1,dateObj2);
       timeStruct.minutes = timeStruct.minutes - (DayMinutes + HourMinutes);

       DayMinutes = timeStruct.days * 86400;
       HourMinutes = (timeStruct.hours * 3600) + (timeStruct.minutes * 60);
       timeStruct.seconds = DateDiff("s",dateObj1,dateObj2);
       timeStruct.seconds = timeStruct.seconds - (DayMinutes + HourMinutes);
       return timeStruct;
}
&lt;/cfscript&gt;

&lt;cfset sm = createObject("component", "CFIDE.adminapi.servermonitoring")&gt;
&lt;cfset hb = sm.getHeartBeat()&gt;

&lt;!--- miliseconds ---&gt;
&lt;cfset uptime = hb.serveruptime&gt;

&lt;cfset upat = dateAdd("l", -1 * uptime, now())&gt;

&lt;cfset dur = duration(upat, now())&gt;

&lt;cfinclude template="header.cfm"&gt;

&lt;h2 class="pageHeader"&gt;Uptime&lt;/h2&gt;

&lt;cfoutput&gt;
Up for #dur.days# days, #dur.hours# hours, and #dur.minutes# minutes.
&lt;/cfoutput&gt;

&lt;cfinclude template="footer.cfm"&gt;
</code>

<p>

Here's a screen shot:

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip208.png" />

<p>

Notice I chose to ignore the seconds value. It seems a bit silly to be concerned about that level of detail. Feel free to disagree with me though. The Duration UDF returns it.