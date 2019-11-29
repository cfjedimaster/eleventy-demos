---
layout: post
title: "ColdFusion 9's new Application variables"
date: "2009-07-13T11:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/07/13/ColdFusion-9s-new-Application-variables
guid: 3436
---

ColdFusion 9 adds a few new settings options for your Application.cfc file. Some are documented, some are not. You can find the documentation for these variables <a href="http://help.adobe.com/en_US/ColdFusion/9.0/CFMLRef/WSc3ff6d0ea77859461172e0811cbec22c24-750b.html">here</a>. Here is a quick run down of what was added.

<b>Edited: I'm finding more missing keys, so I've updated the article.</b>

<ul>
<li>datasource: Allows you to specify a default datasource for all queries in your application. This one is missing from the list which is a bit surprising, but I'm sure it will be fixed by the doc team. Ben Nadel just <a href="http://www.bennadel.com/index.cfm?dax=blog:1642.view">covered</a> this as did Forta a <a href="http://forta.com/blog/index.cfm/2009/6/20/Look-No-Datasource">few days ago</a>.</li>
<li>ormenabled: A boolean that determines if ORM is turned on for the application.
<li>ormsettings: A structure that specifies <i>how</i> ORM is enabled for the application.
<li>serverSideFormValidation: Allows you to disable server side validation. To be clear, it doesn't mean that it will block all server side validation, but rather, the old school, built in, server side validation based on form field names. I talked about this more <a href="http://www.raymondcamden.com/index.cfm/2009/7/12/My-first-ColdFusion-9-scoop--disable-server-side-validation">last night</a>.</li>
<li>smtpServer: As you know, cfmail tags will default to the server specified in the Administrator unless you override them at the tag level. This new attribute lets you override it at the application level. Unfortunately, it isn't working for me yet. I specified it, then tried to run a mail tag, and was told that I had not specified a mail server at the admin or tag level. I think it is safe to assume this will work though and it's a nice addition.</li> 
<li>timeout: This allows you to set an application-wide value for your request timeout. Previously this would rely on the Admin setting, or the value in cfsetting. Interestigly the docs say this overrides the cfsetting tag. I would think the cfsetting tag would take priority. I did a quick test, and cfsetting <b>did</b> take priority, which is a good thing, even if it's a doc bug.</li>
<li>debugipaddress: Allows you to specify a list of IP addresses to enable debugging. Woot! Now folks on a shared host can enable debugging without needing CF Admin access!</li>
<li>enablerobustexception: Allows you to turn on robust exception handling. Nice... and a bit scary. In general, this should never be enabled on a production server. But if you need it, and again, don't have CF Admin access, this will allow you to enable it for your application.</li>
<li>googlemapkey: Allows you to define a Google Map's API key for all cfmap tags in the application. Useful if you do not want to specify it at the server or page level.
</ul>