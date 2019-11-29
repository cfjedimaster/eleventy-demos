---
layout: post
title: "My first jQuery/AIR Application: Selecter Tester"
date: "2009-04-16T18:04:00+06:00"
categories: [jquery]
tags: []
banner_image: 
permalink: /2009/04/16/My-first-jQueryAIR-Application-Selecter-Tester
guid: 3318
---

A few days ago I was speaking with Ben Nadel and Rey Bango about a problem I had with jQuery Selectors. I've only recently become a bit comfortable with them, but they can still be a bit confusing to use. I wondered if there was a way to create a test script. Currently I'll write my selector and do hide() (for those of you who don't use jQuery, you can probably guess that will hide the matched items) or apply a class that adds a border. I'll do a bunch of "edit/save/alt-tab/reload" tests which isn't always fun.

With that in mind, I built a simple testing application with jQuery and AIR. When it launches, you are presented with a simple UI:

<img src="https://static.raymondcamden.com/images//Picture 151.png">

You can then enter some code:

<img src="https://static.raymondcamden.com/images/cfjedi//Picture 231.png">

and switch to the render tab:

<img src="https://static.raymondcamden.com/images/cfjedi//Picture 323.png">

Now comes the fun part. You can type a selector value in the form above. As you do, jQuery will attempt to find, and match, the items in your page. 

For example, I knew I could match li:first, but wasn't sure about li:last. Yep, it works:

<img src="https://static.raymondcamden.com/images/cfjedi//Picture 48.png">

You can install it here - and hopefully this badge thing will work.

<script type="text/javascript" src="/js/badge/swfobject.js"></script>

<div id="flashcontent" style="width:215px; height:180px; ">
<strong>Please upgrade your Flash Player</strong>
This is the content that would be shown if the user does not have Flash Player 6.0.65 or higher installed.
</div>

<script type="text/javascript">
var so = new SWFObject("/js/badge/AIRInstallBadge.swf", "Badge", "215", "180", "9.0.115", "#FFFFFF");
	so.addVariable("airversion", "1.5");
	so.addVariable("appname", "jQuery Selector Tester");
	so.addVariable("appurl", "http://www.coldfusionjedi.com/downloads/jst.air");
	so.addVariable("appid", "com.adobe.example.jQuerySelectorTester");
	so.addVariable("image", "/js/badge/DemoImage.jpg");
	so.addVariable("hidehelp", "false");
	so.addVariable("skiptransition", "false");
	so.addVariable("appversion", "1.0");
	so.addVariable("backgroundColor", "#FFFFFF");
	so.write('flashcontent');
</script>

(The badge isn't working on my blog preview. Folks, if you read this entry immediately after I post it, give me a few if the badge is broken. FYI - badge is definitely wonkey. Use the download link below. Update 7:39PM - badge works now.)

I used Aptana's AIR support plugin. It is nice, but has a few issues. I was never able to get it to run the AIR application. It wouldn't error - it just refused to do anything. I used the command line so it wasn't too bad. It did do a real nice job of laying down the files for a new project. I really appreciate that. It also handled creating the certs/.air file nicely as well. 

I'm planning another modification to this soon, based on a suggestion Ben had. I'd also like to allow people to change the 'highlight' CSS in case a red border doesn't make sense. 

Shoot, I don't know if this is useful or not, but, enjoy. :)

p.s. Download the app using the link below. It is a zipped version of the air file. The badge is just not working. Maybe I need to bug the Aptana folks more. :)<p><a href='enclosures/E{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5Cwww%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2FjQuery%{% endraw %}20Selector{% raw %}%20Tester%{% endraw %}2Eair%2Ezip'>Download attached file.</a></p>