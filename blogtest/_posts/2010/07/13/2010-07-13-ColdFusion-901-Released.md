---
layout: post
title: "ColdFusion 9.0.1 Released"
date: "2010-07-13T12:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/07/13/ColdFusion-901-Released
guid: 3875
---

The title says it all. You can now download ColdFusion 901 <a href="http://www.adobe.com/go/getcf901">here</a>. Release notes may be read <a href="http://www.adobe.com/support/documentation/en/coldfusion/releasenotes.html ">here</a>. A detailed list of new features may be found <a href="http://www.adobe.com/support/documentation/en/coldfusion/901/cf901features.pdf ">here (PDF)</a>. This is <b>not</b> some small "point" release. In fact, I'm rather surprised by how much Adobe managed to sneak into this without calling it a 9.5 release. Over the next week I'll be discussing 901 in detail, but at a high level, here are some of the updates 901 adds, for free, to your ColdFusion 9 install. (<b>Note - if any of the links don't work - give it a minute.</b>)

<ul>
<li>Amazon S3 support. I shared a <a href="http://www.raymondcamden.com/index.cfm/2010/6/8/ColdFusion-901-Sneak ">video</a> a few weeks back demonstrating this new feature. Basically - S3 is now as easy to use as your local file system.
<li>You can now do "for in" for arrays within loops. 
<li>CFScript support for file uploads.
<li>CFScript support for dbinfo, cfimap, cfpop, cfldap, and cffeed.
<li>Caching updates
<li>IIS7 support
<li>Support for using CFCs out of web root for Ajax. So... I'm not a big fan of this feature. In general I put stuff out of web root on purpose, but if you want to use it, you can. Unfortunately this is only for CF Ajax features like CFDiv, etc. You can't use this with your own AJAX. (I'll be sure to demonstrate this when I do my detailed blog later this week.)
<li>JSON serialization <b>partial</b> fix. Numbers will no longer be converted to floats - but only if positive. So given the number 6, when serialized, you won't end up with 6.0. Unfortunately this only applies to positive numbers.
<li>Enhancements to the UI controls for cfmap and cfgrid. There have also been updates to the Ajax "hooks" for various UI controls.
<li>ORM now supports multiple datasources. As I've said before, in my 10+ years of web development I've known maybe one client who needed multiple datasources, but, for what it's worth, it is now supported.
<li>Speaking of ORM, Adobe worked on the error messages to try to make them friendlier. That was probably my biggest complaint. Sometimes you would get an error stating that "something" was wrong and never get the exact details. I can say that the messages are now a lot clearer. Oh, and speaking of that - the "feature" where persistent CFCs with errors would be ignored is now disabled. (Woot!) Finally, transaction behavour was also updated. See the release notes for details.
<li>Still speaking of ORM - you can now do HQL within the cfquery tag.
<li>You can now pass a structure of values to entityNew. This allows you to create a new entity and seed it with values.
<li>A few updates were done to Excel support. I've yet to play with this - but it's nice to see the feature continue to improve.
<li>On the Flash/AIR/DS side - there were updates to the CF/AIR integration bits, Flash Remoting, and support was added for BlazeDS 4 and LCDS 3. (Blaze and LCDS are one of the things I think far too many CFers don't know enough about.)
<li>Another big woot for me - but Solr integration was dramatically improved. A few months ago I blogged about how badly ColdFusion's implementation of Solr failed to handle binary files. This has been fixed, along with support for previousCriteria and categories. I'll definitely be showing some new examples of this soon. Note that you <b>must</b> reindex your collections.
<li>New system level log files were added for cfhttp, cfftp, web services, portlets, derby, and cffeed. These logs are 'automatic' and provide data about the network calls. Unfortunately the level of detail isn't so great, but it should be improved in the future.
<li>Here is a big one folks may miss. The server monitor now runs as it's own server. Under heavy load conditions, this means the SM may be responsive when your main web server is not. 
<li>You can now specify both a datasource and a username and password in the This scope. Previously you could only specify the dsn.
<li>CFaaS was updated to allow you to get text and images from PDFs.
<li>A whole mess of third party libraries were updated. For the most part you won't need to worry, but you may care that ExtJS is now version 3.1, and Solr was updated to 1.4. Hibernate was also updated to 3.5.1.
<li>A butt load (technical term) of bug fixes! Here is one of my favorites - the methods of a CFC are now sorted when you cfdump it. Makes finding methods a heck of a lot easier!
</ul>

So what about CFBuilder? You may not realize this - but the last point update actually updated your library to add support for 901. If you type in cfquery, then dbtype, the hint will show both query and hql. This support isn't quite 100% though (ormoptions doesn't show up as an argument for cfquery). If you find anything missing, please log a bug report (as I did for the previous) at the <a href="http://cfbugs.adobe.com/bugreport/flexbugui/cfbugtracker/main.html">CFBuilder bug tracker</a>.

As I said, I'm going to be blogging about 901 updates over the next few weeks. I'll be using the prefix "CF901" before these entries in case they begin to annoy the heck out of you. I'll also be updating this server to 901 tonight so if you see any momentary downtime, blame Apple. (Yes, that didn't make sense. Deal with it. :)

<img src="https://static.raymondcamden.com/images/cfjedi/chuck-norris.jpg" />