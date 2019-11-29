---
layout: post
title: "Working with Transfer's Event Model"
date: "2008-12-08T21:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/12/08/Working-with-Transfers-Event-Model
guid: 3139
---

In all my posts so far on Transfer, this is the one I was most looking forward to. I had known, in general, what Transfer did and how it works... kind of. But the event model was something I was completely in the dark with so I couldn't wait to start playing with it. Now that I have, I can say I'm both impressed, and a bit disappointed.
<!--more-->
I've been pretty happy with Transfer so far, but this one feature bugged me in regards to how poorly the documentation covers the topic. I encourage you to read for yourself (<a href="http://docs.transfer-orm.com/wiki/Using_the_Transfer_Event_Model.cfm">Using the Transfer Event Model</a>) and tell me if it is clear to you how event model is used? Yes, we get an API list, but nowhere do we see an actual example of using the API! I shouldn't complain so much. I actually have access to edit the wiki and, well, let's not talk about the documentation on my projects, but such an important feature really should have a bit more detail added. 

Ok, so enough ranting. Mark knows I mean well (grin), I hope this blog entry can help clear things up for folks. Let's get started.

At a basic level, the Transfer Event Model is a way to automatically do things based on certain events. So for example, we know that when we make something new in Transfer, at some point that object is persisted to the database. We also know that if we retrieve an existing object, modify it, and then save it, an update is being performed. These are two of the various events that Transfer gives you access to.

A good example of where this comes in handy is with auditing. If you want to mark when an object was created and when it was last updated, you can obviously do this by hand, but the Transfer event model lets you do this automatically.

Transfer makes the actual code simple enough. You write a function - it gets passed event data - and you do what you want. What didn't maker sense to me is how you hooked up this function to Transfer. 

The number one thing you must do is create a component. Even though you may just want to handle one event (and therefore use one function) it has to be packaged in the CFC. 

The second thing you must do is ensure that the method name in the CFC matches with the required name per the docs (again, see the <a href="http://docs.transfer-orm.com/wiki/Using_the_Transfer_Event_Model.cfm">event model</a> doc). So - if you want to handle the 'before I save the information to the database' event, or "Before Create", then you must name your method: actionBeforeCreateTransferEvent.

The final step then is to register your CFC with Transfer. This confused me as well. So if you build one CFC with handlers for multiple events, you must register each and every event with Transfer. You can't just make one call to Transfer with the one CFC. 

Here is a simple example. I want to handle the 'before save' and 'before update' operations in Transfer. These are called BeforeCreate and BeforeUpdate. I create a CFC named observer.cfc and placed two methods within it:

<code>
&lt;cfcomponent&gt;

&lt;cffunction name="actionBeforeCreateTransferEvent" hint="Actions an event before a create happens" access="public" returntype="void" output="false"&gt;
 	&lt;cfargument name="event" hint="The event object" type="transfer.com.events.TransferEvent" required="Yes"&gt;

 	&lt;cflog file="transferdemo" text="create called"&gt;     	
&lt;/cffunction&gt;

&lt;cffunction name="actionBeforeUpdateTransferEvent" hint="Actions an event before a update happens" access="public" returntype="void" output="false"&gt;
 	&lt;cfargument name="event" hint="The event object" type="transfer.com.events.TransferEvent" required="Yes"&gt;

 	&lt;cflog file="transferdemo" text="update called"&gt;&lt;/cffunction&gt;

&lt;/cfcomponent&gt;
</code>

For the two events, I named them per the spec and I ensure both had the event argument. I'll talk a bit more about that argument in a second. I used a simple cflog for both. 

Now I need to register this component with Transfer. Going to the Application.cfc/onApplicationStart method I've been using for my sample application, remember that I made an instance of my Transfer like so:

<code>
&lt;cfset application.transfer = application.transferFactory.getTransfer()&gt;
</code>

I then made an instace of the CFC I just wrote:

<code>
&lt;cfset application.observer = createObject("component", "empdir.model.observer")&gt;
</code>

I now tell Transfer that this CFC is where it can find the event handler for BeforeCreate:

<code>
&lt;cfset application.transfer.addBeforeCreateObserver(application.observer)&gt;
</code>

And I also tell it to use this CFC for BeforeUpdate:

<code>
&lt;cfset application.transfer.addBeforeUpdateObserver(application.observer)&gt;
</code>

Altogether, the entire onApplicationStart now has:

<code>
&lt;cfset application.transferFactory = 
				createObject("component", "transfer.TransferFactory").init(
 							"/empdir/configs/datasource.xml", 
 							"/empdir/configs/transfer.xml",
 							"/empdir/configs/definitions")&gt;

&lt;cfset application.transfer = application.transferFactory.getTransfer()&gt;
&lt;cfset application.observer = createObject("component", "empdir.model.observer")&gt;
&lt;cfset application.transfer.addBeforeCreateObserver(application.observer)&gt;
&lt;cfset application.transfer.addBeforeUpdateObserver(application.observer)&gt;
</code>

So I don't know exactly why - but this felt really awkward to me. The docs don't actually show a simple CFC nor do they show setting it up like so. I'm repeating myself, but I also didn't quite get why I couldn't pass the CFC one time to Transfer. 

So that aside, once I re-inited my application, I went to the admin, created a new Employee, save it, then edited it again and saved it. When I checked the logs I saw that Transfer correctly noticed both events! Pretty cool when you get past the confusion. Now let's make it a bit real. I went into my Employee table added two new fields, created and updated. I reflected this in the XML:

<code>
&lt;property name="created" type="date" /&gt;
&lt;property name="updated" type="date" /&gt;
</code>

I then borrowed some code from Bob Silverberg's excellent blog post on Transfer events (<a href="http://www.silverwareconsulting.com/index.cfm/2008/5/21/My-Take-on-Transfer-ORM-Event-Model-Examples--BeforeCreate-Example">My Take on Transfer ORM Event Model - BeforeCreate Example</a>). Using the event object passed to Transfer, we can get access to the actual Transfer object being worked with:

<code>
&lt;cfset var to = arguments.event.getTransferObject()&gt;
</code>

Once we have the TransferObject, we can check to see if it is an Employee, or, follow Bob's example, and just see if it has a created field:

<code>
&lt;cfif structKeyExists(to, "setCreated")&gt;
    &lt;cfset to.setCreated(now())&gt;
&lt;/cfif&gt;
</code>

The complete method now looks like this:

<code>
&lt;cffunction name="actionBeforeCreateTransferEvent" hint="Actions an event before a create happens" access="public" returntype="void" output="false"&gt;
 	&lt;cfargument name="event" hint="The event object" type="transfer.com.events.TransferEvent" required="Yes"&gt;

	&lt;cfset var to = arguments.event.getTransferObject()&gt;
	&lt;cfif structKeyExists(to, "setCreated")&gt;
    		&lt;cfset to.setCreated(now())&gt;
	&lt;/cfif&gt;
    
&lt;/cffunction&gt;
</code>

The handler for updates is very similar:

<code>
&lt;cffunction name="actionBeforeUpdateTransferEvent" hint="Actions an event before a update happens" access="public" returntype="void" output="false"&gt;
 	&lt;cfargument name="event" hint="The event object" type="transfer.com.events.TransferEvent" required="Yes"&gt;

	&lt;cfset var to = arguments.event.getTransferObject()&gt;
	&lt;cfif structKeyExists(to, "setUpdated")&gt;
    		&lt;cfset to.setUpdated(now())&gt;
	&lt;/cfif&gt;

&lt;/cffunction&gt;
</code>

Once again I re-inited my application and played with some new data. Transfer noticed the presence of the created and updated properties and automatically took care of setting the values. What's cool is that I can just go to some other object, add the properties, and not worry about it. The auditing will be handled automatically. 

As with my earlier entries, I've included a zip of my most recent code base so you can see this in action. I hope this helps clear things up a bit. If you are curious, here is a complete list of the events Transfer can handle:

<ul>
<li>AfterNew: When the object is first created, but before it is persisted.
<li>BeforeCreate: Called before the object is persisted.
<li>AfterCreate: Called after the object is persisted.
<li>BeforeUpdate: Called before a persisted object is updated.
<li>AfterUpdate: Called after the already persisted object is updated.
<li>BeforeDelete: Called before an object is about to be deleted.
<li>AfterDelete: Called after the object is deleted.
</ul><p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5Cwww%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fempdirectory7%{% endraw %}2Ezip'>Download attached file.</a></p>