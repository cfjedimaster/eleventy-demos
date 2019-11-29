---
layout: post
title: "Yahoo Traffic API ColdFusion Example"
date: "2006-09-28T17:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/09/28/Yahoo-Traffic-Example
guid: 1562
---

That's it. I'm officially boycotting Yahoo. They are an evil corporation and must be stopped. Why do I say that? Today I decided to look at their <a href="http://developer.yahoo.com/traffic/">Traffic API</a>, and while it was <i>dang</i> cool - they angered me by not supporting the sprawling metropolis known as <a href="http://en.wikipedia.org/wiki/Lafayette%2C_la">Lafayette, LA</a>. So that's it. No more examples. Well, ok, maybe just one more. (And you know, the Map API look pretty darn cool too.)
<!--more-->
So I spent a few minutes looking at the <a href="http://developer.yahoo.com/traffic/rest/V1/index.html">Traffic REST API</a> last night after my presentation. This was after Teddy Payne and I spent a good hour fighting the darn Google Calendar API service. What a good feeling it was to spend an hour getting nowhere with one API and have success in - oh - five minutes - with another. 

At a basic level - Yahoo Traffic can provide reports on addresses down to the street level, city, state, or zip code. You can also provide an address in a free form text mode using the <b>location</b> attribute. The most interesting attribute though is the severity value. Yahoo rates every traffic "issue" on a 1 to 5 scale, with 1 being the least severe and 5 being... well, you don't want to go there. This lets you filter out traffic problems that don't really concern you. 

I can think of some great real world uses for this. An organization could create a traffic report for it's location and send it out to it's employees every morning. An event management site could send out an alert to an organizer so they know about traffic issues going on before an event. I think you get the idea.

So once again I have an example. As before, I'm not going to explain it as all I did was pick apart the XML result. As before, I didn't use everything from the request/result API. I'd suggest checking the <a href="http://developer.yahoo.com/traffic/rest/V1/index.html">documentation</a> for a full list of what you can do. 

Oh - one note. The datetime stamps returned from this service are in a UNIX epoch form. Basically the number of seconds from 1970. Luckily Chris Mellon wrote a nice little UDF to convert those values. I use this within my code below.

<code>
&lt;cfscript&gt;
/**
 * Converts a UNIX epoch time to a ColdFusion date object.
 * 
 * @param epoch 	 Epoch time, in seconds. (Required)
 * @return Returns a date object. 
 * @author Chris Mellon (mellon@mnr.org) 
 * @version 1, June 21, 2002 
 */
function EpochTimeToDate(epoch) {
    return DateAdd("s", epoch, "January 1 1970 00:00:00");
}
&lt;/cfscript&gt;

&lt;!--- Main URL ---&gt;
&lt;cfset reqURL = "http://api.local.yahoo.com/MapsService/V1/trafficData"&gt;
&lt;!--- AppID ---&gt;
&lt;cfset appID = "doesanyonereadtheseposts"&gt;
&lt;!--- where? ---&gt;
&lt;cfset location = "CA"&gt;
&lt;!--- get a map image ---&gt;
&lt;cfset include_map = 1&gt;

&lt;cfhttp url="#reqURL#?appid=#appID#&location=#urlEncodedFormat(location)#&include_map=#include_map#" charset="utf-8"&gt;

&lt;cfset result = cfhttp.fileContent&gt;
&lt;cfset xmlResult = xmlParse(result)&gt;

&lt;cfif structKeyExists(xmlResult, "Error")&gt;

	&lt;cfset error = xmlResult.error.message.xmlText&gt;
	&lt;cfoutput&gt;
	The following error was returned: #error#
	&lt;/cfoutput&gt;
	
&lt;cfelse&gt;

	&lt;cfset lastUpdated = xmlResult.resultSet.lastUpdateDate.xmlText&gt;
	&lt;!--- convert to a normal date ---&gt;
	&lt;cfset lastUpdated = epochTimeToDate(lastUpdated)&gt;
	
	&lt;!--- get alerts ---&gt;
	&lt;cfset alerts = arrayNew(1)&gt;
	
	&lt;cfif structKeyExists(xmlResult.resultSet, "result")&gt;
		&lt;cfset numAlerts = arrayLen(xmlResult.resultSet.result)&gt;
		
		&lt;cfloop index="x" from="1" to="#numAlerts#"&gt;
			
			&lt;cfset thisAlert = xmlResult.resultSet.result[x]&gt;
			&lt;cfset alert = structNew()&gt;
			&lt;cfset alert.type = thisAlert.xmlAttributes.type&gt;
			&lt;cfset alert.title = thisAlert.title.xmlText&gt;
			&lt;cfset alert.description = thisAlert.description.xmlText&gt;
			&lt;cfset alert.direction = thisAlert.direction.xmlText&gt;
			&lt;cfset alert.severity = thisAlert.severity.xmlText&gt;
			&lt;cfset alert.reportdate = epochTimeToDate(thisAlert.reportdate.xmlText)&gt;
			&lt;cfset alert.updatedate = epochTimeToDate(thisAlert.updatedate.xmlText)&gt;
			&lt;cfset alert.enddate = epochTimeToDate(thisAlert.enddate.xmlText)&gt;
			&lt;cfif structKeyExists(thisAlert, "imageURL")&gt;
				&lt;cfset alert.imageurl = thisAlert.imageurl.xmlText&gt;
			&lt;cfelse&gt;
				&lt;cfset alert.imageurl = ""&gt;
			&lt;/cfif&gt;
			&lt;cfset arrayAppend(alerts, alert)&gt;
		&lt;/cfloop&gt;
	&lt;/cfif&gt;
		
	&lt;cfoutput&gt;
	&lt;h2&gt;Traffic Report&lt;/h2&gt;
	
	&lt;p&gt;
	Last Updated: #dateFormat(lastUpdated)# #timeFormat(lastUpdated)#&lt;br /&gt;
	There are #arrayLen(alerts)# alert(s).
	&lt;/p&gt;
	&lt;/cfoutput&gt;
	
	&lt;cfloop index="x" from="1" to="#arrayLen(alerts)#"&gt;
		&lt;p&gt;
		&lt;hr /&gt;
		&lt;p&gt;
		
		&lt;p&gt;
		&lt;cfoutput&gt;
		Type: #alerts[x].type#&lt;br /&gt;
		Title: #alerts[x].title#&lt;br /&gt;
		Description: #alerts[x].description#&lt;br /&gt;
		Traffic Direction: #alerts[x].direction#&lt;br /&gt;
		Severity (1 is best, 5 is worst): #alerts[x].severity#&lt;br /&gt;
		Reported: #dateFormat(alerts[x].reportdate)# #timeFormat(alerts[x].reportdate)#&lt;br /&gt;
		Last Updated: #dateFormat(alerts[x].updatedate)# #timeFormat(alerts[x].updatedate)#&lt;br /&gt;
		Scheduled End Date: #dateFormat(alerts[x].enddate)# #timeFormat(alerts[x].enddate)#&lt;br /&gt;
		&lt;cfif len(alerts[x].imageurl)&gt;
		Picture: &lt;br /&gt;
		&lt;img src="#alerts[x].imageurl#"&gt;
		&lt;/cfif&gt;
		&lt;/cfoutput&gt;
		&lt;/p&gt;
		
	&lt;/cfloop&gt;
	
&lt;/cfif&gt;
</code>