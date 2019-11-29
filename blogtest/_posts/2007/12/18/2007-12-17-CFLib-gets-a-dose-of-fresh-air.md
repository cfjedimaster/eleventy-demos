---
layout: post
title: "CFLib gets a dose of fresh air..."
date: "2007-12-18T10:12:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2007/12/18/CFLib-gets-a-dose-of-fresh-air
guid: 2547
---

Yes, the AIR jokes are probably getting a bit old. ;) Yesterday I wrote up a quick demo for a off-site (not offline, but off web site) that demonstrates a <a href="http://www.cflib.org">CFLib</a> browser. Spry is used to speak to the web site. I used the same code I wrote for the SnipEx service. This meant no back end changes in CFLib, but it also meant I didn't get back as much data as I would like. But as I was just playing, I got over it. I also made use of Paged Datasets and Spry tabs for layout. 

I begun my development on my own web server. In order to facilitate moving back and forth between a normal web site and AIR, I used code like so:

<code>
var mode = 'prod';
if (mode == 'dev') {
	//dev
	var liburl = "data.cfm?loc=" + escape('http://www.cflib.org/snipex/snipex.cfc');
	var udfurl = "data.cfm?loc=" + escape('http://www.cflib.org/snipex/snipex.cfc?method=getlibrary&libid=') + "{% raw %}{libs::@id}{% endraw %}";
}
else {
	//air
	var liburl = "http://www.cflib.org/snipex/snipex.cfc";
	var udfurl = "http://www.cflib.org/snipex/snipex.cfc?method=getlibrary&libid={% raw %}{libs::@id}{% endraw %}";
}
</code>

Basically, in the non AIR mode, I used a proxy CFM, and in AIR, I didn't have to. 

I didn't use Aptana's AIR support as I had some issues with it recently. Instead I simply used the command line. I blogged in the past about this, so I won't repeat it, but the process was pretty much the same under AIR Beta 3. The main difference was having to create a self-signed certificate first. It would be nice if AIR supplied a "one step" compile for that, but it wasn't too hard. Obviously if you use something like Dreamweaver it would probably be simpler.

The biggest issue I had was with Spry and AIR. I <a href="http://www.raymondcamden.com/index.cfm/2007/12/17/Important-SpryAIR-Resource">blogged</a> on that last night. That was the critical thing I was missing. This app represents probably 4 hours of work, of which 3 was me banging my head against the wall on the AIR/Spry stuff. Now that I know though - it definitely makes sense. 

So let me know what you think. I know the design sucks, but I kind of like it. I'm considering adding it to my taskbar (yes, I'm considering avoiding my own web site - is that sad?) to force myself to use it and add features to it.

The zip contains my original code plus the AIR installer. Just so it's obvious - I'm still learning this stuff, so don't mistake this for 'best practices' AIR development. ;)<p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5Cwww%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fcflibair%{% endraw %}2Ezip'>Download attached file.</a></p>