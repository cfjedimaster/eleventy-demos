---
layout: post
title: "this.datasource versus this.ormsettings.datasource"
date: "2011-04-21T17:04:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/04/21/thisdatasource-versus-thisormsettingsdatasource
guid: 4202
---

This probably falls into the obvious category, but if you are using ORM and have code that sets the datasource in the ormsettings, it will <b>not</b> apply to basic cfquery calls.

<p>

<code>
//Application.cfc
this.ormEnabled=true;
this.ormSettings.datasource="monkeypower";

//foo.cfc
var q = new com.adobe.coldfusion.query();
q.setSQL("select mediatype from media where media like :search");
var results = q.execute().getResult();

//ERROR!
</code>

<p>

But - if you set this.datasource, it applies to both your cfquery calls as well as your ORM calls.

<p>


<code>
//Application.cfc
this.datasource="monkeypower";
this.ormEnabled=true;

//foo.cfc
var q = new com.adobe.coldfusion.query();
q.setSQL("select mediatype from media where media like :search");
var results = q.execute().getResult();

//HAPPY MONKEYS!!
</code>

<p>

I suppose you could use different values for each, but I'd bet most people are using one DSN and probably still use a few "basic" queries even when making use of ORM.