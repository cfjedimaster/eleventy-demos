---
layout: post
title: "Yellow Shipping CFC"
date: "2007-11-26T22:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/11/26/Yellow-Shipping-CFC
guid: 2496
---

Use <a href="http://www.myyellow.com/dynamic/services/content/index.jsp">Yellow</a> for shipping? I'm working with a client who wants to use Yellow for shipping. They were interested in cutting costs a bit - so I wrote the Yellow integration for free in exchange for being able to open source it. Personally I've never even heard of Yellow before this project, so I don't think many people will use this, but I've attached the CFC I created to this blog entry. No docs or anything fancy like that. The CFC basically just pings their service and parses the response into a simple structure. 

There was one interesting tidbit to this code. When I hit their service I get a nice XML packet back. In some cases the zip you send may not be enough. Their service will respond by asking you to pick a particular city to narrow down the request. What is odd is that their response - in XML - is a set of HTML. For example:

<code>
&lt;INPUT{% raw %}%20TYPE=HIDDEN%{% endraw %}20NAME="shprZipForCities"{% raw %}%20VALUE="05495"%{% endraw %}20&gt;Origin{% raw %}%20City&lt;select%{% endraw %}20name="shprCities"{% raw %}%20size="1"&gt;&lt;option%{% endraw %}20value="ST{% raw %}%20GEORGE"&gt;ST%{% endraw %}20GEORGE&lt;/option&gt;&lt;option%20value="WILLISTON"&gt;WILLISTON&lt;/option&gt;&lt;/select&gt;
</code>

I look for this response and parse out the cities so the error message can be checked. Probably not the most elegant solution, but it works.<p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5Cwww%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fmyyellow%{% endraw %}2Ecfc%2Ezip'>Download attached file.</a></p>