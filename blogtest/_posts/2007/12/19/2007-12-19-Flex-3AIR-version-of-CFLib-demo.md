---
layout: post
title: "Flex 3/AIR version of CFLib demo"
date: "2007-12-19T16:12:00+06:00"
categories: [flex]
tags: []
banner_image: 
permalink: /2007/12/19/Flex-3AIR-version-of-CFLib-demo
guid: 2551
---

Yesterday I <a href="http://www.raymondcamden.com/index.cfm/2007/12/18/CFLib-gets-a-dose-of-fresh-air">released</a> an AIR application that lets you browser <a href="http://www.cflib.org">CFLib.org</a> from your desktop. This application didn't take terribly long - except for some issues I ran into with the new security model.

Today I thought I'd try it with Flex. I'm a bit rusty with Flex but I figured it couldn't be too hard. Turns out I was right. With some help from <a href="http://www.boyzoid.com/blog/index.cfm">Scott Stroz</a> and <a href="http://blog.simb.net/">Simeon Bateman</a>, I was able to crank out the application in a lunch break. 

The only part that confused me was - how do I use RemoteObject to talk to a CFC on another server, which AIR allows? Turns out you just need to get a copy of CF's services-config.xml file. I placed it in my Flex app and added this to my compile args:

-services libs/services-config.xml

Next, I edited the file to change 

<code>
&lt;endpoint uri="http://{% raw %}{server.name}{% endraw %}:{% raw %}{server.port}{% endraw %}{% raw %}{context.root}{% endraw %}/flex2gateway/" class="flex.messaging.endpoints.AMFEndpoint"/&gt;
</code>

to

<code>
&lt;endpoint uri="http://www.cflib.org:80/flex2gateway/" class="flex.messaging.endpoints.AMFEndpoint"/&gt;
</code>

That's it. I guess it really isn't much of an AIR app. It doesn't detect online/offline. But I find it cool that it took me 1/5th the time and came out ten times prettier. I've included the AIR app as a download. I renamed it to cflib.zip as I'm too lazy to mess with IIS settings. Rename it and run. If you ran the demo from yesterday, the installer will complain that an application with the same name exists. Either uninstall the other one or supply a custom install location.

Also - I used Flex Builder's Include Source option so you can see my ugly MXML code. Awesome.<p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5Cwww%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2FCFLib%{% endraw %}2Eair%2Ezip'>Download attached file.</a></p>