---
layout: post
title: "FlashVars in Flex"
date: "2006-12-11T16:12:00+06:00"
categories: [flex]
tags: []
banner_image: 
permalink: /2006/12/11/FlashVars-in-Flex
guid: 1704
---

As a developer on the receiving end of Flash files, I've gotten used to dealing with FlashVars as a way to configure a Flash application. I've wondered how I'd do this in Flex though. Joao Fernandes sent me some sample code and showed me the way.

Consider this simple Flex page:

<code>
&lt;?xml version="1.0" encoding="utf-8" ?&gt;
&lt;mx:Application xmlns:mx="http://www.adobe.com/2006/mxml" layout="absolute" xmlns:comp="components.*"&gt;
	
	&lt;mx:Script&gt;
	&lt;![CDATA[
	import mx.controls.Alert;
	
	private function test():void {
		Alert.show(this.parameters.flashvar1+' '+this.parameters.flashvar2, "Flashvars");	
	}
	]]&gt;
	&lt;/mx:Script&gt;
	
	&lt;mx:Button id="btnTest" label="Test" click="test()" /&gt;
	
&lt;/mx:Application&gt;
</code>

Note the this.parameters? This lets me get access to the flashvars. I named them flashvar1 and flashvar2 which isn't very creative. Obviously it could be any name. To pass the variables in you can simply edit the generated HTML.

<code>
"flashvars",'flashvar1=ray&flashvar2=camden&historyUrl=history.htm%3F&lconid=' + lc_id + '',
</code>

Don't forget that each Flex project has an HTML template. It would make sense to edit the template so you don't have to re-edit the generated HTML after each build. 

This should help take care of the "root CFC" issue I mentioned a week or so ago.