---
layout: post
title: "ColdFusion 8 Ajax Security Features"
date: "2007-07-31T16:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/07/31/ColdFusion-8-Ajax-Security-Features
guid: 2239
---

There are some interesting new features in ColdFusion 8 related to security that I thought I'd share. I just discovered them myself (I'm writing one of the Ajax chapters for CFWACK) and I thought I'd share.

<h2>JSON Prefixes</h2>

The first new feature is JSON Prefixes. A JSON prefix is simply a string put in front of your JSON to prevent malicious code from being executed automatically. If you go to your ColdFusion Administrator, you will see a new option under Settings:

Prefix serialized JSON with

This is disabled by default. If you do enable it the default is //, which represents a JavaScript comment. You can also set this security setting directly in your Application.cfc file using two new settings: 

secureJSON<br />
secureJSONPrefix

So for example, I could have this in my Application.cfc:

<code>
&lt;cfset this.secureJSON = "true"&gt;
&lt;cfset this.secureJSONPrefix = "//"&gt;
</code>

Now here is the truly cool part. All JavaScript code that ColdFusion generates will automatically work with these settings and remove the prefix before it works with your JSON. Seems darn easy to use.

Also - you can enable secureJSON at the CFFUNCTION level by adding secureJSON="true" to your method. You cannot, however, set a custom prefix.

<h2>VerifyClient</h2>

Now this is in an interesting one. You can now add verifyClient="true" to a CFFUNCTION, or add &lt;cfset verifyClient()&gt; on top of a CFM page. When used, ColdFusion will look for a special encrypted token sent in by Ajax requests. The docs say that you should <b>only</b> use this option for CFC methods/CFM pages that are called by Ajax requests. You also have to enable client or session management for this to work.

For more information, see page 685 of the ColdFusion 8 Developer's Guide.