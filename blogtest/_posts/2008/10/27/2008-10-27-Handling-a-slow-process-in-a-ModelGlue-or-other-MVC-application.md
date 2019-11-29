---
layout: post
title: "Handling a slow process in a Model-Glue (or other MVC) application"
date: "2008-10-27T23:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/10/27/Handling-a-slow-process-in-a-ModelGlue-or-other-MVC-application
guid: 3073
---

This weekend I exchanged a few emails with a reader about how you can handle very slow processes in a Model-Glue application. Typically folks will handle slow processes using one of these methods:

<ul>
<li>cfflush: Print out a 'Please Wait' type message, use cfflush to flush out the content, and then start the slow process
<li>cfthread: You can use cfthread to either run a bunch of parallel slow processes at once, or 'fire and forget' a slow process
<li>scheduler: Use the ColdFusion scheduler to run the slow process completely outside the view of the site visitor. 
</ul>

Of course the <b>best</b> way to handle a slow process is to ensure you've done everything possible to speed it up. As an example, I was convinced that a particular process on <a href="http://www.coldfusionboggers.org">coldfusionbloggers.org</a> was slow because it had to be. Turned out it was a stupid SQL mistake on my part. So before any attempt is made to mitigate or hide a slow process, you need to do everything possible to ensure you haven't missed something obvious.
<!--more-->
Once you've done that, what next? If you ever tried to use cfflush within a Model-Glue view, you know what happens:

<blockquote>
<p>
<b>Message</b> Unable to perform cfflush.<br/>
<b>Detail</b> You have called cfflush in an invalid location, such as inside a cfquery or cfthread or between a CFML custom tag start and end tag.
</p>
</blockquote>

Because your view file ends up being run as a custom tag (behind the scenes) you can't use the cfflush tag. So what about cfthread? 

I created a simple demo application (available as a zip to this blog entry) using Model-Glue 3. I began by creating a new event, page.slow, that would represent my slow process:

<code>
&lt;event-handler name="page.slow"&gt;
	&lt;broadcasts&gt;
		&lt;message name="doItSlow" /&gt;
	&lt;/broadcasts&gt;
	&lt;results&gt;
		&lt;result do="template.main" /&gt;
	&lt;/results&gt;
	&lt;views&gt;
		&lt;include name="body" template="pages/slow.cfm" /&gt;
	&lt;/views&gt;
&lt;/event-handler&gt;
</code>

The doItSlow controller method is where I put my slow process:

<code>
&lt;cffunction name="doItSlow" access="public" output="false"&gt;
	&lt;cfargument name="event" type="any" required="true"&gt;

	&lt;!--- First, am I running the slow process? ---&gt;
	&lt;cfif structKeyExists(application, "slowprocess")&gt;
		&lt;cfset arguments.event.setValue("status", "ongoing")&gt;
		&lt;cfset arguments.event.setValue("progress", application.slowprocess)&gt;
	&lt;cfelse&gt;
		&lt;cfset arguments.event.setValue("status", "began")&gt;
		&lt;cfthread name="slowprocess" priority="low"&gt;
			&lt;cfset application.slowprocess = 0&gt;
			&lt;!--- run 10 processes that take 1 minute each. ---&gt;
			&lt;cfloop index="x" from="1" to="10"&gt;
				&lt;cfset application.slowprocess++&gt;
				&lt;cfset sleep(15000)&gt;
			&lt;/cfloop&gt;
			&lt;cfset structDelete(application, "slowprocess")&gt;
		&lt;/cfthread&gt;
	&lt;/cfif&gt;

&lt;/cffunction&gt;
</code>

There are two main things happening in this method. If I see that a particular application variable doesn't exist, I begin the process within a cfthread block. I use an application variable, slowprocess, to both signify that I've begun the process and to record how far along I am. If the application variable does exist, note how I use the event object to record what's going on and how far along we are. 

Now I don't think you would normally be running the slow process from the controller. This would typically be in the model with the controller simply firing it off and asking a service object (for example) for an update on what's going on. I only used the controller here for everything since I wanted a quick demo. 

The view is interesting. I'm going to display the current status and do an automatic reload:

<code>
&lt;cfset status = event.getValue("status")&gt;
&lt;cfset progress = event.getValue("progress")&gt;
&lt;cfset event.setValue("usemeta",true)&gt;

&lt;cfoutput&gt;
&lt;b&gt;status=&lt;/b&gt;#status#&lt;br/&gt;
&lt;b&gt;progress=&lt;/b&gt;#progress#
&lt;/cfoutput&gt;
</code>

The usemeta is simply a flag to my template view:

<code>
&lt;cfset usemeta = event.getValue("usemeta", false)&gt;

&lt;html&gt;

&lt;head&gt;
	&lt;link rel="stylesheet" type="text/css" href="css/stylesheet.css"&gt;&lt;/link&gt;
	&lt;cfif isBoolean(usemeta) and usemeta&gt;
		&lt;meta http-equiv="refresh" content="10"&gt;
	&lt;/cfif&gt;
&lt;/head&gt;

&lt;body&gt;
	&lt;div id="banner"&gt;Demo&lt;/div&gt;
	
	&lt;!--- Display the view named "body" ---&gt;
	&lt;cfoutput&gt;#viewCollection.getView("body")#&lt;/cfoutput&gt;
&lt;/body&gt;

&lt;/html&gt;
</code>

So the end result is - the person starts the process and can just sit back and watch as the page gives an updated status on the process.

Again - this is just a quick demo. It isn't best practice or anything. (In fact, it will continuously reload the process.) 

So I was going to stop there. But why stop when you can try something cool? Many moons ago I <a href="http://www.raymondcamden.com/index.cfm/2008/1/4/Another-charting-option-XMLSWF-Charts">blogged</a> about <a href="http://www.maani.us/xml_charts/index.php">XML/SWF Charts</a>, a cheap, and very sexy, charting engine. One of the coolest feature is it's ability to point to an XML file to both configure the chart and create an auto-reload data set for the chart. What follows is video of a modified version (also in the zip) where the chart engine itself runs the request for the status. The resulting data is output in the XML format required for the chart. 

<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="468" height="361"> <param name="movie" value="http://content.screencast.com/users/jedimaster/folders/Jing/media/c84991a4-ef49-4085-a351-2f4e43ab0f11/bootstrap.swf"></param> <param name="quality" value="high"></param> <param name="bgcolor" value="#FFFFFF"></param> <param name="flashVars" value="thumb=http://content.screencast.com/users/jedimaster/folders/Jing/media/c84991a4-ef49-4085-a351-2f4e43ab0f11/FirstFrame.jpg&content=http://content.screencast.com/users/jedimaster/folders/Jing/media/c84991a4-ef49-4085-a351-2f4e43ab0f11/00000002.swf&width=468&height=361"></param> <param name="allowFullScreen" value="true"></param> <param name="scale" value="showall"></param> <param name="allowScriptAccess" value="always"></param> <embed src="http://content.screencast.com/users/jedimaster/folders/Jing/media/c84991a4-ef49-4085-a351-2f4e43ab0f11/bootstrap.swf" quality="high" bgcolor="#FFFFFF" width="468" height="361" type="application/x-shockwave-flash" allowScriptAccess="always" flashVars="thumb=http://content.screencast.com/users/jedimaster/folders/Jing/media/c84991a4-ef49-4085-a351-2f4e43ab0f11/FirstFrame.jpg&content=http://content.screencast.com/users/jedimaster/folders/Jing/media/c84991a4-ef49-4085-a351-2f4e43ab0f11/00000002.swf&width=468&height=361" allowFullScreen="true" scale="showall"></embed> </object>

I'm really impressed by this charting engine. It may not be as easy as cfchart, but it is certainly as pretty, and the auto-update for data is worth the price in itself.

So outside of the pretty charts - have folks done anything like the above code? (Again, ignoring the fact I used the controller.)<p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5Cwww%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fmgdemos%{% endraw %}2Ezip'>Download attached file.</a></p>