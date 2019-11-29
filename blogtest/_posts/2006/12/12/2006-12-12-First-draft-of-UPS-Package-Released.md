---
layout: post
title: "First draft of UPS Package Released"
date: "2006-12-12T12:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/12/12/First-draft-of-UPS-Package-Released
guid: 1707
---

Yesterday I <a href="http://ray.camdenfamily.com/index.cfm/2006/12/11/What-can-Brown-do-for-me-How-about-a-provide-an-easy-to-use-service">complained</a> about how much of a pain it was to get access to UPS's API service. Once I did get in - the docs weren't terribly helpful either. I was able to eventually find what I needed though early this morning. With that I'm happy to announce the initial release of the UPS Package (get it, UPS Package! I kill me). 

Right now there are no docs and the only service I support is Address Verification. Obviously I will add to this. In order to use the code though you will need to go through the painful <a href="http://ray.camdenfamily.com/index.cfm/2006/12/11/What-can-Brown-do-for-me-How-about-a-provide-an-easy-to-use-service">process</a> I had to go through. I can say that once you do get your XML key and login info, it should work pretty easily. Here is a simple example:

<code>
&lt;cfset av = createObject("component", "org.camden.ups.addressverification").init(application.key, application.username, application.password)&gt;

&lt;cfset results = av.addressVerification(city="Lafayette", state="LA",postalcode="70508")&gt;
&lt;cfdump var="#results#"&gt;
</code>

By the way - the UPS documentation had a wonderful little gem about displaying a disclaimer in your code "from time to time". I kid you not. They want you to do it every now and then. Ahem. Well, I added a getDisclaimer() service to the CFC. Use it - um - from time to time.

You can download the zip by clicking Download below. As I said, you <b>must</b> have your own login and key. The avtest1.cfm file is <b>not</b> going to run out of the box until you set up the right application variables.<p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Cwebsites{% raw %}%5Cdev%{% endraw %}2Ecamdenfamily{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fups%{% endraw %}2Ezip'>Download attached file.</a></p>