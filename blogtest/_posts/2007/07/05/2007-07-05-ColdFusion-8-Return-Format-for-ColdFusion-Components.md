---
layout: post
title: "ColdFusion 8 - Return Format for ColdFusion Components"
date: "2007-07-05T23:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/07/05/ColdFusion-8-Return-Format-for-ColdFusion-Components
guid: 2173
---

One of the lesser publicized updates in ColdFusion 8 is the introduction of the returnFormat attribute for the cffunction tag. What does this do? ColdFusion Components, when executed remotely, will return data wrapped in WDDX format. This is a problem if you want to use the result in AJAX or some other non-WDDX form. ColdFusion 7 fixed this partially by making any function that had a returnType of XML return it's data unformatted. 

ColdFusion 8 takes this further and allows you to explicitly state how the result data should be returned. You can specify:

<ul>
<li>WDDX
<li>JSON
<li>plain
</ul>

As you can probably guess, the "plain" format will do nothing to your result at all. This will only work if your data is a simple value. There is no such thing as a "plain" result for arrays. 

What's interesting is that you can set the returnformat on the fly when you make a request. Imagine that you've requested:

http://localhost/foo.cfc?method=transform

The default behavior will be the same as what you saw in ColdFusion 7. If the returntype isn't XML, you get WDDX. But now you can change this with the request:

http://localhost/foo.cfc?method=transform&returnFormat=JSON

This will return the same data, but encoded in JSON instead of WDDX. This URL, 

http://localhost/foo.cfc?method=transform&returnFormat=plain

Will return the data as is - not encoded at all. An interesting use of this would be a service that lets you embed an ad or other "widget". I could build a "Ray's Daily Tip" service that could be embeddable with a CFHTTP call.