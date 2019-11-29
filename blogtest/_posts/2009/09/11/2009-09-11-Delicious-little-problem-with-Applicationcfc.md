---
layout: post
title: "Delicious little problem with Application.cfc"
date: "2009-09-11T16:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/09/11/Delicious-little-problem-with-Applicationcfc
guid: 3522
---

Yes, I'm calling a bug delicious. Not that I like bugs of course - but sometimes there is no better feeling than working with someone on a problem, going through numerous rounds of tests, and then finally finding the solution. Shoot - I think I probably enjoy that feeling more than actually completing a project. It's like a mystery. Why is my application spewing out X when it should return Y? I don't know - maybe I'm just too much of a dork. Either way - sit back and let me tell you a little story.
<!--more-->
The user came to me with the following description of his problem: He wanted to make a web service call within his Application.cfc file. Whenever he did so, though, his application would throw an error. He could take the same code though, put it in an index.cfm file, and it ran perfectly!

So with that being said, I began to work with him to simplify and laser in on the possible issue. I first asked to see his Application.cfc file - and while not directly related to the bug, there was some interesting (and incorrect) things he was doing there.

Check out how his Application.cfc began:

<code>
&lt;cfcomponent&gt;
	&lt;cfscript&gt;
		this.applicationTimeout = createTimeSpan(0,10,0,0);
		this.clientmanagement= "yes";
		this.loginstorage = "session";
		this.sessionmanagement = "yes";
		this.sessiontimeout = createTimeSpan(0,10,0,0);
		this.setClientCookies = "yes";
		this.setDomainCookies = "no";
		this.scriptProtect = "all";
		this.application.title = "APPTITLE";
		this.application.datasource = "MYDSN";
		this.datasource = "MYDS";
		this.configManager = CreateObject("webservice", "Config");
		return this;
   &lt;/cfscript&gt;
</code>

Now this surprised me. First - he was the This scope to store variables related to his Application that were <i>not</i> settings. You can put anything you want in the This scope really, but in this case it really wans't a good idea to do so. I immediately suggested moving those custom values to the Application scope and the onApplicationStart method.

The real crazy part though was the return statement in the constructor. I've done some testing with a statement in the CFC and it doesn't quite seem to actually do anything. But certainly I had him remove that as well.

Ok - so now he had this This statements cleaned up. He had a set of Application variables being created in onApplicationStart. The last thing he had was his web service call. He was using the "alias" format:

<code>
application.configManager = CreateObject("webserivce", "Config");
</code>

Where "Config" was defined in the ColdFusion Administrator's Web Services panel. When debugging I strip things down as much as possible and simplify everywhere. So I had him replace the alias with the URL. Same issue.

So next I had him build a new CFC with a "HelloWorld" method only. I figured it must be something wrong with his other CFC. Things <i>still</i> broke. So now that his application was torn down to the bare essentials, I told him to zip it up and send it to me. 

It's at that point I saw this in his onApplicationStart:

<code>
application.configManager = CreateObject("webservice", "http://localhost:80/testingzone/badws/common/components/PropertyManager.cfc?wsdl");
</code>

Do you see it? Obviously the URL was modified to fit my machine - and even I missed it at first when I fixed the URL.

If you don't see it - here is what essentially happened. 

Request A came in - the first request - to the application.<br/>
CF said, this app isn't started, let me run onApplicationStart.<br/>
While Request A was waiting, onApplicationStart made the web service call.<br/>
Request B, the web service call, called the <b>same application</b>.<br/>
CF told Request B, "Hey man, I'm still starting up, please stand by."<br/>
Request A was still waiting for the web service call to end.<br/>
Request B, the web service, is still waiting for the app to start up.<br/>

And there we go - dead lock. You can see the same issue if you just use cfhttp to hit a CFM in the same application.

Totally - completely - obvious. Isn't it? But both he and I were more focused on the web service side then anything else. Web services can be tricky so I kind of <i>expect</i> them to fail randomly sometimes. 

Anyway - I thought I'd share this. As I said - it was pure joy figuring it out.