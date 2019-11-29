---
layout: post
title: "INeedIt - Addressing text size issues"
date: "2011-05-18T00:05:00+06:00"
categories: [flex,mobile]
tags: []
banner_image: 
permalink: /2011/05/17/INeedIt-Addressing-text-size-issues
guid: 4236
---

This past Saturday I <a href="http://www.raymondcamden.com/index.cfm/2011/5/14/INeedIt--Simple-Flex-Mobile-example">wrote about</a> my experience creating a Flex Mobile application called INeedIt. Based on the <a href="http://code.google.com/apis/maps/documentation/places/">Google Places API</a>, it was a simple application that found businesses of a certain type around your location. One of the issues I ran into was with text size. Consider what the simulator showed:
<!--more-->
<p>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip90.png">

<p>

This looked perfect to me. But when run in my device, the text ended up being a lot smaller. Here's a shot I took with my web cam. Not perfect, but it should give you an idea of how much smaller it ended up:

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/Image.png" />

<p>

I wasn't quite sure what to do. I knew Flex 4.5 had support for handling DPI changes - but nothing I tried seemed to work right. Finally I gave up and tried just adding fontSize to the list. Here is the entire layout for first page:

<p>

<code>
&lt;s:List id="typeList" dataProvider="{% raw %}{types}{% endraw %}" labelField="label"  width="100{% raw %}%" height="100%{% endraw %}" click="loadType(event)" includeIn="normal"  /&gt;
</code>

<p>

Obviously there's more in the file, but in terms of UI, that's pretty much it. So as I said, I added fontSize in and that worked, but only for one page. I then turned to Adobe evangelist <a href="http://devgirl.org/">Holly Schinsky</a>. Her suggestion was simple - CSS. I keep forgetting you can use CSS in Flex. In fact, she pointed out two simple CSS items to cover the entire application. Here is INeedIt.mxml - my root file for the application.

<p>

<code>
&lt;?xml version="1.0" encoding="utf-8"?&gt;
&lt;s:ViewNavigatorApplication xmlns:fx="http://ns.adobe.com/mxml/2009" 
							xmlns:s="library://ns.adobe.com/flex/spark" firstView="views.INeedItHomeView" 
							splashScreenImage="@Embed('assets/first.jpg')"&gt;
	&lt;fx:Declarations&gt;
		&lt;!-- Place non-visual elements (e.g., services, value objects) here --&gt;
	&lt;/fx:Declarations&gt;
	
	&lt;fx:Style&gt;
	@namespace s "library://ns.adobe.com/flex/spark";
	global {
		fontSize: 36pt;
	}
	s|ActionBar #titleDisplay
	{
		fontSize: 36pt;
	}		
	&lt;/fx:Style&gt;
&lt;/s:ViewNavigatorApplication&gt;
</code>

<p>

The first declaration, global, applies to everything within the app - but not the title bar. I'm taking a guess here but I'd bet it also doesn't apply to menus. (More on how to use menus later.) To cover the title bar (really the ActionBar), I simply specify the second one. Note the use of the namespacing there. That's required for it to work. The numbers I picked were pretty arbitrary. I started big (100) and went down until it seemed "comfortable" for my big fat fingers. Check out the difference: 

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/Image2.png" />

<p>

Again - not the best camera shot, but you can definitely tell a difference. Want to see <i>all</i> the code. I've now put it up on GitHub: <a href="https://github.com/cfjedimaster/ineedit">https://github.com/cfjedimaster/ineedit</a>. Feel free to download and modify the code to your liking. I've also included the APK as an attachment to this entry. In theory you can download and install right from your mobile browser. (As always, even if your phone company thinks your an idiot and can't be trusted to install applications, don't forget you can easily work around that by using the Android SDK.)

<p>

Ok - so what's next? I want to add menu support and see if I can fix the map. I bet I can also add in driving directions pretty easily.<p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2009%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2FINeedIt%{% endraw %}2Eapk'>Download attached file.</a></p>