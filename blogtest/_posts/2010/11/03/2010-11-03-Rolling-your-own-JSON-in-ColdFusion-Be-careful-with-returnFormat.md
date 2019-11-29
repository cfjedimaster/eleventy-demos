---
layout: post
title: "Rolling your own JSON in ColdFusion? Be careful with returnFormat"
date: "2010-11-03T19:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/11/03/Rolling-your-own-JSON-in-ColdFusion-Be-careful-with-returnFormat
guid: 3999
---

Earlier today I <a href="http://www.raymondcamden.com/index.cfm/2010/11/3/Best-JSON-option-for-folks-not-running-ColdFusion-9">blogged</a> about rolling your own JSON solutions for ColdFusion. This mainly applied to folks running something less than ColdFusion 901 with the last hot fix. The original reader who requested the help had no problems using the <a href="http://jsonutil.riaforge.org/">jsonutil</a> open source project, but ran into a problem as soon as he tried to combine it with ColdFuion's built in Ajax utilities. For example, this is a simple bound drop down he tried to use:
<!--more-->
<p>

<code>
&lt;cfselect name="sel_store" bind="cfc:projects.test.cfjsonutil.data.getStores()" bindonload="true" display="STORENUMBER" value="STORENUMBER" /&gt;
</code>

<p>

His CFC was using jsontil and returning a JSON string. Upon running his application he got an error: <b> Bind failed for select box sel_store, bind value is not a 2D array or valid serialized query. </b>

<p>

So what went wrong? This is a case where even something like Firebug may not help if you don't pay careful attention. When you use ColdFusion's built in Ajax controls with bindings, it automatically converts the bind into a URL request. That request appends returnFormat=json. This tells ColdFusion that it should JSON-ify the result. But - his result was already JSON. So what you end up with is a JSON representation of a JSON string. Not good. 

<p>

Luckily the fix is easy enough. Don't forget you can use "url" as a bound value as well. This allows you to point to any URL on your server. You can then point to the CFC and include method=getstores to tell ColdFusion to run that particular method. The critical part, though, is to also add: returnFormat=plain. This tells ColdFusion to <b>not</b> muck with the response and just leave it as is.