---
layout: post
title: "RIAForge update, and a reminder about ColdFusion debugging"
date: "2011-07-29T15:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/07/29/RIAForge-update-and-a-reminder-about-ColdFusion-debugging
guid: 4313
---

So earlier today a few peeps on Twitter pointed out that a particular project page was running very slowly. I tried to replicate this but wasn't able to consistently. Then - all of a sudden - I could - and I couldn't understand why. You see - the code in question was something I knew was slow and something that was a bit out of my control - the SVN interface. I couldn't speed that up so I had made use of <a href="http://docs.model-glue.com/wiki/HowTos/HowToUseContentCaching#ContentCaching">Model-Glue caching</a>. This is a nifty little feature that probably doesn't get a lot of use out there (or maybe it does, let me know!) and allows for quick caching within your controller layer. However, I missed one very critical part of the docs:
<!--more-->
<p/>

<blockquote>
Model-Glue 3's caching systems will, by default, cache elements for five <b style="color:red">seconds</b>.
</blockquote>

<p/>

Yeah, seconds. <i>Duh.</i>  So how did I find this? Using ColdFusion's simple, built in, debugging support. You know, the one you can turn on in one second and get reports on all your CFC/template execution times and database queries? I know I'm a <strike>fanboy</strike>evangelist and I'm supposed to push this stuff, but <b>damn</b> was that useful. Turned it on - ran my test - and within 5 minutes I had identified not only the sore spot but also about 5 database queries that I could cache. As an example, the list of project categories? I've added maybe 2 categories in the last year years. Why am I getting that darn list on each and every request?

<p/>

<code>
&lt;cffunction name="getProjectCategories" output="false" returnType="any"&gt;
	&lt;cfset var cats = cacheGet("riaforgeprojectcategories")&gt;
	&lt;cfif isNull(cats)&gt;
		&lt;cfset cats = variables.gateway.getall()&gt;
		&lt;cfset cachePut("riaforgeprojectcategories", cats, createTimeSpan(7,0,0,0))&gt;
	&lt;/cfif&gt;
	&lt;cfreturn cats&gt;
&lt;/cffunction&gt;
</code>

<p/>

The open source license for a project? I fetched the details (just the name really) every time you viewed a project. I've edited licenses maybe 3 times in the history of RIAForge.

<p/>

<code>
&lt;cffunction name="getLicense" output="false" returnType="any"&gt;
	&lt;cfargument name="id" type="any" required="true"&gt;
	&lt;cfset var license = cacheGet("riaforgelicense_#arguments.id#")&gt;
	&lt;cfif isNull(license)&gt;
		&lt;cfset license = variables.dao.read(arguments.id)&gt;
		&lt;cfset cachePut("riaforgelicense_#arguments.id#", license, createTimeSpan(7,0,0,0))&gt;
	&lt;/cfif&gt;
	&lt;cfreturn license&gt;
&lt;/cffunction&gt;

&lt;cffunction name="getLicenses" output="false" returnType="any"&gt;
	&lt;cfset var licenses = cacheGet("riaforgelicenses")&gt;
	&lt;cfif isNull(licenses)&gt;
		&lt;cfset licenses = variables.gateway.getAll()&gt;
		&lt;cfset cachePut("riaforgelicenses", licenses, createTimeSpan(7,0,0,0))&gt;
	&lt;/cfif&gt;
	&lt;cfreturn licenses&gt;
&lt;/cffunction&gt;
</code>

<p/>

I did this a few times (to be honest, I could hack away at RIAForge even more, it's old and is probably due for a rewrite) and cut down the number of database queries per request in half. All by just enabling debugging and looking over the report.