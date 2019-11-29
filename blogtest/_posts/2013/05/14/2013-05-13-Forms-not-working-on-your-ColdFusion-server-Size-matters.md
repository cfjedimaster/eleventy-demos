---
layout: post
title: "Forms not working on your ColdFusion server? Size matters."
date: "2013-05-14T10:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2013/05/14/Forms-not-working-on-your-ColdFusion-server-Size-matters
guid: 4933
---

I've come across multiple people lately who have been bitten by this so I thought a quick blog post would be useful for my readers. If you've recently upgraded your ColdFusion server or patched it, you may find some forms return an error when submitted. Here is an example:
<!--more-->
<img src="https://static.raymondcamden.com/images/Screenshot_5_14_13_9_08_AM.png" />

To cause this error, I simply created a form with 101 fields like so:

<script src="https://gist.github.com/cfjedimaster/5576199.js"></script>

If you modify the loop to go to 100 instead of 101, it works fine. People using ColdFusion 10 or a recently patched ColdFusion 9 will encounter this.

The cause is a recent security fix. You can read the details here (<a href="http://www.infosecurity-magazine.com/view/24510/adobe-ships-patch-for-coldfusion-flaw-that-could-lead-to-dos-attacks/">Adobe ships patch for ColdFusion flaw that could lead to DoS attacks</a>), but most likely you are only concerned about how to get around this.

In the ColdFusion 10 Administrator, under Settings, way at the bottom, you will find this new setting:

<img src="https://static.raymondcamden.com/images/rayScreenshot_5_14_13_9_12_AM.png" />

You can tweak this to a value that makes sense for your form. For folks using ColdFusion 8 and 9, you have to edit a bit of XML to handle this. Details may be found here: <a href="http://helpx.adobe.com/coldfusion/kb/coldfusion-security-hotfix.html">ColdFusion Security Hotfix APSB12-06</a>.

<b>Edit:</b><br/>
A few minutes after I posted this blog post I tried a quick experiment. In ColdFusion 10, you can finally now take form fields of the same name and use this as an array. If you add this.sameformfieldsasarray = "true"; to your Application.cfc and post 2 form fields with the same name, their value in the form scope will be an array. I recommend this setting in general as a list (the normal behavior) cannot be reliably decoded. Turns out, if you use the same field name, you can post any number of form fields you want. I tried with 200, no problem. If you also do the sameformfield thingy, the values work just fine.