---
layout: post
title: "Ask a Jedi: AjaxProxy and Application Scoped CFCs"
date: "2008-01-22T17:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/01/22/Ask-a-Jedi-AjaxProxy-and-Application-Scoped-CFCs
guid: 2609
---

Paul asks:

<blockquote>
<p>
I am working with CF8 and cfajaxproxy.  I have all of my cfc's in the application scope and they all have init functions that take the dsn as parameters. On a form that I have, I am using cfajaxproxy to allow a user to add a value to a 'type' drop down list and the functions to do this are in my cfcs that I put in the application scope with variables.dsn.  

I want to do something like this: <cfajaxproxy cfc="APPLICATION.resourceManager" jsclassname="resourceManagerObj"/> 

This isn't working because the cfajaxproxy call returns an error saying that 'element dsn is undefined in variables'.  

I had to revert using this: <cfajaxproxy cfc="admin.cfc.resourceManager" jsclassname="resourceManagerObj" />
And changed the component to use application.dsn instead of variables.dsn

Is there anyway to tell cfajaxproxy to use the application scope component (tried some things to no avail)?  Or am I going to have to create a interface/facade (cfc that hits the app scope cfc) to do this?   But I'm thinking that even if I do this, I'm going to have to hard code the variables.dsn to be the value of appllication.dsn or just use application.dsn within this new component.
</p>
</blockquote>
<!--more-->
So Paul, you already have the right answer, a proxy CFC. But you do not need to hard code the DSN value at all. Let's look at a real, simple example. First I'll build the main CFC, Paris:

<code>
&lt;cfcomponent&gt;

&lt;cffunction name="init" access="public" returnType="paris" output="false"&gt;
  &lt;cfargument name="dsn" type="string" required="true"&gt;
  &lt;cfset variables.dsn = arguments.dsn&gt;
  &lt;cfreturn this&gt;
&lt;/cffunction&gt;

&lt;cffunction name="getBooks" access="public" returntype="query" output="false"&gt;
  &lt;cfset var q = ""&gt;
  &lt;cfquery name="q" datasource="#variables.dsn#"&gt;
  select id, title
  from books
  &lt;/cfquery&gt;
  &lt;cfreturn q&gt;
&lt;/cffunction&gt;

&lt;/cfcomponent&gt;
</code>

This CFC is then set into the Application scope via onApplicationStart():

<code>
&lt;cfset application.dsn = "tmz"&gt;
&lt;cfset application.paris = createObject("component", "paris").init(application.dsn)&gt;
</code>

So far so good. Now what would the proxy CFC look like? First off it is important where you place the proxy CFC. In order for the Ajax-based controls to use them, they must be under web root. Your main CFCs can be anywhere - but the proxies must be web accessible. Let's build a simple proxy component to integrate with Paris' getBooks() method:

<code>
&lt;cfcomponent output="false"&gt;

&lt;cffunction name="getBooks" access="remote" returnType="query" returnFormat="json" output="false"&gt;
  &lt;cfreturn application.paris.getBooks()&gt;
&lt;/cffunction&gt;

&lt;/cfcomponent&gt;
</code>

Some things to note. The method is marked remote. Without that, I wouldn't be able to run the method even if it was under web root. I also went ahead and supplied a returnFormat. ColdFusion's Ajax controls will do this for me, but it doesn't hurt to specify it here as well. Then I just hit the Application scoped CFC. Note that I'm not worrying about the DSN setting.

I can see one possible thing here that could concern you. Imagine your proxy grows rather large and you have quite a few methods. Now imagine all of a sudden you changed the Application variable "paris" to "parisCFC". All of those methods would then break. You could get around this by adding a utility method:

<code>
&lt;cfcomponent output="false"&gt;

&lt;cffunction name="getBooks" access="remote" returnType="query" returnFormat="json" output="false"&gt;
  &lt;cfreturn getParis().getBooks()&gt;
&lt;/cffunction&gt;

&lt;cffunction name="getParis" access="private" output="false"&gt;
  &lt;cfreturn application.paris&gt;
&lt;/cffunction&gt;

&lt;/cfcomponent&gt;
</code>

In this sample, I added a method named getParis. Any method that needs Paris would simply call that first, and then call the method, as you see in getBooks above. I also marked getParis private since it doesn't make sense to remotely expose that.