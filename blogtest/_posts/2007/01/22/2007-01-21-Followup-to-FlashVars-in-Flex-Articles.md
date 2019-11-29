---
layout: post
title: "Followup to FlashVars in Flex Articles"
date: "2007-01-22T09:01:00+06:00"
categories: [flex]
tags: []
banner_image: 
permalink: /2007/01/22/Followup-to-FlashVars-in-Flex-Articles
guid: 1786
---

Last month I wrote an <a href="http://ray.camdenfamily.com/index.cfm/2006/12/11/FlashVars-in-Flex">article</a> about how to use FlashVars in a Flex application. FlashVars are simple values passed in to the Flash movie from the HTML/JavaScript that embeds the SWF. I thought I'd follow it up with a practical example on an application I'm working on right now.
<!--more-->
I'm building an administrator interface for a web site. This application will make use of Flash Remoting to talk to a CFC. The path to the CFC isn't hard coded though. To make matters worse, my dev environment isn't exactly like production. Therefore, the "dot path" location of the CFC needs to be dynamic. I decided to pass in the path via FlashVars. 

I had things working on the Flex side, hard coded, so the first thing I did was to remove the source attribute from my RemoteObject tag:

<code>
&lt;mx:RemoteObject id="core" destination="ColdFusion" showBusyCursor="true" &gt;
</code>

My Flex code was already running code on creationComplete:

<code>
&lt;mx:VBox xmlns:mx="http://www.adobe.com/2006/mxml" width="100{% raw %}%" height="100%{% endraw %}" xmlns:views="views.*" creationComplete="init()" &gt;
</code>

So I simply updated my init() function:

<code>
private var componentroot:String = "";

private function init():void {
	componentroot = this.parameters.componentroot;
	core.source = componentroot + "components.admin";
}	
</code>

As I mentioned in the <a href="http://ray.camdenfamily.com/index.cfm/2006/12/11/FlashVars-in-Flex">previous entry</a>, the data from the FlashVars is available as this.parameters.<i>name</i>, where <i>name</i> is the FlashVar name. 

So how do I test this? One of the cool things about FlexBuilder is that you can modify the HTML generated when you view your application. I went into the html-template folder, opened up index.template.html, and changed this line:

<code>
"flashvars",'historyUrl=history.htm%3F&lconid=' + lc_id + '',
</code>

To this:

<code>			"flashvars",'componentroot=secretproject.server.&historyUrl=history.htm%3F&lconid=' + lc_id + '',
</code>

This isn't the final step though. I'm deploying to a site running ColdFusion. I'll eventually change my index.html file to an index.cfm file and use an Application variable for the component root.

So now I have a problem. The this.parameters structure only exists for the core Flex file of an application, not the children. How can I get my children to also use the value? I'm thinking what I'll do is pass the value from parent to child, since that is relatively easy to do. I could make the child run code to grab it from the parent, but that is such a pain to do. (More on that later.) I don't want to have to create a custom even just to read a simple value from the parent. (But that may just be me being lazy. :)