---
layout: post
title: "CFBuilder Contest: Pastebin"
date: "2010-05-05T18:05:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2010/05/05/CFBuilder-Contest-Pastebin
guid: 3806
---

<img src="https://static.raymondcamden.com/images/cfjedi/cf_builder_appicon.jpg" align="left" style="margin-right:5px" title="ColdFusion Builder FTW!" /> Welcome to the second entry in the ColdFusion Builder Contest. Today's entry is Pastebin by <a href="http://www.danvega.org/blog/">Dan Vega</a>. As you can probably guess, this is an extension that gives you integration with the <a href="http://pastebin.com/">Pastebin.com</a> service. Pastebin is a quick way to share code with others. They have many code highlighters (including one for our <a href="http://www.adobe.com/go/coldfusion">framework</a>) that will "pretty up" your paste as well. Let's take a look at Dan's extension.
<!--more-->
<br clear="left" />

<p>

After installing his extension, you get a right click option for both files and within the code editor to run Pastebin. Once you've done either, the extension pops open a window with your options:

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/pb1.png" title="Pastebin Options" />

<p>

The Paste Format drop down is where you pick the formatter for your code. ColdFusion is there of course, and I've told Dan it would make sense to put it on top. Not because I think ColdFusion is more important than any other language. (Wait, I do actually.) But I think it is fair to assume the 99% of the use of this extension will be for ColdFusion. In fact, I'd probably put CF, JS, XML, and CSS on top for quick access to your common formats. (A really smart extension would store data about your picks and move them up to the top automatically. That brings open a whole other discussion about "self-evolving" CFBuilder extensions.) 

<p>

Once you finish selecting your options and hit submit, you will be presented with the URL to your paste. <b>Do not</b> click that URL. It never worked for me. I was able to cut and paste the URL into my browser though...

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/pb2.png" title="Pastebin.com screen shot" />

<p>

Sorry, that isn't the best screen shot, but wonder over to <a href="http://www.pastebin.com">Pastebin.com</a> yourself for examples. You can also click <a href="http://pastebin.com/zm6sjhMR">here</a> to see an example of something I just pasted via the extension. (Something from BlogCFC6.) 

<p>

It worked well - except when I right clicked on a folder. His extension didn't filter on files so that's something he will need to fix. Of course, I brought it up with him and we had this great exchange:

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/pb3.png" />

<p>

I swear I'm not that flippant on IM most of the time. ;) But it brings up the issue we saw in the previous entry. One of the things extension developers really have to look out for is proper handling of the file and folder resources sent to their code. As I prepare for my SOTR presentation on extension development, I'm seeing a lot of interesting things folks should be aware of. It's not something that makes extension development hard per se, but you really need to keep it in mind. A great example: You can filter a right click menu on a type of file, like *.cfc, but the filter allows you to select a CFC file <b>and</b> any other file. If your extension assumes it only got the proper file than it will crash and burn. I'm a bit off topic now but I think you get my drift.

<p>

On the code side, I don't have much to complain about. Dan, too, makes use of the Application scope to get around Session issues. As I said before, I'm definitely going to be using that as well in the future. I will point out Dan's org.vega.builder package. He has some utilities there to help parse the XML CFBuilder sends to extensions. I was thinking today that a nice library to help automate that parsing would be nice. I think I may try to talk Dan into possibly packaging this up and posting it to RIAForge. I've got some ideas about other common utilities that I think could be added as well.

<p>

All in all - this is really a <i>very</i> simple extension. It does one thing and does it well - but I really think it demonstrates just how darn powerful CFBuilder's extension support is. I know some folks who use Pastebin multiple times a time, and I bet this would really come in handy.

<p>

A quick note. I'm including the extension as an attachment to this blog entry. However, later tonight I'll be approving Dan's RIAForge project for the extension. <b>Please grab that version when posted.</b> I'll post a comment so folks know when it is available.<p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2009%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2FPastebin%{% endraw %}2Ezip'>Download attached file.</a></p>