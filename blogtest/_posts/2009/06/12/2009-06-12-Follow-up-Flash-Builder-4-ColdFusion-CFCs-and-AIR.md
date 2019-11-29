---
layout: post
title: "Follow up - Flash Builder 4, ColdFusion CFCs, and AIR"
date: "2009-06-12T11:06:00+06:00"
categories: [coldfusion,flex]
tags: []
banner_image: 
permalink: /2009/06/12/Follow-up-Flash-Builder-4-ColdFusion-CFCs-and-AIR
guid: 3392
---

I've done a few blog entries recently showing simple examples of connecting to a ColdFusion CFC via Flex. My <a href="http://www.raymondcamden.com/index.cfm/2009/6/8/Simple-example-of-accessing-ColdFusion-data-with-Flex-now-with-Flash-Builder-4">last blog entry</a> demonstrated this using Flash Builder 4. A reader there asked me to create an example of this in AIR. It just took a few minutes, so let me walk you through the process (and please forgive me but let me give the normal disclaimer, I'm new to Flex, blah blah blah).
<!--more-->
First, when creating the new Flex project, be sure to select AIR (Desktop):

<img src="https://static.raymondcamden.com/images/cfjedi//Picture 163.png">

After that, follow the same directions from the last blog post, specifically ensuring you select ColdFusion and Flash Remoting in the Server Technology part.

Once I had the file, I pasted in the same MXML I had used previously:

<code>
&lt;s:layout&gt;
	&lt;s:VerticalLayout/&gt;
&lt;/s:layout&gt;

&lt;mx:Button label="Talk to ColdFusion" /&gt;
&lt;mx:TextArea id="resultBox"  /&gt;
</code>

I had reinstalled Flash Builder 4, so I quickly went to my Data Services panel and added my CFC. <b>An important note:</b> I'm testing locally, so I used the same CFC as before, testa. Once I went through the process of adding the CFC and defining the return types, I then switched to Design mode. I dragged my method onto the Button, and then dragged it onto the TextArea and selected the response. (Again, this is detailed in my <a href="http://www.coldfusionjedi.com/index.cfm/2009/6/8/Simple-example-of-accessing-ColdFusion-data-with-Flex-now-with-Flash-Builder-4">last post</a>.)

At this point I had the following code - remember - I had just typed the layout and initial components, Flash Builder 4 did all the rest:

<code>
&lt;?xml version="1.0" encoding="utf-8"?&gt;
&lt;s:WindowedApplication xmlns:fx="http://ns.adobe.com/mxml/2009" xmlns:s="library://ns.adobe.com/flex/spark" xmlns:mx="library://ns.adobe.com/flex/halo" xmlns:cfservice="services.cfservice.*"&gt;
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
   
	&lt;mx:Button label="Talk to ColdFusion"  id="button" click="button_clickHandler(event)"/&gt;
	&lt;mx:TextArea id="resultBox"  text="{% raw %}{echotestResult.lastResult}{% endraw %}"/&gt;
   	
&lt;/s:WindowedApplication&gt;
</code>

I did a quick test to ensure it ran, and it did just fine. Ok, now for the fun part. I modified my CFC to make the echotest a bit different:

<code>
&lt;cffunction name="echotest" access="remote" returnType="string"&gt;
	&lt;cfreturn "CFJ: The time is #timeFormat(now())#"&gt;
&lt;/cffunction&gt;
</code>

Notice the CFJ? I uploaded this to www.coldfusionjedi.com/demos. Back in Flash Builder I modified the service tag:

<code>
&lt;cfservice:Cfservice id="cfservice" destination="ColdFusion" endpoint="http://www.coldfusionjedi.com/flex2gateway/" fault="Alert.show(event.fault.faultString)" showBusyCursor="true" source="demos.testa"/&gt;
</code>

Notice I changed the endpoint to point to my service, and I had to tweak source a bit. Whereas before testa.cfc was in web root, now it's in the demos folder. Once again I clicked the little run button and it worked like a charm:

<img src="https://static.raymondcamden.com/images/cfjedi//Picture 239.png">

Woot. Just call me an Experience Designer! If you want to confirm this works, I've placed the AIR file online <a href="http://www.coldfusionjedi.com/demos/TestCFC.air">here</a>. I also included the source. (Easily one of the coolest features of Flex Builder 3/Flash Builder 4 is the ability to include the source code in your apps!)