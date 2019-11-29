---
layout: post
title: "Ask a Jedi: ColdFusion Calendar"
date: "2006-06-02T11:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/06/02/Ask-a-Jedi-ColdFusion-Calendar
guid: 1313
---

I've mentioned before that I'm going to, on an occasional basis, post questions where I don't have a great answer. That is because I have a wonderful audience and I know they can help out. As before, if this bugs people, let me know. 

Joel wants to know about ColdFusion Calendars:

<blockquote>
Do you know of any good coldfusion-based calendars?  We currently have a solution, but the company we purchased it from has since gone under.
</blockquote>

I am not aware of one. I wrote an <a href="http://www.raymondcamden.com/index.cfm/2005/8/31/ColdFusion-101-Building-a-Calendar">entry</a> on how to build one in ColdFusion. I also released <a href="http://www.coldfusionjedi.com/index.cfm/2006/4/20/GoogleCalendarcfc-Version-1">GoogleCalendar.cfc</a>, which lets you integrate with the new Google Calendar service. But again - I am not aware of a "Calendar" product for ColdFusion. 

The first place I checked was Brian's wonder <a href="http://www.remotesynthesis.com/cfopensourcelist/">ColdFusion Open Source Project List</a>. There I found:

<blockquote>
<a href="http://www.sustainablegis.com/projects/icu4j/CalendarsTB.cfm">i18n calendars</a><br>
[A] set of CFCs that use icu4j java library to handle non-gregorian calendars. these CFC know islamic, buddhist, chinese, japanese emperor, hebrew, persian, coptic, ethopian and persian (via dr. ghasem kiani's library) calendars.
</blockquote>

But that was the only thing close. So - time for the audience to help out. Also do not forget that ColdFusion can generate a calendar automatically inside forms in CFMX7.