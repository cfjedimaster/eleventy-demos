---
layout: post
title: "Stump the Chump: Rounding Errors in ColdFusion"
date: "2005-12-19T12:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/12/19/Stump-the-Chump-Rounding-Errors-in-ColdFusion
guid: 978
---

David sent in a question that I wasn't able to resolve, so I thought I'd share it with everyone else:

<blockquote>
I'm confused by a odd rounding type error.. and this is really starting to bud me but I can't explain why or how to get round it...

It started whilst trying to get the NumberFormat function to return the correct values for Value Added Tax.  The value output is different depending if the input value has been calculated or has been set in the system.  The input value appears the same - but isn't..

&lt;cfoutput&gt;
&lt;cfset testvalue="34.825"&gt;
&lt;cfset testvaluerounded=NumberFormat(testvalue, "__.__")&gt;

#testvalue# #testvaluerounded#&lt;br /&gt;

&lt;!--- Now the reason we found the problem ---&gt;

&lt;cfset cost="199"&gt;
&lt;cfset vat=(cost * 0.175)&gt;
&lt;cfset vatrounded=NumberFormat(vat, "__.__")&gt;

#vat# #vatrounded#

&lt;/cfoutput&gt;
</blockquote>

So I ran his code and confirmed it. I figured it was probably due to the typeless nature of ColdFusion. I did a quick test and outputted testvalue.getClass() and vat.getClass(). As I expected, testvalue.getClass returned java.lang.String, and bat returned java.lang.Double. Of course, I would have assumed the String would have rounded wrong, not the Double.

So how to fix? I tried this:

&lt;cfset testvalue= 34.825 + 0&gt;

This was enough to make testvaue also return as a Double, but get this - it still rounded the wrong way. I then tried something dumb:

&lt;cfset vat = round(vat*1000)/1000&gt;

Since the vat had numbers out to the thousands place, this should do nothing - and it did nothing. I still had a vat value of 34.825. However - when I next ran the numberFormat, it rounded the same, although still incorrectly.

So - would this a ColdFusion bug? Or just something we have to live with since ColdFusion is typeless? I even tried this:

&lt;cfset vat = round(vat*100)/100&gt;

and it returned the wrong value. The exact same code run on testvalue worked just fine.