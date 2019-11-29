---
layout: post
title: "Frameworks Conference: Introduction to Fusebox 5, by Adam Lehman"
date: "2007-02-01T11:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/02/01/Frameworks-Conference-Introduction-to-Fusebox-5-by-Adam-Lehman
guid: 1809
---

Introduction to Fusebox 5, by Adam Lehman

So readers of this blog know that I've never been a huge fan of Fusebox. But I've decided that this is the year that I'll give it a shot. I'm going to be attending a few Fusebox classes here at the conference and I'm going to go through the process of developing a simple Fusebox application sometime later this month. So with that in mind I'm attending the Intro to Fusebox class being taught by Adam Lehman. Please pardon the scattered nature of this report as I'll be taking notes during the presentation.
<!--more-->
Fusebox is CF's oldest (released in 97) and most popular framework. Originally designed by Steve Nelson and Gabe Roffman (both here at the conference). Maintained by TeraTech. Uses a MVC (Model-View-Controller) design pattern. XML based configuration since version 4. Latest release is version 5 (June 2006). And it is open source and free.

Lots of benefits I won't repeat here as I think they apply to most frameworks.

Application Structure based on a circuit. Login could be a circuit. Circuits has Fuseactions. Fuseactions have fuses. Kinda confused now so I hope he describes this a bit more.

FuseDocs: Documentation/structure comment system. Its XML used in the file that describe what the file does. (This sounds sexy.)

FLiP: Fusebox Lifecycle Process. Its a methodology. From requirements out to deployment. Not required for Fusebox, and you can use it w/o using Fusebox. 

Whats new in FuseBox 5: Mostly CFC based. Backwards compatible with earlier version. Multiple application can work under one Fusebox app. And other stuff I don't get since maybe I don't know Fusebox. 

Now he is showing the Fusebox.xml file (I think that is the name). Fusebox has a set of configuration files. (Like Model-Glue.) This is the core XML file for the application. The top portion of the file is a circuits block. This to me feels like the Controllers portion of Model-Glue. 

There is a classes box for CFC declarations. Not sure how that compares to circuits.

Parameters is your configuration stuff. That makes sense - Model-Glue has this as well. 

Lovely - one of the staff members is actually talking on his cell phone. He left after 5 minutes on the phone. Gee, thanks.

Apparently Fusebox generates code. (Model-Glue can do this with Reactor/Scaffolds.) 

Next section is globalfuseactions. Looks like high level events (application init, pre and post process). Model-Glue has this as well, but on first glance I think I like how Fusebox does this better. In Model-Glue it is defined in the onRequestStart/Stop methods for various controllers, which is good, but I like how in Fusebox it feels a bit more evident. 

He is talking a bit now about XFA (didn't quite get it) and layout. Seems like Fusebox is using request.content in his layout template instead of a viewState like Model-Glue. Not sure I like that - but it is a bit simpler.

He is showing the Entry circuit. Fusebox has standard filenames. act_, qry_, dsp_. Fuseaction in URL defines the circuit and action to run. XML defines what to do with that. You can define some fuseactions as private. I like that. You can't define events in Model-Glue as private. Showing how his action needs to get recent blog entries and this runs a CFM. This is odd. I'm not seeing yet how files communicate with each other. It seems like it could be request variables. Ok so I just asked Adam. There -is- a way to make it abstract, but the simpler method is to have this view file directly access the name of the query generated in the query file. That really bugs me - but I'm keeping an open mind.

He is now talking about add/edit forms. It kinds of ties in to what I brought up before, but the XML can pass to the fuseaction attributes. Interesting - the XML language allows for conditions. 

Showing an example of a lexicon. Seems like a custom tag defined for the XML. This seems kinda cool. You can extend the XML grammar to add new behavior. 

Showing how to initialize applcation files. There is an init file (missed the name) that is run on every request. This is a lot like Application.cfm. There is also an appinit.cfm file only run once. 

Now talking about plugins. Lexicons extend the grammar - but plugins extend the functionality. Plugins are event based. (You add a plugin to an event, like processError). 

Summary: I'm interested. I'm now looking forward to building my sample application later in the month. I definitely see things I don't think I like, but I definitely also see things I really do think is cool.