---
layout: post
title: "Ask a Jedi: Moving existing application code into Model-Glue"
date: "2007-05-27T16:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/05/27/Ask-a-Jedi-Moving-existing-application-code-into-ModelGlue
guid: 2065
---

Rony sent me some interesting questions today concerning existing code and Model-Glue. He sent two questions. His second question was easier so I'll address that one first:

<blockquote>
I also have several variables, objects (such as DAO's, gateways) and structs inside stored in my application scope. How I can integrate this with MG?
</blockquote>

<more />

Model-Glue makes this rather simple. All controllers (you should have at least one per application) are automatically stored in the Application scope. This may not be 100% obvious as you don't see the Application scope used in your own, but it is indeed cached there. In fact, if you use the Model-Glue application template, you will see this in the Controller.cfc init method:

<code>
&lt;!--- Controllers are in the application scope:  Put any application startup code here. ---&gt;
</code>

All you need to do is place your Model CFCs here to cache them. An example:

<code>
&lt;cfset variables.userModel = createObject("myapp.model.user")&gt;
</code>

Because the controller itself is cached, this CFC will also be cached. 

Now for his second question:

<blockquote>
I currently have an application.cfc in which i have code for each of the functions inside this component, onrequeststart(), on applicationstart() etc. How can I integrate this into MG?
</blockquote>

There are a few answers to this. First off - Model-Glue will automatically call onRequestStart and onRequestEnd in each of your controller CFCs. So if you had 4 controllers, you actually get 4 different ways to run something on the start and end of each request. 

As for onApplicationStart(), I kind of covered this in the first portion. The init method of each controller is run when the controller is created. This acts like a virtual onApplicationStart, and again, you have one for each controller. This is both good and bad. On one hand - I like how Model-Glue allows me to focus on each controller and it's own application startup/request startup work. On the flip side, that makes it a bit more difficult to see - quickly - exactly what is going on in your startup code. It's not impossible of course. You just need to look at multiple files.

As a side question - do you think it makes sense for Model-Glue to have a site wide Application and Request startup handler?