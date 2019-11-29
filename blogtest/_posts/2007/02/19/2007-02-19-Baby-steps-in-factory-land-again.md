---
layout: post
title: "Baby steps in factory land (again)"
date: "2007-02-19T21:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/02/19/Baby-steps-in-factory-land-again
guid: 1847
---

About a week ago I posted about my first experiments with <a href="http://ray.camdenfamily.com/index.cfm/2007/2/11/Baby-steps-in-factory-land">object factories</a>. If you haven't read that post, please do so before reading this one. When I wrapped the last entry I mentioned I had two problems with my solution. I want to thank Rob Gonda. His code (variations of it) is used below.
<!--more-->
First - my factory returned a new instance every time you asked for a CFC. This isn't necessary if you only need one instance of the CFC per application. In other words, I may have multiple CFCs all using Foo.cfc, but only one instant needs to exist in memory. (Some people refer to this as a <a href="http://en.wikipedia.org/wiki/Singleton_variable">singleton</a>.)

Let's look at a simple modification of the old factory to support this. Here is the code from the past entry:

<code>
&lt;cfcomponent output="false"&gt;

&lt;cffunction name="getComponent" returnType="any" output="false"&gt;
   &lt;cfargument name="name" type="string" required="true"&gt;
   
   &lt;cfswitch expression="name"&gt;
   
      &lt;cfcase value="ship"&gt;
         &lt;cfreturn createObject("component", "cfcs.ship").init("dsn", "arrayofshipclasses")&gt;
      &lt;/cfcase&gt;
      
      &lt;cfcase value="soldier"&gt;
         &lt;cfreturn createObject("component","cfcs.soldier").init("dsn", "arrayofjobs")&gt;
      &lt;/cfcase&gt;

      &lt;cfcase value="planet"&gt;
         &lt;cfreturn createObject("component", "cfcs.planet").init("dsn","arrayofplanettypes","maxforgame")&gt;
      &lt;/cfcase&gt;
      
      &lt;cfcase value="player"&gt;
         &lt;cfreturn createObject("component", "cfcs.planet").init("dsn","arrayofplayertypes","maxforgame")&gt;
      &lt;/cfcase&gt;
      
      &lt;cfcase value="ruleset"&gt;
         &lt;cfreturn createObject("component", "cfcs.ruleset").init("dsn")&gt;
      &lt;/cfcase&gt;
      
      &lt;cfdefaultcase&gt;
         &lt;cfthrow message="#arguments.name# is not a recognized component."&gt;
      &lt;/cfdefaultcase&gt;
      
   &lt;/cfswitch&gt;
   
&lt;/cffunction&gt;

&lt;/cfcomponent&gt;
</code>

The idea is that your code will use factory.getComponent(name) to load a CFC. As you can see though that a new CFC is loaded every time you request the CFC. Now lets tweak it a bit...

<code>
&lt;cfcomponent output="false"&gt;

&lt;cfset variables.instances = structNew()&gt;

&lt;cffunction name="getComponent" returnType="any" output="false"&gt;
   &lt;cfargument name="name" type="string" required="true"&gt;
   

   &lt;cfswitch expression="name"&gt;
   
      &lt;cfcase value="ship"&gt;
         &lt;cfreturn createObject("component", "cfcs.ship").init("dsn", "arrayofshipclasses")&gt;
      &lt;/cfcase&gt;
      
      &lt;cfcase value="soldier"&gt;
         &lt;cfreturn createObject("component","cfcs.soldier").init("dsn", "arrayofjobs")&gt;
      &lt;/cfcase&gt;

      &lt;cfcase value="planet"&gt;
         &lt;cfreturn createObject("component", "cfcs.planet").init("dsn","arrayofplanettypes","maxforgame")&gt;
      &lt;/cfcase&gt;
      
      &lt;cfcase value="player"&gt;
         &lt;cfreturn createObject("component", "cfcs.planet").init("dsn","arrayofplayertypes","maxforgame")&gt;
      &lt;/cfcase&gt;
      
      &lt;cfcase value="ruleset"&gt;
         &lt;cfreturn createObject("component", "cfcs.ruleset").init("dsn")&gt;
      &lt;/cfcase&gt;
      
      &lt;cfdefaultcase&gt;
         &lt;cfthrow message="#arguments.name# is not a recognized component."&gt;
      &lt;/cfdefaultcase&gt;
      
   &lt;/cfswitch&gt;
   
&lt;/cffunction&gt;

&lt;cffunction name="get" returnType="any" output="false"&gt;
   &lt;cfargument name="name" type="string" required="true"&gt;

   &lt;cfif not structKeyExists(variables.instances, arguments.name)&gt;
      &lt;cfset variables.instances[arguments.name] = getComponent(arguments.name)&gt;
   &lt;/cfif&gt;

   &lt;cfreturn variables.instances[arguments.name]&gt;

&lt;/cffunction&gt;

&lt;/cfcomponent&gt;
</code>

First - note that the CFC creates a structure, variables.instance, outside of any method. This means it will run when the CFC is created. Next note the new method, get. This method will see if a component exists in the instances structure. If not, it adds it. Lastly the CFC stored in the structure is returned. So the first time you ask for "moo" the CFC will be created, but after that the initial instance is returned. One more thing I like about this change is that I use get instead of getComponent. It's less typing, and since the factory only returns components, it makes it even simpler.

Ok - so to repeat: This change simply ensures that I return one and only one instance of a CFC. So the next thing to we need to cover is how our CFCs themselves will talk to the factory. It would be child's play to add this to our CFCs:

<code>
&lt;cfset variables.foo = application.factory.get("goo")&gt;
</code>

However, it is generally considered bad practice to reference the Application scope inside of a CFC. So how do we get what we need? One answer is dependency injection. 

I'll be honest. Most of the time when I heard dependency injection, my left eye would twitch a bit and I generally felt like ducking my head into the ground. I don't know why but it <i>really</i> seemed weird to me. 

So I finally got it through my thick head. (Probably thanks to all the exposure at the frameworks conference.) Imagine you are going to Home Depot because you want your bathroom redone. You could buy the materials, hire the designer, plumber, carpenter, etc. 

Or you could hire the designer and let Home Depot supply him with everything he needs. In other words, Home Depot will provide the designer with all the resources he needs to complete the job. The designer doesn't have to worry about where it comes from, it is just there. 

I don't know if that is the best description (and I know my readers will find better ones), but lets show an example. 

The CFC Ship needs an instance of planet, soldier, and ruleset. (By the way, there was some confusion in the last blog entry. No - I am not working on a Star Wars ColdFusion site. The CFC names are just for fun.) The old Ship.cfc init() method could have looked like this:

<code>
&lt;cffunction name="init" returnType="ship"&gt;
   &lt;cfargument name="dsn" type="string"&gt;
   &lt;cfargument name="arrayofshipclasses" type="array"&gt;

   &lt;cfset variables.planet = createObject("component", "planet")&gt;
   &lt;cfset variables.soldier = createObject("component", "soldier")&gt;
   &lt;cfset variables.ruleset = createObject("component", "ruleset")&gt;
   &lt;cfreturn this&gt;
&lt;/cffunction&gt;
</code>

As I mentioned - when the requirements for these CFCs change, I have to update ship.cfc properly or my application will break. I'm going to switch this CFC so that now the the CFCs Ship needs are passed to it when it is created:

<code>
&lt;cffunction name="init" returnType="ship"&gt;
   &lt;cfargument name="dsn" type="string"&gt;
   &lt;cfargument name="arrayofshipclasses" type="array"&gt;

   &lt;cfargument name="planet" type="planet" required="true"&gt;
   &lt;cfargument name="soldier" type="planet" required="true"&gt;
   &lt;cfargument name="ruleset" type="planet" required="true"&gt;

   &lt;cfset variables.planet = arguments.planet&gt;
   &lt;cfset variables.soldier = arguments.soldier&gt;
   &lt;cfset variables.ruleset = arguments.ruleset&gt;
   &lt;cfreturn this&gt;
&lt;/cffunction&gt;
</code>

Notice that the CFC has zero idea how these CFCs are made. It just gets them handed to it. The factory would be updated of course. Here is the relevant changes from factory.cfc:

<code>
      &lt;cfcase value="ship"&gt;
         &lt;cfreturn createObject("component", "cfcs.ship").init("dsn", "arrayofshipclasses", get("planet"), get("soldier"), get("ruleset"))&gt;
      &lt;/cfcase&gt;
</code>

Not terribly complex. But certainly if there <i>is</i> any complexity, its in the factory now, and not my CFCs. All issues related to component creation are now contained within one file. This is a much better situation than how the code was before. For a good example - check out <a href="http://galleon.riaforge.org">Galleon</a>. While I'm proud of my forums - it really shows you where a factory can help out.

Comment away folks and let me know what I screwed up. If <i>anything</i> isn't clear - let me know!