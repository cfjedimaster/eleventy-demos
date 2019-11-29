---
layout: post
title: "ORM Entity not available? Check your logs"
date: "2010-02-08T17:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/02/08/ORM-Entity-not-available-Check-your-logs
guid: 3712
---

This afternoon I was working on a set of persistent entities called event, eventtype, eventstatus, and eventpriority. Event is the "core" entity with hooks to status, type, and priority. When everything was done I whipped up a quick test:

<p>

<code>
&lt;cfset o = entityLoadByPk("event", 597878)&gt;
</code>

I assumed this would work - or throw an error about one of the properties perhaps. What I did <i>not</i> expect was this:

<h2>Mapping for component event not found.</h2>
<!--more-->
<p>

That made no sense. I took a quick look at the Hibernate APIs to see if there was a simple way to list all known entities. I discovered getAllClassMetadata, a method of the SessionFactory, and quickly tried the following code:

<p>

<code>
&lt;cfset factory = ormGetSessionFactory()&gt;
&lt;cfset known = listSort(structKeyList(factory.getAllClassMetadata()),"textnocase")&gt;
&lt;cfoutput&gt;#known#&lt;/cfoutput&gt;
</code>

<p>

This returned a nice list of entities - which unfortunately did not include event. At this point I was completely stumped. I had - of course, ran an ormReload() on my application. I even ran an applicationStop(). None of them threw an error, but none of them made event become recognized. Then I decided to check my ColdFusion logs. I found this gem in application.log:

<p>

<b>"Skipping file c:\yada\yada\yada\event.cfc as it has errors"</b>

<p>

What the frack?!?! So the component had an error - and the ORM system noticed this and just didn't tell me? How incredibly frustrating and counterintuitive! I checked exception.log and luckily, it had a longer error. My stack trace said: 

<p>

<b>"Properties cannot be declared more than once."</b>

<p>

I quickly went back to event.cfc and saw the error right away - two properties with the same name. -sigh- Fixing that immediately corrected my problem.