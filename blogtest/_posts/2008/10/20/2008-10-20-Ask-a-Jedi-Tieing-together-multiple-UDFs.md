---
layout: post
title: "Ask a Jedi: Tieing together multiple UDFs"
date: "2008-10-20T13:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/10/20/Ask-a-Jedi-Tieing-together-multiple-UDFs
guid: 3061
---

Brandon asks:

<blockquote>
<p>
I have a UDF that gets called a few times each page request. I need this UDF to save the results of each request to an array. Then I need it to output that array to another UDF.  Is that possible?
</p>

<p>
Here is an example<br />
<br />
whatever_page.cfm (included on request)<br />
&lt;cfset newButton("first")&gt;<br />
<br />
another_page.cfm (also included on request)<br />
&lt;cfset newButton("nextButton")&gt;
</p>

<p>
So you can see that multiple templates are calling this function.  I would like this function to then store the results somehow so that they can all be output together in a central location.  Is that even possible?
</p>

<p>
This needs to be done because in my app plugins are installed
and try to create buttons.  Then once all the templates call the newButton function, another function retrieves that array (or struct, doesn't matter) and loops over it, creating the dynamic buttons.
</p>
</blockquote>

Is this possible? Of course it. ColdFusion is everything and the kitchen sink! Seriously though - yes, this is possible, and there are a few different ways of doing it. The basic issue is finding a way to store each button so you get it later. As you can probably guess, this involves using one of ColdFusion's built in scopes - but which?
<!--more-->
The Request scope is the best choice for this type of functionality. It will only last for the current request and it provides a simple way for multiple files to share the same data. Here is a simple example:

<code>
&lt;cfscript&gt;
function newButton(b) {
	if(!structKeyExists(request,"buttons")) request.buttons = [];
	arrayAppend(request.buttons, b);
}

function getButtons() {% raw %}{ return request.buttons; }{% endraw %}
&lt;/cfscript&gt;

&lt;cfset newButton("Nuke the Zoo!")&gt;
&lt;cfset newButton("Obama 08!")&gt;
&lt;cfset newButton("Bunnies have 2D8 HP")&gt;
	
&lt;cfdump var="#getButtons()#"&gt;
</code>

This script has 2 UDFs. One for adding a button to an array, and another for returning the array. The second UDF isn't technically needed. I could have just dumped request.buttons. By the same token the first UDF isn't necessary either. But together they provide a nice, abstract way to store and retrieve the data. 

Now you may ask - what would happen if someone else does: request.buttons = "Foo"? That would obviously screw things up pretty bad. In cases where you control the code, as you are here, it isn't such a big deal. If your button display code all of a sudden started breaking because the buttons weren't a proper array, you would have a good idea of what to look for. You mentioned you were building an application with plugins. I'd be willing to bet you will need this functionality in multiple places. Instead of using the root Request scope, it may make sense to work in your own area underneath the request scope. If your app was code named Foo, then perhaps request.foo.buttons would be more sensible. Or request.foo.ui.buttons. You get the idea. You can even abstract this name within another UDF:

<code>
function getStore() {
	if(!structKeyExists(request,"corestore")) request.corestore = {};
	return "corestore";
}

function newButton(b) {
	if(!structKeyExists(request[getStore()],"buttons")) request[getStore()].buttons = [];
	arrayAppend(request[getStore()].buttons, b);
}

function getButtons() {% raw %}{ return request[getStore()].buttons; }{% endraw %}
</code>

This version is like the first one, except that I've added a getStore() UDF to create a root level key for my data. Notice I create the structure if it doesn't exist, and then I return the name. The other UDFs don't' care about this name. They just store what they need to. You could get even fancier of course but hopefully this gives you an idea on how to solve your problem.