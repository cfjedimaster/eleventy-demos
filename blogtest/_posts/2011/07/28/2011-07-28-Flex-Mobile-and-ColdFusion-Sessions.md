---
layout: post
title: "Flex Mobile and ColdFusion Sessions"
date: "2011-07-28T17:07:00+06:00"
categories: [coldfusion,flex,mobile]
tags: []
banner_image: 
permalink: /2011/07/28/Flex-Mobile-and-ColdFusion-Sessions
guid: 4311
---

It just works. Thanks. Bye.

<p/>

Ok - maybe a little more detail is in order? ;) I knew that Flex on the desktop, when making calls to CFC, kept a session just like any other normal HTTP request. I was also mostly certain that the same held true for Flex Mobile. I decided to verify it just to be sure though. I created an incredibly simple Flex Mobile project that pings a ColdFusion service. Here is the view:

<p/>
<!--more-->

```markup
<?xml version="1.0" encoding="utf-8"?>
<s:View xmlns:fx="http://ns.adobe.com/mxml/2009" 
				 xmlns:s="library://ns.adobe.com/flex/spark" title="HomeView">
	
	<fx:Declarations>
		<s:RemoteObject id="testService" destination="ColdFusion" source="demos.july282011.remote" endpoint="http://www.raymondcamden.com/flex2gateway/" />			
	</fx:Declarations>

	<s:layout>
		<s:VerticalLayout/>
	</s:layout>

	<s:Button label="Test" click="testService.getKey()" />
	<s:Label id="resultLabel" text="{% raw %}{testService.getKey.lastResult}{% endraw %}" />

</s:View>
```

<p/>

For those of you who have never seen a lick of Flex code, you can probably guess as to what this code is doing. I've defined a CFC service that points to my blog. I've got a button that when clicked will run getKey. getKey is a ColdFusion component method. I've taken the label field below and bound it to the last result. That's a built in feature that allows me to quickly say, "Just take the last result and drop it here." Normally you're going to use an event handler for the result but for this simple test it works well enough. Now let's look at the code. First, my Application.cfc:

<p/>

```js
component {
	this.name="flexremotetest1";
	this.sessionManagement="true";
	
	public void function onSessionStart() {
		session.mykey = randRange(1,9999);
	}
	
}
```

<p/>

Nothing too interesting there - just a session start event handler that assigns a random number to the session scope. Now let's look at my CFC:

<p/>

```js
component {

	remote string function getKey() { 
		return session.mykey & " - " & session.urltoken;
	}

}
```

<p/>

I've got one method, getKey, that returns the key, and just to be extra sure, the built in URL token for the session. The result is - as expected -  a random number (with the urltoken):

<p/>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip148.png" />

<p/>

I tested it in a few devices just to be extra sure, and as expected, they each had their own sessions. Too easy.