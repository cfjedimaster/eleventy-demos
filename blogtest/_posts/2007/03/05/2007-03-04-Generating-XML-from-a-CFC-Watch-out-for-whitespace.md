---
layout: post
title: "Generating XML from a CFC? Watch out for whitespace"
date: "2007-03-05T06:03:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/03/05/Generating-XML-from-a-CFC-Watch-out-for-whitespace
guid: 1876
---

A friend sent in a question this weekend that confounded him to no end. He was generating some XML but kept getting an error in the browser because of extra white space. He had used cfsetting enablecfoutputonly=true. He had used output=false in the method. But he still had a white space issue. And let's face it - ColdFusion likes whitespace more than Paris Hilton likes publicity.
<!--more-->
Turns out he had simply forgotten one last hole to plug - the cfcomponent tag. It takes an output=true/false attribute to specify if the initialization area should generate output. If that sounded Greek to you - think of it like this. Any line of code (or white space) outside of cffunction tags is run when the CFC is created. So imagine this CFC:

<code>
&lt;cfcomponent displayName="Paris Hilton"&gt;

&lt;cffunction name="getTrashier" returnType="void"&gt;
&lt;!--- code here ---&gt;
&lt;/cffunction&gt;

&lt;/cfcomponent&gt;
</code>

The two blank lines outside of the cffunction tag pair will be part of the output when the CFC is created. To remove it - just add the output tag I mentioned above:

<code>
&lt;cfcomponent displayName="Paris Hilton" output="false"&gt;

&lt;cffunction name="getTrashier" returnType="void"&gt;
&lt;!--- code here ---&gt;
&lt;/cffunction&gt;

&lt;/cfcomponent&gt;
</code>