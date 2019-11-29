---
layout: post
title: "ColdFusion 101: Config Files A-Go-Go Part 3: Wrap Up"
date: "2005-09-08T14:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/09/08/ColdFusion-101-Config-Files-AGoGo-Part-3-Wrap-Up
guid: 758
---

If you haven't already, please see <a href="http://ray.camdenfamily.com/index.cfm/2005/8/26/ColdFusion-101-Config-Files-AGoGo">part 1</a> and <a href="http://ray.camdenfamily.com/index.cfm/2005/9/2/ColdFusion-101-Config-Files-AGoGo-Part-2-XML-Files">part 2</a> of this series. I've been talking about various ways of doing configuration for web applications. I wanted to use this last part to simply wrap up a few threads, share a few ideas, and, well, wrap up. So here are some thoughts in no particular order.

<h3>Database Configuration</h3>
More than one person said that they do all of their configuration in the database. Which is nice, of course, but I made the point that you couldn't store DSN information in the database. Outside of that, using the database also means that, like INI files, you will typically only have "simple" settings. Ie, foo=goo. You can't do the complex nesting that I showed in the <a href="http://ray.camdenfamily.com/index.cfm/2005/9/2/ColdFusion-101-Config-Files-AGoGo-Part-2-XML-Files">XML example</a>. It does have one huge benefit. While I think most clients could handle editing an INI or XML file, I may be thinking too highly of their technical skills. It also means the client has to work on a file on the server. Using the database would allow the client to use a super-simple web form to update configuration information. Everything can be done from the browser. (Of course, you can build a tool that would allow the client to update the INI or XML files as well.) 

<h3>ColdFusion Configuration</h3>
Christrian brought up this idea. Instead of using INI or XML files, why not simply use CFML? 

<div class="code"><FONT COLOR=MAROON>&lt;cfset application.dsn = <FONT COLOR=BLUE>"foo"</FONT>&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;cfset application.email = <FONT COLOR=BLUE>"<A HREF="mailto:ray@camdenfamily.com">ray@camdenfamily.com</A>"</FONT>&gt;</FONT><br>
etc...</div>

This would allow for more dynamic configuration settings (conditional settings, etc.). My problem with this is that a) normally I'd say configuration items shouldn't be dynamic (I'll contradict myself in a few minutes) and b) it defeats the purpose of having a configuration setup that a non-techie could update. In other words, I could trust most clients with a text file, but not CFML. That being said, it <i>is</i> a very valid option and should be considered as well.

<h3>Supporting Multiple Servers</h3>
So one of the cool things that you can do with configuration files (no matter which form you use) is to support multiple configuration sets per host. A "typical" site will have three servers. A "Dev" server, a "Staging" server, and a "Live" server. In the past, I would simply modify the config files on each box. However, this means that if you accidentally upload the config file from dev to staging, you will be screwed. A much simpler method is to just have three config files: settings_dev.ini, settings_staging.ini, and settings_live.ini. Your application initialization code would simply check to see what the current server is. You can get this value from CGI.server_name. Once you know the server, you can then use the appropriate file. If you use this method, I'd suggest creating a setting that gives a "pretty" name for the server:

<div class="code">server=Development Server</div>

In your administration tool, output this value. That way when you are using the administration tool, you can clearly see which server you are on. Sure, it should be obvious, but I find it helpful to remind folks. Clients, for example, may forget that staging.foo.com is <i>not</i> the live site. 

<h3>In conclusion...</h3>
This is the first time I've tried a series like this. I want to thank everyone for their feedback on it. I'm going to think about other 'themes' that would be good for similar treatments.