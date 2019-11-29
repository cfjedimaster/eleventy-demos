---
layout: post
title: "How to use one remote method in Flex for multiple \"clients\""
date: "2010-06-21T14:06:00+06:00"
categories: [coldfusion,flex]
tags: []
banner_image: 
permalink: /2010/06/21/How-to-use-one-remote-method-in-Flex-for-multiple-clients
guid: 3856
---

Jon asked me an interesting Flex based question. Now before I show any code, I'll remind folks - I'm still very much the Flex Padawan. Whatever I show here I expect could be done much better (in fact, be sure to read the final code sample as it was created by a true Flex Jedi). That being said, I'm proud to have at least had an idea of the ballpark of the solution! Ok, enough jibber jabber - let's get to the question. Jon was using Flash Remoting to talk to a ColdFusion component. His code made use of RemoteObject and method, a bit like so:
<!--more-->
<p/>

<code>
&lt;mx:RemoteObject destination="ColdFusion" source="flextest" id="doubleService"&gt;
	&lt;mx:method name="double" result="handleResult(event)" fault="handleFault(event)" /&gt;
&lt;/mx:RemoteObject&gt;
</code>

<p/>

In this code block I've created a connection to a CFC, "flextest", and given the remote object an id of doubleService. I've defined a method called double (can you guess what it does?) and a result handler. Now I can take a field and set it up so that when you enter a value, it runs this method and sets the result. Something like so:

<p/>

<code>

&lt;?xml version="1.0" encoding="utf-8"?&gt;
&lt;mx:Application xmlns:mx="http://www.adobe.com/2006/mxml" layout="absolute" minWidth="955" minHeight="600"&gt;
	
	&lt;mx:RemoteObject destination="ColdFusion" source="flextest" id="doubleService"&gt;
		&lt;mx:method name="double" result="handleResult(event)" fault="handleFault(event)" /&gt;
	&lt;/mx:RemoteObject&gt;
	
	&lt;mx:Script&gt;
		&lt;![CDATA[
		import mx.rpc.events.FaultEvent;
		import mx.rpc.events.ResultEvent;
			
		public function handleFault(evt:FaultEvent):void {
			mx.controls.Alert.show(evt.toString())
		}
			
		public function handleResult(evt:ResultEvent):void {
			resultone.text = evt.result.toString()
		}
			
		]]&gt;
	&lt;/mx:Script&gt;
	
	&lt;mx:VBox&gt;
		
		&lt;mx:HBox&gt;
			&lt;mx:Text text="Field One" /&gt;
			&lt;mx:TextInput id="fieldone" change="doubleService.double(fieldone.text)" /&gt;
			&lt;mx:Text text=" doubled is " /&gt;
			&lt;mx:TextInput id="resultone" /&gt;
		&lt;/mx:HBox&gt;
		
	&lt;/mx:VBox&gt;
&lt;/mx:Application&gt;
</code>

<p/>

I've got a simple set of fields here - one being the input - one for the output. When you enter a value, I fire off a request to the CFC to get the value. My result handler simply takes the result and puts it in the field. Simple, right? Well what happens when you add 2 more fields?

<p/>

<code>
&lt;mx:HBox&gt;
	&lt;mx:Text text="Field One" /&gt;
	&lt;mx:TextInput id="fieldone" change="doubleService.double(fieldone.text)" /&gt;
	&lt;mx:Text text=" doubled is " /&gt;
	&lt;mx:TextInput id="resultone" /&gt;
&lt;/mx:HBox&gt;
		
&lt;mx:HBox&gt;
	&lt;mx:Text text="Field Two" /&gt;
	&lt;mx:TextInput id="fieldtwo" change="doubleService.double(fieldtwo.text)" /&gt;
	&lt;mx:Text text=" doubled is " /&gt;
	&lt;mx:TextInput id="resulttwo" /&gt;
&lt;/mx:HBox&gt;
		
&lt;mx:HBox&gt;
	&lt;mx:Text text="Field Three" /&gt;
	&lt;mx:TextInput id="fieldthree" change="doubleService.double(fieldthree.text)" /&gt;
	&lt;mx:Text text=" doubled is " /&gt;
	&lt;mx:TextInput id="resultthree" /&gt;
&lt;/mx:HBox&gt;
</code>

<p/>

While this won't generate any errors, the the result handler is hard coded to update resultone. Hence the problem. So here is where a little knowledge can be a dangerous thing. I knew that Flex supported something called an AsyncToken. This is a little magical fairy that creates state for your asynchronous call. Magical may not be exactly right - but I had worked with them a bit in the past so I had a basic idea of how they could work. I whipped up a quick demo that was very jQuery related. Hopefully you will see how:

<p/>

<code>
&lt;?xml version="1.0" encoding="utf-8"?&gt;
&lt;mx:Application xmlns:mx="http://www.adobe.com/2006/mxml" layout="absolute" minWidth="955" minHeight="600"&gt;
	
	&lt;mx:RemoteObject destination="ColdFusion" source="flextest" id="doubleService"&gt;
		&lt;mx:method name="double" /&gt;
	&lt;/mx:RemoteObject&gt;
	
	&lt;mx:Script&gt;
		&lt;![CDATA[
			import mx.rpc.AsyncToken;
			import mx.rpc.Responder;
			import mx.rpc.events.FaultEvent;
			import mx.rpc.events.ResultEvent;
			
			public function handleFault(evt:FaultEvent):void {
				mx.controls.Alert.show(evt.toString())
			}
			
			public function handleResult(evt:ResultEvent):void {
				resultthree.text = evt.result.toString()
			}

			public function getDouble(name:String):void {
				var field:mx.controls.TextInput = this["field"+name]
				var resfield:mx.controls.TextInput = this["result"+name]
				var val:String = field.text
				var token:AsyncToken = doubleService.double(val)
				token.addResponder(new mx.rpc.Responder(function(evt:ResultEvent):void {% raw %}{ resfield.text = evt.result.toString()}{% endraw %}, handleFault))
			}

		]]&gt;
	&lt;/mx:Script&gt;
	
	&lt;mx:VBox&gt;
		
		&lt;mx:HBox&gt;
			&lt;mx:Text text="Field One" /&gt;
			&lt;mx:TextInput id="fieldone" change="getDouble('one')" /&gt;
			&lt;mx:Text text=" doubled is " /&gt;
			&lt;mx:TextInput id="resultone" /&gt;
		&lt;/mx:HBox&gt;
		
		&lt;mx:HBox&gt;
			&lt;mx:Text text="Field Two" /&gt;
			&lt;mx:TextInput id="fieldtwo" change="getDouble('two')" /&gt;
			&lt;mx:Text text=" doubled is " /&gt;
			&lt;mx:TextInput id="resulttwo" /&gt;
		&lt;/mx:HBox&gt;
		
		&lt;mx:HBox&gt;
			&lt;mx:Text text="Field Three" /&gt;
			&lt;mx:TextInput id="fieldthree" change="getDouble('three')" /&gt;
			&lt;mx:Text text=" doubled is " /&gt;
			&lt;mx:TextInput id="resultthree" /&gt;
		&lt;/mx:HBox&gt;
		
	&lt;/mx:VBox&gt;
&lt;/mx:Application&gt;
</code>

<p/>

Ok, a lot going on here. Let's tackle it bit by bit. First, I've simplified my mx:method tag to just contain a name. Right now I guess it's pretty useless. I've written a new function, getDouble, that my fields call. Notice that each field passes a name ("one", "two", "three"). Within getDouble I use this name to get the field I want to work with. I then get the result field as well. Both of these lines....

<p/>

<code>
var field:mx.controls.TextInput = this["field"+name]
var resfield:mx.controls.TextInput = this["result"+name]
</code>

<p/>

reminded me of $("#..") calls in jQuery. Or at least a document.getElementById call. I create an AsyncToken and then create an anonymous function to create a dynamic handler for the result. You can see how I passed in the result field to the handler. This then lets any of my three fields run the call and get the result in the right place. 

<p/>

So it "works" - but here is where someone with a little bit more knowledge than I (ok, a lot more) comes along and makes things much more simpler. I ran my code by <a href="http://blog.simb.net/">Simeon Bateman</a> and he pointed out that you can assign <i>any</i> custom data to the token itself. What does that mean? Check out this version:

<p/>

<code>
&lt;?xml version="1.0" encoding="utf-8"?&gt;
&lt;mx:Application xmlns:mx="http://www.adobe.com/2006/mxml" layout="absolute" minWidth="955" minHeight="600"&gt;

	&lt;mx:RemoteObject destination="ColdFusion" source="flextest" id="doubleService"&gt;
		&lt;mx:method name="double" result="handleResult(event)" fault="handleFault(event)" /&gt;
	&lt;/mx:RemoteObject&gt;
	
	&lt;mx:Script&gt;
		&lt;![CDATA[
			import mx.rpc.AsyncToken;
			import mx.rpc.Responder;
			import mx.rpc.events.FaultEvent;
			import mx.rpc.events.ResultEvent;
			
			public function handleFault(evt:FaultEvent):void {
				mx.controls.Alert.show(evt.toString())
			}
			
			public function handleResult(evt:ResultEvent):void {
				trace(evt.token.fieldName)
				var resfield:mx.controls.TextInput = this["result"+evt.token.fieldName]
				resfield.text = evt.result.toString()					
			}
			
			public function getDouble(name:String):void {
				var field:mx.controls.TextInput = this["field"+name]
				var val:String = field.text
				var token:AsyncToken = doubleService.double(val)
					token.fieldName = name
			}
			
		]]&gt;
	&lt;/mx:Script&gt;
	
	&lt;mx:VBox&gt;
		
		&lt;mx:HBox&gt;
			&lt;mx:Text text="Field One" /&gt;
			&lt;mx:TextInput id="fieldone" change="getDouble('one')" /&gt;
			&lt;mx:Text text=" doubled is " /&gt;
			&lt;mx:TextInput id="resultone" /&gt;
		&lt;/mx:HBox&gt;
		
		&lt;mx:HBox&gt;
			&lt;mx:Text text="Field Two" /&gt;
			&lt;mx:TextInput id="fieldtwo" change="getDouble('two')" /&gt;
			&lt;mx:Text text=" doubled is " /&gt;
			&lt;mx:TextInput id="resulttwo" /&gt;
		&lt;/mx:HBox&gt;
		
		&lt;mx:HBox&gt;
			&lt;mx:Text text="Field Three" /&gt;
			&lt;mx:TextInput id="fieldthree" change="getDouble('three')" /&gt;
			&lt;mx:Text text=" doubled is " /&gt;
			&lt;mx:TextInput id="resultthree" /&gt;
		&lt;/mx:HBox&gt;
		
	&lt;/mx:VBox&gt;
&lt;/mx:Application&gt;
</code>

<p/>

I've restored the result/fault handlers back to my method tag. Now when I run getDouble, I just assign the name to the token itself. What's cool then is that in the handler, it's set into a token value of the event object. It just. Plain. Works. 

<p/>

Hopefully this is helpful to others (and if not, I sure as heck learned something).