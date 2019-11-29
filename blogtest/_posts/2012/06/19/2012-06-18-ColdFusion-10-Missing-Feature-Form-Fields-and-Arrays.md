---
layout: post
title: "ColdFusion 10 Missing Feature - Form Fields and Arrays"
date: "2012-06-19T08:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2012/06/19/ColdFusion-10-Missing-Feature-Form-Fields-and-Arrays
guid: 4651
---

Here is a feature that was missed from the docs that I think folks will be happy about. Credit for this find goes to Joe Zack and I'd like to thank Adam Cameron for bringing it to my attention. (And the proper people have been notified about the doc issue so hopefully the online versions will be updated soon to reflect this.) When posting form fields to a ColdFusion page, any form field with the same name will have its values combined into one variable. So consider the following simple script:

<script src="https://gist.github.com/2953727.js?file=gistfile1.cfm"></script>

Given input of Ray and Camden, you will get a form variable called NAME with a value of Ray,Camden:

<img src="https://static.raymondcamden.com/images/screenshot4.png" />

That's all well and good and ColdFusion makes it easy to parse that into separate values with list functions, but what happens when you enter "Camden,Ray" and "Foo"?

<img src="https://static.raymondcamden.com/images/screenshot5.png" />

At this point, it is impossible to tell what the user really entered. Maybe they had "Camden" as the first value. Maybe it was "Camden,Ray". There is no way to properly tell what was put in each field.

Now - to me - the best fix is to simply use unique form field names. But we don't always have control over that. There is a <a href="http://www.raymondcamden.com/index.cfm/2010/3/31/Processing-forms-with-duplicate-field-names">work around</a> you can use, but it would be nice if it was built in. 

Turns out - ColdFusion 10 has a feature just for this. Simply by adding one setting to your Application.cfc file, you can convert these values into arrays automatically:

<script src="https://gist.github.com/2953756.js?file=Application.cfc"></script>

The new setting, sameformfieldsasarray, will enable this feature and generate the array on submission:

<img src="https://static.raymondcamden.com/images/screenshot6.png" />

It looks like Scott Stroz actually <a href="http://www.boyzoid.com/blog/index.cfm/2012/2/26/ColdFusion-10--Form-Fields-With-the-Same-Name">blogged</a> this way back in February and I (and probably many others) completely forgot it!

There is one small caveat that may or may not matter to you. What do you think happens if you leave the first field empty and enter a second item? You get an array of one item. Now - that may be fine for your needs. But if you really want to know that the first field was blank, you would need to check with getHTTPRequestData as mentioned in my <a href="http://www.raymondcamden.com/index.cfm/2010/3/31/Processing-forms-with-duplicate-field-names">earlier fix</a>.