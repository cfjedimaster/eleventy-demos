---
layout: post
title: "Simple example of accessing ColdFusion data with Flex"
date: "2009-06-03T20:06:00+06:00"
categories: [coldfusion,flex]
tags: []
banner_image: 
permalink: /2009/06/03/Simple-example-of-accessing-ColdFusion-data-with-Flex
guid: 3382
---

About a week ago I exchanged a few emails with Susan. She was learning Flex, and while she thought she understood the basic UI stuff (layout, widgets), she was having a real hard time grokking the basics of using ColdFusion Components with Flex. I whipped up a quick demo for her that was as simple as possible and I thought I'd share it on the blog. Please note that Flex, like ColdFusion, provides multiple ways of doing things, so this code could probably be done in many other ways.
<!--more-->
My blog entry will make use of Flex Builder 3. The UI will be a bit different if you are using Flash Builder 4. To begin, I created a simple project named TestB. I specified "Web" for Application Type, and most importantly, selected "ColdFusion" at the bottom in the Application Server Type. Notice I've got "Use remote object access service" is checked and I've selected "ColdFusion Flash Remoting." (Most of this was selected for me, but I don't know if that is simple FB remembering for me.)

<img src="https://static.raymondcamden.com/images//Picture 411.png">

Click next. Now on the next page, a lot will depend on your ColdFusion setup. Mine is a standalone server tied to Apache. 

<img src="https://static.raymondcamden.com/images/cfjedi//Picture 237.png">

Click Finish (or Next and Finish) and you should be presented with a (mostly) blank MXML file. 

<code>
&lt;?xml version="1.0" encoding="utf-8"?&gt;
&lt;mx:Application xmlns:mx="http://www.adobe.com/2006/mxml" layout="absolute"&gt;
	
&lt;/mx:Application&gt;
</code>

Ok, so for my example, I didn't want to worry about input and output. Instead, I just want to call a CFC that returns a string. Using my ... um... other editor... I created a very simple CFC named testa in web root:

<code>
&lt;cfcomponent&gt;

&lt;cffunction name="echotest" access="remote" returnType="string"&gt;
	&lt;cfreturn "The time is #timeFormat(now())#"&gt;
&lt;/cffunction&gt;

&lt;/cfcomponent&gt;
</code>

I've got one method, echotest, that simply returns a sentence with the time. <b>Note:</b> The method is marked remote. I believe you can setup ColdFusion to allow Flash Remoting calls to methods marked public, but I don't think I'd do that. It's simpler, and more direct (IMHO) to mark my methods remote that I want exposed to Flex.

I saved the CFC and ran it in my browser just to ensure I didn't do anything stupid:

http://localhost/testa.cfc?method=echotest

Ok, now back in Flex Builder. If you read the docs (<a href="http://livedocs.adobe.com/flex/3/html/help.html?content=data_access_1.html">Accessing Server-Side Data with Flex</a>) you will see that there are a few ways to access data with Flex. The best way, as far as I know, will almost always be Flash Remoting. This is done with the <a href="http://livedocs.adobe.com/flex/3/html/help.html?content=data_access_4.html#202412">RemoteObject</a> component</a>. The tag lets you define a Flash Remoting connection to a CFC, like so:

<code>
&lt;mx:RemoteObject destination="ColdFusion" source="testa" id="cfservice"&gt;
	&lt;mx:method name="echotest" fault="handleFault(event)" result="handleResult(event)" /&gt;
&lt;/mx:RemoteObject&gt;
</code>

In the code above I've:

<ul>
<li>Specified ColdFusion as my destination, which will be routed through the servers FlashRemoting connection
<li>Specified a "dot path" address for my CFC. My file was called testa.cfc. If you were to create an instance of that using createObject, you would just use "testa". If the CFC was in a folder called services, my path would be services.testa. You get the idea. Since the CFC is in web root, I can just use testa. 
<li>Finally, the ID, cfservice, just let's me get a handle to the service.
</ul>

Next up, let's create a simple UI to run my test. I'll add a button and a textarea to store the result from the server:

<code>
&lt;mx:Button label="Talk to ColdFusion" click="cfservice.echotest()" /&gt;
&lt;mx:TextArea id="resultBox" /&gt;
</code>

(I won't go into detail on each line of code. I assume, like Susan, that you either know Flex enough to get what's going on, or can guess. So for example, in the above code, the first line makes a button, and the second a textarea.) 

The final bit is to tie is all together. Notice my button runs a method on the cfservice RemoteObject. In this case, it isn't a method I wrote in ActionScript, but the method in the CFC. Also remember this line from above:

<code>
&lt;mx:method name="echotest" fault="handleFault(event)" result="handleResult(event)" /&gt;
</code>

This said: For the service, when echotest is run, do handleFault() on an error and handleResult on a normal result. I need code for these, and here is what I used:

<code>
&lt;mx:Script&gt;
&lt;![CDATA[
import mx.controls.Alert;

function handleFault(evt) {
	mx.controls.Alert.show(evt.fault.faultString)
}			
	
function handleResult(evt) {
	resultBox.text = evt.result
}		
]]&gt;
&lt;/mx:Script&gt;
</code>

The fault handler simply displays the error. The result handler though takes the result data and adds it to the text area. How did I know "result" was a key in evt? I didn't. I debugged it and played around with it. Basically evt is a Result object and the result key is the 'pure' result. (My take on it - I'm sure folks can say that a lot better.)

Altogether now, my MXML looks like so:

<code>
&lt;?xml version="1.0" encoding="utf-8"?&gt;
&lt;mx:Application xmlns:mx="http://www.adobe.com/2006/mxml" layout="horizontal"&gt;
	
	&lt;mx:RemoteObject destination="ColdFusion" source="testa" id="cfservice"&gt;
		&lt;mx:method name="echotest" fault="handleFault(event)" result="handleResult(event)" /&gt;
	&lt;/mx:RemoteObject&gt;
	
	&lt;mx:Script&gt;
	&lt;![CDATA[
	import mx.controls.Alert;

	function handleFault(evt) {
		mx.controls.Alert.show(evt.fault.faultString)
	}			
	
	function handleResult(evt) {
		resultBox.text = evt.result
	}		
	]]&gt;
	&lt;/mx:Script&gt;

	&lt;mx:Button label="Talk to ColdFusion" click="cfservice.echotest()" /&gt;
	&lt;mx:TextArea id="resultBox" /&gt;
		
&lt;/mx:Application&gt;
</code>

Running it, and clicking the button of course, gives us:

<img src="https://static.raymondcamden.com/images/cfjedi//Picture 54.png">

Woot. That's a fancy looking clock there, eh? Ok, so let's take it a step further and try an example with input and output. Back in my CFC, I added a new method:

<code>
&lt;cffunction name="hellotest" access="remote" returnType="string"&gt;
	&lt;cfargument name="name" type="string" required="true"&gt;
	&lt;cfreturn "Hello, #arguments.name#!"&gt;
&lt;/cffunction&gt;
</code>

The hellotest method takes a name argument and returns a string including the name. Back in Flex Builder, go and make a new file. (I selected MXML Application.) I could have modified the previous page, but I wanted to keep things simple. This time my RemoteObject test will contain a method for the hellotest call.

<code>
&lt;mx:RemoteObject destination="ColdFusion" source="testa" id="cfservice"&gt;
	&lt;mx:method name="hellotest" fault="handleFault(event)" result="handleResult(event)" /&gt;
&lt;/mx:RemoteObject&gt;
</code>

You do <b>not</b> have to define a method for each CFC function you want to call. I'm using it as a convenience as it allows me to define the fault/result handler. My UI now is a bit more complex. I have a form field to enter your name, a button, and a result textarea:

<code>
&lt;mx:TextInput id="nameText" /&gt;
&lt;mx:Button label="Say Hello" click="cfservice.hellotest(nameText.text)" /&gt;
&lt;mx:TextArea id="resultBox" /&gt;
</code>

Notice that the button grabs the value from the name field. The ActionScript is the exact same, so here is the complete MXML file:

<code>
&lt;?xml version="1.0" encoding="utf-8"?&gt;
&lt;mx:Application xmlns:mx="http://www.adobe.com/2006/mxml" layout="horizontal"&gt;
	
	&lt;mx:RemoteObject destination="ColdFusion" source="testa" id="cfservice"&gt;
		&lt;mx:method name="hellotest" fault="handleFault(event)" result="handleResult(event)" /&gt;
	&lt;/mx:RemoteObject&gt;
	
	&lt;mx:Script&gt;
	&lt;![CDATA[
	import mx.controls.Alert;

	function handleFault(evt) {
		mx.controls.Alert.show(evt.fault.faultString)
	}			
	
	function handleResult(evt) {
		resultBox.text = evt.result
	}		
	]]&gt;
	&lt;/mx:Script&gt;

	&lt;mx:TextInput id="nameText" /&gt;
	&lt;mx:Button label="Say Hello" click="cfservice.hellotest(nameText.text)" /&gt;
	&lt;mx:TextArea id="resultBox" /&gt;
		
&lt;/mx:Application&gt;
</code>

Running it, and entering a test value, gives me the following:

<img src="https://static.raymondcamden.com/images/cfjedi//Picture 61.png">

Enjoy. If folks want to post comments to other Flex+ColdFusion blog entries like this, I'd definitely appreciate it, and I'm sure Susan would as well. 

Next - I'll show this in <strike>Flex</strike>FlashBuilder 4 and how the cool new server side introspection stuff works. (Hint: It's the bee's knees.)