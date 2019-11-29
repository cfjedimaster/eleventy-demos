---
layout: post
title: "Using CFMAIL's server attribute to store additional information"
date: "2007-01-15T09:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/01/15/Using-CFMAILs-server-attribute-to-store-additional-information
guid: 1766
---

Did you know that <a href="http://www.cfquickdocs.com/?getDoc=cfmail">CFMAIL's</a> server attribute allows you to pass in the username, password, and port information as well? Why would you do that? Let's say you are building code for an application where the port setting may not exist. Your server is set to mypop.com. To conditionally add the port you could do something like this:
<!--more-->
<code>
&lt;cfif application.mailport neq ""&gt;
	&lt;cfset application.mailserver = application.mailserver & ":" & application.mailport&gt;
&lt;/cfif&gt;			
</code>

So a mailserver value of mypop.com and a port of 25 would end up with an application.mailserver value of mypop.com:25. 

The same can be done with the username and password. The syntax you would use in the server setting would be:

<code>
username:password@server
</code>

So a practical example of this would look like so:

<code>
&lt;cfif application.mailusername neq ""&gt;
	&lt;cfset application.mailserver = application.mailusername & ":" & application.mailpassword & "@" & application.mailserver&gt;
&lt;/cfif&gt;
</code>

Obviously this only works if the password exists as well. 

So all in all this helps a lot. I want to thank Andrew Penhorwood for reminding me of this. I included it in the latest build of <a href="http://lighthousepro.riaforge.org/">Lighthouse Pro</a>. Unfortunately, if you want to build <i>truly</i> robust code to handle all situations, even those where you don't need a mail server specified, you have a problem. If you try to do this:

<code>
&lt;cfmail server="" ....&gt;
</code>

You will get an error. This means you need to wrap your cfmail tags in silly CFIF conditionals:

<code>
&lt;cfif len(application.mailserver)&gt;
	&lt;cfmail server="#application.mailserver#" to="#application.adminemail#" from="#application.adminemail#" subject="Error in Lighthouse Pro" type="html"&gt;#mailbody#&lt;/cfmail&gt;
&lt;cfelse&gt;
	&lt;cfmail to="#application.adminemail#" from="#application.adminemail#" subject="Error in Lighthouse Pro" type="html"&gt;#mailbody#&lt;/cfmail&gt;
&lt;/cfif&gt;
</code>

It would probably be best to build a simple CFC that could handle your mailing for you. Hopefully Scorpio will address this, although most folks don't have to worry about writing their code like this.