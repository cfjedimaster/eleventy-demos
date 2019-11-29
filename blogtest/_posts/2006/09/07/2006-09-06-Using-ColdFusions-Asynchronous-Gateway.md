---
layout: post
title: "Using ColdFusion's Asynchronous Gateway"
date: "2006-09-07T10:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/09/07/Using-ColdFusions-Asynchronous-Gateway
guid: 1518
---

I got an email a while back from a user who was having issues with ColdFusion's Asynchronous Gateway code. It had been a while since I used it so I thought it might be nice to refresh my own memory, and provide a simple guide for users on how to work with it. I ran into a few issues that I bet have tricked up my own readers. (Hopefully we will see Damon Cooper's <a href="http://www.dcooper.org/blog/client/index.cfm?mode=entry&entry=916FEFD9-4E22-1671-57A23859C50FFF47">cfthread</a> get rolled into the core product to make this a lot easier.) This guide will not cover everything you can do with the Asynch gateway, but it should be enough to get you going.
<!--more-->
So let's talk. When using the Asynch Gateway you are coordinating and working with two different files. You have one file that makes the requests. You can think of this as the customer asking for orders. The other file is a CFC and receives the requests via the Asynch Gateway. You can think of this as the wageslave behind the counter making your Happy Meal. To think of it another way - you have one file that fire offs the events and another file handling the (potentially) slower request in an asynchronous matter. All that means is that ColdFusion doesn't have to wait around for the slow process to end. 

The very first thing you need to do is create the CFC. You do <b>not</b> need to write <b>any</b> code in this CFC, but you must at least have the file. My file is located under my web root at testingzone/test.cfc. Next, you need to go into your ColdFusion Administrator. Under Event Gateways click <b>Gateway Instances</b>. Click <b>Add Gateway Instance</b>.  A form will pop up. You are concerned about the <b>Gateway ID</b> and the CFC Path. The Gateway ID is simply a label, nothing more. So for example, if your site is CIASecretPrisons.com, you may want to give your gateway a name related to the site: CIASecretPrison_AsynchGateway. That's a bit long but you get the idea. 

The CFC path is simply the path to the CFC you are using. You can actually change that at run time, but I'll leave that to the next blog entry. Leave the configuration file field alone and keep Startup Mode to automatic. This just ensures your gateway will run when ColdFusion restarts. Make your gateway and then start it by clicking the green start icon. Click the screen shot below for a larger version of the settings that I used. 

<a href="http://ray.camdenfamily.com/images/gateway1.jpg"><img src="http://ray.camdenfamily.com/images/gateway1_small.jpg" border="0"></a>

Now open up your CFC in your <a href="http://www.cfeclipse.org">favorite text editor</a>. In order to correctly listen to the Asynch Gateway, your CFC needs to have a method named onIncomingMessage. This method is sent one argument, a struct, that contains the a set of data. What data? It depends. Let's say you were using the gateway to send mail. Well then your data may contain an email address and a message. I'm using a modified version of the example from the docs which was a basic logger:

<code>
&lt;cfcomponent output="false"&gt;

&lt;cffunction name="onIncomingMessage" output="false" returnType="void"&gt;
	&lt;cfargument name="cfEvent" type="struct" required="yes"&gt;

	&lt;cfscript&gt;
	if(not structKeyExists(arguments.cfEvent.data, "file")) arguments.cfEvent.Data.file="defaultEventLog";
	if(not structKeyExists(arguments.cfEvent.data, "type")) arguments.cfEvent.Data.type="info";
	&lt;/cfscript&gt;

	&lt;cfif structKeyExists(arguments.cfevent.data, "message")&gt;
		&lt;cflog text="#arguments.cfEvent.data.message#" file="#arguments.cfEvent.data.file#" 
			   type="#arguments.cfEvent.data.type#" thread="yes" date="yes" time="yes" application="yes"&gt;
	&lt;/cfif&gt;
&lt;/cffunction&gt;
	
&lt;/cfcomponent&gt;
</code>

The code should be pretty trivial. The data passed to the gateway exists in a key named "data" under the cfEvent argument passed in. You see some basic checking for a file and type attribute, but outside of that the code simply logs a value named "message".

Let's now switch to the CFM file that will call this CFC. Let me show the code first and then I'll explain it.

<code>
&lt;cfscript&gt;
   status = false;
   props = structNew();
   props.message = "Replace me with a variable with data to log";   
   status = SendGatewayMessage("Asynch CF", props);
   if (status IS true) WriteOutput('Event Message "#props.Message#" has been sent.');
&lt;/cfscript&gt;
</code>

The code begins by initializing a status variable. This is used as a default flag for what our gateway returns. I then create my data. Again - what you use here will depend on what you are doing with your code. Our logger can take a few things like file and type, but it really just needs a message. Next the <a href="http://www.techfeed.net/cfQuickDocs/?getDoc=SendGatewayMessage">SendGatewayMessage</a> function is used. This lets ColdFusion communicate with the Event Gateway system. I know - it sounds complicated. Just think of it as a message. In this case, I used the gateway ID I had created "Asynch CF". The second argument is the structure of data. Just so you know - there are some special keys you can use within that structure to change how things work behind the scenes. I'll discuss that in the next entry.

Guess what - we're done. If you run this in your browser you will see the message logged. By itself this isn't too sexy. But consider modifying your onIncomingMessage like so:

<code>
&lt;cfset thread = CreateObject("java", "java.lang.Thread")&gt;
&lt;cfset thread.sleep(5000)&gt;
</code>

This will cause your CFC to pause for five seconds. Rerun your CFM and you will notice <b>no</b> delay. The only delay you have is in actual logging of the message. 

In my next blog entry I'll show a more real world example based on the code I wrote as a <a href="http://ray.camdenfamily.com/index.cfm/2006/7/21/CFTHREADCFJOIN-Proof-of-Concept">proof of concept for cfthread</a>. I'll also discuss those "other" keys I alluded to earlier. 

Something very important to remember: It is possible that your code may contain an error (shocking, I know). What happens when your CFC screws up? You don't get an error on your CFM page. In fact, the status message will still be true. If your CFC doesn't seem to be working correctly, check the eventgateway.log. I added a simple syntax error to my CFC and it was nicely logged:

<code>
"Error", "Thread-21", "09/07/06", "08:33:05", ,"Error invoking CFC for gateway Asynch CF: Variable structKeyExistsTheSmithsRule is undefined. "
</code>