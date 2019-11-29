---
layout: post
title: "More playtime with Flex, AIR, ColdFusion, and Flex Messaging"
date: "2009-05-10T17:05:00+06:00"
categories: [coldfusion,flex]
tags: []
banner_image: 
permalink: /2009/05/10/More-playtime-with-Flex-AIR-ColdFusion-and-Flex-Messaging
guid: 3350
---

Since I wrapped GameOne, and begun work on GameTwo, I've been thinking a lot about messaging about AIR/ColdFusion applications. I had an idea today for a simple application. Imagine your web site sells widgets. Every time you sell a widget, your boss wants an alert. You could easily use email, but emails tend to get ignored. How about writing a quick AIR application instead?
<!--more-->
I began on the server side. I didn't want to build a real ecommerce site for this demo. Instead I decided to simply simulate one person spending X amount of money and a certain time. 

Data Services Messaging is fairly simple to setup. I went to my ColdFusion Administrator, Event Gateways, Gateway Instances, and created a new instance. I named it SimpleTest, used the DataServicesMessaging type, and pointed to a CFC in my code folder. This CFC is used when Flex sends data to the server. However, in my application, the client will never send data. A blank file then is fine for the CFC. However, if you try to skip making the file the administrator will get pissy with you.
 
<img src="https://static.raymondcamden.com/images//Picture 155.png">

<b>Important:</b> Note that you have to start the gateway instance. Even with the startup set to auto, which I would assume would mean 'start now too please', don't forget to hit that start icon after you create it.

At this point I can write a quick CFM that will simulate a web site sale. 

<code>
&lt;cffunction name="firstName" output="false"&gt;
	&lt;cfset var list = "Bob,Ray,Jacob,Noah,Lynn,Jeanne,Stacy,Mel,Darth,Luke,Anakin,Padme,Kirk,Frank,James,Hal,Ben,Lori,Kerry,Gorf"&gt;
	&lt;cfset var name = listGetAt(list, randRange(1, listLen(list)))&gt;
	&lt;cfreturn name&gt;
&lt;/cffunction&gt;
&lt;cffunction name="lastName" output="false"&gt;
	&lt;cfset var list = "Camden,Smith,Nadel,Stroz,Pinkston,Sharp,Jonas,Vader,Palpatine,Break,Sneider"&gt;
	&lt;cfset var name = listGetAt(list, randRange(1, listLen(list)))&gt;
	&lt;cfreturn name&gt;
&lt;/cffunction&gt;

&lt;cftry&gt;
	&lt;cfset msg = StructNew()&gt; 
	&lt;cfset msg.body = {}&gt;
	&lt;cfset msg.body["firstName"] = firstName()&gt;
	&lt;cfset msg.body["lastName"] = lastName()&gt;
	&lt;cfset msg.body["amount"] = "#randRange(1,100)#.#randRange(0,9)##randRange(0,9)#"&gt;
	&lt;cfset msg.body["timestamp"] = now()&gt;
	&lt;cfset msg.destination = "ColdFusionGateway"&gt;
	
	&lt;cfdump var="#msg#"&gt;
	&lt;cfset ret = SendGatewayMessage("simpletest", msg)&gt; 
	
	&lt;cfdump var="#ret#"&gt;

	&lt;cfcatch&gt;
		&lt;cfdump var="#cfcatch#"&gt;
	&lt;/cfcatch&gt;
&lt;/cftry&gt;
</code>

Those first two UDFs were simply me playing around. They return a random first and last name. The important part is the msg structure. I set the name, a random amount, and set a timestamp. (The docs say I don't have to, but frankly, the timeformat of the embedded timestamp wasn't something I knew how to parse.) Why? Those keys are entirely application dependent. If I were building a simple chat application, I may have just had a username and text property. For GameOne, one of my broadcasts includes stock data.

The destination, ColdFusionGateway, is actually specified in the XML files that ship with ColdFusion. I'll be honest and say I only kinda half-grok these files. I had to peek around in there when I played with BlazeDS locally, but all of the code here today runs on a 'stock' ColdFusion8. It has the ColdFusionGateway specified in the Flex XML files so for now, just go with it. 

Once the data is set, I pass it to sendGatewayMessage. The first argument is the name of the event gateway I just created. The second is the structure defined in the file. 

And that's it. Obviously this would be in a CFC method, you could imagine it being called after the order process is done.

The Flex/AIR side is even simpler. I used all of 2 files. (Ignoring the XML file AIR uses to create the build.) My main file contains one tag - a list. This list uses another file to handle rendering sales updates from the server. Here is the complete application file:

<code>
&lt;?xml version="1.0" encoding="utf-8"?&gt;
&lt;mx:WindowedApplication xmlns:mx="http://www.adobe.com/2006/mxml" layout="absolute" creationComplete="init()"&gt;

&lt;mx:Consumer id="consumer" message="handleMessage(event)" channelSet="{% raw %}{myChannelSet}{% endraw %}" destination="ColdFusionGateway"  /&gt;

&lt;mx:Script&gt; 
&lt;![CDATA[
import mx.messaging.channels.AMFChannel;
import mx.messaging.Channel;
import mx.messaging.ChannelSet;
import mx.controls.Alert; 
import mx.collections.ArrayCollection;     
import mx.messaging.events.MessageEvent;

[Bindable] 
public var myAC:ArrayCollection  = new ArrayCollection(); 

[Bindable]
public var myChannelSet:ChannelSet

private function handleMessage(e:MessageEvent):void {
	var body:Object = e.message.body
	var newMsg:Object = new Object()
	newMsg.firstName = body.firstName
	newMsg.lastName = body.lastName
	newMsg.amount = new Number(body.amount)
	newMsg.timestamp = body.timestamp
	myAC.addItemAt(newMsg,0)
}

private function init():void {
	myChannelSet = new ChannelSet()
//	var customChannel:Channel = new AMFChannel("my-cfamf","http://localhost/flex2gateway/cfamfpolling")
	var customChannel:Channel = new AMFChannel("my-cfamf","http://www.coldfusionjedi.com/flex2gateway/cfamfpolling")
	myChannelSet.addChannel(customChannel) 	
	
	consumer.subscribe();	
}


]]&gt; 
&lt;/mx:Script&gt; 
 
&lt;mx:List dataProvider="{% raw %}{myAC}{% endraw %}" itemRenderer="ItemRenderer" height="100{% raw %}%" width="100%{% endraw %}"/&gt; 

&lt;/mx:WindowedApplication&gt;
</code> 

I won't cover every line, but let's talk a bit about the important bits - specifically the consumer. Since this application doesn't send messages, I don't need a producer, only a consumer. The consumer uses a channel set, myChannelSet, that I define in my init function. You can see where I commented out my local address and replaced it with the 'production' value. (And yes, this can be done better via Ant.) My renderer isn't that complex, and could be sexier, but here ya go:

<code>
&lt;?xml version="1.0" encoding="utf-8"?&gt;
&lt;mx:Box xmlns:mx="http://www.adobe.com/2006/mxml" 
	backgroundColor="#e0e0e0" cornerRadius="4" borderStyle="solid" borderThickness="0" 
	paddingBottom="5" paddingTop="5" paddingLeft="5" paddingRight="5" height="90" dropShadowColor="#000000" dropShadowEnabled="true"&gt;
	
	
	&lt;mx:CurrencyFormatter id="fmtCurrency" precision="2"/&gt; 
	&lt;mx:DateFormatter id="fmtDate" formatString="H:NN:SS" /&gt;
	
	&lt;mx:Text text="Purchaser: {% raw %}{data.firstName}{% endraw %} {% raw %}{data.lastName}{% endraw %}" /&gt;
	&lt;mx:Text text="Purchased: {% raw %}{fmtCurrency.format(data.amount)}{% endraw %}" /&gt;
	&lt;mx:Text text="Time: {% raw %}{fmtDate.format(data.timestamp)}{% endraw %} " /&gt;
&lt;/mx:Box&gt;
</code>

You can download the AIR application below. You can force a fake sale by simply visiting: <a href="http://www.coldfusionjedi.com/demos/messagetest/test.cfm">http://www.coldfusionjedi.com/demos/messagetest/test.cfm</a>. What's cool is - if someone else does it, your AIR application will see it as well.

So this is probably a bit of a trivial example, but shoot, look how simple it is. I'm <i>really</i> excited about LCDS/BlazeDS!

<iframe width="232" scrolling="no" height="190" frameborder="0" src="http://www.coldfusionjedi.com/demos/messagetest/badge1/index.html"></iframe>