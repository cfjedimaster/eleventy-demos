---
layout: post
title: "Last build of my Flex 2/ColdFusion Security Homework"
date: "2006-11-25T22:11:00+06:00"
categories: [coldfusion,flex]
tags: []
banner_image: 
permalink: /2006/11/25/Last-build-of-my-Flex-2ColdFusion-Security-Homework
guid: 1676
---

Ok, so this is the last revision of my <a href="http://ray.camdenfamily.com/index.cfm/2006/11/21/My-Thanksgiving-Flex-Homework">Flex Thanksgiving homework</a>. Thanks to everyone for the tips. My only purpose here was to learn a bit and I've definitely done that - thanks to you guys out there. So - enough kissing up. Let me talk about what I did in this last build.

First I expanded core.cfc to include a few new methods: unsecure and secure. They simply return random strings with the secure method adding a static string in front:
<!--more-->
<code>
&lt;cffunction name="unsecure" access="remote" returnType="numeric" output="false"&gt;
	&lt;cfreturn randRange(1,10000)&gt;
&lt;/cffunction&gt;

&lt;cffunction name="secure" access="remote" returnType="string" output="false" roles="admin"&gt;
	&lt;cfreturn "secure function " & randRange(1,10000)&gt;
&lt;/cffunction&gt;
</code>

You may be wondering why I bothered with the unsecure method. I mean - I've done it before easily enough. My authenticate method wasn't secured. Frankly there was no good reason - I just wanted to be complete. Ignore the roles equals part. I'll be getting to that in a second.

To my main stage (remember I was using a ViewStack and I named my different pages as stages) I added two buttons:

<code>
&lt;mx:Button id="unsecureButton" label="Call unsecured method." click="callUnsecure()" /&gt;	

&lt;mx:Button id="secureButton" label="Call secured method." click="callSecure()" /&gt;	
</code>

These two buttons were what I used to test my methods. Now lets talk security. I started off this series saying I wanted to avoid ColdFusion's roles based security. I am <b>not</b> of fan of it. It is probably the only thing about ColdFusion I don't like. Turns out though that it is very darn handy when working with Flex. So handy that I decided to swallow my pride a little and just use it. How difficult is it to use in Flex? Incredibly difficult. Very complex. In fact, I shouldn't even tell you how to do this. I should charge outrageous consulting fees instead. (Actually more than a few people posted this.)

Basically what you do is set login information into your RemoteObject tag. I moved my username/password values out of the old method and into the global scope. I then used setRemoteCredentials. Here is my new function that is run after authentication:

<code>
private function checkAuthResult(event):void {
	var result = event.result;
	if(result == 'false') {
		Alert.show("Authentication failed", "Errors", mx.controls.Alert.OK);				
	} else {
		core.setRemoteCredentials(usernameValue,passwordValue);	
		mainView.selectedChild = mainStage;
	}
}
</code>

The only real difference here from the last version is the setRemoteCredentials function. You can think of it like adding a badge to your remoteObject. Now all calls will also pass along authentication information. How do you use that? With the CFLOGIN scope. I added an Application.cfc file to the project and used this onRequestStart:

<code>
&lt;cffunction name="onRequestStart" returnType="boolean" output="false"&gt;
	&lt;cfargument name="thePage" type="string" required="true"&gt;
	
	&lt;cflogin&gt;
		&lt;cfif isDefined("cflogin.name") and isDefined("cflogin.password")&gt;
			&lt;cfif application.core.authenticate(cflogin.name, cflogin.password)&gt;
				&lt;cfloginuser name="#cflogin.name#" password="#cflogin.password#" roles="#application.core.getRoles(cflogin.name)#"&gt;
			&lt;/cfif&gt;
		&lt;/cfif&gt;
	&lt;/cflogin&gt;
	
	&lt;cfreturn true&gt;
&lt;/cffunction&gt;
</code>

So for those of you who have not used CFLOGIN, the basic thing to remember is that it can auto detect calls made with authentication data (not just from Flash/Flex) and will give you access to the username and password. I took these values and passed them to the authentication method. If it returns true (which it should), then I grab the roles (hard coded in my CFC as "admin") and run the CFLOGINUSER tag. So remember my secured method above that had roles=admin? It will now work correctly since the CFLOGINUSER tag will end up giving me a role of "admin."

So I said this was the last entry, but earlier today J Fernandes showed me a good way to make my source attribute dynamic based on FlashVars. So I'll do one more build tomorrow demonstrating that. 

I'm happy this was so easy in the end. But - I'm not happy that I ended up using CFLOGIN. To me it is almost as bad as Evaluate(). How could I get around it? One idea would be to build a proxy CFC. This CFC would have contain the methods I need to run remotely, and each method would

<ul>
<li>have a username and password attribute. These would get passed to an authenticate() method and logic would only continue if the authentication passed
<li>any other arguments would be passed in as a structure and then expanded as arguments to the "real" CFC behind the scenes
</ul>

This seems like extra work. But it does get rid of CFLOGIN. It also lets me keep my original CFC a bit slimmer and more focused on business logic while my proxy can worry about security. 

For those of you out there doing Flex 2 development - how do you handle security?

p.s. Oops, forgot to link to the new build. You can view it here: <a href="http://ray.camdenfamily.com/demos/flexsec4/SimpleRemotingTest.html">http://ray.camdenfamily.com/demos/flexsec4/SimpleRemotingTest.html</a>