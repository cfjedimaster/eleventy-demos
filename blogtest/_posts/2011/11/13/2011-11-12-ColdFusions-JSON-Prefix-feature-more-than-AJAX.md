---
layout: post
title: "ColdFusion's JSON Prefix feature - more than AJAX"
date: "2011-11-13T10:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/11/13/ColdFusions-JSON-Prefix-feature-more-than-AJAX
guid: 4431
---

That's a pretty poor title, but hopefully things will make more sense when I explain it. Earlier this week I <a href="http://www.raymondcamden.com/index.cfm/2011/11/8/Handling-JSON-with-prefixes-in-jQuery-and-jQueryUI">blogged</a> about JSON prefixes and how you could handle them in jQuery and jQuery UI. While not specifically a ColdFusion topic, it was easy to test since ColdFusion has a feature where it can automatically prefix your JSON strings. This can be done at the server level, application level, and even the method level if you want. So given a CFC that returns some data, if you enable this feature and use the default prefix of //, your JSON may look like this:

<p/>
<!--more-->
<code>
//{% raw %}{"Y":"ray","X":[1,2,3]}{% endraw %}
</code>

<p/>

No big deal. You can easily work around it. But here's what surprised me. I had always assumed this was for Ajax services only. By that I mean, given a CFC that returns data, if this feature is on and I request the CFC with returnformat=json, I'd expect that to be the <b>only</b> place where the prefix is added. Not true! Consider this:

<p/>

<code>
&lt;cfset d = {% raw %}{x=[1,2,3],y="ray"}{% endraw %}&gt;
&lt;cfoutput&gt;#serializejson(d)#&lt;/cfoutput&gt;
</code>

<p/>

In this snippet, which has <i>nothing</i> to do with Ajax, nothing to do with remote CFC calls, the JSON string is <b>also</b> prefixed with //. Admittedly I can't think of many situations where I'm not using JSON for Ajax, but the point is, I did not expect this. Am I alone in this?

<p/>

My recommendation is - you probably want to explicitly <b>disable</b> this feature in your Application.cfc file if you don't want to use it. Anyone who develops open source code or code that a client may put on a shared host will probably want to ensure the feature isn't enabled by accident.