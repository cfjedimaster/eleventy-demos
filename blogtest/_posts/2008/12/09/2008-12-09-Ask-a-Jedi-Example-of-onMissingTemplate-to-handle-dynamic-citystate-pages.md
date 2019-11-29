---
layout: post
title: "Ask a Jedi: Example of onMissingTemplate to handle dynamic city/state pages"
date: "2008-12-09T13:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/12/09/Ask-a-Jedi-Example-of-onMissingTemplate-to-handle-dynamic-citystate-pages
guid: 3141
---

Dave asks:

<blockquote>
<p>
I have a lot of city pages for my site similar to this folder
structure: example.com/colorado/denver.cfm
</p>
<p>
What I have been doing is to create a template called template-city.cfm that gets included in to each city page such as denver.cfm. So basically denver.cfm is just a tiny shell file and the real guts of the page is located in the template-city.cfm, so the thought is that I only have to change the template-city.cfm once and all the others pages like denver.cfm get updated at once.
</p>
<p>
But in order to do this I had to create tons of city pages within each state (which I automated with CFfile) but a red flag is going off in my brain telling me this is the wrong way to do it. Is there some virtual way to create these city pages and even state folders? 
</p>
</blockquote>
<!--more-->
There are two ways of doing this. The first would be with a server side URL rewriter. Apache has this built in, and you can find options for IIS as well. The URL rewriter would simply map example.com/louisiana/lafayette.cfm to example.com/dyncity.cfm?state=louisiana&city=lafayette.cfm.

If you don't have access to the web server and you are using ColdFusion 8, there is no reason not to use onMissingTemplate in Application.cfc. Here is a simple example:

<code>
&lt;cffunction name="onMissingTemplate" access="public" returnType="boolean" output="true"&gt;
	&lt;cfargument name="pageRequested" type="string" required="true"&gt;
	&lt;cfset var city = listLast(arguments.pageRequested, "/")&gt;
	&lt;cfset var state = listGetAt(arguments.pageRequested, listLen(arguments.pageRequested,"/")-1, "/")&gt;
	&lt;cfset city = replaceNoCase(city, ".cfm", "")&gt;
        
	&lt;cfinclude template="dyncity.cfm"&gt;
	&lt;cfreturn true&gt;
        
&lt;/cffunction&gt;
</code>

Given a request of some.com/louisiana/lafayette.cfm, the value passed to pageRequested will be a string I can parse using list functions. I grab the city at the end, and the state at the second to last position. At that point, what you do is up to your model. You would probably call a CFC method that would translate a state/city string to a particular ID value of a city in the database. In my example I just include a file that displays it:

<code>
&lt;cfoutput&gt;&lt;h2&gt;#city#, #state#&lt;/h2&gt;&lt;/cfoutput&gt;
</code>

I've included the application as a zip to this blog entry. You should be able to extract it to your web server, and then hit any URL. The only drawback is that .cfm must be in the URL. 

If you wanted to support example.com/louisiana/lafayette, then you would need to use the URL rewriters I mentioned above.<p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5Cwww%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fcitydemo%{% endraw %}2Ezip'>Download attached file.</a></p>