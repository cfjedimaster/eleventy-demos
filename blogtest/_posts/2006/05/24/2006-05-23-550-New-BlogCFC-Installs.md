---
layout: post
title: "550 New BlogCFC Installs"
date: "2006-05-24T10:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/05/24/550-New-BlogCFC-Installs
guid: 1290
---

Forgive me for tooting my own horn (and there is a practical side to this entry as well), but <a href="http://www.hellometro.com">HelloMetro.com</a> went live with 550 new installs of BlogCFC. The installs are all virtual for their 550 city sites. More info at the <a href="http://www.prweb.com/releases/2006/5/prweb389917.htm">press release</a>.

So how was this done? Most people don't know (maybe because I never documented it) that BlogCFC supports dynamic configuration as well as the more normal blog.ini.cfm file. So for example, to make one install of BlogCFC work for all 550 blogs, I simply added code like so to the Application.cfm file:

<code>
&lt;cfset blogName = getCities.cityName&gt;

&lt;!--- custom ---&gt;
&lt;cfset instance = structNew()&gt;
&lt;cfset instance.dsn = "Blog"&gt;
&lt;cfset instance.owneremail="blog@hellometro.com"&gt;
&lt;cfset instance.blogurl = "http://#cgi.server_name#/blog/index.cfm"&gt;
&lt;cfset instance.blogtitle = "#blogName# Blog"&gt;
&lt;cfset instance.blogdescription = "#blogname# Blog"&gt;
&lt;cfset instance.blogDBType="MSSQL"&gt;
&lt;cfset instance.locale="en_US"&gt;
&lt;cfset instance.users = ""&gt;
&lt;cfset instance.commentsFrom  = ""&gt;
&lt;cfset instance.mailServer = ""&gt;
&lt;cfset instance.mailUsername = ""&gt;
&lt;cfset instance.mailPassword = ""&gt;
&lt;cfset instance.pingurls = ""&gt;
&lt;cfset instance.offset = "0"&gt;
&lt;cfset instance.allowtrackbacks = false&gt;
&lt;cfset instance.trackbackspamlist="phentermine,MORE STUFF DELETED"&gt;
&lt;cfset instance.blogkeywords = ""&gt;
&lt;cfset instance.ipblocklist = "67.180.242.3"&gt;
&lt;cfset instance.maxentries = "10"&gt;
&lt;cfset instance.usecaptcha = false&gt;
</code>

The value, getCities, is a query containing the current city based on the host name. I got this from cfincluding custom code, but you could replace this with any other code as well. 

I then changed the component creation to this:

<code>
&lt;cfset application.blog = createObject("component","org.camden.blog.blog").init(blogName, instance)&gt;
</code>

Notice how I pass the instance struct to the init method. Anyway, that was it. I did do other mods to support their "Anyone can blog" functionality, and yes, I know the layout is broken in Firefox (they are working on that).