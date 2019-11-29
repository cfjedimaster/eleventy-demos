---
layout: post
title: "ColdFusion UPS Package Updated"
date: "2006-12-23T17:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/12/23/ColdFusion-UPS-Package-Updated
guid: 1734
---

I've updated my <a href="http://cfups.riaforge.org/">ColdFusion UPS Package</a> code today to include the first draft of a service that will return shipping rates. This is not yet feature complete, but for basic (I have a 10 pound package) tasks, it will tell you the rates for various services.

The API is rather complex, so I built an API to return structs of package information in the form the rate information API desires. So this code, for examples, will get rate information on shipping two packages:

<code>
&lt;cfset packages = arrayNew(1)&gt;
&lt;cfset arrayAppend(packages, st.getPackageStruct(weight=40,width=20,length=40,height=10,packagetype="02"))&gt;
&lt;cfset arrayAppend(packages, st.getPackageStruct(weight=10,width=20,length=40,height=10,packagetype="03"))&gt;

&lt;cfset rates = st.getRateInformation(shipperpostalcode=70508,packages=packages,shiptopostalcode=90210)&gt;
</code>

There are a few other APIs to help translate UPS codes and package types.