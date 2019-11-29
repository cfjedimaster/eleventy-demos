---
layout: post
title: "Ask a Jedi: Building a ColdFusion site to support dynamic subdomains"
date: "2009-06-01T22:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/06/01/Ask-a-Jedi-Building-a-ColdFusion-site-to-support-dynamic-subdomains
guid: 3380
---

Rick asks:

<blockquote>
<p>
I am trying to do something that I thought would be simple (ever heard that before). I can not find anywhere that explains how to do it. I am creating a membership website and want to put the member name in front of the domain name. Such as member.site.com Is there a way to do this programatically? If it is a IIS hack is there a way to add this and take it away on the fly?
</p>
</blockquote>

I wasn't quite sure what Rick meant at first, but after some clarification, I realized he wanted something similar to how <a href="http://www.riaforge.org">RIAForge</a> works. If you visit multiple different projects at RIAForge, you will notice that each project is a subdomain: blogcfc.riaforge.org, lighthousepro.riaforge.org, makebeerwithcf.riaforge.org. I'm not creating a new web site for each project. (Although in theory I could. Apache uses a text file for configuration and IIS is supposedly scriptable as well.) I use one code base that dynamically responds to the current subdomain. Here is a very simple version of how I did it at RIAForge.
<!--more-->
First off, let's talk server and domain configuration. This is Mac/Apache specific, but it shouldn't be that different for IIS or Windows. I created the following site definition in Apache. Notice the server name and 2 aliases.

<code>
&lt;VirtualHost *:80&gt;
    ServerName dev.cowbell.com
    ServerAlias *.cowbell.com
    DocumentRoot "/Library/WebServer/cowbell"
    Options Indexes MultiViews
    &lt;Directory "/Library/WebServer/cowbell"&gt;
	    Options Indexes Includes MultiViews FollowSymLinks
	    AllowOverride All
	    Order Allow,Deny
	    Allow from All
    &lt;/Directory&gt;
&lt;/VirtualHost&gt;
</code>

You can ignore pretty much everything after the first three lines. The ServerName gives the main domain name for the site. The ServerAlias is an alias. Notice the use of the wildcard (*). This means I can do dfkjfkjfdjfdkjd.cowbell.com and the server will respond to it. 

Save this, reload Apache, and ensure you didn't type anything (obviously fix the filepaths to something that makes sense on your system).

Now, unless you run your own DNS, you can't do wildcard DNS to your own machine. (Although I'm no DNS expert, so please correct me if I'm wrong.) I almost always make use of the HOSTS file (which exists on both a Mac and a Windows machine) to specify domain names I want to resolve to my local machine. I added the 3 following lines to my HOSTS file:

<code>
127.0.0.1	dev.cowbell.com
127.0.0.1	xxx.cowbell.com
127.0.0.1	yyy.cowbell.com
</code>

xxx and yyy are the sample subdomains I want to use. dev represents the 'default' or www version of the domain name. 

Save your HOSTS file and quickly add a simple index.cfm in the folder you defined as the site root in Apache. Ensure that all three domains resolve and show you that index.cfm file. 

Alright, so now for the fun part. We need to write code that will notice when we are on a subdomain and respond to it. I created a simple Application.cfc and used the following onRequestStart:

<code>
&lt;!--- Run before the request is processed ---&gt;
&lt;cffunction name="onRequestStart" returnType="boolean" output="true"&gt;
	&lt;cfargument name="thePage" type="string" required="true"&gt;
	&lt;cfset var subDomain = ""&gt;
	&lt;cfset var thisServer = cgi.server_name&gt;

	&lt;!--- is it just cowbell.com? ---&gt;
	&lt;cfif listLen(thisServer,".") lt 3&gt;
		&lt;cfreturn true&gt;
	&lt;/cfif&gt;

	&lt;cfset subDomain = listFirst(thisServer,".")&gt;
	&lt;!--- If the subdomain is dev, or www, its a root request ---&gt;
	&lt;cfif subDomain is "www" or subDomain is "dev"&gt;
		&lt;cfreturn true&gt;
	&lt;/cfif&gt;

	&lt;cfset request.subDomain = subDomain&gt;
				
	&lt;cfreturn true&gt;
&lt;/cffunction&gt;
</code>

Line by line, this is what the code does. First, it copies the value of CGI.server_name. This CGI variable represents the requested server. I treat this value like a list. If the length of the list is two, then it is a request for cowbell.com. I.e., no subdomain, no www, etc. The return true then simply ends any more logic in the method. If we havne't left the method, I pop off the subDomain using listFirst. If the subdomain is dev or www, then we treat it as a 'normal' request and also leave the method. Finally, if we are still in the method, it means we have a subdomain request.

At this point, what you do is entirely up to the application. At RIAForge, I modify the URL scope to set the event value manually to something like: event=project.homepage&project=SUBDOMAIN. At this point it acts like any normal Model-Glue request.

For my demo, I simply set a request variable. My index.cfm file was modified to reflect this change:

<code>
&lt;cfif not structKeyExists(request, "subDomain")&gt;

	&lt;h2&gt;Welcome to Cowbell.com&lt;/h2&gt;

&lt;cfelse&gt;

	&lt;cfoutput&gt;&lt;h2&gt;Welcome to #request.subDomain#'s Page at Cowbell.com&lt;/h2&gt;&lt;/cfoutput&gt;
		
&lt;/cfif&gt;
</code>

As you can see, when the request variable exists, we treat it like a 'user' page. I can now open dev.cowbell.com and see the default home page. Then I can try both xxx and yyy to see the 'personalized' user home pages. If I added zzz.cowbell.com to my HOSTS file, it would work with that as well.

Hope this helps, Rick!

<b>Edit at 9:10 PM</b> Some of the comments made it clear that I may not have made it obvious what I edited my HOSTS file. In this blog entry I'm working locally. The HOSTS file lets me say, on my machine, that domain X (xxx.cowbell.com) points to IP y (127.0.0.1 means my mchine). You would do this when testing your site locally. In production you wouldn't do this normally. You would set up the wildcard DNS with your domain name provider.