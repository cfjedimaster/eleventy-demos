---
layout: post
title: "Taking another step forward with Fusebox - Configuration"
date: "2007-02-13T21:02:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2007/02/13/Taking-another-step-forward-with-Fusebox-Configuration
guid: 1833
---

Well it is taking me a bit longer than I would like, but I am  getting more excited about Fusebox and don't want to lose too much steam in my learning of the framework. In my <a href="http://ray.camdenfamily.com/index.cfm/2007/2/5/Installing-Fusebox">first entry</a> I talked about installing Fusebox (summary: easy as pie). In the <a href="http://ray.camdenfamily.com/index.cfm/2007/2/7/Continuing-my-Fusebox-study">second entry</a> I talked about what happens during the Fusebox request cycle. (In other words, what happens when you load the application.) That entry focused mainly on the application life cycle.
<!--more-->
The <a href="http://www.fusebox.org/index.cfm?fuseaction=documentation.TheBasics">documentation</a> continues on to talk about the configuration and the Fusebox request lifecycle. A request of a Fusebox application will have the following parts:

<ul>
<li>preProcess and postProcess: Called at the beginning and end of the request. Seems a lot like onRequestStart and onRequestEnd from Application.cfc.
<li>preFuseaction and postFuseaction: Called before and after the fuseaction.
</ul>

So this is nice and if I read it right, a bit more fleshed out then Model-Glue. Model-Glue lets you define pre/post actions per controller. Fusebox lets you do it per event (fuseaction) and for the request as a whole. I <i>like</i> that. I can see benefits in both approaches though. In Model-Glue, I can run code on start up and tear down that is very specific for the controller. In Fusebox I can tie the logic closer to the event, and have a global start/end stop type action. Either way - I'm impressed with this support.

Along with configuring the above settings, you can also define code to run on exception (processError) as well as specific exception handlers for fuseactions (fuseactionException). Again, this seems to be a bit more precse than Model-Glue. I'm not sure I'd use fuseactionException. Typically at that level I'd imagine having try/catch in the code. But it is nice that it is supported.

Moving on - configuration of your Fusebox app is done via an XML file. The docs don't mention it, but the XML file is actually Fusebox.xml.cfm, at least in the skeleton. I pinged Sean on this and he said the framework can support either fusebox.xml or fusebox.xml.cfm. Why use the CFM filename when it's really an XML file? One reason is security. Your fusebox.xml.cfm file (like your ModelGlue.xml file), describe everything about your application. You probably don't want the general public reading this. By using a CFM file, you can guarantee folks won't be viewing the file. The skeleton's Application.cfm file uses this code to prevent that:

<code>
&lt;cfif right(cgi.script_name, len("index.cfm")) neq "index.cfm" and right(cgi.script_name, 3) neq "cfc"&gt;
	&lt;cflocation url="index.cfm" addtoken="no" /&gt;
&lt;/cfif&gt;
</code>

Nifty. The XML file consists of five main sections:

<ul>
<li>circuits: From my talks with Sean I know these are a collection of fuseactions, or events. 
<li>classes: From what I read in the docs - this allows you to map an object (CFC, Java Object, web service) directly a circuit. So instead of me defining my events in the XML, I can just point to the CFC. Again - I may be reading that wrong. But it is kind of cool. I don't know if I like "losing" the XML definition and not being able to see exactly what events will exist.
<li>parameters: The basic configuration (modes, defaults, etc)
<li>lobalfuseactions: This is where you define the pre and postProcess actions described above.
<li>plugins: I'll just steal from the docs here: "Plugins are a way to extend the functionality of the Fusebox core files." Cool, but I'll worry about that once I can actually write a simple Fusebox application!
</ul>

So that is a lot of ground. I still haven't covered circuits in detail (that is next in the docs), nor have I written a lick of code yet, but I'm growing in appreciation of this framework.