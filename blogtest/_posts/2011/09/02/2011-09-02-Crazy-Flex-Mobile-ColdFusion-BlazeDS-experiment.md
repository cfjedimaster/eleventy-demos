---
layout: post
title: "Crazy Flex, Mobile, ColdFusion, BlazeDS experiment"
date: "2011-09-02T17:09:00+06:00"
categories: [coldfusion,flex,mobile]
tags: []
banner_image: 
permalink: /2011/09/02/Crazy-Flex-Mobile-ColdFusion-BlazeDS-experiment
guid: 4352
---

After lunch today I decided to embark on a little test. Folks know - or should know - that ColdFusion ships with an incredibly powerful Server Monitor. If you haven't yet played with it, I highly encourage taking a look at Charlie Arehart's <a href="http://www.adobe.com/devnet/coldfusion/articles/monitoring_pt1.html">four part article</a> over on the Adobe Developer connection for a review. One of the features he talks about is the Alerts system. For folks who don't want to spend all day staring at a computer screen (wait, people don't?), then the Alerts feature is a powerful way to have the monitor tell you when something is wrong as opposed to you keeping a constant eye on it. Alerts can do a variety of things, but when the built in functionality doesn't meet your needs, you can also have it run a CFC for you - and that's where this experiment began.
<!--more-->
<p>

I began by creating a simple data services messaging gateway in my ColdFusion Administrator. This is a pretty deep topic (and some of my readers will share that it's not always as easy as I'm going to make out), but for the most part, I simply created the event gateway and I was done with that part. On the Flex side, it's a simple matter of setting up code to connect to that event gateway. So here for example is a one page Flex Mobile app that let's me send a message to the gateway.

<p>

<code>

&lt;?xml version="1.0" encoding="utf-8"?&gt;
&lt;s:View xmlns:fx="http://ns.adobe.com/mxml/2009" 
		xmlns:s="library://ns.adobe.com/flex/spark" title="HomeView" viewActivate="init(event)" xmlns:mx="library://ns.adobe.com/flex/mx"&gt;
	
	&lt;fx:Declarations&gt;
		&lt;mx:Consumer id="mainConsumer" destination="ColdFusionGateway" message="msgResponder(event)" /&gt;
		&lt;mx:Producer id="mainProducer" destination="ColdFusionGateway" /&gt;
	&lt;/fx:Declarations&gt;

	&lt;fx:Script&gt;
		&lt;![CDATA[
			import mx.messaging.ChannelSet;
			import mx.messaging.channels.AMFChannel;
			import mx.messaging.events.MessageEvent;
			import mx.messaging.messages.AsyncMessage;
			
			import spark.events.ViewNavigatorEvent;

			private var pollChannel:AMFChannel = new AMFChannel("cf-polling-amf", "http://127.0.0.1/flex2gateway/cfamfpolling");
			private var amfChannelSet:ChannelSet = new ChannelSet();

			protected function init(event:ViewNavigatorEvent):void {
				amfChannelSet.addChannel(pollChannel);
				
				mainConsumer.channelSet = amfChannelSet;
				mainProducer.channelSet = amfChannelSet;
				mainConsumer.subscribe();
			}

			
			protected function msgResponder(event:MessageEvent):void
			{
				trace("got something");
				debug.text += event.message.body.MESSAGE + '\n';
			}
			
			protected function btnClick(event:MouseEvent):void
			{
				var msgString:String = inputText.text;
				var msg:AsyncMessage = new AsyncMessage();
				msg.body.MESSAGE = msgString;
				msg.headers.gatewayid="MobileGateway1";
				mainProducer.send(msg);
				trace("sent "+msgString);
			}
			
		]]&gt;
	&lt;/fx:Script&gt;
		
	&lt;s:layout&gt;
		&lt;s:VerticalLayout /&gt;
	&lt;/s:layout&gt;
	
	&lt;s:TextInput id="inputText" /&gt;
	&lt;s:Button label="Send" click="btnClick(event)" /&gt;
	
	&lt;s:Label id="debug" /&gt;
&lt;/s:View&gt;
</code>

<p>

On the ColdFUsion side, my CFC listened for messages and echoed them back:

<p>

<code>
component {

	remote struct function onIncomingMessage(required any event) {
		writelog(file="application", text="gateway  - #serializejson(event)#");
		event.data.body.MESSAGE = "Sent back " & event.data.body.MESSAGE;
		return event.data;
	}
	
}
</code>

<p>

Notice I modify the message a bit just so I can see it working right. Here's a screen shot of it working.

<p>

<img src="https://static.raymondcamden.com/images/ScreenClip174.png" />

<p>

To be clear - that's Flex talking to BlazeDS and ColdFusion on the server. If I had more devices, they all would have gotten the message. So - with me so far? Because here is where things get interesting.

<p>

As I mentioned before, the Server Monitor allows you to specify alerts, and allows you to specify CFCs to run. The docs, unfortunately, are completely lacking in useful information here. For example, they don't tell you how to specify the CFC. You can only use a file name (no directory!) and it must live in cfusioninstall\runtime\bin. (Thanks to Charlie's article on that.) And while you are told what methods your CFC must have, they don't tell you what the data looks like when your CFC is run. I ended up using writeDump to a directory just to see this! Here is an example:

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip175.png" />

<p>

Ok, so given that I've got some basic info there - I wrote my CFCs then to send messages to my event gateway.

<p>

<code>
component {

	remote function onAlertStart(struct alert) {
		writelog(file="application", text="START - #serializejson(alert)#");
		writedump(output="c:\raytest\#createUUID()#.html", var=alert, format="html", label="START");
		var s = {
			destination="ColdFusionGateway",
			body={
				type=alert.alerttype,
				message=alert.alertmessage,
				start=true
			}
		};
	
		sendGatewaymessage("MobileGateway1", s);
	}
	
	remote function onAlertEnd(struct alert) {
		writelog(file="application", text="END - #serializejson(alert)#");
		writedump(output="c:\raytest\#createUUID()#.html", var=alert, format="html", label="END");

		var s = {
			destination="ColdFusionGateway",
			body={
				type=alert.alerttype,
				message=alert.alertmessage,
				start=false
			}
		};
	
		sendGatewaymessage("MobileGateway1", s);
		
	}
	
}
</code>

<p>

To be clear, the first two lines in both methods was just for testing purposes. You can see though that I take a few values from the alert and send it to the gateway. Now for the front end.

<p>

<code>

&lt;?xml version="1.0" encoding="utf-8"?&gt;
&lt;s:View xmlns:fx="http://ns.adobe.com/mxml/2009" 
		xmlns:s="library://ns.adobe.com/flex/spark" title="Server Monitor" viewActivate="init(event)" xmlns:mx="library://ns.adobe.com/flex/mx"&gt;
	
	&lt;fx:Declarations&gt;
		&lt;mx:Consumer id="mainConsumer" destination="ColdFusionGateway" message="msgResponder(event)" /&gt;
		&lt;mx:Producer id="mainProducer" destination="ColdFusionGateway" /&gt;
	&lt;/fx:Declarations&gt;
	
	&lt;fx:Style&gt;
		@namespace s "library://ns.adobe.com/flex/spark";
		@namespace mx "library://ns.adobe.com/flex/mx";
		
		.inactiveBtn {
			backgroundColor:#c0c0c0;
		}
		
		.activeBtn {
			backgroundColor:red;
		}
	&lt;/fx:Style&gt;
	&lt;fx:Script&gt;
		&lt;![CDATA[
			import mx.messaging.ChannelSet;
			import mx.messaging.channels.AMFChannel;
			import mx.messaging.events.MessageEvent;
			import mx.messaging.messages.AsyncMessage;
			
			import spark.events.ViewNavigatorEvent;
			
			private var pollChannel:AMFChannel = new AMFChannel("cf-polling-amf", "http://192.168.1.108/flex2gateway/cfamfpolling");
			private var amfChannelSet:ChannelSet = new ChannelSet();
			
			protected function init(event:ViewNavigatorEvent):void {
				amfChannelSet.addChannel(pollChannel);
				
				mainConsumer.channelSet = amfChannelSet;
				mainProducer.channelSet = amfChannelSet;
				mainConsumer.subscribe();
			}
			
			
			protected function msgResponder(event:MessageEvent):void
			{
				trace("got something");
				switch(event.message.body.TYPE) {
					
					case "Timeouts Alert": { 
							ssa.styleName = 'inactiveBtn';
							usa.styleName = 'inactiveBtn';
							jma.styleName = 'inactiveBtn';
							if(event.message.body.START == "true") toa.styleName = 'activeBtn'; 
							else toa.styleName = 'inactiveBtn';
							break;
					}
					case "Slow Server Alert": {
						if(event.message.body.START == "true") ssa.styleName = 'activeBtn'; 
						else ssa.styleName = 'inactiveBtn';
						usa.styleName = 'inactiveBtn';
						jma.styleName = 'inactiveBtn';
						toa.styleName = 'inactiveBtn'; 
					}
				}
				//only log if starting
				if(event.message.body.START == "true") messageArea.text = event.message.body.MESSAGE + '\n' + messageArea.text;
			}
			
		]]&gt;
	&lt;/fx:Script&gt;
	
	&lt;s:layout&gt;
		&lt;s:VerticalLayout paddingTop="10" paddingLeft="10" paddingRight="10" paddingBottom="10" verticalAlign="middle" horizontalAlign="center"  /&gt;
	&lt;/s:layout&gt;

	&lt;s:Label id="ssa" width="100%" height="60" styleName="inactiveBtn" text="Slow Server Alert"
			 textAlign="center" verticalAlign="middle"/&gt;

	&lt;s:Label id="toa" width="100%" height="60" styleName="inactiveBtn" text="Timeout Alert"
			 textAlign="center" verticalAlign="middle"/&gt;

	&lt;s:Label id="usa" width="100%" height="60" styleName="inactiveBtn" text="Unresponsive Server"
			 textAlign="center" verticalAlign="middle"/&gt;

	&lt;s:Label id="jma" width="100%" height="60" styleName="inactiveBtn" text="JVM Memory"
			 textAlign="center" verticalAlign="middle"/&gt;

	&lt;s:Label id="messageArea" width="100{% raw %}%" height="100%{% endraw %}" /&gt;
	
&lt;/s:View&gt; 
</code>

<p>

Yeah - a bit more code there. It may help if I run it so you can see it first:

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip176.png" />

<p>

Basically - my application has 4 labels. When a message is received (notice this version never actually sends anything - I can get rid of the Producer) - I highlight various fields based on what the alert type was. I only wrote code for two of the types, but you can imagine what support for the other two would do. And what happens? Check out this horrible, shaky, YouTube video. I apologize in advance. Oh, and it's boring too. You will have to wait a bit to see the results. That isn't Flex or BlazeBS being slow, it's me trying to force a slow server alert on my box by reloading a very large Model-Glue site in 5-6 tabs at once.

<p>

<iframe width="560" height="345" src="http://www.youtube.com/embed/WRAWxqex6OE" frameborder="0" allowfullscreen></iframe>