---
layout: post
title: "Five minutes to your first mobile AIR Application"
date: "2010-11-01T08:11:00+06:00"
categories: [flex,mobile]
tags: []
banner_image: 
permalink: /2010/11/01/Five-minutes-to-your-first-mobile-AIR-Application
guid: 3991
---

A few days back I <a href="http://www.raymondcamden.com/index.cfm/2010/10/21/My-First-Android-Application">blogged</a> about my mobile AIR application. I talked a bit about how darn easy it was but I had to be bit vague as I was still under NDA. Now that MAX has passed everyone has the opportunity to build mobile AIR applications and I thought I'd show just how easy it is. <b>To be clear, you do not need an Android device to play/learn.</b>
<!--more-->
<p>

To begin, first you want to download the new Flash Builder <a href="http://labs.adobe.com/technologies/flashbuilder_burrito/">"Burrito"</a> from Adobe Labs. Technically this may take you more than five minutes, but hopefully not too much longer. Don't worry if you already have Flash Builder installer - Burrito will stand on it's own. (Assuming a stand alone install of course.)

<p>

Once you've got Burrito up and running, create a new Flex Mobile project:

<p>
<img src="https://static.raymondcamden.com/images/cfjedi/screen25.png" />

<p>

You may notice that you can also build an ActionScript Mobile Project as well. Flash Builder will now begin prompting you about the project. I named mine HelloWorld. You can leave everything else as is.

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/screen26.png" />

<p>

Ok, so now you should have your code up, specifically a file called HelloWorldHome.mxml. If you've never seen Flex before, well, you've got a bit to learn later. (I recommend: <a href="http://www.amazon.com/gp/product/1935182420?ie=UTF8&tag=raymondcamden-20&linkCode=as2&camp=1789&creative=9325&creativeASIN=1935182420">Flex 4 in Action: Revised Edition of Flex 3 in Action</a><img src="http://www.assoc-amazon.com/e/ir?t=raymondcamden-20&l=as2&o=1&a=1935182420" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />) If you do know Flex, note that AIR 2.5 adds new features specifically for mobile. For now though let's keep it simple. Add a s:label tag as shown below.

<p>

<code>
&lt;?xml version="1.0" encoding="utf-8"?&gt;
&lt;s:View xmlns:fx="http://ns.adobe.com/mxml/2009" 
		xmlns:s="library://ns.adobe.com/flex/spark" title="Home"&gt;
	&lt;fx:Declarations&gt;
		&lt;!-- Place non-visual elements (e.g., services, value objects) here --&gt;
	&lt;/fx:Declarations&gt;
	
	&lt;s:Label text="Hello, Mobile World!" /&gt;
	
&lt;/s:View&gt;
</code>

<p>

Ok, next up, let's run this baby. Click the pretty little green button on top:

<p>


<img src="https://static.raymondcamden.com/images/cfjedi/screen27.png" />

<p>

This will load up the run configuration screen (the first time only - after that it will remember your options). You have two options here. If you don't have an Android device, you will select "On desktop" and pick any of the device simulators. If you have an Android device, ensure it is connected via USB and that you've enabled USB Debugging. Flash Builder is smart enough to recognize if you don't have AIR installed on the device and will take care of that for you.

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/screen28.png" />

<p>

Finally, you can see your lovely little mobile app running:

<p>


<img src="https://static.raymondcamden.com/images/cfjedi/screen29.png" />

<p>

And that's it. Obviously there is a lot more to learn, but the actual mechanics of this is <b>frackin easy as pie</b>, which I really like. Later this week I'll post the actual source code to my Death Clock mobile application. I'd also like to hear from you guys what you would like to see next. Don't forget Adobe Labs has quite a few links to docs and examples as well.

<p>

<b>Quick Tip:</b> Using the mobile simulator? ctrl+r will rotate your application and you can see how your application reacts to orientation changes.