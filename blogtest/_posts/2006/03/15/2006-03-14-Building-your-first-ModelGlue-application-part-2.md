---
layout: post
title: "Building your first Model-Glue application (part 2)"
date: "2006-03-15T08:03:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/03/15/Building-your-first-ModelGlue-application-part-2
guid: 1150
---

In my <a href="http://ray.camdenfamily.com/index.cfm/2006/3/13/Building-your-first-ModelGlue-application-part-1">last entry</a>, I walked us through the basic set up and design for the photo gallery application. In this entry we will start talking about the security and registration system. To be honest, this is something that I had trouble with when I was creating my first Model-Glue application. I'm not convinced I have the best answer for this, but this is what has worked for me so far, so I'm going to share it with others.
<!--more-->
Like most sites, our application will have both a logon screen and a registration screen. But how do we handle security? Typically I'd use onRequestStart in an Application.cfc file to see if a request needs to be secured. So for example, I'd typically do something like this pseudo-code:

<code>
if the request is NOT for logon.cfm, or register.cfm, 
the user needs to be logged on so let's push them there
and abort the request
</code>

But how do we handle this in Model-Glue? Let's cover some basic Model-Glue facts. Model-Glue defines events. These events simply define what your application can do. The default application template that we used has two events, Home and Exception. When we hit the application without an event, it is going to use a default event defined in the settings. In our case, it's the Home template. So let's start by securing the Home template.

Events can (and normally will) broadcast a message. When I first read this in the quick start guide, it didn't make much sense. The way I look at it is - sometimes events need additional information ("Am I logged in?" for example), and the event requests that information when the event is fired. Your event can even do something with the result. 

So how can we use this? We've already said that we need to require people to logon or register. So we can modify the Home event to check if the user is logged in. If they aren't, we can force them to the logon page. Here is a modified version of the Home event:

<code>
    &lt;event-handler name="Home"&gt;
      &lt;broadcasts&gt;
      	&lt;message name="getAuthenticated" /&gt;
      &lt;/broadcasts&gt;
      &lt;views&gt;
      	&lt;include name="body" template="dspBody.cfm" /&gt;
	&lt;include name="main" template="dspTemplate.cfm" /&gt;
      &lt;/views&gt;
      &lt;results&gt;
      	&lt;result name="notAuthenticated" do="Logon" /&gt;
      &lt;/results&gt;
    &lt;/event-handler&gt;
</code>

What has changed here? I added a new message, getAuthenticated. I added a new result. The name of the result, notAuthenticated, means, only run this result if the notAuthenticated result was returned from the controller. As you can probably guess, my controller will either return authenticated or notAuthenticated. In my case, I only really care if the user is not authenticated.

Now we need to make the controller listen for the event. You may ask - why do I need to do this? What else is going to listen to my events? Well, the Model-Glue sample application only has one controller, but a Model-Glue production application may have many. You will also see that we can tell the controller to listen to event "foo" but call method "goo". This is nice in case our controller changes as it lets us keep our events using the older event name. So go up to your controllers block, go to myController, and after the onRequestEnd message, add a new one for getAuthenticated. The entire block will look like this now:

<code>
  &lt;controllers&gt;
    &lt;controller name="myController" type="controller.Controller"&gt;
      &lt;message-listener message="OnRequestStart" function="OnRequestStart" /&gt;
      &lt;message-listener message="OnRequestEnd" function="OnRequestEnd" /&gt;
      &lt;message-listener message="getAuthenticated" function="getAuthenticated" /&gt;
      &lt;!-- Message-Listener Template
      &lt;message-listener message="BroadcastMessageName" function="ControllerFunctionToFire"&gt;
        &lt;argument name="AnEventArgument" value="aValue" /&gt;
      &lt;/message-listener&gt;
      --&gt;
    &lt;/controller&gt;
  &lt;/controllers&gt;
</code>

If you want, you can get rid of the comment in there. It is just there to help you learn the format. As you can see, we added the getAuthenticated listener and it calls the same method in the controller. Now let's add the method to our controller. Open up controller/Controller.cfc, and add this method, before OnRequestStart:

<code>
&lt;cffunction name="getAuthenticated" access="public" returntype="void" output="false" hint="I return if the user is authenticated."&gt;
  &lt;cfargument name="event" type="ModelGlue.Core.Event" required="true"&gt;
  
  &lt;cfset arguments.event.addResult("notAuthenticated") /&gt;
&lt;/cffunction&gt;
</code>

So let's examine this line by line. All controller methods that listen to events are passed in a Model-Glue event. This is what you modify to pass results back and forth. It is a bit weird at first. I always want to return a value from methods, so this took some getting used to. But you can imagine this Event object as a bus making stops at all the events during your request. At each bus stop, a new value may get on or get off, or the bus driver may be given special instructions. In this case, I'm not adding any values per se, but adding a result to the event. As you can guess, I'm hard coding this now since we don't really have a Model yet, a back end. Therefore the result will always be that a user is not logged in.

Hopefully you are still with me. Since we are returning a result of notAuthenticated, and our Home event says to fire the Logon event, we now need to add that:

<code>
    &lt;event-handler name="Logon"&gt;
      &lt;broadcasts /&gt;
      &lt;views&gt;
      	&lt;include name="body" template="dspLogon.cfm" /&gt;
      &lt;/views&gt;
      &lt;results /&gt;
    &lt;/event-handler&gt;
</code>

This is pretty simular to how the original Home event was. I'm not broadcasting any events. I'm simply including a logon template. Notice that the Home event uses two views. One is the content (named body) and one is the display. Normally a logon page has slightly different layout than the rest of the site. Typically I'll create a view called "base" or "bare" for that and other pages (like the register page). For now though I'm going to keep it ugly and simple. The dspLogon.cfm file is included in the zip (which I didn't forget this time) and is nothing more than a simple form. There is one line of interest that I'll share here:

<code>
&lt;form action="#viewstate.getValue("myself")#logonattempt" method="post"&gt;
</code>

The view state, as desribed in the Quick Start, is a collection of data passed to the view. So for example, if you were displaying a press release, the controller could ask the model for the data, and then set that data in the view state so that your view files could use it. I'll talk more about this later because, to be honest, it confused me at first. But for now, the thing I want to point out is that "myself" is a default value in the view state. You can use it to point to the root file of your Model-Glue application. All you need to add to the end is the event name. Since I'm using "Logon" to display the logon form, I'm using "logonattempt" for the "try to logon" event.

<b>Summary</b>

So we talked about a lot here. Let's do a quick summary of what changed:

<ul>
<li>The first thing I did was add a new setting, DSN, to my ModelGlue.xml file. This setting will be available to my code. You can think of it like Application variables.
<li>I modified the Home event to broadcast an event. This event checks to see if we are logged in.
<li>I modified the controller to check and see if the user is logged on. For this release, I simply made it return false. I did this by adding a result to my event that the Home event will notice. 
<li>I added the Logon event to handle displaying the logon form. Any request for the site's Home event will now force you to logon if you haven't done so. 
</ul>

As before, you can see this in action <a href="http://pg1.camdenfamily.com">here</a>.<p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Cwebsites{% raw %}%5Ccamdenfamily%{% endraw %}5Csource{% raw %}%5Cmorpheus%{% endraw %}5Cblog{% raw %}%5Cenclosures%{% endraw %}2Fwwwroot1%2Ezip'>Download attached file.</a></p>