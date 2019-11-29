---
layout: post
title: "Reminder on structs and bracket notation"
date: "2006-07-05T10:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/07/05/Reminder-on-structs-and-bracket-notation
guid: 1374
---

A friend sent in an interesting problem yesterday that had a quick solution:

<blockquote>
Need some help, I'm stuck on parsing this xml string.  Hoping that you might kick me back in right direction. It seems to be getting stuck on new-order-notification with the following error:
 
 Diagnostics: Element NEW is undefined in CHECKOUT.
 
From playing around, I can do a rereplace on the - and get  to work, but that is not really a good solution.  So the 
question is, how can I use XML like the one below.
 
Code:
<cfset CheckOut = xmlParse(GoogleCheckOutFile)>	
 
<cfoutput>
#checkOut.new-order-notification.google-order-number.XMLtext#
</cfoutput>
</blockquote>

One of the nice things about ColdFusion's handling of XML data is that it lets you treat the document as a structure. This makes using XML very easy. However, you have to follow the same rules you would for a "normal" structure, and one of them is that you cannot use dot notation for keys that aren't valid ColdFusion variables.

Note the variable: #checkOut.new-order-notification.google-order-number.XMLtext#

The second and third keys are not valid variables, and therefore ColdFusion throws an error. Luckily this is trivial to get around:

#checkOut["new-order-notification"]["google-order-number"].XMLtext#

By switching to bracket notation, ColdFusion will no longer throw an error.