---
layout: post
title: "Model-Glue 3 - Example of Custom Event Types"
date: "2008-05-09T16:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/05/09/ModelGlue-3-Example-of-Custom-Event-Types
guid: 2818
---

Now that Model-Glue 3 has been announced and available for folks to play with, it's time to start working up some demos so folks can see stuff in action. Joe has included a few demos in the zip, but if I don't play with it myself, I don't learn. 

Before I go any further, and yes, I <b>will</b> be repeating this warning a lot, keep in mind the following two points:

<ol>
<li>Model-Glue 3 is in Alpha. Everything I talk about here may stop working tomorrow. If it does, I'm going to hunt Joe down and make him rewrite Model-Glue in Pascal. 
<li>Like every new feature, there are "good" ways of using it and "not so good" ways of using it. This is the first time I've done this feature. It may be a stupid example. I may look back in a month and ask - what was I drinking. 
</ol>

So with the above in mind, let's dig in.
<!--more-->
First off - let's talk about what Custom Event Types (CETs) are. Those of us who develop in Model-Glue are used to the repeated XML we have to use for things like layout and security checks. Consider:

<code>
&lt;event-handler name="page.about"&gt;
	&lt;broadcasts /&gt;
	&lt;views&gt;
	&lt;include name="body" template="main.about.cfm" /&gt;
	&lt;/views&gt;
	&lt;results&gt;
	&lt;result do="view.template" /&gt;
	&lt;/results&gt;
&lt;/event-handler&gt;
&lt;event-handler name="page.category"&gt;
	&lt;broadcasts&gt;
	&lt;message name="GetProjectCategory" /&gt;
	&lt;message name="GetProjectsForCategory" /&gt;
	&lt;/broadcasts&gt;
	&lt;views&gt;
	&lt;include name="body" template="main.category.cfm" /&gt;
	&lt;/views&gt;
	&lt;results&gt;
	&lt;result do="view.template" /&gt;
	&lt;/results&gt;
&lt;/event-handler&gt;
</code>

These two simple events both have an unnamed event to run a template view. As you can imagine, my application has this repeated quite a bit. CETs allow us a simple way to get around it. Let's start with the XML changes you have to make. 

MG3 supports a type argument to the event-handler tag. Here is a simple example:

<code>
&lt;event-handler name="page.index" type="mg3app1.events.customLayoutEvent"&gt;
</code>

The value is the full path to the CFC we will create to define our CET. Note that the value is passed to createObject, so use whatever paths you would normally use.

Ok, so the CFC. As you can see I used an events folder above. This was based on Joe's sample apps and as it made sense, I'm going to pretend it was all my idea and take credit for it.

Your CFC will begin by extending the core EventHandler from Model-Glue. Here is an empty CET:

<code>
&lt;cfcomponent extends="ModelGlue.gesture.eventhandler.EventHandler"&gt;

&lt;/cfcomponent&gt;
</code>

It's empty - but boy does it run fast. So out of the box there are 2 built-in events that you potentially will want to use:

<ul>
<li>beforeConfiguration: This is run while the event is starting up. This is where you would add broadcasts. So for a security CET, you would broadcast a message to check authorization/authentication.
<li>afterCongifuration: This is run when the event is ending. This is where you would add results. Note that CETs support named and unnamed results. Now to be clear - you can also broadcast stuff as well. But this would run after other broadcasts so if you need to broadcast something that later messages need, you want to use beforeConfiguration.
</ul>

So first off - those CFC names are a bit oddly named in my book. I just bugged Joe about this. To me, "configuration" implies one time while in reality, these guys are always run, much like onRequestStart/End. This confused me so I'm just sharing it if other folks get confused by it as well. (FYI, Joe is IMing right now, so don't be surprised if it changes. Actually, it's done. It may not be in the zip yet, but it is changing to beforeEvent and afterEvent.)

The second thing that confused me was that I couldn't figure out how to get access to the Event object. After speaking with Joe, I was able to wrap my head around the idea that this CFC code is basically replacing XML. You aren't going to be doing Event checks here - just basically just adding to the XML (via CF) that would have been hard coded in the event normally. 

So - so once I got things working, I needed something to code. I wanted to build upon the <a href="http://www.raymondcamden.com/index.cfm/2008/5/7/Ask-a-Jedi-Multiple-templates-and-ModelGlue">article</a> I wrote a few days ago concerning multiple templates. The idea there was - how do I support different templates. The answer I used there was to simply have multiple results. Here is sample XML I used from that entry:

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

This turns out to be very easy in CET. Here is the code I used for afterConfiguration:

<code>
&lt;cffunction name="afterConfiguration" access="public" returntype="void" output="false" hint="Called after configuring the event handler.  Subclasses can use this to add messages, results, or views after they're added by something like a ModelGlue XML file."&gt;
	&lt;cfset var result = createObject("component", "ModelGlue.gesture.eventhandler.Result") /&gt;
	&lt;cfset var secondresult = createObject("component", "ModelGlue.gesture.eventhandler.Result") /&gt;
	
	&lt;cfset super.afterConfiguration() /&gt;

	&lt;cfset result.event = "template.main" /&gt;
	&lt;cfset addResult(result) /&gt;

	&lt;cfset secondresult.name="printformat"&gt;
	&lt;cfset secondresult.event="template.printmain"&gt;
	&lt;cfset addResult(secondresult)&gt;

&lt;/cffunction&gt;
</code>

I create two results. The first is unnamed and represents my default template. The second is named printformat. To use this new event type, I first specify it in my XML:

<code>
&lt;event-handler name="page.index" type="mg3app1.events.customLayoutEvent"&gt;
	&lt;broadcasts /&gt;
	&lt;results /&gt;
	&lt;views&gt;
		&lt;include name="body" template="pages/index.cfm" /&gt;
	&lt;/views&gt;
&lt;/event-handler&gt;
</code>

And I'm done. I made it so that in my application, if "print" exists in the Event (url or form obviously), the printformat result is added. I did this via onRequestEnd in my main controller:

<code>
&lt;cffunction name="onRequestEnd" access="public" output="false" returnType="void"&gt;
	&lt;cfargument name="event" type="any"&gt;

	&lt;cfif arguments.event.valueExists("print")&gt;
		&lt;cfset arguments.event.addResult("printformat")&gt;
	&lt;/cfif&gt;
&lt;/cffunction&gt;
</code>

So - this <i>would</i> have been the end of the story. Unfortunately, it didn't work. I bugged Joe again, and he came up with the answer. Unfortunately, the reason it doesn't work is rather low level. The simplest explanation is that onRequestEnd (an automatic broadcast in MG) is actually consdiered <i>another</i> event: modelglue.onRequestEnd.

Joe came up with a solution that isn't quite as short as my previous example, but works ok. Now what we do is simply broadcast a message that will do the same check as my onRequestEnd code above. Take a look at the new version on afterConfiguration:

<code>
&lt;cffunction name="afterConfiguration" access="public" returntype="void" output="false" hint="Called after configuring the event handler.  Subclasses can use this to add messages, results, or views after they're added by something like a ModelGlue XML file."&gt;
	&lt;cfset var result = createObject("component", "ModelGlue.gesture.eventhandler.Result") /&gt;
	&lt;cfset var secondresult = createObject("component", "ModelGlue.gesture.eventhandler.Result") /&gt;
 	&lt;cfset var message = createObject("component", "ModelGlue.gesture.eventhandler.Message") /&gt;
   	
	&lt;cfset super.afterConfiguration() /&gt;

	&lt;cfset message.name = "checkFormat" /&gt;
    &lt;cfset addMessage(message) /&gt;
	
	&lt;cfset result.name="mainformat"&gt;
	&lt;cfset result.event = "template.main" /&gt;
	&lt;cfset addResult(result) /&gt;

	&lt;cfset secondresult.name="printformat"&gt;
	&lt;cfset secondresult.event="template.printmain"&gt;
	&lt;cfset addResult(secondresult)&gt;

&lt;/cffunction&gt;
</code>

As you can see, I now broadcast checkFormat. I won't show the code for that as it's the exact same as the onRequestEnd above.

Alright - so hopefully that wasn't <i>too</i> confusing! I've attached a zip of my application. Please note that Joe will be updating the MG3 alpha zip fairly shortly so this code may not work right this very second.<p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5Cwww%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fmg3app1%{% endraw %}2Ezip'>Download attached file.</a></p>