---
layout: post
title: "Flex/ColdFusion case sensitivity gotcha"
date: "2007-05-16T10:05:00+06:00"
categories: [coldfusion,flex]
tags: []
banner_image: 
permalink: /2007/05/16/FlexColdFusion-case-sensitivity-gotcha
guid: 2039
---

Yesterday I was helping a ColdFusion user who is just getting into Flex. He kept getting this error:

<code>
[RPC Fault faultString="[MessagingError message='Unknown destination
'Coldfusion'.']" faultCode="InvokeFailed" faultDetail="Couldn't establish a
connection to 'Coldfusion'"]
</code>

This was his first attempt trying to hook Flex 2 into ColdFusion and he wasn't getting anywhere. His code looked ok to me:

<code>
&lt;mx:RemoteObject id="cfService" destination="Coldfusion"
source="flexbtb.cfc.myService" /&gt;
</code>

But then I noticed something. He had "Cold<b>f</b>usion", not "ColdFusion". Turns out the destination value is case sensitive. Just one more example of something us ColdFusion developers have probably gotten a bit lazy with - case sensitivity.