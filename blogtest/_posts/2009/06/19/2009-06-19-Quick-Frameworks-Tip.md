---
layout: post
title: "Quick Frameworks Tip"
date: "2009-06-19T21:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/06/19/Quick-Frameworks-Tip
guid: 3404
---

I originally wrote this as a Model-Glue tip, but I believe it applies to frameworks in general. This is something that's bitten me in the rear a few times now, and it's finally sunk in and I thought I should blog it. (Why is it that some lessons needs to be repeated multiple times before we learn?)
<!--more-->
Ok, so the basic issue is this. Imagine you have a Model-Glue event called getShips. This fires off a message to get a list of ships that is passed to your view. Each ship has a detail link that goes to a URL like so:

index.cfm?event=ship.display&id=#id#

This event broadcasts a message, getShip, that runs controller code. The controller code grabs the id and then loads the data. Your code may look something like this (and again, if you use some other framework the code would be different).

<code>
&lt;cfset id = arguments.event.getValue("id")&gt;
&lt;cfset ship = shipService.getShip(id)&gt;
&lt;cfset arguments.event.setValue("ship", ship)&gt;
</code>

Ok, nice and simple, right? Now imagine a second set of events - getPlanets and getPlanet. These work almost the same way. The first event gets a list of planets while the second works as a detail view. You can imagine that URL looking like so:

index.cfm?event=planet.display&id=#id#

So this works all well and good, until the client comes along and asks for a report on ships and their docking history with planets. You now have the need to get both a ship and a planet. You already have existing messages/listeners for getShip and getPlanet, but you have a problem. Both controller functions look for ID as the value that determines which value to load.

Maybe I'm crazy, but this seems very avoidable and yet it's still bitten me a few times now on the last few Model-Glue apps I've worked on. As a workaround, I've used message arguments in Model-Glue. So instead of just doing:

<code>
&lt;message name="getShip" /&gt;
</code>

I'll do:

<code>
&lt;message name="getShip"&gt;
  &lt;argument name="id" value="ship" /&gt;
&lt;/message&gt;
</code>

In my controller, instead of just looking in the Event object for "id", I'll see if the message had an argument passed to it. If so, I'll look for that key as opposed to id. So now I can pass ship=X in the URL (or Form) and it will work just as fine as id=X.

It's a workaround, but the real solution (unless my readers can suggest something better) is to start using better names for my parameters. Instead of ID, I'll uses shipid. Instead of ID, I'll use planetID.

Has anyone else run into this?