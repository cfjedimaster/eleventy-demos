---
layout: post
title: "Ask a Jedi: Getting a list of application names in ColdFusion"
date: "2007-12-19T18:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/12/19/Ask-a-Jedi-Getting-a-list-of-application-names-in-ColdFusion
guid: 2552
---

Andy asks:

<blockquote>
<p>
Is there a way to get a list of application names from all of  the Application.cfc running on a server. I'm trying to dynamically build a server.applicationNameArray by just dropping a web app into the web tree. Thanks for your time.
</p>
</blockquote>

Technically the answer to this is no, but there are two ways of doing this. The first way is to use the SeverMonitor API. There isn't a 'get a list of application names', but there is a method named getAllApplicationScopesMemoryUsed. This method returns the memory used by all application scopes on your server. The keys of the structure are your application names. Here is an example:

<code>
&lt;cfset password = "poorspearsfamily"&gt;
&lt;cfinvoke component="CFIDE.adminapi.administrator" method="login" adminpassword="#password#" returnVariable="result"&gt;

&lt;cfinvoke component="CFIDE.adminapi.servermonitoring" method="getAllApplicationScopesMemoryUsed" returnVariable="ascopes"&gt;
&lt;cfdump var="#ascopes#"&gt;
</code>

By the way, check out the memory usage for the model-glue app:

<img src="https://static.raymondcamden.com/images/dec18.png">

The Model-Glue app is the one in red. Model-Glue is so good it <i>gives</i> your server RAM. Yeah, that's it. 

So the second solution is a bit of an hack, but has been around for a while. If you define an application w/o a name, the Application scope for that unnamed application will contain a bunch of junk, including a pointer to all the applications on your server. Consider this code:

<code>
&lt;cfapplication&gt;
&lt;cfloop item="k" collection="#application#"&gt;
	&lt;cfif isStruct(application[k]) and structKeyExists(application[k], "applicationname")&gt;
		&lt;cfdump var="#application[k]#" label="#k#"&gt;
	&lt;/cfif&gt;
&lt;/cfloop&gt;
</code>

This will dump each Application and all it's variables. Note the CFIF and how I check to see if the variable is an application scope. Not perfect, but in my test with both code blocks, it returned the same thing. (Well, the second code block didn't show the blank key for the unnamed application scope like the first one did.)