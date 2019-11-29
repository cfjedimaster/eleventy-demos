---
layout: post
title: "Building your first HTML/Adobe AIR Application"
date: "2010-07-31T14:07:00+06:00"
categories: [javascript,jquery]
tags: []
banner_image: 
permalink: /2010/07/31/Building-your-first-HTMLAdobe-AIR-Application
guid: 3894
---

This week I gave my first ever presentation on building HTML-based AIR applications. You can find the slides and code from that presentation <a href="http://www.raymondcamden.com/index.cfm/2010/7/29/Slides--Code-from-CFUNITED10">here</a>. I thought it would be nice to spend a bit of time talking about this topic on the blog in a slower, more verbose manner than I had time for at CFUNITED. This will also allow us to go in different directions, try new things, etc. I'm looking to you guys for feedback on what is covered and to provide direction on where to go next. I thought it would be great to simply start off with some basic links and resources to get you started. So enough preamble - lets get started.
<!--more-->
<img src="https://static.raymondcamden.com/images/cfjedi/Adobe_Air_logo.jpg" align="left" style="margin-right: 10px;margin-bottom:10px" />
<b>1) What is AIR?</b><br/>
AIR (technically Adobe AIR) is a runtime for applications built with Flex or HTML. Basically, it's the promise of Java's "Write Once/Run Everywhere" using web technologies. Is it perfectly "Write Once/Run Everywhere"? Heck no. But it's pretty darn well close and a great product. Obviously I'm biased but I think it is a great thing for ColdFusion developers to pick up to help compliment their existing skills. 

At the end of the day - it is a way to use HTML/JavaScript or Flash/Flex to build cross platform applications. (And I should warn you now - I don't work for Adobe marketing. I'm sure there are longer, better descriptions. This is the way I understand and explain it to others.)

<b>2) What do you need to get started?</b><br/>
At minimum all you need is the AIR SDK. You can grab that <a href="http://www.adobe.com/go/air_sdk/">here</a>. You can grab the runtime too if you want but the SDK will have everything. 

<b>3) Ok, but what do I <i>really</i> need?</b><br/>
The SDK will give you the command line tools necessary to run and package up AIR applications, but honestly, you want to use a visual tool/editor to build this stuff. I <b>strongly</b> recommend downloading and installing <a href="http://www.aptana.com/">Aptana Studio 2</a>. CFBuilder uses Aptana bits in it, and you can do AIR work within CFBuilder, but I prefer the separate tool. It's just how I operate. Aptana is 100% free. It works on both Windows and the Mac. It also comes with a butt load (techincal term) of highly focused, simple AIR demos. You can right click on these samples, import as a project, and run them immediately. It makes playing with various features (file access, database access, etc) much easier. 

You <i>can</i> use Dreamweaver too. There is an AIR plugin. I can't comment on it as I haven't used it.

<b>4) Where are the docs?</b><br/>
There is a whole section at Adobe just for HTML-based AIR development: <a href="http://www.adobe.com/products/air/develop/ajax/">For Ajax developers</a>. This section contains docs, demos, and articles all focused on this type of AIR development. It was extremely helpful to me when I was preparing for my presentation.

<b>5) Is there a particular type of JavaScript you have to use?</b><br/>
Yes, you have to use jQuery when working with Adobe AIR.

Ok... I'm kidding. No - seriously - there is no requirement that any particular type of JavaScript is supported over any other. Most folks tend to use either Ext or jQuery. 

<b>6) Are there any actual apps out there?</b><br/>
Yes, check out the <a href="http://www.adobe.com/devnet/air/ajax/samples.html">Samples</a> page at Adobe. I'm not so sure it is fair to call each of these full "apps" (in my mind, I'm thinking of apps as in real products, supported and constantly developed, etc) but they do give you some examples. I'd love to see more apps listed here, and if folks know of any that they want to call attention too (commercial or not!) please leave a comment.

So what's next? In the next entry I'll walk through the steps needed to create an AIR project using Aptana. (So your homework is to download and install Aptana before then!)