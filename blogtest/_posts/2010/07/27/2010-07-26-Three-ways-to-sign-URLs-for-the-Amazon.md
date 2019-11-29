---
layout: post
title: "Three ways to sign URLs for Amazon Web Services"
date: "2010-07-27T10:07:00+06:00"
categories: [coldfusion,flex]
tags: []
banner_image: 
permalink: /2010/07/27/Three-ways-to-sign-URLs-for-the-Amazon
guid: 3889
---

Last week I was doing some experiments with the <a href="http://aws.amazon.com/">Amazon web service API.</a> For the most part it is pretty self explanatory. The part that was difficult was figuring out how to construct the URL so it can authenticate with Amazon. In researching this issue I found three different solutions. I'm writing them down here mainly for my own needs so I can find it later.

<p>

<b>Flex/Flash/AIR apps:</b> You can use the ActionScript code here: <a href="http://www.brendonwilson.com/blog/2009/07/31/signing-amazon-web-service-requests-in-actionscript/">Signing Amazon Web Service Requests in ActionScript</a>

<p>

<b>JavaScript apps:</b> Technically this isn't a library, but Amazon has an online URL signer here: <a href="http://associates-amazon.s3.amazonaws.com/signed-requests/helper/index.html">Signed Requests Helper</a>. You can view source to see the JavaScript used. I'm not sure you would ever use this in production as it implies putting your access keys in the view source, but it's another option.

<p>

<b>ColdFusion apps:</b> I used the <a href="http://amazonsig.riaforge.org/">Amazon Product Advertising API Signature Generator </a> from Tim Dawe and it worked very easily. You provide the "base" URL and the CFC will handle returning the URL with all the extra crap at the end. So for example:

<p>

<code>
&lt;cfset accesskey = "key here"&gt;
&lt;cfset secretkey = "secret key here"&gt;

&lt;cfset theurl = "http://ecs.amazonaws.com/onca/xml?Service=AWSECommerceService&Operation=ItemSearch&SearchIndex=Music&Keywords=Depeche+Mode+Violator&ResponseGroup=Images&AWSAccessKeyId=#accesskey#"&gt;
&lt;cfset theurl = signRequest(theurl, secretkey)&gt;
&lt;cfhttp url="#theurl#"&gt;
</code>

<p>

In case you are curious, that code above did an image search on the Depeche Mode Violator album which returned the CD cover. Pretty cool (and yes, it's what I was originally trying to do).

<p>

<img src="https://static.raymondcamden.com/images/31773C0MTBL.jpg" />