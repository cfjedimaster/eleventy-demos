---
layout: post
title: "Simple example of accessing ColdFusion data with Flex (now with Flash Builder 4)"
date: "2009-06-08T21:06:00+06:00"
categories: [coldfusion,flex]
tags: []
banner_image: 
permalink: /2009/06/08/Simple-example-of-accessing-ColdFusion-data-with-Flex-now-with-Flash-Builder-4
guid: 3388
---

Last week I wrote up a quick <a href="http://www.raymondcamden.com/index.cfm/2009/6/3/Simple-example-of-accessing-ColdFusion-data-with-Flex">blog entry</a> demonstrating how to talk to ColdFusion via Flex. It wasn't meant to be the complete guide to Flex/ColdFusion development, but more a simple example to demonstrate how easy it is. Tonight I took a look at Flash Builder 4 and the support it has for working with data services. Here is what I found (and once again, I'll remind folks that I'm learning Flash Builder 4 and Flex 4 so please forgive any dumb mistakes). 

I created a new Flex project called TestFB4, selected Web for the Application type, and ensured ColdFusion Flash Remoting was selected in the Server technology section.

<img src="https://static.raymondcamden.com/images/cfjedi//Picture 238.png">

The next page will ask you to confirm your ColdFusion settings. (I assume you know what to do there.)

Once done, you should end up with a simple, empty, Flex file. I took the simple button and text field from my first example in the last blog post and just pasted it into my document:

<code>
&lt;?xml version="1.0" encoding="utf-8"?&gt;
&lt;s:Application xmlns:fx="http://ns.adobe.com/mxml/2009" xmlns:s="library://ns.adobe.com/flex/spark" xmlns:mx="library://ns.adobe.com/flex/halo" minWidth="1024" minHeight="768"&gt;

	&lt;mx:Button label="Talk to ColdFusion" /&gt;
	&lt;mx:TextArea id="resultBox" /&gt;
   	
&lt;/s:Application&gt;
</code>

Unfortunately this won't quite work right. Switch to Design View and you see:

<img src="https://static.raymondcamden.com/images/cfjedi//Picture 328.png">

What the heck? I see the TextArea but not my button. I then noticed that there was no layout attribute in the core Application tag. One of the things that changed in Flex 4, specifically in the Spark components, is the layout stuff. You can't just use layout="vertical", but instead must declare it using a child tag:

<code>
&lt;?xml version="1.0" encoding="utf-8"?&gt;
&lt;s:Application xmlns:fx="http://ns.adobe.com/mxml/2009" xmlns:s="library://ns.adobe.com/flex/spark" xmlns:mx="library://ns.adobe.com/flex/halo" minWidth="1024" minHeight="768"&gt;

	&lt;s:layout&gt;
		&lt;s:VerticalLayout/&gt;
	&lt;/s:layout&gt;

	&lt;mx:Button label="Talk to ColdFusion /&gt;
	&lt;mx:TextArea id="resultBox" /&gt;
   	
&lt;/s:Application&gt;
</code>

My understanding, and let me stress here, it's just my understanding, is that this reflects the fact that layout is now handled by a component. Hence the lack of a simple layout="string" argument. If you have seen my Twits, you know I'm still a bit overwhelmed by the changes in Flex 4, so, let's just move on and ensure that works. A quick click back to Design mode shows that it does:

<img src="https://static.raymondcamden.com/images/cfjedi//Picture 412.png">

Ok, now for the fun part. I still had my CFC from the last entry. It was called testa and contained two methods, echotest and hellotest. How difficult is it to get FB4 hooked up to this?

First, ensure you see the Data/Services view. If you don't, go to Window, Show View, Data/Services. If you don't see it there, click Other and it will be under Flash Builder. (I'm confused - is it Flash Builder or FlashBuilder?) Mine looks like this:

<img src="https://static.raymondcamden.com/images/cfjedi//Picture 55.png">

Click on Connect to Data/Service and note that ColdFusion is selected first:

<img src="https://static.raymondcamden.com/images/cfjedi//Picture 62.png">

On the next screen, the Service Name is simply a reference to the remote CFC. In the last blog entry I had made a RemoteObject tag named cfservice. That's a bit vague, but I'll go ahead and use it again. Import CFC should be selected. I hit the Browse button to pick my testa file. 

<img src="https://static.raymondcamden.com/images/cfjedi//Picture 73.png">

When you click next, you will be asked to enter your RDS info. After you do that, it should (hopefully!) parse your CFC data and display the methods:

<img src="https://static.raymondcamden.com/images/cfjedi//Picture 81.png">

Click Finish and you will notice the following warning:

<img src="https://static.raymondcamden.com/images/cfjedi//Picture 91.png">

This seems a bit odd, especially if you look over in the Data/Services panel and see...

<img src="https://static.raymondcamden.com/images/cfjedi//Picture 10.png">

My guess is that the String you see here is from the CFC file, and Flash Builder is simply saying, "Yes, I know you sya you return a string, but maybe you return some weird, freaky, non-standard string that will make me unhappy and slightly gassy." Fair enough. Right click on both operations (I'm only using one now) and click Configure Return Type. Select Use an Existing ActionScript or custom data type and pick String from the drop down. After you do that, notice the grey balls next to the method now become green balls. Not terribly obvious, but, I'll get used to it.

<img src="https://static.raymondcamden.com/images/cfjedi//Picture 1110.png">

Ok, now for the cool part. Ensure you are still in design mode. Click on echotest and simply drag it to your button. You should see a green + when over the button. That's it. If you switch to Source view you can see what it did:

<code>
&lt;?xml version="1.0" encoding="utf-8"?&gt;
&lt;s:Application xmlns:fx="http://ns.adobe.com/mxml/2009" xmlns:s="library://ns.adobe.com/flex/spark" xmlns:mx="library://ns.adobe.com/flex/halo" minWidth="1024" minHeight="768" xmlns:cfservice="services.cfservice.*"&gt;
	&lt;fx:Script&gt;
		&lt;![CDATA[
			import mx.controls.Alert;

			protected function button_clickHandler(event:MouseEvent):void
			{
				echotestResult.token = cfservice.echotest();
			}

		]]&gt;
	&lt;/fx:Script&gt;

	&lt;s:layout&gt;
		&lt;s:VerticalLayout/&gt;
	&lt;/s:layout&gt;
	&lt;fx:Declarations&gt;
		&lt;s:CallResponder id="echotestResult"/&gt;
		&lt;cfservice:Cfservice id="cfservice" destination="ColdFusion" endpoint="http://localhost:80/flex2gateway/" fault="Alert.show(event.fault.faultString)" showBusyCursor="true" source="testa"/&gt;
	&lt;/fx:Declarations&gt;

	&lt;mx:Button label="Talk to ColdFusion" id="button" click="button_clickHandler(event)"/&gt;
	&lt;mx:TextArea id="resultBox" /&gt;
   	
&lt;/s:Application&gt;
</code>

That's a lot of code written for me! Of course, you may be thinking - we tied the method to the button, but we want the result to show in the box, right? Surely we have to type, right? Nope! This really surprised me. Switch back to the Design mode, and drag echotest <i>again</i>, but this time, drop it on the TextArea.

Note that you get a prompt now:

<img src="https://static.raymondcamden.com/images/cfjedi//Picture 1210.png">

If you switch to Existing call result, you will have linked it up to the service call we created by dragging onto the button. 

And that's it. Run it, click the button, and it just plain works.

<img src="https://static.raymondcamden.com/images/cfjedi//Picture 1310.png">

Hopefully you guys are impressed by this, I am. The blog entry ended up being a lot longer than I expected, but mainly because of the screen shots. When I tried this the first time, it took about 60 seconds.