---
layout: post
title: "ColdFusion 9 ORM does not respect security settings on the DSN"
date: "2009-10-07T11:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/10/07/ColdFusion-9-ORM-does-not-respect-security-settings-on-the-DSN
guid: 3555
---

Now <i>this</i> this is surprising. During my first presentation on ColdFusion 9 and ORM, I was asked about security permissions on DSNs and how they impact ORM. So for example, if you go into the Advanced Settings of a DSN and only allow certain operations (Select, Update, etc), will that impact ORM? I told the attendee that I honestly wasn't sure, but that I'd assume it would. 

Turns out I was completely wrong. I edited one of my examples so that only SELECT operations were allowed. But this had no impact on the ORM operations I was allowed to do. I could still update, delete, and insert. 

As I said - surprising - but I'm guessing that the DSN security operations must be something that ORM just doesn't go through.