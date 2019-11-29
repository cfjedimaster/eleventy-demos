---
layout: post
title: "Ask a Jedi: CFC Scope Question"
date: "2008-03-18T13:03:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/03/18/Ask-a-Jedi-CFC-Scope-Question
guid: 2713
---

Jason asks:

<blockquote>
<p>
I know it is important to ALWAYS var scope your variables in your CFCs my question is, is there a difference between these two cfset statements?

&lt;cfset var myVar = "" /&gt;<br/>
<br/>
&lt;cfset variables.myVar = "" /&gt;
</p>
</blockquote>

It is indeed very important, and there is a world of difference between those two lines of code. I cover this more in my <a href="http://www.raymondcamden.com/enclosures/cfcscopes.pdf">CFC Scope Reference</a>, but the basic difference is that your first line of code creates a variable that will only exist for the execution of the method. You use this for any variable you create in the method, and be sure to not forget things like loop counters, query names, etc.

The second line creates a <i>global</i> variable the CFC. Anything in the variables scope is available to every method of the CFC. I'll typically use the variables scope for configuration information, like a DSN, so all my queries will use datasource="#variables.dsn#". You would definitely <b>not</b> want to use it for things you intend to just be in the local method.