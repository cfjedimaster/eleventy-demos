---
layout: post
title: "Crazy cool Chrome extension (and how to dig into the source)"
date: "2015-04-21T09:40:04+06:00"
categories: [development]
tags: []
banner_image: 
permalink: /2015/04/21/crazy-cool-chrome-extension-and-how-to-dig-into-the-source
guid: 6036
---

I'm learning some interesting stuff at <a href="http://fluentconf.com">FluentConf</a> and I'll talk more about that when the conference wraps, but I want to share something I found yesterday that I thought was really freaking cool. It is a Chrome extension called <a href="https://chrome.google.com/webstore/detail/momentum/laookkfknpbbblfpciffpaejjkokdgca?hl=en">Momentum</a>. Apparently this was all over the place a few weeks ago so I'm late to the party, but it replaces your "New Tab" screen with an absolutely beautiful (and somewhat useful) design:

<!--more-->

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/04/nt1.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/04/nt1.png" alt="nt1" width="800" height="403" class="alignnone size-full wp-image-6037" /></a>

You can customize it a bit, but really, it's just that - a beautiful picture and a greeting. The text, "Patience", comes from the app prompting you the first time you open a a new tab in the morning:

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/04/nt2.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/04/nt2.png" alt="nt2" width="800" height="500" class="alignnone size-full wp-image-6038" /></a>

Which - ok - maybe it is a bit dorky - but I like it. I was also a bit curious about how it worked. Chrome extensions are built with web standards, so I decided to take a quick look at the code.

To find your Chrome extensions, you first need to find where your profile is. Open up <code>chrome://version</code> and you'll see a "Profile Path" folder. Get to that directory and then enter the Extensions folder. Here you'll see this wonderfully helpful list of directories (obviously different for each user):

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/04/shot12.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/04/shot12.png" alt="shot1" width="800" height="161" class="alignnone size-full wp-image-6039" /></a>

Ok, wow, so, now what? Well next go to your Chrome extensions tag (<code>chrome://extensions/</code>), and find the extension. Make note of the ID value:

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/04/shot21.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/04/shot21.png" alt="shot2" width="800" height="578" class="alignnone size-full wp-image-6040" /></a>

You would then enter the directory with the same ID as the extension. At this point, you can dig through the assets and see how they do - well - what they do. 

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/04/shot3.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/04/shot3.png" alt="shot3" width="800" height="474" class="alignnone size-full wp-image-6041" /></a>

What I found out about Momentum is that the background images are stored locally, which makes sense because you could be offline, and they ship quite a few of them. I also took a look at their JavaScript libraries to see how they built it. It is a Backbone app which is cool, but not a framework I'm really interested in anymore. 

The core logic was minified, but that doesn't really slow you down. I opened a new tab, and then opened dev tools. I went to the minified file and clicked Pretty Print:

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/04/shot4.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/04/shot4.png" alt="shot4" width="800" height="404" class="alignnone size-full wp-image-6042" /></a>

Which then gave me nice, readable text:

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/04/shot5.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/04/shot5.png" alt="shot5" width="800" height="275" class="alignnone size-full wp-image-6043" /></a>

I then selected all and copied into an editor so I could go through it in a proper tool. For me, the real interesting tidbit I found was how they handle weather. They use <a href="https://developer.yahoo.com/yql">YQL</a>, a Yahoo API I've blogged about before, but I really don't see many people using. It is a <i>very</i> cool API so I'm happy to see it in action. If your curious how they use it, this is the block that grabs your current weather:

<pre><code class="language-javascript">function n(e) {
    var t = "https://query.yahooapis.com/v1/public/yql?q=" + encodeURIComponent("select * from weather.forecast where woeid=" + e + ' and u="' + s.model.get("unit") + '"') + "&format=json&callback=?";
    $.getJSON(t, function(e) {
        if (e && e.query && 1 == e.query.count) {
            var t = e.query.results.channel.item.condition;
            t && s.model.save({% raw %}{temperature: t.temp,code: t.code,condition: t.text,updated: new Date}{% endraw %})
        } else
            console.log("Error getting weather data: Result count not equal to one")
    }).error(function(e) {
        console.log("Error getting weather data: " + e)
    })
}</code></pre>

Yes - the YQL API is SQL like for data. Very cool stuff. Anyway, check out the extension, and don't forget you can dig into the code and learn from them as well!