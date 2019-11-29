---
layout: post
title: "Followup to Google/RIAForge Post"
date: "2009-07-20T21:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/07/20/Followup-to-GoogleRIAForge-Post
guid: 3453
---

Yesterday I <a href="http://www.raymondcamden.com/index.cfm/2009/7/19/RIAForge-Update-and-awesome-example-of-ColdFusionGoogle-Integration">blogged</a> about I how I integrated Todd Sharp's <a href="http://cfgoogle.riaforge.org/">ColdFusion/Google API project</a> into <a href="http://www.riaforge.org">RIAForge</a>. I had a few people ask to see a bit of the code, so I thought I'd share how it was added. Credit goes to Todd Sharp for the integration, I just handled the view, and obviously, to see his core Google/CF code, visit his <a href="http://cfgoogle.riaforge.org">project</a>.
<!--more-->
Ok, so to start off with, we added a ColdSpring bean definition for his service:

<code>
&lt;bean id="analytics" class="model.google.analytics"&gt;
       &lt;constructor-arg name="username"&gt;
               &lt;value&gt;rcamden@gmail.com&lt;/value&gt;
   &lt;/constructor-arg&gt;
   &lt;constructor-arg name="password"&gt;
               &lt;value&gt;mypassword&lt;/value&gt;
   &lt;/constructor-arg&gt;
   &lt;constructor-arg name="defaultFormat"&gt;
       &lt;value&gt;xml&lt;/value&gt;
   &lt;/constructor-arg&gt;
&lt;/bean&gt;
</code>

As you can see, the API is initialized with my login for Google Analytics. Yes, that's my real password. Go ahead and try it. 

Next up is the controller method. This runs the reports I asked Todd to set up. To be clear, these are the reports I wanted added to RIAForge, but do <b>not</b> represent all the data you can get from Google Analytics.

<code>
&lt;cffunction name="getAnalytics" access="public" returntype="void"
output="false"&gt;
       &lt;cfargument name="event" type="any" /&gt;
       &lt;cfset var anal = getModelGlue().getBean("analytics") /&gt;
       &lt;cfset var id = "ga:1392225" /&gt;&lt;!--- hardcoding - make dynamic if you
want to ---&gt;
	   &lt;cfset var projectOb = arguments.event.getValue("project")&gt;
       &lt;cfset var project = lcase(projectOb.getUrlName()) & ".riaforge.org" /&gt;
       &lt;cfset var downloadpage = "/index.cfm?event=action.download" /&gt;&lt;!---
set it as a variable in case it ever changes ---&gt;
       &lt;cfset var trafficSources =
anal.getAnalyticsData(id=id,dimensions="ga:hostname,ga:source,ga:referralPath",metrics="ga:pageViews,ga:visits,ga:newVisits,ga:timeOnSite",filters="ga:hostname=~^#left(project,
21)#", sort="-ga:visits",maxResults=25) /&gt;
       &lt;cfset var keywords =
anal.getAnalyticsData(id=id,dimensions="ga:hostname,ga:keyword",metrics="ga:pageViews,ga:visits,ga:newVisits,ga:timeOnSite",filters="ga:hostname=~^#left(project,
21)#", sort="-ga:visits",maxResults=25) /&gt;
       &lt;cfset var downloads =
anal.getAnalyticsData(id=id,dimensions="ga:hostname,ga:pagePath,ga:month,ga:year",
metrics="ga:pageViews",filters="ga:hostname=~^#left(project,21)#;ga:pagePath==#downloadpage#",startDate=dateAdd("m",-11,now()))
/&gt;
       &lt;cfset var views =
anal.getAnalyticsData(id=id,dimensions="ga:hostname,ga:month,ga:year",metrics="ga:pageViews,ga:visits,ga:newVisits,ga:timeOnSite",filters="ga:hostname=~^#left(project,
21)#",startDate=dateAdd("m",-11,now())) /&gt;
       &lt;!--- you might consider caching some of this stuff for performance
reasons and because there are rate limits to the google api ---&gt;
       &lt;cfset arguments.event.setValue("trafficSources", trafficSources) /&gt;
       &lt;cfset arguments.event.setValue("keywords", keywords) /&gt;
       &lt;cfset arguments.event.setValue("downloads", downloads) /&gt;
       &lt;cfset arguments.event.setValue("views", views) /&gt;
&lt;/cffunction&gt;
</code>

I want to first point out this line:

<code>
&lt;cfset var id = "ga:1392225" /&gt;
</code>

This is a hard coded account id for RIAForge. My Google Analytics account has about 10 sites being tracked, and this one specifically focuses it on RIAForge. 

After that we simply run four getAnalyticsData calls. I won't go over each call, but you can see how different options, filters, etc, are passed in to get the appropriate data.

And really, that's it! I did have to massage the data a bit in the view. First, the query was sorted newest date to oldest. I also translated the date based columns (one for month and one for year) into one formatted date column. But outside of that, the hard work was already done for me. 

Anyway, I hope this helps others and encourages folks to check out the <a href="http://cfgoogle.riaforge.org">project</a>.