---
layout: post
title: "Adding a real time component to your Flex application"
date: "2011-05-23T23:05:00+06:00"
categories: [flex,mobile]
tags: []
banner_image: 
permalink: /2011/05/23/Adding-a-real-time-component-to-your-Flex-application
guid: 4245
---

For a long time now I've had something of a mildly addictive personality when it comes to computer simulations. One of the first games I played - and hacked - was Lemonade Stand on the Apple 2e. Later on I spent many hours playing Taipan. Now I'm really into a little game called Farmville. You may have heard of it. One of the things that interest me most about Farmville is that it has a real time component to it. You may do some planting in the morning and while you are away your crops will grow. Later that night you can log back in and see a change to your farm. It makes the simulation seem more realistic and - let's face it - encourages you to come back. A lot. So I've been giving some thought about how this could be done with a mobile application. I've been playing <a href="https://market.android.com/details?id=com.seventeenbullets.android.island&feature=search_result">Paradise Island</a> on my phone - a simple economic/Sim City clone - but it also has a "over time" aspect to it. I figured - I could build something like that - right?
<!--more-->
<p>

I decided to build a simple version of the old Tamagotchi game. This was a big crazy in the 80s and basically involved a little monster with a tiny LED screen. You could feed, pet, etc the creature and was responsible for keeping it happy. I designed an application I named Pokedev. (And yeah - I know Pokemon is completely different. Sorry.) In my simulation I decided to keep the interaction to one simple stat - Happiness. My application would consist of a picture that represented how happy the developer was and a button to feed the developer. Every N seconds the developer would move "down" one happiness point. If the developer hit 0 happiness, he died. That's it. I built my first iteration without any idea of persistence. I figured I'd get the basics working and go from there. Here's a simple screen shot showing the application in the perfect state:

<p>

<img src="https://static.raymondcamden.com/images/perfect.png" />

<p>

Over time - the developer will "degrade" and get more and more unhappy. Here is the very unhappy state:

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/vu.png" />

<p>

I could make nicer graphics of course. It would be best if they were taller and took the complete vertical space over the button. The point is - it works. I can run it and let the developer die - or I could sit there and hit the button and try my best to keep em happy. (Not an easy task in real life either.) So - what about the persistence?

<p>

This is where things get a bit interesting. Flex Mobile applications can have automatic support for persisting their data. If you think about it, this is pretty critical. Mobile apps are often shut down unexpectantly - like when a phone call comes in.  Your typical user isn't going to exit the application properly. The Flex docs have a good section on this: <a href="http://help.adobe.com/en_US/flex/mobileapps/WSb0a29bf92525419c-54dd253312afbec3ecb-8000.html#WS8b1c39bd7e9fc364-26b394fa12ba6c7fdd7-7fff">Session Persistence</a>. (You should also read <a href="http://devgirl.org/2011/05/18/flex-4-5-mobile-data-handling/">this blog entry</a> from Holly - my 'goto' person now for Flex 4.5!) Basically it comes down to this. First, in your application you need to enable the feature, this is as simple as setting persistNavigatorState to true.

<p>

<code>
&lt;s:ViewNavigatorApplication xmlns:fx="http://ns.adobe.com/mxml/2009" 
							xmlns:s="library://ns.adobe.com/flex/spark" firstView="views.PokeDevHomeView" 
							persistNavigatorState="true"
&gt;
</code>

<p>

Once done - Flex can handle persisting simple values, but if you have complex classes you will have to handle the persistence yourself. What wasn't clear to me though was that Flex will not persist your simple variables actually. It will only persist simple values within a variable called data.

<p>

Now I've seen the "data" variable before. Whenever you tell Flex to load a new view, you can pass along a structure of data to the next view. Flex will put this into an object called data. So for me - I mentally associated "data" with the Arguments scope in ColdFusion. But the data value can be created manually as well. What's cool is - as soon as I copied my happiness value to the data object, it persisted. I could kill my application and restart it and the old value was there. So as an example:

<p>

<code>
if(data != null) {
	trace("data exists...");
	//determine how many intervals between now and last run
	HAPPY = data.HAPPY;
</code>

<p>

This code snippet comes from my application's main view's init function. It essentially copies the value from data.HAPPY into a main variable I had called HAPPY. With me so far? I'm not. Let's actually look at the entire page. It's a pretty small app so we can put the whole thing here in the post.

<p>

<code>

&lt;?xml version="1.0" encoding="utf-8"?&gt;
&lt;s:View xmlns:fx="http://ns.adobe.com/mxml/2009" 
		xmlns:s="library://ns.adobe.com/flex/spark" title="PokeDev V1.0" viewActivate="init()"&gt;
	&lt;fx:Declarations&gt;
		&lt;!-- Place non-visual elements (e.g., services, value objects) here --&gt;
	&lt;/fx:Declarations&gt;
	
	&lt;fx:Script&gt;
	&lt;![CDATA[
		
	//Interval is the number of seconds between state change	
	private var INTERVAL:int = 10;
	//current happiness level
	private var HAPPY:int = 10;
	//max level of happiness
	private var MAXHAPPY:int = 10;

	//main timer for the creature	
	private var heartBeat:Timer;
	
	[Embed(source="pictures/dead.jpg")]
	[Bindable]
	private var deadPic:Class;

	[Embed(source="pictures/veryunhappy.jpg")]
	[Bindable]
	private var veryunhappyPic:Class;

	[Embed(source="pictures/unhappy.jpg")]
	[Bindable]
	private var unhappyPic:Class;

	[Embed(source="pictures/neutral.jpg")]
	[Bindable]
	private var neutralPic:Class;

	[Embed(source="pictures/happy.jpg")]
	[Bindable]
	private var happyPic:Class;

	[Embed(source="pictures/veryhappy.jpg")]
	[Bindable]
	private var veryhappyPic:Class;

	[Embed(source="pictures/perfect.jpg")]
	[Bindable]
	private var perfectPic:Class;

	private function init():void {

		if(data != null) {
			trace("data exists...");
			//determine how many intervals between now and last run
			HAPPY = data.HAPPY;
			trace("Last run at "+data.lastrun+ " and it is now "+new Date());
			//how many seconds since last run - we only care if not dead
			if(HAPPY &gt;= 1) {
				//http://jbablog.com/2008/04/actionscript-2-datediff-function/
				var seconds:Number = (new Date().getTime() - new Date(data.lastrun).getTime())/1000;
				trace(seconds + " seconds since last run.");
				//so the number of times we decrease hunger is seconds/interval
				var intervals:Number = Math.floor(seconds/INTERVAL);
				trace("there were "+intervals+ " intervals since last run");
				HAPPY -= intervals;
				trace("so happy is now at "+HAPPY);
				if(HAPPY &lt;= 0) currentState="dead";
			}			
		} else data = {};
		drawPicture();
		heartBeat = new Timer(INTERVAL*1000);
		heartBeat.addEventListener(TimerEvent.TIMER,doHeartBeat);
		heartBeat.start();
	}

	private function persist():void {
		data.HAPPY = HAPPY;
		data.lastrun = new Date();
		trace("Stored lastrun as "+data.lastrun);
	}
		
	private function doHeartBeat(evt:TimerEvent):void {
		HAPPY--;
		persist();
		trace("Happy at heart beat: "+HAPPY);
		if(HAPPY &lt;= 0) {
			currentState="dead";
			heartBeat.stop();
		} else drawPicture();
	}

	private function drawPicture():void {
		//based on HAPPY level we do a different image
		switch(HAPPY) {
			case 10: 
				mainImage.source=perfectPic;
				break;
			case 9:
			case 8:
				mainImage.source=veryhappyPic;
				break;
			case 7:
			case 6:
				mainImage.source=happyPic;
				break;
			case 5:
				mainImage.source=neutralPic;
				break;
			case 4:
			case 3:
				mainImage.source=unhappyPic;
				break;
			case 2:
			case 1:
				mainImage.source=veryunhappyPic;
				break;
			case 0:
				mainImage.source=deadPic;
				break;
		}
		
	}

	private function feed(event:MouseEvent):void {
		if(HAPPY &lt; MAXHAPPY) HAPPY++;
		persist();
		drawPicture();
		trace("Happy after feeding: "+HAPPY);
	}
	
	private function startOver(event:MouseEvent):void {
		currentState="normal";
		HAPPY = MAXHAPPY;
		persist();
		drawPicture();
		heartBeat.start();
	}
	]]&gt;
	&lt;/fx:Script&gt;

	&lt;s:states&gt;
		&lt;s:State name="normal" /&gt;
		&lt;s:State name="dead" /&gt;
	&lt;/s:states&gt;
	
	&lt;s:layout&gt;
		&lt;s:VerticalLayout verticalAlign="top" /&gt;
	&lt;/s:layout&gt;

	&lt;!-- These are the normal views --&gt;
	&lt;s:Image id="mainImage" width="100{% raw %}%" height="100%{% endraw %}" includeIn="normal" /&gt;
	&lt;s:Button id="feedButton" label="Feed the Developer" width="100%" click="feed(event)" includeIn="normal" /&gt;	

	&lt;s:Image id="deadImage" width="100{% raw %}%" height="100%{% endraw %}" includeIn="dead" source="{% raw %}{deadPic}{% endraw %}" /&gt;
	&lt;s:Button id="soButton" label="Start Over" width="100%" click="startOver(event)" includeIn="dead" /&gt;	

&lt;/s:View&gt;
</code>

<p>

My application begins with 3 variables. HAPPY is the current developer's level of happiness. INTERVAL is how many seconds to wait to 'degrade' the value. And MAXHAPPY simply represents the upper end of the scale. Rememer - this is a game. While I have a real value for how happy the developer is, I'm going to show pictures instead of numbers to the end user. You can see those pictures in the next set of embeds.

<p>

My init function has a few things it has to handle. Basically - if we have old data, we need to set our HAPPY value to it - but also determine how long it's been since you last ran the app. This is the "real" time aspect. We calculate the difference in time and do N degradations based on it. That's the gist of it really. The rest of the code mainly handles drawing the developer and responding to clicks. 

<p>

I do want to call out the "persist" function. It's not actually persisting - but passing values to the data scope so it will be stored upon the application closing. I feel a bit... weird about that. I don't like having a copy of the HAPPY value. But it's a simple enough function so I'm going with it for now. 

<p>

So - any comments on this? You can browse the code at Github now: <a href="https://github.com/cfjedimaster/pokedev">https://github.com/cfjedimaster/pokedev</a> I've included the APK as an attachment as well.<p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2009%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2FPokeDev%{% endraw %}2Eapk'>Download attached file.</a></p>