---
layout: post
title: "Model-Glue 3 - The New Frakin' Awesomeness"
date: "2008-05-02T18:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/05/02/ModelGlue-3-The-New-Frakin-Awesomeness
guid: 2805
---

Before I get started - you can download the Alpha now <a href="http://www.model-glue.com/">available.</a>

My notes from Joe's Model-Glue 3 presentation at cfObjective. Please pardon the bad writing here and some text are direct quotes without me using quotes (so basically, all copyright Joe).
<!--more-->
Why is MG 3 being built? Joe had no plans on going past version 1. He was 'away' from CF for a while, came back, 
and realized some rough spots he wanted to improve on in the framework. The community has evolved, and this is impacting
the development of MG. Awesome slide of the MG timeline stating that the old days were the "Fuseaic Era". (Fusebox Era) Next is the "Helmsian Period". (Mach II Era) And then MG began. (Ok, I'm really shortening up what was a good story. Sorry, can't type everything Joe is saying.) MG1 came out around the same time as some important (other) frameworks like ColdSpring, Transfer, Reactor. And eventually we grow into MG2. However, since there was more to MG2, this led to some confusion.

MG3 - code named Gesture - return to simplicity. "Back to basics" "It's goal is to provide the easiest workflow possible w/o sacrificing the benefits of adding Implicit Invocation."

MG3 is a feature release - ie, new features hoping to make your life easier. No giant changes to the way things are done by you - although a good bit of the code for MG itself is being redone. 

All new features are aimed at productivity. 

dsp is gone from the skeleton views - not the MG cared, but it's gone.

ViewState is gone - it's just Event now (woohoo!!!).

"ActionPacks" are coming. Like basic user management/user/group/event security action pack will ship with Alpha. 

<b>New features</b>

1) The ability to auto-generate code via the URL. So you can hit event=user.save, and MG can create the xml/controller/model/view code for you. Uses a "Controller.Action" approach. FYI, this is something you can turn off, and will be (probably) disabled by default. You can enter the URL of an event that doesn't exist and get a wealth of free code. Example:

Run ant task to make new MG app.<br>
Turn on the feature.<br>
Type index.cfm?event=user.login<br>
Edit userController.login() to make it real.<br>
Edit view to make a form.<br>
And you are done! (with no xml editing)<br>
Oh, but wait - theres more - it will (eventually) also make unit tests for it.

<b>Event Types</b>

When you have 100 events, and 95 of them use a site wide template, you have 95 repeated lines of XML. This stinks. So what we need our Event Templates. You can create CFCs to extend EventHandler. You can make a login required event. You can do stuff before and after the event that uses the template is run. Security, layout, etc. In the XML, you just specify the type fgor the event.

<code>
&lt;event-handler name="foo" type="events.TemplatedEvent"&gt;
</code>

This ties to code generation as well - if you use "type" in the URL when generating code, the new events will use that event type.

<b>Application.cfc</b>

There ya go - it's supported. You can add listeners:

<code>
&lt;message-listener message="onApplicationStart(SessionStart/SessionEnd" function=".." /&gt;
</code>

<b>URL Manager</b>

SES urls supported out of the box. You can build things the way you want. New ways to build URls:

<code>
&lt;a href="#event.linkTo("user.profile","userid,profileid")&gt;
</code>

Can result in either of these, up to you:

<code>
index.cfm?event=userid=x&profileid=3&lt;br&gt;
OR
index.cfm/userid/2/profileid/42
</code>

<b>Helpers</b>

Have you used UDFs in a MG app? It's a pain. You have to include them into a view, and doesn't help the controller. You can now drop a library of UDFs and drop it into the helpers folder. Then you can access ALL the udfs via the helpers scope in controllers and views. (Love this.)

<code>
#helpers.dateLib.daysTilXmas()#
</code>

You can also drop an entire CFC into the folder and it acts the same way.

<b>Bean "injection"</b>

No more need to write setters for bean injection. 

<code>
&lt;cfcomponent beans="sameDAO" /&gt;
</code>

This code in your controller will then load the DAO into the controller automatically. It will use a beans scope. You can list more than one. (Love this.)

<b>Caching Updates</b>

Gesture won't have an object cache - thats for your service layer. But a very simple content cache will be added.

<code>
&lt;event-handler name="page.home" cache="true" /&gt;
</code>

This will cache the HTML result into RAM. You can tweak timeout. You can also cache into different scopes, and supply specific keynames for the cache. Keyname="X" means, the name of the cache is based on the Event value for X. So one event can have N different caches. So a product detail page would use the productID for the cache key. You can also invalidate a cache. 

MG's cache is intentionally simple caching system since most folks have very personal/specific ways of needing to cache. MG makes it easy to swap out it's system and use your own. (Like JDBM or memcached.)

<b>Formats</b>

Joe is on the fence on this one. Apps have to work with multiple formats - HTML, XML, JSON, Partial pages. It's providing the same data in N formats. Which stinks. In gesture, you can tell an event to run based on a format. Like requestFormat=JSON. So you can tell broadcast tags, views tags, and results tags to run on format=X. 

<code>
&lt;event-handler name="x"&gt;
&lt;broadcasts&gt;....&lt;/broadcasts&gt;
&lt;views format="json"&gt;
..
&lt;/views&gt;
&lt;views format="xml"&gt;
...
&lt;/views&gt;
&lt;views format="custom"&gt;
...
&lt;/views&gt;
&lt;results format="html"&gt;
...
&lt;/results&gt;
&lt;/event&gt;
</code>

<b>Model-Glue Remoting</b>

A typical CF app will contain HTML, Flex, Flash, etc. Your app can have both an index.cfm file at root plus a ModelGlueGateway CFC as an entry point for Flex/Flash thingies. You can call events from Flex/Flash:

<code>
&lt;mx:RemoteObject id="modelGlueGateway" desitnation="ColdFusion" source="ModelGlueGatway"&gt;
</code>

I can't type this fast, but he basically uses the gateway to run a MG event (all via ActionScript).

<b>Edited a few minutes later...</b>

You can now support unknown events. Ie, if event X is requested and not supported, you can tell MG to run event Y to handle it instead of just having an error thrown.