---
layout: post
title: "Using ColdFusion Builder's debugger for Flex and Ajax"
date: "2010-11-04T15:11:00+06:00"
categories: [coldfusion,flex,jquery]
tags: []
banner_image: 
permalink: /2010/11/04/Using-ColdFusion-Builders-debugger-for-Flex-and-Ajax
guid: 4000
---

This is probably one more blog entry of mine that falls into the "obvious" category, but until I tried it today I didn't know it was possible so <i>hopefully</i> I'm not the only one. I don't normally use the debugger in ColdFusion Builder. There isn't anything wrong with it - it just doesn't really mesh with the way I like to write code. On the flip side, I make a heck of a lot of use out of the debugger in Flash Builder. Why do I use it more there and less in ColdFusion? No idea. That being said, a reader this week asked me an interesting question. He is using Flash Builder and wanted to know about debugging on the server side. I knew you could debug the Flex side of course. You can also easily debug the network communications. What I wasn't sure of was how I'd handle debugging on the ColdFusion Builder side when I'm actually using Flash Builder. The debuggers in both products aren't related. (Well, I assume they share some code at the Eclipse level.) Here is what I found out.
<!--more-->
<p>

I began by creating a super simple CFC to act as my service. I put some bogus code in there just to give me a few lines of logic.

<p>

<code>
component {

	remote function double(numeric x) {
		var thisisdumb = now();
		var thisismoredumb = randRange(1,1000);
		var result = arguments.x*2;
		return result;
	}

}
</code>

<p>

Over in Flash Builder I then created an extremely simple front end.

<p>

<code>

&lt;?xml version="1.0" encoding="utf-8"?&gt;
&lt;s:Application xmlns:fx="http://ns.adobe.com/mxml/2009" 
			   xmlns:s="library://ns.adobe.com/flex/spark" 
			   xmlns:mx="library://ns.adobe.com/flex/mx" minWidth="955" minHeight="600"&gt;
	
	&lt;fx:Declarations&gt;
		&lt;mx:RemoteObject destination="ColdFusion" source="double" id="doubleService"&gt;
			&lt;mx:method name="double" result="handleResult(event)" fault="handleFault(event)" /&gt;
		&lt;/mx:RemoteObject&gt;
	&lt;/fx:Declarations&gt;

	&lt;fx:Script&gt;
	&lt;![CDATA[
	import mx.controls.Alert;
	import mx.rpc.events.FaultEvent;
	import mx.rpc.events.ResultEvent;
	
	public function handleFault(evt:FaultEvent):void {
		mx.controls.Alert.show(evt.toString())
	}
	
	public function handleResult(evt:ResultEvent):void {
		resultValue.text = evt.result.toString()
	}
	
	public function tryIt():void {
		doubleService.double(initialValue.text);
	}
	]]&gt;
	&lt;/fx:Script&gt;

	&lt;s:HGroup&gt;
		
		&lt;s:TextInput id="initialValue" /&gt;
		&lt;s:Button id="doubleBtn" label="Click to double" click="tryIt()" /&gt;
		&lt;s:TextInput id="resultValue" /&gt;

	&lt;/s:HGroup&gt;

&lt;/s:Application&gt;
</code>

<p>

All this code does is take input from the first field and send it to my CFC. When the result is returned I place it in the second field. I hit run in Flash Builder and confirmed everything worked. I then went to ColdFusion Builder (I don't run my installs in the same Eclipse package) and switched to the ColdFusion Debugging perspective. I put a breakpoint on one of the lines and then I clicked the little green bug to start up the debugging session. This launched double.cfc in the browser which gave me the normal CFC view.

<p>

<img src="https://static.raymondcamden.com/images/screen36.png" />

<p>

Now at this point I then switched back to my browser tab containing my Flex app. I entered another number, hit the button, and voila - all of a sudden CFBuilder is blinking in my task bar. I could see nothing being displayed in the Flex app and when I alt-tabed over to CFBuilder I was in the middle of a debugging session.

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/screen37.png" />

<p>

When I let the method carry on, my data was returned to Flex. I tried the same thing in a simple Ajax based application and it also worked. 

<p>

Even better - I then switched over to Aptana and converted my jQuery example into a simple AIR application. I ran it and once again - the result was 'hung' up while I debugged in ColdFusion Builder.

<p>

Cool! So - as I said, I guess this is 100% expected, but it never occurred to me to try using CFBuilder's debugger like this. I can actually see myself using it more now.