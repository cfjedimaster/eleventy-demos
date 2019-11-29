---
layout: post
title: "Case Study - Moving to Spry 1.5 and JSON for Lighthouse Pro"
date: "2007-07-02T11:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/07/02/Case-Study-Moving-to-Spry-15-and-JSON-for-Lighthouse-Pro
guid: 2164
---

Yesterday while watching bad TV, I thought I'd go ahead and update <a href="http://lighthousepro.riaforge.org">Lighthouse Pro</a> so that it used JSON instead of XML. I thought others might be interested in what worked well, and what didn't. First and foremost - this is not a ColdFusion 8 story. Lighthouse Pro is supported on ColdFusion 7 and therefore everything I've done was for ColdFusion 7 only (although I run ColdFusion 8 and can confirm this all works in Scorpio as well).
<!--more-->
Let me start by describing how I used Spry and XML in Lighthouse Pro. Spry is used on the Project View page. This is where you view project issues. There is a filter that lets you show/hide issues of various states and pagination is used to present 10 issues on screen at once. But before any filter or paging, everything is sucked down to the browser via AJAX.

The first thing I did was to update the Spry libraries to the most recent 1.5 version. Previously, Lighthouse Pro used SpryData.js and xpath.js. I had to copy over SpryJSONDataSet.js. I then included this new JavaScript file on the Project View page. (As a side tip - if you aren't using AJAX on a page - don't include the libraries. This may be obvious - but I think people get a bit spoiled by their high speed connections.)

Next I changed my dataset. The original line:

<code>
var dsIssues = new Spry.Data.XMLDataSet("url here", "issues/issue");
</code>

Notice it is an XMLDataSet and I use xpath to tell Spry how to look at the data. The new line looks like so:

<code>
var dsIssues = new Spry.Data.JSONDataSet("url here",{% raw %}{path:"data"}{% endraw %});
</code>

The first obvious difference is the switch to a JSONDataSet. The more interesting change is the "path" attribute. This tells Spry where to look in my JSON result for the information. We will see a minute that my JSON is a structure where data contains the data. (Big surprise there.)

On the front end - that was it. Seriously. Not too complicated so far. Next I needed to update my page that generated the XML, issuesxml.cfm. I kept the filename the same even though I was switching over to JSON. The original file used a CFC to get the data, did a bit of manipulation (that maybe should be done in the model instead), and then used <a href="http://www.raymondcamden.com/projects/toxml/">toXML</a> to convert the data into XML:

<code>
&lt;cfset issuesXML = application.toXML.queryToXML(issues, "issues", "issue")&gt;

&lt;cfcontent type="text/xml" &gt;&lt;cfoutput&gt;#issuesXML#&lt;/cfoutput&gt;
</code>

I downloaded the latest build of <a href="http://www.epiphantastic.com/cfjson/">CFJSON</a> and added the CFC to my code base. I then switched the lines above to:

<code>
&lt;cfset issuesJSON = application.json.encode(issues,"array","upper")&gt;
&lt;cfcontent type="application/json" reset="true"&gt;&lt;cfoutput&gt;#issuesJSON#&lt;/cfoutput&gt;
</code>

Now here is where I ran into my first problem. My first attempt looked like so:

<code>
&lt;cfset issuesJSON = application.json.encode(issues)&gt;
</code>

Notice I didn't use the two additional arguments. The second argument is specifically there to handle ColdFusion queries. The default value is "query". This gives you a JSON string that contains a structure of columns filled with arrays of data. The value I used, "array", creates an array of records  with structures of data. I'll be honest and admit that this confused me a bit at first. But I can definitely say that Spry didn't like the default format. Switching it over to array fixed the issue right away.

The third argument simply referred to the case to use when generating the JSON string from the query. By default this is lowercase. By setting it to upper, all my Spry tokens in Project View, which looked like {% raw %}{NAME}{% endraw %}, would continue to work.

All in all it was a pretty painless process. The issue with the array versus query format is the only thing that really threw me for a loop.

The savings in file size were good - but not great. Remember though that I had slimmed down the XML before so I wasn't expecting a great deal. For a project with 300 bugs, the file size of the XML was around 130k. After the switch to JSON it went down to 90k. 

As a last quick note - I just noticed that CFJSON uses string concatenation. This will be pretty darn slow compared to using Java StringBuffers like toXML.cfc uses. I'll be sending the authors a quick note on that.