---
layout: post
title: "ColdFusion 8.0.1 adds pizazz to implicit array/struct creation"
date: "2008-04-04T01:04:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/04/04/ColdFusion-801-adds-pizazz-to-implicit-arraystruct-creation
guid: 2751
---

One of my favorite features in ColdFusion 8 is the ability to create and populate structs and arrays in one line of code:

<code>
&lt;cfset a = ["paris","britney","lindsey"]&gt;
&lt;cfset s = {% raw %}{name="Raymond",age="Almost 35",weight="204"}{% endraw %}&gt;
</code>

This is <i>so</i> darn useful I can't imagine life without it. 

ColdFusion 8.0.1 makes this even better by letting you nest these implicit creations:

<code>
&lt;cfset s = {% raw %}{name="Raymond",age="Almost 35",weight="204",kids=["Jacob","Lynn","Noah"]}{% endraw %}&gt;
&lt;cfdump var="#s#"&gt;	
</code>

Which results in:

<img src="https://static.raymondcamden.com/images/Picture 111.png">

Now obviously you don't want to go crazy with this. You still want to keep things readable!

(Sorry for all the blog entries. I can't sleep and I figured I'd share some of my favorite parts of 8.0.1.)