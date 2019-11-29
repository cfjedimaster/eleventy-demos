---
layout: post
title: "Ask a Jedi: Multiple templates and Model-Glue"
date: "2008-05-07T10:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/05/07/Ask-a-Jedi-Multiple-templates-and-ModelGlue
guid: 2811
---

Shimju asks:

<blockquote>
<p>
In a model-glue app, suppose I have 3 templates files - templateA, templateB and
templateC. All are set as private events in model-glue.xml. Now my requirement
is I want to select a particular template dynamically based on
Arguments.event.AddResult("templateA") which we set on contoller method for the
event. Based on this, I want corresponding template should appear for that
event. Can you please advice how we can accomplish this.
</p>
</blockquote>
<!--more-->
This is rather simple, and I think you already have most of the answer written out already. Typically folks do layouts in Model-Glue like so:

<code>
&lt;event-handler name="page.index"&gt;
	&lt;broadcasts /&gt; 
	&lt;results&gt;
		&lt;result do="view.template" /&gt;
	&lt;/results&gt;
	&lt;views&gt;
		&lt;include name="body" template="dspIndex.cfm" /&gt;
	&lt;/views&gt;
&lt;/event-handler&gt;

&lt;event-handler name="view.template"&gt;
	&lt;broadcasts /&gt;
	&lt;results /&gt;
	&lt;views&gt;
		&lt;include name="template" template="dspTemplate.cfm" /&gt;
	&lt;/views&gt;
&lt;/event-handler&gt;
</code>

The event, page.index, has one result. Because it is unnamed, and the only result, it will always run. So all calls to page.index always run view.template. As you have already suggested, you can simply add other results. So let's say you want to have a default template, and two alternates, slim and print. Your controller could decide to add those results based on some logic, like the existence of a print attribute:

<code>
&lt;cfif arguments.event.valueExists("print")&gt;
  &lt;cfset arguments.event.addResult("print")&gt;
&lt;/cfif&gt;
</code>

The modified XML could then look like so:

<code>
&lt;event-handler name="page.index"&gt;
	&lt;broadcasts /&gt; 
	&lt;results&gt;
		&lt;result name="print" do="view.printtemplate" /&gt;
		&lt;result do="view.template" /&gt;
	&lt;/results&gt;
	&lt;views&gt;
		&lt;include name="body" template="dspIndex.cfm" /&gt;
	&lt;/views&gt;
&lt;/event-handler&gt;

&lt;event-handler name="view.template"&gt;
	&lt;broadcasts /&gt;
	&lt;results /&gt;
	&lt;views&gt;
		&lt;include name="template" template="dspTemplate.cfm" /&gt;
	&lt;/views&gt;
&lt;/event-handler&gt;

&lt;event-handler name="view.printtemplate"&gt;
	&lt;broadcasts /&gt;
	&lt;results /&gt;
	&lt;views&gt;
		&lt;include name="template" template="dspPrintTemplate.cfm" /&gt;
	&lt;/views&gt;
&lt;/event-handler&gt;
</code>

This simply reads as - if no result was fired, use the view.template template, but if the print result was used, fire off view.printtemplate.

Pretty simple, but I wonder if this could be done <a href="http://www.raymondcamden.com/index.cfm/2008/5/2/ModelGlue-3--The-New-Frakin-Awesomeness">easier?</a> (And yes, I'm being sly. Look later today for another example using Model-Glue 3, or as I call it, the Super-Fantastic Uber Framework.)