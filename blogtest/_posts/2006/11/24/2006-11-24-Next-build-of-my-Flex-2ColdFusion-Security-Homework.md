---
layout: post
title: "Next build of my Flex 2/ColdFusion Security Homework"
date: "2006-11-24T23:11:00+06:00"
categories: [coldfusion,flex]
tags: []
banner_image: 
permalink: /2006/11/24/Next-build-of-my-Flex-2ColdFusion-Security-Homework
guid: 1674
---

If you don't know what I'm talking about, check this <a href="http://ray.camdenfamily.com/index.cfm/2006/11/21/My-Thanksgiving-Flex-Homework">post</a>. Essentially - I'm trying to wrap my brain around how to best get Flex 2 talking to ColdFusion in a secure manner. My earlier posts showed how to graphically start up with a login screen, require you to login, and then switch to the main view.
<!--more-->
Today I've actually hooked up my Flex code to a real CFC. Let's look at how I did that. The first new lines to my Flex code are:

<code>
&lt;mx:RemoteObject id="core" destination="ColdFusion" source="demos.flexsec3.core" showBusyCursor="true" &gt;

	&lt;mx:method name="authenticate" fault="alertMsg(event.fault.toString())" result="checkAuthResult(event)" /&gt;
		
&lt;/mx:RemoteObject&gt;
</code>

This creates an object named "core" that represents my ColdFusion Component. Notice the "source" attribute is the "dot" path, from web root, to the CFC. (More on that later.) I have only one method defined, authenticate, and I've set up both a fault handler and a result handler. 

The fault handler simply dumps the error, so lets look at checkAuthResult:

<code>
private function checkAuthResult(event):void {
	var result = event.result;
	if(result == 'false') {
		Alert.show("Authentication failed", "Errors", mx.controls.Alert.OK);				
	} else {	
		mainView.selectedChild = mainStage;
	}
}
</code>

My CFC, which I'll show in a second, will return either true or false. I check the contents of this variable, and depending on the result, either show an error or hide the login stage.

Prety simple, right? The CFC doesn't do much yet. It's authenticate method simply has this:

<code>
&lt;cfif arguments.username is "admin" and arguments.password is "dharma"&gt;
	&lt;cfreturn true&gt;
&lt;cfelse&gt;
	&lt;cfreturn false&gt;
&lt;/cfif&gt;
</code>

Since this is only a demo I'm not going to worry about hooking it up to a database.

So - let me review what I've done: I've defined a CFC service in my Flex code named core. (Not a very descriptive name, but...) I defined a method on this CFC and what Flex should do on error and on the result. I then check the result and either tell the user he didn't login correctly or go ahead and show the main application. 

My questions/problems are:

<ol>
<li>It seems like the source attribute must be hard coded. This has always been a pain in the butt for me (well, "always" for the few Flex 2 applications I've built) as it means I have to change it from source to production. Obviously I could have set up things differently, but I wish I could abstract that value out - perhaps into Flash Vars. Is that possible?
<li>I'm not storing the username and password. As I have no idea (yet!) how I'm going to talk securely to the CFC backend, I don't know if I need to. I assume I will - but for now I don't both storing the values.
<li>As I mentioned, the fault handler should be more intelligent. Any application based on back end services like this should have some nice error handling. 
</ol>

If you want to view this demo, please go here:

<a href="http://ray.camdenfamily.com/demos/flexsec3/SimpleRemotingTest.html">http://ray.camdenfamily.com/demos/flexsec3/SimpleRemotingTest.html</a>

As before - please feel free to point anything I did wrong.