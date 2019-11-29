---
layout: post
title: "Ask a Jedi: Variables versus Var in a CFC"
date: "2005-11-25T08:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/11/25/Ask-a-Jedi-Variables-versus-Var-in-a-CFC
guid: 937
---

Nick asks:

<blockquote>
Quick question: is there any difference between using &lt;cfset variables.databasename = "" /&gt; and &lt;cfset var databasename = "" /&gt; in a CFC?
</blockquote>

It makes a big difference. A CFC, like a 'normal' CFM page, has a Variables scope. Inside a CFC, a variable in the Variables scope is accessible anywhere. So, as a typical example, one may use Variables.DSN throughout a CFC to retrieve a datasource variable. Here is some quick pseudo-code showing an example of setting the variable in the init() function then using it later. Again - this is pseudo-code and I haven't had a full cup of coffee yet:

<code>
&lt;cfcomponent&gt;

&lt;cfset variables.dsn = ""&gt;

&lt;cffunction name="init"&gt;
  &lt;cfargument name="dsn" type="string" required="true"&gt;
  
  &lt;cfset variables.dsn = arguments.dsn&gt;

  &lt;cfreturn this&gt;
&lt;/cffunction&gt;

&lt;cffunction name="fixMyXBox"&gt;
  &lt;cfset var q = ""&gt;

  &lt;cfquery name="q" datasource="#variables.dsn#"&gt;
  select .....
  &lt;/cfquery&gt;

  &lt;cfreturn q&gt;
&lt;/cffunction&gt;

&lt;/cfccmponent&gt;
</code>

A var scope variable, however, only exists for the execution of the method. Look in my example above at the fixMyXBox method. That method creates one variable, a query, so I use the var scope to keep it local to the method itself. Once the method ends, q will no longer exist, but variables.dsn will stick around. (To be clear, it will stick around if you are calling more methods in the same instance of the CFC. But I think you get my point.)