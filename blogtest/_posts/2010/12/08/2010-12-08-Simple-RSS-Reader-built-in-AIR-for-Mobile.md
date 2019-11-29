---
layout: post
title: "Simple RSS Reader built in AIR for Mobile"
date: "2010-12-08T19:12:00+06:00"
categories: [flex,mobile]
tags: []
banner_image: 
permalink: /2010/12/08/Simple-RSS-Reader-built-in-AIR-for-Mobile
guid: 4047
---

Tonight I whipped up a quick port of Mike Chamber's code that <a href="http://www.mikechambers.com/blog/2008/01/22/parsing-rss-20-feeds-in-actionscript-3/">demonstrates RSS parsing in ActionScript</a>. I took his code and built a simple native AIR for Mobile application from it. The more I work with <a href="http://labs.adobe.com/technologies/flashbuilder_burrito/">Flash Builder "Burrito"</a> and <a href="http://labs.adobe.com/technologies/flexsdk_hero/">Flex SDK "Hero"</a> (the new AIR framework with mobile support), the more I <i>really</i> appreciate how easy Adobe has made mobile development. I've got a full application here that downloads a RSS feed, displays it nicely, and allows you to read the entry text. While this isn't that special, what impresses me is that steps done to make it easy to create the application. For example, it's trivial to tell the application to move from one screen to another. It's trivial to pass data from one view to another. These are all things that aren't terribly complex in a traditional AIR application - but frankly there is nothing at all wrong with making things even simpler. Let's take a look at the code - and again - credit goes to Mike Chambers for the original.
<!--more-->
<p>

Let's start off with the first page of the application. This view is responsible for:

<p>

<ul>
<li>Getting the RSS from a remote feed, in my case, <a href="http://www.androidgator.com">AndroidGator.com</a>
<li>Turning the RSS string into data. This is done with an open source library called <a href="http://code.google.com/p/as3syndicationlib/">as3syndicationlib</a>
<li>Setting the RSS items into a list.
<li>Providing a way to click from the list into a detail
</ul>

<p>

Here is that template in full. I'm going to skip over the things covered in Mike's post.

<p>

<code>
&lt;?xml version="1.0" encoding="utf-8"?&gt;
&lt;s:View xmlns:fx="http://ns.adobe.com/mxml/2009" 
		xmlns:s="library://ns.adobe.com/flex/spark" title="News from {% raw %}{COMPANY}{% endraw %}" viewActivate="init()"&gt;
	&lt;fx:Declarations&gt;
		&lt;!-- Place non-visual elements (e.g., services, value objects) here --&gt;
	&lt;/fx:Declarations&gt;
	
	&lt;fx:Script&gt;
	&lt;![CDATA[
	import com.adobe.utils.XMLUtil;
	import com.adobe.xml.syndication.rss.Item20;
	import com.adobe.xml.syndication.rss.RSS20;
	
	import mx.collections.ArrayCollection;
		
	[Bindable] private var COMPANY:String = "AndroidGator";
	private var URL:String = "http://www.androidgator.com";
	private var RSSURL:String = "http://feeds.feedburner.com/AndroidgatorcomFeed";
	
	[Bindable] private var rssItems:ArrayCollection;
		
	private var loader:URLLoader;

	private function init():void {
		
		loader = new URLLoader();
				
		//request pointing to feed
		var request:URLRequest = new URLRequest(RSSURL);
		request.method = URLRequestMethod.GET;
		
		//listen for when the data loads
		loader.addEventListener(Event.COMPLETE, onDataLoad);
		
		//listen for error events
		loader.addEventListener(IOErrorEvent.IO_ERROR, onIOError);
		loader.addEventListener(SecurityErrorEvent.SECURITY_ERROR, onSecurityError);
		
		//load the feed data
		loader.load(request);
		
	}

	//called once the data has loaded from the feed
	private function onDataLoad(e:Event):void {
		//get the raw string data from the feed
		var rawRSS:String = URLLoader(e.target).data;

		//parse it as RSS
		parseRSS(rawRSS);
		
	}

	private function parseRSS(data:String):void {
		
		//XMLSyndicationLibrary does not validate that the data contains valid
		//XML, so you need to validate that the data is valid XML.
		//We use the XMLUtil.isValidXML API from the corelib library.
		if(!XMLUtil.isValidXML(data))
		{
			trace("Feed does not contain valid XML.");
			return;
		}	
		
		//create RSS20 instance
		var rss:RSS20 = new RSS20();
		
		//parse the raw rss data
		rss.parse(data);
		
		//get all of the items within the feed
		var items:Array = rss.items;
		rssItems = new ArrayCollection(items);
	}	
	
	private function loadEntry(evt:Event):void {
		navigator.pushView(ItemView,{% raw %}{item:rssListing.selectedItem}{% endraw %});
		
	}

	private function onIOError(e:IOErrorEvent):void {
	}
	
	private function onSecurityError(e:SecurityErrorEvent):void {
	}		
	]]&gt;
	&lt;/fx:Script&gt;

	&lt;s:layout&gt;
		&lt;s:VerticalLayout paddingTop="10" paddingLeft="5" paddingRight="5" gap="20" /&gt;
	&lt;/s:layout&gt;
	
	&lt;s:List id="rssListing" dataProvider="{% raw %}{rssItems}{% endraw %}" width="100{% raw %}%" height="100%{% endraw %}" click="loadEntry(event)" labelField="title" /&gt;

	&lt;s:Button width="100%" label="Visit Website" click="navigateToURL(new URLRequest(URL))" /&gt;

&lt;/s:View&gt;
</code>

<p>

As I said, I won't bother discussing what Mike's post does, but let me point out a few things. I've got 3 variables that define how the application works and is displayed. COMPANY (which should really be SITE) is simply a label for the application. It tells you what site's RSS feed is being used. URL and RSSURL are the main URL and RSS feed URLs respectively. Make note of how we can load the main URL using the navigateToURL function. Nice and simple, right? Now take a look at the loadEntry function, repeated below.

<p>

<code>
private function loadEntry(evt:Event):void {
	navigator.pushView(ItemView,{% raw %}{item:rssListing.selectedItem}{% endraw %});
}
</code>

<p>

This is <b>exactly</b> what I was talking about in terms of Adobe going out of it's way to simplify things. The pushView API does exactly what you would imagine - put up a view in front of the user. The second argument is a set of data that is passed into the view. This makes it easy to handle navigation between different views and pass data around. Love it.  Here is how it renders.

<p>

<img src="https://static.raymondcamden.com/images/ScreenClip.png" />

<p>

Now let's look at the rss item viewf.

<p>

<code>
&lt;?xml version="1.0" encoding="utf-8"?&gt;
&lt;s:View xmlns:fx="http://ns.adobe.com/mxml/2009" 
		xmlns:s="library://ns.adobe.com/flex/spark" title="" initialize="init()" xmlns:mx="library://ns.adobe.com/flex/mx"&gt;
	
	&lt;fx:Declarations&gt;
		&lt;mx:DateFormatter id="myDateFormat" formatString="MMMM D, YYY / L:NN A" /&gt;
	&lt;/fx:Declarations&gt;
	
	&lt;fx:Style&gt;
	@namespace s "library://ns.adobe.com/flex/spark";
	@namespace mx "library://ns.adobe.com/flex/mx";
	
	#titleValue {
		font-size: 20px;
		font-weight: bold;
	}		
	&lt;/fx:Style&gt;
	
	&lt;fx:Script&gt;
	&lt;![CDATA[
		
	import spark.components.supportClasses.MobileTextField;

	private function init():void {
		//credit to Brian Rinaldi: http://remotesynthesis.com/post.cfm/adding-html-text-to-a-flex-mobile-textarea
		MobileTextField(bodyText.textDisplay).htmlText = data.item.description;

		dateValue.text = myDateFormat.format(data.item.pubDate);

	}		
	]]&gt;
	&lt;/fx:Script&gt;

	&lt;s:actionContent&gt;
		&lt;s:Button height="100%" label="Back" click="navigator.popToFirstView()" /&gt;
	&lt;/s:actionContent&gt;
	
	&lt;s:layout&gt;
		&lt;s:VerticalLayout paddingTop="10" paddingLeft="5" paddingRight="5" gap="20" /&gt;
	&lt;/s:layout&gt;

	&lt;s:Label width="100{% raw %}%" id="titleValue" text="{data.item.title}{% endraw %}"  /&gt;
	&lt;s:Label width="100%" id="dateValue" /&gt;

	&lt;s:TextArea id="bodyText" width="100{% raw %}%" height="100%{% endraw %}"  /&gt;
	
	&lt;s:Button width="100%" label="Click to Read" click="navigateToURL(new URLRequest(data.item.link))" /&gt;
&lt;/s:View&gt;
</code>

<p>

For the most part, this isn't anything special. Note how I make use of data.item.*. This is the RSS item I passed in with my pushView. Also make note of the button that let's me go back. I don't need this. The hardware itself has a back button. But I like having the obvious button there. Lastly, make note of the nice hack I got from <a href="http://www.remotesynthesis.com/">Brian Rinaldi</a>. This is - as far as I know - the only way to display HTML in a mobile component. I'm sure it will be corrected later. Here is how one typical RSS item renders in the application.

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip1.png" />

<p>

And that's it. I've included a zip that includes all the source code. The zip also includes an APK file if you want to skip compiling it yourself. I've got an interesting idea for a follow up to this - and if I can stay off of Warcraft enough - I'll get it out tomorrow night.<p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2009%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2FSimpleRSS%{% endraw %}2Ezip'>Download attached file.</a></p>