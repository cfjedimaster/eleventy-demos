---
layout: post
title: "Ask a Jedi: Var Scoping Queries"
date: "2006-01-19T09:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/01/19/Ask-a-Jedi-Var-Scoping-Queries
guid: 1039
---

Brian asks:

<blockquote>
Your rantings about var scoping CFC function variables has really made me look closely to how I code. If I var scope the name of a query before querying a datasource, will that query object become local to the function as well?
</blockquote>

Rant? Me? Ok - so maybe I go a bit off the deep end at times with var scoping. The main reason is that it makes stuff very hard to debug if something goes wrong. But to answer your question, yes, if you var scope the name of the query before you use it, it will keep the query local to the function. This is how I do it normally:

<code>
&lt;cffunction name="foo" returnType='query" output="false" access="public"&gt;
    &lt;cfset var q = ""&gt;

    &lt;cfquery name="q" datasource="kingsweallare"&gt;
    select name from goo
    &lt;/cfquery&gt;

    &lt;cfreturn q&gt;
&lt;/cffunction&gt;
</code>

Notice that I did not define q as a query. Since CF is typeless, this is perfectly fine.