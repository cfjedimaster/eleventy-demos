---
layout: post
title: "Dynamic BlogCFC Instances"
date: "2006-10-07T14:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/10/07/Dynamic-BlogCFC-Instances
guid: 1570
---

This may be better off at <a href="http://www.blogcfc.com">BlogCFC.com</a>, but I've had a few requests for this lately so I thought I'd post it here.

One of the undocumented features of BlogCFC is the ability to pass in configuration information to the CFC. Normally you tell the CFC to load data from the INI file. However, you may want to create a completely dynamic setup. For example, maybe you want x.foo.com and y.foo.com to both run BlogCFC and both use one physical folder. 

This is rather simple - but you have to pass a structure that contains all the keys that would normally be in the INI file. Here is an example I'm using on a real site now (unreleased to the public though). First - here is the code that sniffs the server name to grab the name of the blog, in this case it is based on the first part of the URL. If we were using x.foo.com and y.foo.com, the blog names would be X and Y.

<code>
&lt;cfset blogname = listFirst(cgi.server_name,".")&gt;
&lt;cfapplication name="_blog_#blogname#" sessionManagement="true" loginStorage="session"&gt;
</code>

Next I create a structure with all values that exist in a normal INI file:

<code>
&lt;cfset instance = structNew()&gt;
&lt;cfset instance.dsn = dsn&gt;
&lt;cfset instance.owneremail="blog@blog.com"&gt;
&lt;cfset instance.blogurl = "http://#cgi.server_name#/blog/index.cfm"&gt;
&lt;cfset instance.blogtitle = "#blogname# Blog"&gt;
&lt;cfset instance.blogdescription = "#blognme# Blog"&gt;
&lt;cfset instance.blogDBType="MYSQL"&gt;
&lt;cfset instance.locale="en_US"&gt;
&lt;cfset instance.users = ""&gt;
&lt;cfset instance.commentsFrom  = ""&gt;
&lt;cfset instance.mailServer = ""&gt;
&lt;cfset instance.mailUsername = ""&gt;
&lt;cfset instance.mailPassword = ""&gt;
&lt;cfset instance.pingurls = ""&gt;
&lt;cfset instance.offset = "0"&gt;
&lt;cfset instance.allowtrackbacks = false&gt;
&lt;cfset instance.trackbackspamlist="lots of bad words here"&gt;
&lt;cfset instance.blogkeywords = ""&gt;
&lt;cfset instance.ipblocklist = ""&gt;
&lt;cfset instance.allowgravatars = true&gt;
&lt;cfset instance.maxentries = "10"&gt;
&lt;cfset instance.usecaptcha = false&gt;
</code>

Once you have the structure populated, you then pass it to the CFC:

<code>
&lt;cfset application.blog = createObject("component","org.camden.blog.blog").init(blogname,instance)&gt;
</code>

That's it. Obviously you may need to tweak your instance settings. For example, you may have special logic for the users value. Anyway, let me know if this doesn't make sense.