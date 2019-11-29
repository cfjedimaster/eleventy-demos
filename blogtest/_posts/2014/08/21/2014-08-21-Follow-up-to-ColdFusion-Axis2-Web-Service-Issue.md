---
layout: post
title: "Follow up to ColdFusion Axis2 Web Service Issue"
date: "2014-08-21T11:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2014/08/21/Follow-up-to-ColdFusion-Axis2-Web-Service-Issue
guid: 5291
---

<p>
Last month I <a href="http://www.raymondcamden.com/2014/7/10/Unexpected-behavior-with-Axis2-web-services-in-ColdFusion">blogged</a> about an odd issue with Axis2 web services. Basically, the CFC was persisting past the initial hit. Normally CFCs are recreated on every request. This didn't seem to be the case with Axis2 web services.
</p>
<!--more-->
<p>
I filed a <a href="https://bugbase.adobe.com/index.cfm?event=bug&id=3787631">bug report</a> for the issue and today I got a response from an engineer:
</p>

<blockquote>
This is a change in behavior in how we designed the Axis 2 web services support.
<p/>
In Axis 1, For every web service request we created a new CFC instance and the request was handled by this new instance. That is why the variables always gets re initialized for every request.
<p/>
In Axis 2, we are creating the CFC instance the first time only. For every subsequent requests the same instance is used. So you are seeing the caching there. A new CFC instance will be created only if service CFC is modified.
<p/>
Normally if you are deploying an axis2 based aar, in tomcat, you will see the same behavior.
<p/>
This was a design decision we took. Are you facing any issues because of this caching? Do you have a requirement to use different CFC instances for each web service request? 
</blockquote>

<p>
So, long story short, this is expected. I want to be clear so people understand the issue. This is <strong>not</strong> like trusted cache, where changing the code doesn't reflect on the server. This is <strong>not</strong> like the case where you change a method and have to tell CF to refresh the WSDL. No, this is data persistence, as my example demonstrates. In <i>every</i> other case of using a CFC - either via Ajax or WSDL - this is not how CFCs act. 
</p>

<p>
So... um... yeah. I guess watch out for it. Or take the advice I gave on the last blog entry and avoid WSDL like the plague on humanity it is. If you feel like this was a bad design by the ColdFusion engineers, please post your thoughts on the bug entry, not here. (Or both - just keep in mind I've got no power to change things there. ;)
</p>