---
layout: post
title: "Quick example of ExternalInterface, communicating between Flex and JavaScript"
date: "2009-07-09T14:07:00+06:00"
categories: [flex,javascript]
tags: []
banner_image: 
permalink: /2009/07/09/Quick-example-of-ExternalInterface-communicating-between-Flex-and-JavaScript
guid: 3428
---

A few days ago I did some mentoring with a ColdFusion developer in Baton Rouge. He was also doing some Flex and I got to take a look at some of his work. He was making use of a feature I had not seen before, ExternalInterface. This is a rather interesting little feature. It lets you create a bridge between your Flex code and JavaScript code on the page. This is <b>not</b> the same as the <a href="http://livedocs.adobe.com/flex/3/html/help.html?content=ajaxbridge_1.html">Flex Ajax Bridge</a> (which apparently was a Labs product and then moved into core Flex 3). I plan on looking at that more later, but here is some basic info about ExternalInterface.
<!--more-->
At a simple level, ExternalInterface allows for two way communication between anything in the browser that uses JavaScript (remember that other plugins may have a JavaScript API, and other Flex/Flash embeds may have exposure as well). So I could write JavaScript code that runs some stuff in my Flex app. I could write Flex code that will fire off something in JavaScript.

Here is a quick example of listening for events in Flex. 

<code>
&lt;?xml version="1.0" encoding="utf-8"?&gt;
&lt;mx:Application xmlns:mx="http://www.adobe.com/2006/mxml" layout="vertical" creationComplete="init()" width="220" height="200"&gt;

&lt;mx:Script&gt;
&lt;![CDATA[

public function init():void {

	ExternalInterface.addCallback('sendMessage',getMessage)	
	
}	

private function getMessage(m:String) {
	thebox.text+=m	
}	

]]&gt;
&lt;/mx:Script&gt;	

&lt;mx:TextArea id="thebox" /&gt;

&lt;/mx:Application&gt;
</code>

The ExternalInterface.addCallback API allows you to specify a function name to listen for (sendMessage) and a corresponding function to run in your Flex code. In this case, I've built an API to let me pass strings to a TextArea. Very exciting, I know.

For testing, I modified the file, index.template.html. If you are new to Flex, you may not know this, but Flex uses a template HTML file to generate your view when you run your application. You don't have to use this HTML in production. You can just use the SWF. For my testing I modified this so it would be easier to work with. This template is a bit large (I'll include the source in a zip at the end) so I'll just paste in the modifications I made.

Normally your Flex application will take over the entire page. I wanted a mix of HTML and Flex. If you look at your template, you will notice the embed code uses tokens for height and width:

<code>
AC_FL_RunContent(
		"src", "${% raw %}{swf}{% endraw %}",
		"width", "${% raw %}{width}{% endraw %}",
		"height", "${% raw %}{height}{% endraw %}",
... more ...
</code>

Now, if you are like me, you may wonder - where in the heck do those values come from? I had a hard time finding this in the docs. I did find an excellent blog post on it though: <a href="http://www.morearty.com/blog/2007/01/24/macros-that-are-available-in-html-template-files/">Macros that are available in html-template files </a>. Long story short - if I add a width and height to my MXML Application tag (as you see in the first code listing), it will get respected in the HTML template. To be sure it was working, I also added this lovely design:

<code>
&lt;style&gt;
body {% raw %}{ background-color: pink; }{% endraw %}
&lt;/style&gt;
</code>

Pink is the new black. You heard it here first folks. Ok, so I added a simple button:

<code>
&lt;input type="button" onclick="tryit()" value="Try it"&gt;
</code>

Add added the following JavaScript:

<code>
function tryit() {
	document.TestJS.sendMessage('you rock')
}
</code>

The basic idea for 'speaking' to the Flex application is to use the name of embed (also a token, it comes from the Flex project name) and call the method you exposed.

Here is a quick screen shot: 

<img src="https://static.raymondcamden.com/images//Picture 246.png">

Ok, not so terribly exciting, but you get the idea. Note that document.X is Netscape only, it would be window.X in IE. 

The flip side to this is calling JavaScript from Flex. This is done with the call API:

<code>
&lt;mx:Button click="ExternalInterface.call('alert','Alerts are the new black')" label="Alert Me, Baby" /&gt;	
</code>

As you can see, you just name the function and pass the arguments. 

I'm not 100% sure where I'd use this just yet - and I want to dig more into the Flex-Ajax bridge, but for a deeper look, please see this excellent blog entry:

<a href="http://blogs.4point.com/taylor.bastien/2009/02/flex-javascript-the-externalinterface-and-you.html">ExternalInterface: Flex + Javascript Get Downright Cozy</a>