---
layout: post
title: "Ask a Jedi: AjaxProxy and working with CFCs"
date: "2008-02-01T07:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/02/01/Ask-a-Jedi-AjaxProxy-and-working-with-CFCs
guid: 2628
---

Mark asks a question about working with CFCs over AjaxProxy:

<blockquote>
<p>
I have a ColdFusion object (CFC) designed in an OO fashion with getters and setters. I want to use the new ColdFusion 8 ajax proxy stuff to create an instance of the object and use it in javascript like I do in ColdFusion. For instance, I want to instantiate it, set a parameter, call the load() method, then be able to use any of the getter methods that I've marked as remote. I've tried doing this, but from what I can tell, you can only use this js-cf bridge as one-time things (e.g. stateless?), with the object not "remembering" the other things you've done to it. Here is a example of what I want to do that I cannot figure out how:

<cfajaxproxy
cfc="path.to.mycfc" jsclassname="mycfc">

Then in javascript:
mycfc.setId(1);<br>
mycfc.load();<br>
alert(mycfc.getFirstName() + ' ' + mycfc.getLastName());<br>

Anyway to do this? I can do it now calling one method at a time and passing in the id to that method, but that requires writing remote-specific methods that take the id for every call, look it up, and return that one piece of data (or
stringing together multiple pieces) in the callback handler--but that is what I'm trying to avoid.
</p>
</blockquote>
<!--more-->
So this is a rather interesting situation. Most of the time I think people would use cfajaxproxy to talk to a service, not to a bean object. As Mark noticed, all the hits to the remote object are stateless. You could possibly store information in the session scope, but that would get a bit messy. So he was left with passing an ID every time. 

You may ask - why did he create a proxy to the bean in the first place? Why not make a proxy to a service and return the bean CFC? Well CFCs are not something you can return via ajaxproxy. To be clear, you <i>can</i> return a CFC no problem. But on the server side, ColdFusion will return it as a struct and return the This scope. So if you CFC had this.name="Paris", you would end up with this in JSON: {% raw %}{ "NAME":"Paris" }{% endraw %}. Any methods your CFC may have had will not get returned.

I can think of a few things he could do. First off - instead of returning a bean, simply return a structure. I've written beans before where all the data was stored in variables.instance. This let me then have a getAll method that would simply return variables.instance.

He could then build into the service layer a getFoo(ID) type service where the CFC would instantiate the bean, but instead of returning it, would return bean.getAll. Back in JavaScript, you would treat the result not like a bean, but a simple structure. 

Another alternative - and I'm not sure I'd recommend this - is to use the This scope. As I said, my beans normally write to variables.instance.X, where X is the property. If your bean instead wrote to the This scope, like this bean:

<code>
&lt;cfcomponent&gt;

&lt;cffunction name="setname" returnType="void" access="public" output="false"&gt;
	&lt;cfargument name="name" type="string" required="true"&gt;
	&lt;cfset this.name = arguments.name&gt;
&lt;/cffunction&gt;

&lt;cffunction name="getname" returnType="string" access="public" output="false"&gt;
	&lt;cfreturn this.name&gt;
&lt;/cffunction&gt;

&lt;/cfcomponent&gt;
</code>

You can actually return this over the wire and automatically have a structure with the right data. You still wouldn't use getName() in JavaScript, but would instead just use the NAME property.