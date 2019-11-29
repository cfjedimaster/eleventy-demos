---
layout: post
title: "Model-Glue 3 - Example of Formats"
date: "2008-05-14T13:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/05/14/ModelGlue-3-Example-of-Formats
guid: 2827
---

Time for yet another quick Model-Glue 3 example. This time I wanted to show off formats. In the past, if you wanted to have multiple views of the same type of data, you had to build multiple events. So for example, one page may display a list of all the starships in your fleet in HTML format. If you wanted the same query in JSON, then you would build another event to handle that request. Model-Glue 3 makes this a heck of a lot simpler. The views XML entity now supports a format attribute. So for example:
<!--more-->
<code>
&lt;views format="json"&gt;
  &lt;include name="body" template="starships.json.cfm"&gt;
&lt;/views&gt;
&lt;views&gt;
  &lt;include name="body" template="starships.cfm"&gt;
&lt;/views&gt;
</code>

My first view specifically runs when the JSON format is requested. The second view has no format so it acts as the default.

How do you specify the format? Model-Glue looks for requestformat in the Event (remember - either URL or Form scope) object. So you could simply use a URL like so:

index.cfm?event=getstarships&requestformat=json

The value for the requestformat can be anything you desire really. For my demo I wanted to do something that <i>wasn't</i> Ajax based. My simple example application will do browser sniffing, and if it sees that you are on an iphone (or itouch) it will run a different template. This is incredibly simple. First - check out the modified template XML:

<code>
&lt;event-handler access="private" name="template.main"&gt;
	&lt;views format="iphone"&gt;
		&lt;include name="body" template="templates/iphone.cfm" /&gt;
	&lt;/views&gt;
	&lt;views&gt;
		&lt;include name="main" template="templates/main.cfm" /&gt;
	&lt;/views&gt;
&lt;/event-handler&gt;
</code>

I've specified two views. One for format="iphone" and another that is unnamed. I then added onRequestStart to the controller portion of the XML. My code then is an exact copy of what I used for <a href="http://www.coldfusionbloggers.org">ColdFusionBloggers.org</a>:

<code>
&lt;cffunction name="onRequestStart" access="public" output="false"&gt;
	&lt;cfargument name="event" type="any" required="true"&gt;

	&lt;cfif findNoCase("iphone", cgi.http_user_agent) or findNoCase("ipod", cgi.http_user_agent) or arguments.event.valueExists("ray")&gt;
		&lt;cfset arguments.event.setValue("requestformat", "iphone")&gt;
	&lt;/cfif&gt;
&lt;/cffunction&gt;
</code>

Ok, not an exact copy. Along with the checking the user agent, I also look for "ray" as an event argument. Notice though that we set the requestformat to iphone.

And that's it really. Incredibly simple to use. I've attached my code to the this blog entry. A note - because I have multiple versions of Model-Glue on my box, I added a mapping for MG3 to my code base. This points to a folder on my system. You will need to either edit this line, or remove it if you only have Model-Glue 3 installed.<p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5Cwww%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fmg3app2%{% endraw %}2Ezip'>Download attached file.</a></p>