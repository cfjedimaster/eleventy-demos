---
layout: post
title: "My Flex Mobile/DPI issue - solved!"
date: "2011-05-20T10:05:00+06:00"
categories: [flex,mobile]
tags: []
banner_image: 
permalink: /2011/05/20/My-Flex-MobileDPI-issue-solved
guid: 4240
---

Last Saturday I posted my latest Flex/Mobile experiment, <a href="http://www.raymondcamden.com/index.cfm/2011/5/14/INeedIt--Simple-Flex-Mobile-example">INeedIt</a>. For the most part it just plain worked, and Flash Builder/Flex 4.5 made it super easy. One thing really annoyed me though. The text on my phone was too small, especially when compared to the simulator. A few days later I posted a <a href="http://www.coldfusionjedi.com/index.cfm/2011/5/17/INeedIt--Addressing-text-size-issues">follow up</a> that fixed the issue by using CSS. This was thanks to the help of <a href="http://devgirl.org/">Holly Schinsky</a>. But it still bugged me. So I posted a quick note to the Flex forums at Adobe - and guess what? Turns out it was a bug in Flex!
<!--more-->
<p>

Ok, so I know some Flex developers are laughing at me now. I certainly don't expect Flex to be any more perfect than ColdFusion, but I guess I don't use Flex quite enough to run into bugs. Adobe employee Jason San Jose  figured out that Flex was simply not getting the right DPI for my Inspire phone. His bug report may be found <a href="http://bugs.adobe.com/jira/browse/SDK-30487">here</a>. Turns out, the Atrix also has the issue. If you view the <a href="https://bugs.adobe.com/jira/browse/SDK-29999">bug report</a> for that issue you discover there is a nice work around. 

<p>

I thought that Flex only provided one way to set DPI: applicationDPI

<p>

<code>
&lt;s:ViewNavigatorApplication xmlns:fx="http://ns.adobe.com/mxml/2009" 
							xmlns:s="library://ns.adobe.com/flex/spark" firstView="views.TestAlphaHomeView" applicationDPI="160"&gt;
</code>

<p>

However this only tells Flex that your application is designed for that DPI. It doesn't actually specify to assume your device <i>is</i> that DPI. Again - thanks to Jason to help making this clear. If you want to set your DPI you can use a runtimeDPIProvider.  This is <a href="http://help.adobe.com/en_US/flex/mobileapps/WS19f279b149e7481c682e5a9412cf5976c17-8000.html#WS19f279b149e7481c-2a25e9b212d622ff5e8-8000">documented</a> but you can really just take the workaround from the bug and make use of it. However - note that the workaround is for Atrix only. Here's how to fix it for the Inspire as well.

<p>

First, we tell Flex to make use of it:

<p>

<code>
&lt;s:ViewNavigatorApplication xmlns:fx="http://ns.adobe.com/mxml/2009" 
xmlns:s="library://ns.adobe.com/flex/spark" firstView="views.TestAlphaHomeView" runtimeDPIProvider="CustomRuntimeDPIProvider"&gt;
</code>

<p>

And here is the ActionScript class. The 3rd clause in the IF statement came from my debugging with the Inspire device:

<p>

<code>
package
{
	import flash.system.Capabilities;
	
	import mx.core.RuntimeDPIProvider;
	
	public class CustomRuntimeDPIProvider extends RuntimeDPIProvider
	{
		public function CustomRuntimeDPIProvider()
		{
			super();
		}
		
		override public function get runtimeDPI():Number
		{
			trace(Capabilities.screenResolutionX + " , " + Capabilities.screenResolutionY);
			if (Capabilities.screenResolutionX == 540 && Capabilities.screenResolutionY == 960 || 
				Capabilities.screenResolutionX == 960 && Capabilities.screenResolutionY == 540 ||
				Capabilities.screenResolutionX == 480 && Capabilities.screenResolutionY == 800
						)
				return 240;
			
			return super.runtimeDPI;
		}
	}
}
</code>

<p>

Pretty simple, right? (Ok, it's simple to use - but was way above my current knowledge.) So does it work? Check out these screen shots from my actual device. First, here it is before change. 

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/device bad cap.png" />

<p>

And here it is after:

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/device good cap.png" />

<p>

In the screen shots it isn't quite as dramatic as it was on my device itself. The screen shots are a good 2x big than the real device. But trust me - for my eyes - it was a huge difference. You can clearly see how proportionally things are bigger in the second shot.

<p>

I'll be adding this to INeedIt soon. I actually whipped up a big update to it - one that ended up being a mistake - but I plan on posting the entire story about that this weekend.