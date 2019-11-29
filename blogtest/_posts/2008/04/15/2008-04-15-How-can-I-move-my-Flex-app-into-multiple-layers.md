---
layout: post
title: "How can I move my Flex app into multiple layers?"
date: "2008-04-15T18:04:00+06:00"
categories: [flex]
tags: []
banner_image: 
permalink: /2008/04/15/How-can-I-move-my-Flex-app-into-multiple-layers
guid: 2770
---

So in general - Flex has been easy for me to grok since it first came out. It's gotten easier over time, but normally, the most trouble I have is having to look up an argument to see how to do something in particular.

However - one thing has troubled me for a while now. I've solved this problem before in earlier Flex apps, but I really don't think I have my head around it yet. I'm asking for help and some opinions here on what would be the 'best practice', and I more than understand that there will be more than one answer.
<!--more-->
So first off - let me describe the problem. I know that a Flex application can be entirely contained within one MXML file. That can get a bit messy though. So what I like to do is create a views folder. In my main MXML file I add xmlns:views="views.*" to my core Application tag. This then lets me do:

<code>
&lt;views:login /&gt;
&lt;views:foo /&gt;
&lt;views:nuclearbomb /&gt;
</code>

I <i>get</i> that and I like it as it really makes things more manageable. However - I run into a problem as soon as I want to start sharing data between multiple views. For example, my main MXML has code like so (slightly cropped/edited):

<code>
&lt;mx:RemoteObject id="dataService" destination="ColdFusion" source="remote.user" showBusyCursor="true"&gt;
	&lt;mx:method name="login" result="loginResult(event)" /&gt;	
&lt;/mx:RemoteObject&gt;

&lt;mx:Script&gt;
&lt;![CDATA[
import mx.rpc.events.ResultEvent;
import mx.controls.Alert;

//ToDo: Abstract this into an XML file
private var endpoint:String = "http://dev.nextbigthing.com/flex2gateway/";

private function init():void {
	dataService.endpoint = endpoint;
}



]]&gt;
&lt;/mx:Script&gt;
</code>

Notice the init function, which is run on creationComplete. My thinking was that this config info would actually be moved into an XML file and loaded in via a file read (this is an AIR app by the way). I figured this would be a nice way to configure the application. Anyway - this works like a charm. I can run a method on my dataService. 

But what happens when I want to use this same (configured) service in a lower view? Well I figured out that I could pass in the RemoteObject easily enough:

<code>
&lt;views:someview dsConn="{% raw %}{dataService}{% endraw %}" /&gt;
</code>

And inside someview.mxml:

<code>
[Bindable] public var dsConn:RemoteObject;
</code>

But now I want to run a method on my remote service. I want method X to use call back handler Y. Normally I'd define that with a mx:method tag. However, if I do that in the top level component I should get an error if my call back handler is in someview.mxml. It seems to me that it would be best to keep all the code someview needs within someview itself - but I'm at a loss as to how to properly handle that.

As a practical example, someview.mxml has a grid and it needs data. The data comes from the RemoteObject. Am I expected to create the data in the top level MXML and pass it to someview? That seems... ok... but it feels like I'm cluttering up someview. And to make matters worse, what I really have is main.mxml, which is under my root level MXML, and someview is under main.mxml. So I'd need to pass things along two 'levels'. Ugh. 

I really think I'm over complicating this. So Flex-lovers - tell me there is a simpler way to handle all of this. ;)