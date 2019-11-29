---
layout: post
title: "Ask a Jedi: Problem using onMissingMethod inside a CFC"
date: "2008-06-13T11:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/06/13/Ask-a-Jedi-Problem-using-onMissingMethod-inside-a-CFC
guid: 2881
---

Matthew writes in with an interesting problem:

<blockquote>
<p>
I'm using a onMissingMethod() to generate all my
get/set methods I need, and I have an init() method in my cfc that calls a setDsn(arguments.dsn) and when I run it, it says setDsn() variable is undefined. Now if I change it to this.setDsn(arguments.dsn)  then it works, and the
onMissingMethod() is fired.
</p>
</blockquote>
<!--more-->
Good question. The reason why it didn't work for you, and it worked when you used this.setDSN, is that onMissingMethod only works for <i>outside</i> calls (and remember this.X() acts like an outside call, which is why we don't recommend using that format). It's almost like ColdFusion says to itself "I'm not going to run onMissingMethod for internal calls because there is no way you are that stupid."

To test this yourself, create a quick and dirty CFC with onMissingMethod support:

<code>
&lt;cfcomponent output="false"&gt;


&lt;cffunction name="wrong"&gt;
	&lt;cfreturn doItFunk(1,2,3)&gt;
&lt;/cffunction&gt;

&lt;cffunction name="onMissingMethod" output="false"&gt;
	&lt;cfargument name="missingMethodName" type="string"&gt;
	&lt;cfargument name="missingMethodArguments" type="struct"&gt;
	&lt;cfreturn arguments&gt;
&lt;/cffunction&gt;
&lt;/cfcomponent&gt;
</code>

Now run this from a CFM:

<code>
&lt;cfset test = createObject("component","test")&gt;

&lt;cfset res = test.doItFunky(1,2,3)&gt;
&lt;cfdump var="#res#"&gt;

&lt;cfset res = test.doItFunk(name="paris",age=35,style="funky")&gt;
&lt;cfdump var="#res#"&gt;

&lt;cfset res = test.wrong()&gt;
&lt;cfdump var="#res#"&gt;
</code>

The first two calls work just fine, but the third one will give you a method not found error.

So taking Matthew's specific example - he has a generic bean and wants to init some values, but he can't rely on onMissingMethod. Well the simplest thing to do is just directly set the value. If you are using a structure like variables.instance for your bean data, your init can just do:

<code>
&lt;cfset variables.instance.dsn = "paris"&gt;
</code>

In all things remember the KISS rule! But if you want to get fancy, your onMissingMethod could chain to generic get/set methods. Consider:

<code>
&lt;cffunction name="get" access="private" output="false" returnType="any"&gt;
	&lt;cfargument name="prop" type="string" required="true"&gt;
	&lt;cfreturn variables.instance[arguments.prop]&gt;
&lt;/cffunction&gt;

&lt;cffunction name="set" access="private" output="false" returnType="void"&gt;
	&lt;cfargument name="prop" type="string" required="true"&gt;
	&lt;cfargument name="value" type="any" required="true"&gt;
	&lt;cfset variables.instance[arguments.prop] = arguments.value&gt; 
&lt;/cffunction&gt;

&lt;cffunction name="onMissingMethod" output="false"&gt;
	&lt;cfargument name="missingMethodName" type="string"&gt;
	&lt;cfargument name="missingMethodArguments" type="struct"&gt;
	
	&lt;cfset var property = ""&gt;
	&lt;cfset var value = ""&gt;
	
	&lt;cfif findNoCase("get",arguments.missingMethodName) is 1&gt;
		&lt;cfset property = replaceNoCase(arguments.missingMethodName,"get","")&gt;
		&lt;cfreturn get(property)&gt;
	&lt;cfelseif findNoCase("set",arguments.missingMethodName) is 1&gt;
		&lt;cfset property = replaceNoCase(arguments.missingMethodName,"set","")&gt;
		&lt;!--- assume only arg is value ---&gt;
		&lt;cfset value = arguments.missingMethodArguments[listFirst(structKeyList(arguments.missingMethodArguments))]&gt;
		&lt;cfset set(property,value)&gt;
	&lt;/cfif&gt;
	
&lt;/cffunction&gt;
</code>

All the onMissingMethod does is figure out if you are getting or setting, gets the values, and then runs the private methods. What's nice then is that your init() function can use the same code:

<code>
&lt;cffunction name="init" access="public" output="false" returnType="any"&gt;
	&lt;cfset set("name","Nameless")&gt;
	&lt;cfreturn this&gt;
&lt;/cffunction&gt;
</code>

I'll leave this blog entry with a quick reminder to remember that you <b>must</b> use the right argument names with onMissingMethod. See this blog post for more information: <a href="http://www.raymondcamden.com/index.cfm/2007/8/5/Warning-about-onMissingMethod">Warning about onMissingMethod</a>