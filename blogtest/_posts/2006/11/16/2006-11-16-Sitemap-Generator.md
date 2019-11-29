---
layout: post
title: "Sitemap Generator"
date: "2006-11-16T22:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/11/16/Sitemap-Generator
guid: 1660
---

Earlier today Yahoo and Google announced their collaboration on <a href="http://www.sitemaps.org/">Sitemaps.org</a>. Sitemaps provide a way to describe to a search engine what pages make up your web site. I've had sitemap support in BlogCFC for a while, but today I wrote a little UDF you can use to generate sitemap xml. It will take either a list of URLs or a query of URLs. Enjoy. I'll post it to CFLib later in the week.
<!--more-->
<code>
&lt;cffunction name="generateSiteMap" output="false" returnType="xml"&gt;
	&lt;cfargument name="data" type="any" required="true"&gt;
	&lt;cfargument name="lastmod" type="date" required="false"&gt;
	&lt;cfargument name="changefreq" type="string" required="false"&gt;
	&lt;cfargument name="priority" type="numeric" required="false"&gt;
	
	&lt;cfset var header = "&lt;?xml version=""1.0"" encoding=""UTF-8""?&gt;&lt;urlset xmlns=""http://www.sitemaps.org/schemas/sitemap/0.9""&gt;"&gt;
	&lt;cfset var result = header&gt;
	&lt;cfset var aurl = ""&gt;
	&lt;cfset var item = ""&gt;
	&lt;cfset var validChangeFreq = "always,hourly,daily,weekly,monthly,yearly,never"&gt;
	&lt;cfset var newDate = ""&gt;
	&lt;cfset var tz = getTimeZoneInfo().utcHourOffset&gt;
	
	&lt;cfif structKeyExists(arguments, "changefreq") and not listFindNoCase(validChangeFreq, arguments.changefreq)&gt;
		&lt;cfthrow message="Invalid changefreq (#arguments.changefreq#) passed. Valid values are #validChangeFreq#"&gt;
	&lt;/cfif&gt;

	&lt;cfif structKeyExists(arguments, "priority") and (arguments.priority lt 0 or arguments.priority gt 1)&gt;
		&lt;cfthrow message="Invalid priority (#arguments.priority#) passed. Must be between 0.0 and 1.0"&gt;
	&lt;/cfif&gt;
	
	&lt;!--- reformat datetime as w3c datetime / http://www.w3.org/TR/NOTE-datetime ---&gt;
	&lt;cfif structKeyExists(arguments, "lastmod")&gt;			
		&lt;cfset newDate = dateFormat(arguments.lastmod, "YYYY-MM-DD") & "T" & timeFormat(arguments.lastmod, "HH:mm")&gt;
		&lt;cfif tz gte 0&gt;
			&lt;cfset newDate = newDate & "-" & tz & ":00"&gt;
		&lt;cfelse&gt;
			&lt;cfset newDate = newDate & "+" & tz & ":00"&gt;
		&lt;/cfif&gt;		
	&lt;/cfif&gt;
	
	&lt;!--- Support either a query or list of URLs ---&gt;
	&lt;cfif isSimpleValue(arguments.data)&gt;
		&lt;cfloop index="aurl" list="#arguments.data#"&gt;
			&lt;cfsavecontent variable="item"&gt;
&lt;cfoutput&gt;
&lt;url&gt;
	&lt;loc&gt;#xmlFormat(aurl)#&lt;/loc&gt;
	&lt;cfif structKeyExists(arguments,"lastmod")&gt;
	&lt;lastmod&gt;#newDate#&lt;/lastmod&gt;
	&lt;/cfif&gt;
	&lt;cfif structKeyExists(arguments,"changefreq")&gt;
	&lt;changefreq&gt;#arguments.changefreq#&lt;/changefreq&gt;
	&lt;/cfif&gt;
	&lt;cfif structKeyExists(arguments,"priority")&gt;
	&lt;priority&gt;#arguments.priority#&lt;/priority&gt;
	&lt;/cfif&gt;
&lt;/url&gt;
&lt;/cfoutput&gt;
			&lt;/cfsavecontent&gt;
			&lt;cfset item = trim(item)&gt;
			&lt;cfset result = result & item&gt;
		&lt;/cfloop&gt;
		
	&lt;cfelseif isQuery(arguments.data)&gt;
		&lt;cfloop query="arguments.data"&gt;
			&lt;cfsavecontent variable="item"&gt;
&lt;cfoutput&gt;
&lt;url&gt;
	&lt;loc&gt;#xmlFormat(url)#&lt;/loc&gt;
	&lt;cfif listFindNoCase(arguments.data.columnlist,"lastmod")&gt;
		&lt;cfset newDate = dateFormat(lastmod, "YYYY-MM-DD") & "T" & timeFormat(lastmod, "HH:mm")&gt;
		&lt;cfif tz gte 0&gt;
			&lt;cfset newDate = newDate & "-" & tz & ":00"&gt;
		&lt;cfelse&gt;
			&lt;cfset newDate = newDate & "+" & tz & ":00"&gt;
		&lt;/cfif&gt;		
		&lt;lastmod&gt;#newDate#&lt;/lastmod&gt;
	&lt;/cfif&gt;
	&lt;cfif listFindNoCase(arguments.data.columnlist,"changefreq")&gt;
	&lt;changefreq&gt;#changefreq#&lt;/changefreq&gt;
	&lt;/cfif&gt;
	&lt;cfif listFindNoCase(arguments.data.columnlist,"priority")&gt;
	&lt;priority&gt;#priority#&lt;/priority&gt;
	&lt;/cfif&gt;
&lt;/url&gt;
&lt;/cfoutput&gt;
			&lt;/cfsavecontent&gt;
			&lt;cfset item = trim(item)&gt;
			&lt;cfset result = result & item&gt;
		
		&lt;/cfloop&gt;
	&lt;/cfif&gt;
	
	&lt;cfset result = result & "&lt;/urlset&gt;"&gt;
	
	&lt;cfreturn result&gt;
	
&lt;/cffunction&gt;
</code>