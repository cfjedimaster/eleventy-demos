---
layout: post
title: "ColdFusion Quickie: Tell if a file is being run as a custom tag"
date: "2010-12-02T11:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/12/02/ColdFusion-Quickie-Tell-if-a-file-is-being-run-as-a-custom-tag
guid: 4037
---

This just came in via Twitter so I thought I'd share the tip here. @orangeexception asked how you could tell if a file was being run as a custom tag. One quick and dirty way to do this is to just check for the existence of the ThisScope scope:

<p>

<code>
&lt;cfif structKeyExists(variables, "ThisTag")&gt;
custom tag
&lt;cfelse&gt;
not a custom tag
&lt;/cfif&gt;
</code>

<p/>

I've never bothered to do this with a custom tag, but I can see how it could help enforce folks using your tags in the right way.