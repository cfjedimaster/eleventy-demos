---
layout: post
title: "Model-Glue 3 - Custom Event Types - Want that in XML?"
date: "2008-06-11T14:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/06/11/ModelGlue-3-Custom-Event-Types-Want-that-in-XML
guid: 2876
---

After my last post on <a href="http://www.raymondcamden.com/index.cfm/2008/5/9/ModelGlue-3--Example-of-Custom-Event-Types">custom event types</a> in Model-Glue 3, the reaction was pretty much universal. Nice - but why can't we define these guys in XML?

As of about an hour or so ago, Joe checked into the MG3 Subversion repo an update that now allows you to do custom event types in XML, and frankly, it kicks butt. To define a custom event type, you create a new section of your ModelGlue.xml file named event-types. Here is an example:

<code>
&lt;event-types&gt;
	&lt;event-type name="templatedPage"&gt;
		&lt;after&gt;
			&lt;results&gt;
				&lt;result do="template.main" /&gt;
			&lt;/results&gt;
		&lt;/after&gt;
	&lt;/event-type&gt;
&lt;/event-types&gt;
</code>

In general these follow the same formats as events, but they are separated into a before and after section. You would put broadcasts in the before block. Here is an example Joe created showing a security custom event type:

<code>
&lt;event-type name="securedPage"&gt;
	&lt;before&gt;
		&lt;broadcasts&gt;
			&lt;message name="doSecurityCheck" /&gt;
		&lt;/broadcasts&gt;
	&lt;/before&gt;
&lt;/event-type&gt;
</code>

Using the custom event type hasn't changed. You simply provide the name:

<code>
&lt;event-handler name="page.index" type="templatedPage"&gt;
</code>

And of course you can use multiple custom event types:

<code>
&lt;event-handler name="page.index" type="securedPage,templatedPage"&gt;
</code>

Can I get an "Amen" from the Model-Glue crowd?? (Thanks Joe!)