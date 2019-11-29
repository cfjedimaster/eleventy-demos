---
layout: post
title: "Quick error handling tip for Model-Glue"
date: "2007-01-25T07:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/01/25/Quick-error-handling-tip-for-ModelGlue
guid: 1796
---

Did you know that Model-Glue can run an event when an error occurs? This is a handy way to handle errors and works out of the box. However, this error handling only works if the framework itself can load. For fun, quickly rename your Model-Glue mapping and see what your site does. Most likely you will get a 'naked' error as Model-Glue was never able to load and handle your error. 

<more>

While renaming the mapping isn't something that would normally happen in production, one error I have seen multiple times is a timeout error. On <a href="http://www.riaforge.org">RIAForge</a> for example, if I restart ColdFusion and then hit the site, the first two hits or so will get this error. As we know, Model-Glue loads up a lot of stuff during the first hit, so this isn't too surprising. 

So how would you handle this? Simple - just add the good old &lt;cferror&gt; tag to your Application.cfm file. You won't be able to use any values from Model-Glue (like an email address for the administrator), but you could at least hard code something quick and dirty to handle the error. Here is a quick (and ugly) example:

<code>
&lt;h2&gt;Sorry, an error occurred!&lt;/h2&gt;

&lt;p&gt;
We have top people on it. Really.
&lt;/p&gt;

&lt;cfmail to="ray@camdenfamily.com" from="ray@camdenfamily.com" subject="Error on Site X" type="html"&gt;
&lt;cfdump var="#error#"&gt;
&lt;/cfmail&gt;
</code>