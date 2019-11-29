---
layout: post
title: "The Wisdom of Chuck"
date: "2007-11-30T15:11:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2007/11/30/The-Wisdom-of-Chuck
guid: 2508
---

A little while ago Andrew Powell of Universal Mind released the <a href="http://www.infoaccelerator.net/chuckFacts/">Chuck Norris Fact Web Service</a>. This is a critical feature that has been missing from the Internet for some time. Frankly, I do not know how we have survived without the wisdom of Chuck Norris.

I whipped up a quick AIR application that you can run on your desktop. Every 5 seconds it will load a new pearl of wisdom from the man we know as Chuck. Please note that I'm <i>way</i> rusty with Adobe AIR. I haven't had the chance to play with it much lately, but dang it - I love that I was able to write this up in like 5 minutes. I spent more time making some dumb mistakes in Spry then I did on the "AIR-ness" of it. Enjoy. (As I still haven't updated IIS to let .air files worked, I renamed to a .zip.)

The entire code (minus Spry libraries) is below:
<!--more-->
<code>
&lt;html&gt;

&lt;head&gt;
&lt;script type="text/javascript" src="AIRAliases.js"&gt;&lt;/script&gt;
&lt;script type="text/javascript" src="spryjs/xpath.js"&gt;&lt;/script&gt;
&lt;script type="text/javascript" src="spryjs/SpryData.js"&gt;&lt;/script&gt;

&lt;script type="text/javascript"&gt;
var myurl = "http://www.infoaccelerator.net/chuckFacts/FactService.cfc?method=getCurrentFact&returnformat=plain";

function callHandler(req){
	var result = req.xhRequest.responseText;
	var sp = Spry.$("wisdom");
	sp.innerText = result;
}

function getWisdom(){
	Spry.Utils.loadURL("GET", myurl, true, callHandler);
}

function doLoad(){	
	getWisdom();
	setInterval(getWisdom, 5000);
}
&lt;/script&gt;
&lt;style&gt;
.wisdom {
	font-family: times;
	font-style: italic;	
}
&lt;/style&gt;
&lt;/head&gt;

&lt;body onload="doLoad();"&gt;
&lt;h3&gt;The Wisdom of Chuck Norris&lt;/h3&gt;
&lt;span id="wisdom" class="wisdom"&gt;&lt;/span&gt;
&lt;/body&gt;
&lt;/html&gt;
</code><p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5Cwww%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2FChuckNorris%{% endraw %}2Eair%2Ezip'>Download attached file.</a></p>