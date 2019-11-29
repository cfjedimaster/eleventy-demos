---
layout: post
title: "Finding the username in an AIR app, and a quick binding tip"
date: "2009-06-27T11:06:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2009/06/27/Finding-the-username-in-an-AIR-app-and-a-quick-binding-tip
guid: 3409
---

Gary asked me an interesting question relating to AIR applications. He wanted to know if there was a way for an AIR application to know the username of the current user. I would have guessed that this would be part of the AIR API, but after a bit of searching and asking around, it turns out that this is not the case.

While there isn't a direct API, there is a nice workaround that I found on Stack Overflow (<a href="http://stackoverflow.com/questions/1376/get-the-current-logged-in-os-user-in-adobe-air">Get the current logged in OS user in Adobe Air</a>). The solution simply assumes that all users have a base directory that includes their username. On my Mac, it is "/Users/ray". On my Windows box (yes, I'm ashamed, I still keep one around), the directory is "c:\documents and settings\administrator". So this technique seems like a good one. You could certainly use it to <i>suggest</i> the current username. Here is a simple demo that Gary cooked up using this technique:

<code>
&lt;?xml version="1.0" encoding="utf-8"?&gt;
&lt;mx:WindowedApplication xmlns:mx="http://www.adobe.com/2006/mxml" layout="vertical" horizontalAlign="center" verticalAlign="middle"&gt;

&lt;mx:Script&gt;
&lt;![CDATA[

public function currentOSUser():String { 
	var userDir:String = File.userDirectory.nativePath; 
	var userName:String = userDir.substr(userDir.lastIndexOf(File.separator) + 1); 
	return userName; 
}	
	
]]&gt;
&lt;/mx:Script&gt;	

&lt;mx:Text text="{% raw %}{currentOSUser()}{% endraw %}" fontSize="75" horizontalCenter="true"/&gt; 
&lt;mx:Text text="is a winner!" fontSize="20" /&gt;

&lt;/mx:WindowedApplication&gt;
</code>

I modified it a bit just to simplify things. Running it on my Mac I see: 
<img src="https://static.raymondcamden.com/images//Picture 167.png">

On my PC (oh, and I loved how the AIR installer noticed my PC was a bit behind on the AIR SDK and updated itself) it displayed:

<img src="https://static.raymondcamden.com/images/cfjedi//Picture 243.png">

Ok, one last tip. Gary was trying to use binding with this method and had trouble getting it working. Let's look at what he did.

<code>
public function currentOSUser():String { 
var userDir:String = File.userDirectory.nativePath; 
var userName:String = userDir.substr(userDir.lastIndexOf(File.separator) + 1); 
return userName; 
}

protected function list_creationCompleteHandler(event:FlexEvent):void { 
getMyUnitResult.token = Widget.getMyUnit("{% raw %}{currentOSUser()}{% endraw %}"); 
}
</code>

This didn't work for him. Notice the binding inside the function? That's simply not a place where you can use binding. In this case the solution was simpler code:

<code>
getMyUnitResult.token = Widget.gyMyUnit(currentOSUser())
</code>

My understanding is that you can only use bindings in the attributes of components. However, don't take my word for it. I found a nice article at Adobe specifically on binding: <a href="http://www.adobe.com/devnet/flex/quickstart/using_data_binding/">Using data binding</a>

Hope this helps!