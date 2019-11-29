---
layout: post
title: "ORMScanner CFBuilder Extension"
date: "2010-03-24T09:03:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/03/24/ORMScanner-CFBuilder-Extension
guid: 3762
---

I've been doing a lot with ColdFusion 9 and ORM lately and I've run into an interesting little problem. Look at the code block below and see if you can find the error(s):
<!--more-->
<p/>

<code>
component persistent="true" table="ARTISTS" {
    property name="id" fieldtype="id";
    property name="firstname" dbtype="string";
    property name="lastname" dbtype="string";
    property name="address" sqltype="string";
    property name="city" sqltype="string";
    property name="state" sqltpye="string";
}
</code>

<p/>

There are three things wrong with this code, but CFBuilder will not flag any of them. Nor will ColdFusion complain when you use the entity. So what's wrong? 

<p/>

cfproperty (along with a few other tags) are "magic" within ColdFusion. By magic I mean that they allow you to pass any and all arguments. I could have easily used ray="fat" to the cfproperty tags and it would compile just as nicely. Normally this isn't such a big deal, but ORM adds something like <b>50(!!)</b> new arguments that have special meaning to cfproperty. With so many new arguments it is easy to make a mistake. 

<p/>

The first thing I did wrong above was to use dbtype. ORM lets you specify either a generic database type (ormtype), or a specific type. When I began writing the code above I thought the specific argument was dbtype. But in reality, it is sqltype. My code wouldn't throw an error, and since I was using the default anyway it wouldn't be a huge big deal, but as you can guess, such a mistake could end up with unexpected results.

<p/>

The second issue is more subtle. Notice the typo? I said sqltpye instead of sqltype. Again - this is <b>not</b> something that would throw an error in ColdFusion or be flagged in CFBuilder. So what I did was to create a new extension called ORM Scanner. ORM Scanner will scan all your ORM entities and compare the arguments to your cfproperty tags against the ginormous (that's a technical term) of "accepted" ORM attributes. Given the CFC above, here is the result.

<p/>

<img src="https://static.raymondcamden.com/images/Screen shot 2010-03-24 at 7.54.32 AM.png" title="ORM Scanner Result" />

<p/>

Is this useful? I've attached the extension below. I'll be posting it to RIAForge a bit later today.<p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2009%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2FORM%{% endraw %}20Scanner%2Ezip'>Download attached file.</a></p>