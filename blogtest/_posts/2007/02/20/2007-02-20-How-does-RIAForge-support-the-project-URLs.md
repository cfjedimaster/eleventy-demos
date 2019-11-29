---
layout: post
title: "How does RIAForge support the project URLs?"
date: "2007-02-20T22:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/02/20/How-does-RIAForge-support-the-project-URLs
guid: 1849
---

I was asked today how RIAForge supported the multiple subdomains for the projects. As an example, consider <a href="http://blogcfc.riaforge.org">http://blogcfc.riaforge.org</a> and <a href="http://galleon.riaforge.org">http://galleon.riaforge.org</a>.
<!--more-->
There are three parts to this. First is the DNS. A wildcard dns entry was added for RIAForge so that anything.riaforge.org would resolve to the proper IP.

The second part is the web server configuration. RIAForge uses Apache. One virtual server was setup for www.riaforge.org. The second virtual server was setup for the wildcard, using this:

<code>
ServerAlias *.riaforge.org
</code>

The last thing I did was setup ColdFusion to notice the wildcard. This was a bit tricky as I had to get it working with Model-Glue as well. So first off I have to look at the CGI scope and see if I'm not on the main site:

<code>
&lt;cfif reFindNoCase(".+\.riaforge", cgi.server_name)&gt;
	&lt;cfset thisApp = listFirst(cgi.server_name,".")&gt;
	&lt;cfif thisApp neq "www" and thisApp neq "dev"&gt;
</code>

I start by checking cgi.server_name to see if anything exists before riaforge. If it is www (or dev), then I'm not looking at a project. Going forward...

<code>
&lt;!--- Loading a specific project page. Force an event ---&gt;
&lt;cfif not structKeyExists(url, "event")&gt;
	&lt;cfset url.event = "page.project"&gt;
&lt;/cfif&gt;
&lt;cfset url.projecturlname = thisApp&gt;
</code>

I check to see if an event was specified. There are events under the project home page, but if you are just going to the root of the project site then there is no specified event. Therefore - if no event - default to page.project. Lastly, I add the name of the project to the URL scope. All of this ends up being picked up by Model-Glue. The event, projecturlname, are all available to my code. The event is obviously handled by Model-Glue. The value, projecturlname, is used by my controller to ensure that a valid project is being loaded.

And yes - I <i>do</i> plan on sharing the code behind RIAForge... soon!